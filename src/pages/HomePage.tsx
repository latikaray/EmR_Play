import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star, Target, Award, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const quickStats = [
    { icon: Target, label: "Activities Completed", value: "12", color: "text-fun-pink" },
    { icon: Star, label: "Mood Score", value: "8.5", color: "text-fun-yellow" },
    { icon: Award, label: "Badges Earned", value: "5", color: "text-accent" },
    { icon: Heart, label: "Days Active", value: "7", color: "text-secondary" },
  ];

  const activityCategories = [
    {
      title: "Draw Your Mood",
      description: "Express feelings through colorful art",
      icon: "🎨",
      color: "bg-fun-pink",
      path: "/activities/draw"
    },
    {
      title: "Emoji Match",
      description: "Match emotions with fun emoji games",
      icon: "😊",
      color: "bg-fun-yellow",
      path: "/activities/emoji-match"
    },
    {
      title: "Story Time",
      description: "Interactive stories about emotions",
      icon: "📚",
      color: "bg-accent",
      path: "/activities/story"
    },
    {
      title: "Breathing Fun",
      description: "Calm down with guided breathing",
      icon: "🫁",
      color: "bg-fun-teal",
      path: "/activities/breathing"
    },
    {
      title: "Gratitude Journal",
      description: "Write about things that make you happy",
      icon: "📝",
      color: "bg-secondary",
      path: "/activities/gratitude"
    },
    {
      title: "Emotion Wheel",
      description: "Spin the wheel to explore different emotions",
      icon: "🎯",
      color: "bg-fun-orange",
      path: "/activities/emotion-wheel"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-fun-yellow animate-bounce" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-fun bg-clip-text text-transparent font-comic">
              EMR Play
            </h1>
            <Sparkles className="h-8 w-8 text-fun-pink animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground font-comic">
            Welcome back, Alex! Ready for some emotional adventures? 🌟
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button variant="fun" size="lg" className="animate-bounce-in">
              Continue Journey
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/profile">View Profile</Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={stat.label} className="hover-lift shadow-card bg-card/50 backdrop-blur">
              <CardContent className="p-4 text-center">
                <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-foreground font-comic">{stat.value}</p>
                <p className="text-sm text-muted-foreground font-comic">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mood Tracker */}
        <Card className="bg-gradient-secondary shadow-fun">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-comic text-secondary-foreground">
              What's your mood today? 😊
            </CardTitle>
            <CardDescription className="text-secondary-foreground/80 font-comic">
              Track your emotions and see how you're feeling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { emoji: "😊", label: "Happy", color: "bg-fun-yellow" },
                { emoji: "😢", label: "Sad", color: "bg-fun-blue" },
                { emoji: "😡", label: "Angry", color: "bg-fun-red" },
                { emoji: "😰", label: "Worried", color: "bg-fun-purple" },
                { emoji: "😴", label: "Tired", color: "bg-fun-gray" },
                { emoji: "🤗", label: "Excited", color: "bg-fun-pink" },
              ].map((mood) => (
                <Button
                  key={mood.label}
                  variant="outline"
                  className={`h-20 flex-col gap-2 hover:scale-105 transition-all duration-200 ${mood.color} hover:bg-opacity-20 border-2 hover:border-primary/30`}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs font-comic">{mood.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Categories */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground font-comic mb-2">
              Choose Your Adventure! 🚀
            </h2>
            <p className="text-lg text-muted-foreground font-comic">
              Pick an activity to explore your emotions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activityCategories.map((activity, index) => (
              <Card key={activity.title} className="hover-lift shadow-activity bg-card/80 backdrop-blur border-2 border-transparent hover:border-primary/20 transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${activity.color} rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-fun`}>
                    {activity.icon}
                  </div>
                  <CardTitle className="text-xl font-comic text-foreground">
                    {activity.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground font-comic">
                    {activity.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="activity" className="w-full group" asChild>
                    <Link to={activity.path}>
                      Start Playing
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Progress Summary */}
        <Card className="bg-gradient-primary text-primary-foreground shadow-fun">
          <CardHeader>
            <CardTitle className="text-2xl font-comic flex items-center gap-2">
              <Award className="h-6 w-6" />
              Your Emotional Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold font-comic">75%</p>
                <p className="text-sm opacity-90 font-comic">This Week's Progress</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold font-comic">3</p>
                <p className="text-sm opacity-90 font-comic">New Badges Available</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold font-comic">Happy</p>
                <p className="text-sm opacity-90 font-comic">Most Common Mood</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;