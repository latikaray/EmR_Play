import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, RotateCcw, Brain, Star, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface QuizQuestion {
  id: number;
  question: string;
  emoji: string;
  trait: string;
  options: { text: string; score: number }[];
}

const questions: QuizQuestion[] = [
  {
    id: 1, emoji: "😤", trait: "Self-Awareness",
    question: "When you feel angry, how well can you identify WHY you're angry?",
    options: [
      { text: "I usually have no idea why I'm upset", score: 1 },
      { text: "Sometimes I can figure it out after a while", score: 2 },
      { text: "I can almost always pinpoint the reason", score: 3 },
      { text: "I recognize it immediately and can name the trigger", score: 4 },
    ],
  },
  {
    id: 2, emoji: "🗣️", trait: "Empathy",
    question: "Your friend seems quiet and withdrawn. How do you respond?",
    options: [
      { text: "I probably wouldn't notice", score: 1 },
      { text: "I'd notice but wouldn't say anything — it's their business", score: 2 },
      { text: "I'd ask 'Are you okay?' and listen if they want to talk", score: 3 },
      { text: "I'd check in privately, validate their feelings, and offer support without pushing", score: 4 },
    ],
  },
  {
    id: 3, emoji: "💥", trait: "Emotional Regulation",
    question: "Someone cuts in front of you in line. What's your first reaction?",
    options: [
      { text: "I'd yell at them or push back immediately", score: 1 },
      { text: "I'd get really annoyed and complain loudly", score: 2 },
      { text: "I'd feel annoyed but calmly ask them to go to the back", score: 3 },
      { text: "I'd pause, consider if it was intentional, then address it calmly", score: 4 },
    ],
  },
  {
    id: 4, emoji: "🤝", trait: "Social Skills",
    question: "You need to work with someone you don't like on a project. How do you handle it?",
    options: [
      { text: "I'd refuse or do the project alone", score: 1 },
      { text: "I'd do the bare minimum interaction", score: 2 },
      { text: "I'd be professional and focus on the work", score: 3 },
      { text: "I'd find common ground and try to understand their perspective", score: 4 },
    ],
  },
  {
    id: 5, emoji: "😔", trait: "Self-Awareness",
    question: "After a big disappointment (failed test, rejection), how do you process it?",
    options: [
      { text: "I shut down and avoid thinking about it", score: 1 },
      { text: "I dwell on it and feel awful for a long time", score: 2 },
      { text: "I allow myself to feel sad, then try to learn from it", score: 3 },
      { text: "I acknowledge the feeling, reflect on what I can control, and make a plan", score: 4 },
    ],
  },
  {
    id: 6, emoji: "🎭", trait: "Empathy",
    question: "Someone shares an opinion you strongly disagree with. How do you react?",
    options: [
      { text: "I argue and try to prove them wrong", score: 1 },
      { text: "I dismiss their opinion silently", score: 2 },
      { text: "I listen to their reasoning even though I disagree", score: 3 },
      { text: "I try to understand their perspective and share mine respectfully", score: 4 },
    ],
  },
  {
    id: 7, emoji: "😰", trait: "Emotional Regulation",
    question: "You have a presentation in 10 minutes and feel extremely anxious. What do you do?",
    options: [
      { text: "Panic and consider skipping", score: 1 },
      { text: "Try to ignore the anxiety and push through", score: 2 },
      { text: "Take deep breaths and remind myself I've prepared", score: 3 },
      { text: "Use a calming technique, reframe the anxiety as excitement, and visualize success", score: 4 },
    ],
  },
  {
    id: 8, emoji: "💔", trait: "Motivation",
    question: "You've been working hard on something but see no progress. What keeps you going?",
    options: [
      { text: "Nothing — I give up", score: 1 },
      { text: "External pressure (grades, parents, etc.)", score: 2 },
      { text: "Remembering why I started and adjusting my approach", score: 3 },
      { text: "I celebrate small wins, seek feedback, and stay connected to my purpose", score: 4 },
    ],
  },
  {
    id: 9, emoji: "🪞", trait: "Self-Awareness",
    question: "How often do you reflect on your own behavior and its impact on others?",
    options: [
      { text: "Rarely — I don't think about it much", score: 1 },
      { text: "Only when someone points something out", score: 2 },
      { text: "Regularly — I think about how my words and actions affect others", score: 3 },
      { text: "Consistently — I journal, reflect, and actively seek feedback", score: 4 },
    ],
  },
  {
    id: 10, emoji: "🌊", trait: "Emotional Regulation",
    question: "When multiple stressful things happen at once, how do you cope?",
    options: [
      { text: "I completely shut down or explode", score: 1 },
      { text: "I get overwhelmed but muddle through", score: 2 },
      { text: "I prioritize, tackle one thing at a time, and ask for help", score: 3 },
      { text: "I use coping strategies, communicate my limits, and maintain perspective", score: 4 },
    ],
  },
];

const traitDescriptions: Record<string, { emoji: string; good: string; improve: string }> = {
  "Self-Awareness": { emoji: "🪞", good: "You understand your emotions well!", improve: "Try journaling daily to better recognize your emotional patterns." },
  "Empathy": { emoji: "❤️", good: "You're great at understanding others!", improve: "Practice active listening — focus fully on others without planning your response." },
  "Emotional Regulation": { emoji: "🧘", good: "You manage tough emotions skillfully!", improve: "Try breathing exercises or counting to 10 before reacting in stressful moments." },
  "Social Skills": { emoji: "🤝", good: "You navigate social situations well!", improve: "Practice finding common ground even with people you don't naturally connect with." },
  "Motivation": { emoji: "🔥", good: "You stay driven even when things are hard!", improve: "Break big goals into tiny wins and celebrate each small step forward." },
};

const EQQuizPage = () => {
  const { user } = useAuth();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
      saveCompletion(newAnswers);
    } else {
      setCurrentQ(prev => prev + 1);
    }
  };

  const saveCompletion = async (allAnswers: number[]) => {
    if (!user) return;
    const total = allAnswers.reduce((a, b) => a + b, 0);
    try {
      await supabase.from("activity_completions").insert({
        user_id: user.id,
        activity_name: "eq-quiz",
        activity_type: "quiz",
        eq_trait: "Emotional Intelligence",
        notes: `Scored ${total}/${questions.length * 4}`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setAnswers([]);
    setFinished(false);
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const maxScore = questions.length * 4;
  const percentage = Math.round((totalScore / maxScore) * 100);

  const traitScores: Record<string, { total: number; count: number }> = {};
  answers.forEach((score, i) => {
    const trait = questions[i].trait;
    if (!traitScores[trait]) traitScores[trait] = { total: 0, count: 0 };
    traitScores[trait].total += score;
    traitScores[trait].count += 1;
  });

  const getOverallGrade = () => {
    if (percentage >= 85) return { emoji: "🌟", label: "Emotionally Brilliant!", color: "text-yellow-500" };
    if (percentage >= 65) return { emoji: "💪", label: "Emotionally Strong", color: "text-primary" };
    if (percentage >= 45) return { emoji: "🌱", label: "Growing & Learning", color: "text-green-500" };
    return { emoji: "📚", label: "Room to Grow", color: "text-muted-foreground" };
  };

  const q = questions[currentQ];

  return (
    <div className="min-h-screen bg-gradient-background p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link to="/activities" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Activities
            </Link>
          </Button>
          {(currentQ > 0 || finished) && (
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-1" /> Restart
            </Button>
          )}
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground font-comic">🧠 EQ Quiz</h1>
          <p className="text-muted-foreground font-comic">Discover your emotional intelligence strengths</p>
        </div>

        {/* Progress */}
        {!finished && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm font-comic text-muted-foreground">
              <span>Question {currentQ + 1} of {questions.length}</span>
              <span>{Math.round(((currentQ) / questions.length) * 100)}%</span>
            </div>
            <Progress value={(currentQ / questions.length) * 100} className="h-2" />
          </div>
        )}

        {/* Question */}
        {!finished && q && (
          <Card className="border-2 border-primary/20 shadow-fun animate-in fade-in-0 slide-in-from-right-5">
            <CardHeader className="text-center pb-2">
              <div className="text-4xl mb-2">{q.emoji}</div>
              <Badge variant="outline" className="w-fit mx-auto font-comic mb-2">{q.trait}</Badge>
              <CardTitle className="text-lg font-comic text-foreground">{q.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {q.options.map((option, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="w-full text-left h-auto py-3 px-4 whitespace-normal font-comic hover:bg-primary/10 transition-all"
                  onClick={() => handleAnswer(option.score)}
                >
                  <span className="mr-2 font-bold text-primary">{String.fromCharCode(65 + i)}.</span>
                  {option.text}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {finished && (
          <div className="space-y-4">
            <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/30 shadow-fun">
              <CardContent className="p-6 text-center space-y-4">
                <div className="text-5xl">{getOverallGrade().emoji}</div>
                <h2 className={`text-2xl font-bold font-comic ${getOverallGrade().color}`}>{getOverallGrade().label}</h2>
                <p className="text-4xl font-bold font-comic text-foreground">{percentage}%</p>
                <p className="text-sm text-muted-foreground font-comic">You scored {totalScore} out of {maxScore} points</p>
                <div className="flex justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-6 w-6 ${i < Math.ceil(percentage / 20) ? "text-yellow-500 fill-yellow-500" : "text-muted"}`} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trait Breakdown */}
            <Card className="border-2 border-muted">
              <CardHeader>
                <CardTitle className="text-lg font-comic text-foreground flex items-center gap-2">
                  <Brain className="h-5 w-5" /> Your EQ Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(traitScores).map(([trait, data]) => {
                  const avg = data.total / data.count;
                  const pct = Math.round((avg / 4) * 100);
                  const info = traitDescriptions[trait];
                  return (
                    <div key={trait} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-comic text-sm text-foreground">{info?.emoji} {trait}</span>
                        <Badge variant={pct >= 75 ? "default" : "outline"} className="font-comic text-xs">{pct}%</Badge>
                      </div>
                      <Progress value={pct} className="h-2" />
                      <p className="text-xs text-muted-foreground font-comic">
                        {pct >= 75 ? info?.good : info?.improve}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <div className="flex justify-center gap-3">
              <Button onClick={reset}>Take Again</Button>
              <Button variant="outline" asChild>
                <Link to="/activities">Back to Activities</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EQQuizPage;
