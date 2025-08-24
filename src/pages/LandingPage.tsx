import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Baby, Sparkles, Star, BookOpen, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles className="absolute top-20 left-20 h-6 w-6 text-fun-yellow animate-float" />
        <Heart className="absolute top-32 right-32 h-5 w-5 text-fun-pink animate-float" style={{ animationDelay: '1s' }} />
        <Star className="absolute bottom-40 left-40 h-4 w-4 text-accent animate-float" style={{ animationDelay: '2s' }} />
        <Sparkles className="absolute bottom-20 right-20 h-7 w-7 text-fun-teal animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-fun animate-bounce-in">
              <Heart className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-fun bg-clip-text text-transparent font-comic">
              EMR Play
            </h1>
          </div>
          <p className="text-2xl text-muted-foreground font-comic max-w-3xl mx-auto mb-8">
            Welcome to the magical world of emotional learning! 🌟 
            A safe space where children and parents grow together through fun activities and mindful exploration.
          </p>
        </div>

        {/* Main Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* For Children */}
          <Card className="h-full hover-lift shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20 hover:border-fun-pink/40 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-fun-pink rounded-full flex items-center justify-center mx-auto mb-4 shadow-fun">
                <Baby className="h-10 w-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl font-comic text-foreground">
                For Children 🧒
              </CardTitle>
              <CardDescription className="text-lg font-comic">
                Discover emotions through stories, games, and creative activities!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-fun-pink" />
                  <span className="font-comic">Interactive stories and mood tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <Gamepad2 className="h-5 w-5 text-fun-pink" />
                  <span className="font-comic">Fun emotion games and breathing exercises</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-fun-pink" />
                  <span className="font-comic">Drawing and gratitude journaling</span>
                </div>
              </div>
              <div className="space-y-3 pt-4">
                <Link to="/signup" className="w-full">
                  <Button variant="fun" size="lg" className="w-full text-lg">
                    Start Playing! 🚀
                  </Button>
                </Link>
                <Link to="/login" className="w-full">
                  <Button variant="outline" size="lg" className="w-full font-comic">
                    I Already Have an Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* For Parents */}
          <Card className="h-full hover-lift shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20 hover:border-fun-teal/40 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-fun-teal rounded-full flex items-center justify-center mx-auto mb-4 shadow-fun">
                <Users className="h-10 w-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl font-comic text-foreground">
                For Parents 👨‍👩‍👧‍👦
              </CardTitle>
              <CardDescription className="text-lg font-comic">
                Practice parenting scenarios and support your child's emotional growth!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-fun-teal" />
                  <span className="font-comic">Role-play real parenting situations</span>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-fun-teal" />
                  <span className="font-comic">Reflective quizzes and parenting journal</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-fun-teal" />
                  <span className="font-comic">Track your child's emotional progress</span>
                </div>
              </div>
              <div className="space-y-3 pt-4">
                <Link to="/signup" className="w-full">
                  <Button variant="fun" size="lg" className="w-full text-lg">
                    Join as Parent! 💪
                  </Button>
                </Link>
                <Link to="/login" className="w-full">
                  <Button variant="outline" size="lg" className="w-full font-comic">
                    I Already Have an Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <Card className="shadow-fun bg-gradient-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold font-comic mb-4">🔒 Safe & Secure Learning Environment</h3>
            <p className="text-lg opacity-90 font-comic max-w-2xl mx-auto">
              EMR Play is designed with child safety and privacy as our top priority. 
              All activities are age-appropriate and data is protected with enterprise-grade security.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LandingPage;