import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  TrendingUp, 
  Heart, 
  Calendar as CalendarIcon, 
  Target, 
  MessageSquare, 
  BarChart3,
  ArrowLeft,
  Plus,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MoodEntry {
  id: string;
  mood_emoji: string;
  date: string;
  notes?: string;
}

interface ActivityCompletion {
  id: string;
  activity_name: string;
  activity_type: string;
  eq_trait?: string;
  completed_at: string;
  notes?: string;
}

const ChildProgressPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [activityCompletions, setActivityCompletions] = useState<ActivityCompletion[]>([]);
  const [newMoodEmoji, setNewMoodEmoji] = useState("");
  const [moodNotes, setMoodNotes] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const moodEmojis = [
    { emoji: "😊", name: "Happy", color: "text-green-500" },
    { emoji: "😔", name: "Sad", color: "text-blue-500" },
    { emoji: "😠", name: "Angry", color: "text-red-500" },
    { emoji: "😴", name: "Tired", color: "text-purple-500" },
    { emoji: "😰", name: "Worried", color: "text-yellow-500" },
    { emoji: "🤗", name: "Excited", color: "text-pink-500" },
    { emoji: "😑", name: "Neutral", color: "text-gray-500" },
    { emoji: "🥰", name: "Loved", color: "text-red-400" }
  ];

  const eqTraits = [
    "Self-Awareness", "Empathy", "Social Skills", "Emotional Regulation", 
    "Motivation", "Communication", "Problem Solving", "Confidence"
  ];

  useEffect(() => {
    if (user) {
      fetchMoodEntries();
      fetchActivityCompletions();
    }
  }, [user]);

  const fetchMoodEntries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setMoodEntries(data || []);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
    }
  };

  const fetchActivityCompletions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('activity_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setActivityCompletions(data || []);
    } catch (error) {
      console.error('Error fetching activity completions:', error);
    }
  };

  const saveMoodEntry = async () => {
    if (!user || !newMoodEmoji) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('mood_entries')
        .upsert({
          user_id: user.id,
          mood_emoji: newMoodEmoji,
          date: format(selectedDate, 'yyyy-MM-dd'),
          notes: moodNotes || null
        }, {
          onConflict: 'user_id,date'
        });

      if (error) throw error;

      toast({ title: "Mood saved successfully!" });
      await fetchMoodEntries();
      setNewMoodEmoji("");
      setMoodNotes("");
    } catch (error) {
      console.error('Error saving mood:', error);
      toast({
        title: "Error",
        description: "Failed to save mood entry",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTraitProgress = (trait: string) => {
    const traitActivities = activityCompletions.filter(ac => ac.eq_trait === trait);
    return traitActivities.length;
  };

  const getMoodForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return moodEntries.find(entry => entry.date === dateStr);
  };

  const getRecentMoods = () => {
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    });

    return last7Days.map(date => ({
      date: format(date, 'MMM d'),
      mood: getMoodForDate(date)?.mood_emoji || "😑"
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={profile?.role === 'parent' ? '/parent' : '/'}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-fun bg-clip-text text-transparent font-comic">
              {profile?.role === 'parent' ? "Track Your Child's Progress" : "Your Progress"}
            </h1>
            <p className="text-lg text-muted-foreground font-comic mt-2">
              Monitor emotional growth and activity completions
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="font-comic">Overview</TabsTrigger>
            <TabsTrigger value="mood" className="font-comic">Mood Tracker</TabsTrigger>
            <TabsTrigger value="activities" className="font-comic">Activities</TabsTrigger>
            <TabsTrigger value="growth" className="font-comic">Growth</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
                <CardHeader className="text-center">
                  <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="font-comic">Activities Completed</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-primary font-comic">
                    {activityCompletions.length}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
                <CardHeader className="text-center">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="font-comic">Mood Entries</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-primary font-comic">
                    {moodEntries.length}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
                <CardHeader className="text-center">
                  <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="font-comic">EQ Traits Practiced</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-primary font-comic">
                    {eqTraits.filter(trait => getTraitProgress(trait) > 0).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Mood Trend */}
            <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="font-comic">Recent Mood Trend</CardTitle>
                <CardDescription className="font-comic">Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  {getRecentMoods().reverse().map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl mb-2">{day.mood}</div>
                      <div className="text-xs text-muted-foreground font-comic">{day.date}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mood Tracker Tab */}
          <TabsContent value="mood" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mood Calendar */}
              <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="font-comic">Mood Calendar</CardTitle>
                  <CardDescription className="font-comic">
                    Click on a date to add or view mood
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              {/* Add Mood Entry */}
              <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="font-comic">
                    Add Mood for {format(selectedDate, "MMM d, yyyy")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-comic">How are you feeling?</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {moodEmojis.map((mood) => (
                        <Button
                          key={mood.emoji}
                          variant={newMoodEmoji === mood.emoji ? "default" : "outline"}
                          className="h-12 text-2xl"
                          onClick={() => setNewMoodEmoji(mood.emoji)}
                        >
                          {mood.emoji}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="font-comic">Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="What made you feel this way?"
                      value={moodNotes}
                      onChange={(e) => setMoodNotes(e.target.value)}
                      className="font-comic"
                    />
                  </div>

                  <Button 
                    onClick={saveMoodEntry}
                    disabled={!newMoodEmoji || loading}
                    variant="fun"
                    className="w-full"
                  >
                    {loading ? "Saving..." : "Save Mood"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="font-comic">Recent Activities</CardTitle>
                <CardDescription className="font-comic">
                  Activities completed and EQ traits practiced
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activityCompletions.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-comic text-muted-foreground">
                      No activities completed yet
                    </p>
                    <p className="text-sm font-comic text-muted-foreground">
                      Start with some activities to see your progress here!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activityCompletions.slice(0, 10).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                        <div>
                          <h4 className="font-comic font-semibold">{activity.activity_name}</h4>
                          <p className="text-sm text-muted-foreground font-comic">
                            {activity.activity_type} • {format(new Date(activity.completed_at), "MMM d, yyyy")}
                          </p>
                        </div>
                        {activity.eq_trait && (
                          <Badge variant="secondary" className="font-comic">
                            {activity.eq_trait}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Growth Tab */}
          <TabsContent value="growth" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* EQ Traits Progress */}
              <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="font-comic">EQ Traits Progress</CardTitle>
                  <CardDescription className="font-comic">
                    Number of activities completed for each trait
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {eqTraits.map((trait) => {
                      const count = getTraitProgress(trait);
                      return (
                        <div key={trait} className="flex items-center justify-between">
                          <span className="text-sm font-comic">{trait}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-secondary rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min((count / 5) * 100, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm font-comic font-semibold">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Feedback Section */}
              {profile?.role === 'parent' && (
                <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="font-comic">Parent Feedback</CardTitle>
                    <CardDescription className="font-comic">
                      Share your observations about your child's progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="What have you noticed about your child's emotional growth?"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="min-h-[100px] font-comic"
                    />
                    <Button variant="fun" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Save Feedback
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Focus Areas */}
              <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="font-comic">Focus Areas & Suggestions</CardTitle>
                  <CardDescription className="font-comic">
                    Areas to work on based on activity patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {eqTraits
                      .filter(trait => getTraitProgress(trait) < 2)
                      .slice(0, 3)
                      .map((trait) => (
                        <div key={trait} className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                          <h4 className="font-comic font-semibold text-sm">{trait}</h4>
                          <p className="text-xs font-comic text-muted-foreground">
                            Try more activities focused on this skill
                          </p>
                        </div>
                      ))}
                    
                    {eqTraits.filter(trait => getTraitProgress(trait) < 2).length === 0 && (
                      <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg text-center">
                        <p className="font-comic text-sm">
                          Great job! You're practicing all EQ traits well! 🌟
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChildProgressPage;