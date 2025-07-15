import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, RotateCcw, Star, Clock, Heart, Brain, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface Exercise {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  breathPattern: { in: number; hold: number; out: number; cycles: number };
  situations: string[];
  benefits: string[];
  color: string;
  animationColor: string;
}

const BreathingPage = () => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'in' | 'hold' | 'out'>('in');
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  const exercises: Exercise[] = [
    {
      id: "balloon-breathing",
      title: "Balloon Breathing",
      description: "Imagine inflating and deflating a colorful balloon in your tummy",
      icon: "🎈",
      duration: "3-5 minutes",
      breathPattern: { in: 4, hold: 2, out: 4, cycles: 5 },
      situations: [
        "When feeling worried or anxious",
        "Before a test or presentation", 
        "When it's hard to fall asleep",
        "After an argument with friends"
      ],
      benefits: [
        "Calms your mind and body",
        "Helps you feel more relaxed",
        "Makes worries feel smaller",
        "Improves focus and attention"
      ],
      color: "bg-fun-pink",
      animationColor: "border-fun-pink"
    },
    {
      id: "ocean-waves",
      title: "Ocean Wave Breathing",
      description: "Breathe like gentle ocean waves rolling in and out of the shore",
      icon: "🌊",
      duration: "4-6 minutes",
      breathPattern: { in: 5, hold: 1, out: 6, cycles: 6 },
      situations: [
        "When feeling angry or frustrated",
        "After a busy or overwhelming day",
        "When you need to calm down quickly",
        "Before important conversations"
      ],
      benefits: [
        "Releases tension and stress",
        "Brings peaceful feelings",
        "Helps process emotions better",
        "Creates inner calm and balance"
      ],
      color: "bg-fun-teal",
      animationColor: "border-fun-teal"
    },
    {
      id: "star-breathing",
      title: "Shooting Star Breathing",
      description: "Follow a magical shooting star across the sky with your breath",
      icon: "⭐",
      duration: "2-4 minutes",
      breathPattern: { in: 3, hold: 3, out: 3, cycles: 8 },
      situations: [
        "When you want to feel more confident",
        "Before trying something new",
        "When feeling sad or disappointed",
        "To boost energy and mood"
      ],
      benefits: [
        "Builds confidence and courage",
        "Increases positive feelings",
        "Sparks creativity and imagination",
        "Helps you feel more energized"
      ],
      color: "bg-fun-yellow",
      animationColor: "border-fun-yellow"
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && selectedExercise && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Move to next phase
            if (currentPhase === 'in') {
              setCurrentPhase('hold');
              return selectedExercise.breathPattern.hold;
            } else if (currentPhase === 'hold') {
              setCurrentPhase('out');
              return selectedExercise.breathPattern.out;
            } else {
              // End of cycle
              if (currentCycle >= selectedExercise.breathPattern.cycles) {
                setIsActive(false);
                setIsCompleted(true);
                return 0;
              } else {
                setCurrentCycle(prev => prev + 1);
                setCurrentPhase('in');
                return selectedExercise.breathPattern.in;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentPhase, currentCycle, selectedExercise]);

  const startExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCurrentPhase('in');
    setTimeLeft(exercise.breathPattern.in);
    setCurrentCycle(1);
    setIsCompleted(false);
    setIsActive(true);
  };

  const togglePause = () => {
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    if (selectedExercise) {
      setIsActive(false);
      setCurrentPhase('in');
      setTimeLeft(selectedExercise.breathPattern.in);
      setCurrentCycle(1);
      setIsCompleted(false);
    }
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'in': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'out': return 'Breathe Out';
      default: return '';
    }
  };

  const getAnimationSize = () => {
    if (!isActive) return 'scale-75';
    switch (currentPhase) {
      case 'in': return 'scale-150';
      case 'hold': return 'scale-125';
      case 'out': return 'scale-75';
      default: return 'scale-75';
    }
  };

  if (selectedExercise) {
    return (
      <div className="min-h-screen bg-gradient-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" asChild>
              <Link to="/activities/breathing">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground font-comic">
                {selectedExercise.title}
              </h1>
              <p className="text-muted-foreground font-comic">
                {selectedExercise.description}
              </p>
            </div>
          </div>

          {/* Main Exercise Area */}
          <Card className="bg-card/80 backdrop-blur shadow-activity">
            <CardContent className="p-8 text-center">
              {/* Breathing Animation */}
              <div className="relative mb-8">
                <div 
                  className={`w-48 h-48 mx-auto rounded-full ${selectedExercise.animationColor} border-8 transition-all duration-1000 ease-in-out ${getAnimationSize()}`}
                  style={{ 
                    background: `radial-gradient(circle, ${selectedExercise.color.replace('bg-', 'hsl(var(--')}), transparent)`,
                    boxShadow: isActive ? '0 0 40px rgba(var(--primary), 0.3)' : 'none'
                  }}
                >
                  <div className="flex items-center justify-center h-full text-6xl animate-float">
                    {selectedExercise.icon}
                  </div>
                </div>
              </div>

              {/* Phase Instructions */}
              <div className="space-y-4 mb-8">
                <h2 className="text-3xl font-bold text-foreground font-comic">
                  {getPhaseText()}
                </h2>
                <div className="text-6xl font-bold text-primary font-comic">
                  {timeLeft}
                </div>
                <p className="text-lg text-muted-foreground font-comic">
                  Cycle {currentCycle} of {selectedExercise.breathPattern.cycles}
                </p>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4 mb-6">
                <Button
                  variant="activity"
                  size="lg"
                  onClick={togglePause}
                  className="font-comic"
                >
                  {isActive ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                  {isActive ? 'Pause' : 'Play'}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={resetExercise}
                  className="font-comic"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>

              {/* Completion Message */}
              {isCompleted && (
                <Card className="bg-success/10 border-success">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-success" />
                      <h3 className="text-lg font-bold text-success font-comic">Great Job!</h3>
                      <Star className="h-5 w-5 text-success" />
                    </div>
                    <p className="text-success font-comic">
                      You completed the {selectedExercise.title} exercise! How do you feel now?
                    </p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Exercise Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-comic text-foreground">
                  <Brain className="h-5 w-5 text-fun-teal" />
                  When to Use This
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedExercise.situations.map((situation, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground font-comic">
                      <div className="w-2 h-2 bg-fun-teal rounded-full" />
                      {situation}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-comic text-foreground">
                  <Heart className="h-5 w-5 text-fun-pink" />
                  Amazing Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedExercise.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground font-comic">
                      <div className="w-2 h-2 bg-fun-pink rounded-full" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="text-4xl animate-float">🫁</div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground font-comic">
              Breathing Adventures
            </h1>
            <div className="text-4xl animate-float" style={{ animationDelay: '1s' }}>💨</div>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground font-comic max-w-2xl mx-auto">
            Take deep breaths and discover the magical power of breathing! 
            These fun exercises will help you feel calm, confident, and amazing! ✨
          </p>
        </div>

        {/* Quick Tips */}
        <Card className="bg-gradient-fun text-white shadow-fun">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-6 w-6" />
              <h3 className="text-xl font-bold font-comic">Breathing Superpowers!</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm font-comic">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>Calms your heart and mind</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>Helps you think more clearly</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>Makes you feel more confident</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise, index) => (
            <Card key={exercise.id} className="hover-lift shadow-activity bg-card/80 backdrop-blur border-2 border-transparent hover:border-primary/20 transition-all duration-300 relative overflow-hidden">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 ${exercise.color} rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-fun animate-float`} style={{ animationDelay: `${index * 0.3}s` }}>
                  {exercise.icon}
                </div>
                <CardTitle className="text-lg font-comic text-foreground">
                  {exercise.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground font-comic">
                  {exercise.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Duration */}
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-comic text-muted-foreground">{exercise.duration}</span>
                </div>

                {/* Breath Pattern */}
                <div className="text-center">
                  <Badge variant="outline" className="font-comic">
                    {exercise.breathPattern.in}s in • {exercise.breathPattern.hold}s hold • {exercise.breathPattern.out}s out
                  </Badge>
                </div>

                {/* Key Benefits Preview */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground font-comic">Perfect for:</h4>
                  <div className="flex flex-wrap gap-1">
                    {exercise.situations.slice(0, 2).map((situation, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs font-comic">
                        {situation.length > 20 ? situation.substring(0, 20) + '...' : situation}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <Button 
                  variant="activity" 
                  className="w-full group font-comic" 
                  onClick={() => startExercise(exercise)}
                >
                  Start Breathing
                  <Play className="h-4 w-4 ml-2 group-hover:scale-110 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back to Activities */}
        <div className="text-center">
          <Button variant="outline" asChild className="font-comic">
            <Link to="/activities">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Activities
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BreathingPage;