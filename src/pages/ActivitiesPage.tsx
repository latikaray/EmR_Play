import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, Trophy, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useActivityProgress } from "@/hooks/useActivityProgress";

const ActivitiesPage = () => {
  const { getActivityProgress, getTotalStats, loading } = useActivityProgress();
  
  const baseActivities = [
    {
      id: "draw-mood",
      title: "Draw Your Mood",
      description: "Express your feelings through colorful drawings and art",
      icon: "🎨",
      difficulty: "Easy",
      duration: "10-15 min",
      participants: "Solo",
      badges: ["Creative", "Expressive"],
      color: "bg-fun-pink",
      path: "/activities/draw",
      activityType: "creative",
      eqTrait: "Self-Awareness"
    },
    {
      id: "emoji-match",
      title: "Emoji Match Game",
      description: "Match emotions with their emoji friends in this fun puzzle",
      icon: "😊",
      difficulty: "Medium",
      duration: "5-10 min",
      participants: "Solo",
      badges: ["Quick Thinker", "Emotion Expert"],
      color: "bg-fun-yellow",
      path: "/activities/emoji-match",
      activityType: "game",
      eqTrait: "Emotional Regulation"
    },
    {
      id: "story-time",
      title: "Interactive Stories",
      description: "Join characters on emotional adventures and learn together",
      icon: "📚",
      difficulty: "Easy",
      duration: "15-20 min",
      participants: "Solo or with family",
      badges: ["Story Master", "Empathy Hero"],
      color: "bg-accent",
      path: "/activities/story",
      activityType: "story",
      eqTrait: "Empathy"
    },
    {
      id: "breathing",
      title: "Breathing Adventures",
      description: "Calm your mind with guided breathing exercises and games",
      icon: "🫁",
      difficulty: "Easy",
      duration: "5-10 min",
      participants: "Solo",
      badges: ["Zen Master", "Calm Champion"],
      color: "bg-fun-teal",
      path: "/activities/breathing",
      activityType: "mindfulness",
      eqTrait: "Emotional Regulation"
    },
    {
      id: "gratitude",
      title: "Gratitude Journal",
      description: "Write about wonderful things that make you smile",
      icon: "📝",
      difficulty: "Easy",
      duration: "10-15 min",
      participants: "Solo",
      badges: ["Grateful Heart", "Daily Writer"],
      color: "bg-secondary",
      path: "/activities/gratitude",
      activityType: "journal",
      eqTrait: "Self-Awareness"
    },
    {
      id: "emotion-wheel",
      title: "Emotion Wheel Spin",
      description: "Discover new emotions and learn what they mean",
      icon: "🎡",
      difficulty: "Medium",
      duration: "8-12 min",
      participants: "Solo",
      badges: ["Emotion Explorer", "Wheel Master"],
      color: "bg-fun-orange",
      path: "/activities/emotion-wheel",
      activityType: "educational",
      eqTrait: "Self-Awareness"
    }
  ];

  // Get real progress data for each activity
  const activities = baseActivities.map(activity => {
    const progressData = getActivityProgress(activity.id);
    return {
      ...activity,
      progress: progressData.progress,
      completions: progressData.completions,
      isCompleted: progressData.completions > 0,
      isNew: progressData.completions === 0,
      lastCompleted: progressData.lastCompleted
    };
  });

  const stats = getTotalStats();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-success/20 text-success";
      case "Medium": return "bg-warning/20 text-warning";
      case "Hard": return "bg-destructive/20 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-fun-yellow animate-float" />
            <h1 className="text-3xl md:text-5xl font-bold text-foreground font-comic">
              Emotion Activities
            </h1>
            <Sparkles className="h-6 w-6 text-fun-pink animate-float" style={{ animationDelay: '1s' }} />
          </div>
          <p className="text-lg md:text-xl text-muted-foreground font-comic">
            Choose your emotional adventure and have fun learning! 🌈
          </p>
        </div>

        {/* Filter/Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover-lift shadow-card bg-card/50 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-fun-yellow" />
              <p className="text-xl font-bold text-foreground font-comic">{baseActivities.length}</p>
              <p className="text-sm text-muted-foreground font-comic">Total Activities</p>
            </CardContent>
          </Card>
          <Card className="hover-lift shadow-card bg-card/50 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-fun-pink" />
              <p className="text-xl font-bold text-foreground font-comic">
                {loading ? "..." : activities.filter(a => a.completions > 0).length}
              </p>
              <p className="text-sm text-muted-foreground font-comic">Completed</p>
            </CardContent>
          </Card>
          <Card className="hover-lift shadow-card bg-card/50 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-accent" />
              <p className="text-xl font-bold text-foreground font-comic">
                {loading ? "..." : activities.filter(a => a.progress > 0 && a.progress < 100).length}
              </p>
              <p className="text-sm text-muted-foreground font-comic">In Progress</p>
            </CardContent>
          </Card>
          <Card className="hover-lift shadow-card bg-card/50 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-secondary" />
              <p className="text-xl font-bold text-foreground font-comic">
                {loading ? "..." : stats.totalCompletions}
              </p>
              <p className="text-sm text-muted-foreground font-comic">Total Completions</p>
            </CardContent>
          </Card>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => (
            <Card key={activity.id} className="hover-lift shadow-activity bg-card/80 backdrop-blur border-2 border-transparent hover:border-primary/20 transition-all duration-300 relative overflow-hidden">
              {activity.isNew && (
                <Badge className="absolute top-2 right-2 bg-fun-yellow text-white font-comic z-10">
                  New!
                </Badge>
              )}
              {activity.isCompleted && (
                <Badge className="absolute top-2 right-2 bg-success text-white font-comic z-10">
                  ✓ {activity.completions}x
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 ${activity.color} rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-fun animate-float`} style={{ animationDelay: `${index * 0.2}s` }}>
                  {activity.icon}
                </div>
                <CardTitle className="text-lg font-comic text-foreground">
                  {activity.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground font-comic">
                  {activity.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Activity Details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="font-comic">{activity.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span className="font-comic">{activity.participants}</span>
                  </div>
                </div>

                {/* Difficulty Badge */}
                <Badge className={`${getDifficultyColor(activity.difficulty)} font-comic text-xs`}>
                  {activity.difficulty}
                </Badge>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-comic text-muted-foreground">Progress</span>
                    <span className="font-comic text-foreground font-bold">{activity.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${activity.progress}%` }}
                    />
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1">
                  {activity.badges.map((badge, badgeIndex) => (
                    <Badge key={badgeIndex} variant="outline" className="text-xs font-comic">
                      {badge}
                    </Badge>
                  ))}
                </div>

                {/* Action Button */}
                <Button 
                  variant={activity.isCompleted ? "secondary" : "activity"} 
                  className="w-full group" 
                  asChild
                >
                  <Link to={activity.path}>
                    {activity.isCompleted ? "Play Again" : activity.progress > 0 ? "Continue" : "Start Playing"}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <Card className="bg-gradient-fun text-white shadow-fun">
          <CardContent className="p-6 text-center">
            <h3 className="text-2xl font-bold font-comic mb-2">Ready for More Adventures?</h3>
            <p className="text-lg opacity-90 font-comic mb-4">
              Complete activities to unlock new emotional superpowers! 🦸‍♀️
            </p>
            <Button variant="outline" size="lg" className="bg-white text-fun-pink hover:bg-white/90">
              <Link to="/progress">View My Progress</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivitiesPage;