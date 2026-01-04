import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { format } from "date-fns";

export interface MoodEntry {
  id: string;
  mood_emoji: string;
  date: string;
  notes?: string;
  user_id: string;
  child_user_id?: string;
  created_at: string;
}

export const useMoodProgress = (childUserId?: string) => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, role } = useAuth();
  const { toast } = useToast();

  const targetUserId = childUserId || user?.id;
  const isParentViewing = role === 'parent' && childUserId;

  const fetchMoodEntries = useCallback(async () => {
    if (!targetUserId) return;

    try {
      let query = supabase
        .from('mood_entries')
        .select('*')
        .order('date', { ascending: false });

      if (isParentViewing) {
        // Parent viewing child's mood
        query = query.eq('child_user_id', childUserId);
      } else {
        // User viewing their own mood
        query = query.eq('user_id', targetUserId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMoodEntries(data || []);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
      toast({
        title: "Error",
        description: "Failed to load mood data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [targetUserId, isParentViewing, childUserId, toast]);

  const saveMoodEntry = useCallback(async (
    date: Date,
    moodEmoji: string,
    notes?: string
  ) => {
    if (!user) return { error: "User not authenticated" };

    try {
      const moodData = {
        user_id: user.id,
        child_user_id: role === 'parent' ? childUserId : null,
        mood_emoji: moodEmoji,
        date: format(date, 'yyyy-MM-dd'),
        notes: notes || null
      };

      const { error } = await supabase
        .from('mood_entries')
        .upsert(moodData, {
          onConflict: isParentViewing ? 'child_user_id,date' : 'user_id,date'
        });

      if (error) throw error;

      toast({
        title: "Mood saved! 😊",
        description: "Your mood has been recorded successfully.",
      });

      // Refresh data
      await fetchMoodEntries();
      
      return { success: true };
    } catch (error) {
      console.error('Error saving mood:', error);
      toast({
        title: "Error",
        description: "Failed to save mood entry",
        variant: "destructive"
      });
      return { error: "Failed to save mood" };
    }
  }, [user, role, childUserId, toast, fetchMoodEntries, isParentViewing]);

  const getMoodForDate = useCallback((date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return moodEntries.find(entry => entry.date === dateStr);
  }, [moodEntries]);

  const getRecentMoods = useCallback((days: number = 7) => {
    const recentDays = Array.from({length: days}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    });

    return recentDays.map(date => ({
      date: format(date, 'MMM d'),
      fullDate: date,
      mood: getMoodForDate(date)?.mood_emoji || "😑"
    }));
  }, [getMoodForDate]);

  const getMoodStats = useCallback(() => {
    const totalEntries = moodEntries.length;
    const recentEntries = moodEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });

    // Count mood types
    const moodCounts = moodEntries.reduce((acc, entry) => {
      acc[entry.mood_emoji] = (acc[entry.mood_emoji] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostFrequentMood = Object.entries(moodCounts).sort(
      ([,a], [,b]) => b - a
    )[0]?.[0];

    return {
      totalEntries,
      recentEntries: recentEntries.length,
      mostFrequentMood,
      moodCounts
    };
  }, [moodEntries]);

  // Set up real-time subscription
  useEffect(() => {
    if (!targetUserId) return;

    fetchMoodEntries();

    const channel = supabase
      .channel('mood-progress-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mood_entries',
          filter: isParentViewing 
            ? `child_user_id=eq.${childUserId}` 
            : `user_id=eq.${targetUserId}`
        },
        (payload) => {
          console.log('Real-time mood update:', payload);
          fetchMoodEntries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMoodEntries, targetUserId, isParentViewing, childUserId]);

  return {
    moodEntries,
    loading,
    saveMoodEntry,
    getMoodForDate,
    getRecentMoods,
    getMoodStats,
    refreshData: fetchMoodEntries
  };
};