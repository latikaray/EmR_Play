import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, BookOpen, MessageSquare, Gamepad2, FileText, Users, Brain, Coffee, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import LinkChildAccount from "@/components/LinkChildAccount";

const ParentHomePage = () => {
  const [completedActivities] = useState([
    { name: "Role Play: Dinner Refusal", type: "scenario", date: "Today" },
    { name: "Quiz: Child Emotional Support", type: "quiz", date: "Yesterday" },
  ]);

  const parentingActivities = [
    {
      title: "Role Play Scenarios",
      description: "Practice handling real parenting situations",
      icon: Users,
      path: "/parent/role-play",
      color: "bg-fun-pink",
      count: "6 scenarios",
      sample: "Your child refuses to eat dinner"
    },
    {
      title: "What Would You Do Quizzes",
      description: "Test your parenting instincts with reflective feedback",
      icon: Brain,
      path: "/parent/quizzes", 
      color: "bg-fun-teal",
      count: "6 questions",
      sample: "Child wants to quit a class midway"
    },
    {
      title: "Parenting Journal",
      description: "Weekly reflection on your parenting journey", 
      icon: BookOpen,
      path: "/parent/journal",
      color: "bg-fun-yellow",
      count: "Weekly entries",
      sample: "What made you proud this week?"
    },
    {
      title: "Scenario Mini Games",
      description: "Interactive simulations with feedback",
      icon: Gamepad2,
      path: "/parent/mini-games",
      color: "bg-accent",
      count: "3 simulations", 
      sample: "Handle with Care scenarios"
    },
    {
      title: "Interactive Articles",
      description: "Learn through engaging content with tasks",
      icon: FileText,
      path: "/parent/articles",
      color: "bg-fun-purple",
      count: "3 articles",
      sample: "Fathers wear pink: Gender & colors"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-fun animate-bounce-in">
              <Heart className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-fun bg-clip-text text-transparent font-comic">
              Parent Dashboard
            </h1>
          </div>
          <p className="text-xl text-muted-foreground font-comic max-w-2xl mx-auto">
            Welcome to your parenting journey! Practice, learn, and grow with your child through emotional intelligence activities.
          </p>
        </div>

        {/* Progress Summary */}
        <Card className="mb-8 shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="font-comic flex items-center gap-2">
              <Coffee className="h-5 w-5 text-primary" />
              Your Progress Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary font-comic">{completedActivities.length}</div>
                <div className="text-sm text-muted-foreground font-comic">Activities Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary font-comic">2</div>
                <div className="text-sm text-muted-foreground font-comic">Insights Gained</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary font-comic">5</div>
                <div className="text-sm text-muted-foreground font-comic">Day Streak</div>
              </div>
            </div>
            
            {completedActivities.length > 0 && (
              <div className="mt-4">
                <h4 className="font-comic font-semibold mb-2">Recent Completions:</h4>
                <div className="flex flex-wrap gap-2">
                  {completedActivities.map((activity, index) => (
                    <Badge key={index} variant="secondary" className="font-comic">
                      {activity.name} • {activity.date}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Link Child Account */}
        <LinkChildAccount />

        {/* Main Activities Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-6 font-comic text-foreground">
            Parenting Activities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parentingActivities.map((activity, index) => (
              <Link key={index} to={activity.path}>
                <Card className="h-full hover-lift shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 ${activity.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-fun`}>
                      <activity.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="font-comic text-foreground">
                      {activity.title}
                    </CardTitle>
                    <CardDescription className="font-comic">
                      {activity.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Badge variant="outline" className="mb-3 font-comic">
                      {activity.count}
                    </Badge>
                    <p className="text-sm text-muted-foreground font-comic italic">
                      Example: "{activity.sample}"
                    </p>
                    <Button variant="fun" size="sm" className="mt-4 w-full">
                      Start Activity 🚀
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="font-comic text-center">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/parent/child-progress">
                <Button variant="outline" size="lg" className="w-full font-comic">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Track Child's Progress
                </Button>
              </Link>
              <Link to="/parent/guide-library">
                <Button variant="outline" size="lg" className="w-full font-comic">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Parenting Guide Library
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentHomePage;