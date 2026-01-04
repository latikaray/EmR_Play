import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface ActivityCompletion {
  id: string;
  activity_name: string;
  activity_type: string;
  eq_trait?: string;
  completed_at: string;
  notes?: string;
  user_id: string;
  child_user_id?: string;
}

export interface ActivityProgress {
  activityId: string;
  activityName: string;
  completions: number;
  lastCompleted?: string;
  progress: number; // percentage based on expected completions
}

export const useActivityProgress = (childUserId?: string) => {
  const [activityCompletions, setActivityCompletions] = useState<ActivityCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, role } = useAuth();
  const { toast } = useToast();

  const targetUserId = childUserId || user?.id;
  const isParentViewing = role === 'parent' && childUserId;

  const fetchActivityCompletions = useCallback(async () => {
    if (!targetUserId) return;

    try {
      let query = supabase
        .from('activity_completions')
        .select('*')
        .order('completed_at', { ascending: false });

      if (isParentViewing) {
        // Parent viewing child's progress
        query = query.eq('child_user_id', childUserId);
      } else {
        // User viewing their own progress
        query = query.eq('user_id', targetUserId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setActivityCompletions(data || []);
    } catch (error) {
      console.error('Error fetching activity completions:', error);
      toast({
        title: "Error",
        description: "Failed to load activity progress",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [targetUserId, isParentViewing, childUserId, toast]);

  const recordActivityCompletion = useCallback(async (
    activityName: string,
    activityType: string,
    eqTrait?: string,
    notes?: string
  ) => {
    if (!user) return { error: "User not authenticated" };

    try {
      const completionData = {
        user_id: user.id,
        child_user_id: role === 'parent' ? childUserId : null,
        activity_name: activityName,
        activity_type: activityType,
        eq_trait: eqTrait || null,
        notes: notes || null,
        completed_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('activity_completions')
        .insert([completionData]);

      if (error) throw error;

      toast({
        title: "Great job! 🎉",
        description: `${activityName} completed successfully!`,
      });

      // Refresh data
      await fetchActivityCompletions();
      
      return { success: true };
    } catch (error) {
      console.error('Error recording activity completion:', error);
      toast({
        title: "Error",
        description: "Failed to record activity completion",
        variant: "destructive"
      });
      return { error: "Failed to record completion" };
    }
  }, [user, role, childUserId, toast, fetchActivityCompletions]);

  const getActivityProgress = useCallback((activityId: string): ActivityProgress => {
    const relevantCompletions = activityCompletions.filter(
      completion => completion.activity_name.toLowerCase().replace(/\s+/g, '-') === activityId
    );
    
    const completions = relevantCompletions.length;
    const lastCompleted = relevantCompletions[0]?.completed_at;
    
    // Calculate progress percentage (each activity can be completed multiple times)
    // Progress increases with each completion, capped at 100%
    const progress = Math.min((completions * 20), 100); // 20% per completion, max 100%

    return {
      activityId,
      activityName: relevantCompletions[0]?.activity_name || activityId,
      completions,
      lastCompleted,
      progress
    };
  }, [activityCompletions]);

  const getTotalStats = useCallback(() => {
    const totalCompletions = activityCompletions.length;
    const uniqueActivities = new Set(activityCompletions.map(a => a.activity_name)).size;
    const uniqueEQTraits = new Set(
      activityCompletions.map(a => a.eq_trait).filter(Boolean)
    ).size;

    return {
      totalCompletions,
      uniqueActivities,
      uniqueEQTraits
    };
  }, [activityCompletions]);

  // Set up real-time subscription
  useEffect(() => {
    if (!targetUserId) return;

    fetchActivityCompletions();

    const channel = supabase
      .channel('activity-progress-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_completions',
          filter: isParentViewing 
            ? `child_user_id=eq.${childUserId}` 
            : `user_id=eq.${targetUserId}`
        },
        (payload) => {
          console.log('Real-time activity update:', payload);
          fetchActivityCompletions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchActivityCompletions, targetUserId, isParentViewing, childUserId]);

  return {
    activityCompletions,
    loading,
    recordActivityCompletion,
    getActivityProgress,
    getTotalStats,
    refreshData: fetchActivityCompletions
  };
};