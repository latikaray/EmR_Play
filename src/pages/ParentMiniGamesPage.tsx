import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Gamepad2, Map, Timer, RotateCcw, Trophy, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// ====== GAME 1: Emotion Maze ======
interface MazeCell {
  scenario: string;
  choices: { text: string; correct: boolean; feedback: string }[];
}

const mazeSteps: MazeCell[] = [
  {
    scenario: "🏠 Your child slams the door after school. You hear them crying in their room.",
    choices: [
      { text: "Barge in and demand to know what happened", correct: false, feedback: "This can feel invasive. They need space first." },
      { text: "Knock gently, say 'I'm here when you're ready'", correct: true, feedback: "Respecting their space while showing availability builds trust." },
      { text: "Ignore it — they'll get over it", correct: false, feedback: "Ignoring signals that their feelings don't matter to you." }
    ]
  },
  {
    scenario: "🍽️ At dinner, your child says 'Nobody at school likes me.'",
    choices: [
      { text: "Say 'That's not true, everyone likes you!'", correct: false, feedback: "Dismissing their experience makes them feel unheard." },
      { text: "Ask 'What happened that made you feel that way?'", correct: true, feedback: "Open questions help them process and feel validated." },
      { text: "Immediately call the teacher", correct: false, feedback: "Jumping to action skips the important step of listening." }
    ]
  },
  {
    scenario: "📱 You find your teen has been texting late at night and is exhausted at school.",
    choices: [
      { text: "Confiscate the phone immediately", correct: false, feedback: "Abrupt punishment breaks trust without teaching." },
      { text: "Discuss sleep needs and co-create a phone schedule", correct: true, feedback: "Collaboration teaches self-regulation and respects growing autonomy." },
      { text: "Install a secret monitoring app", correct: false, feedback: "Secret surveillance destroys trust if discovered." }
    ]
  },
  {
    scenario: "🎨 Your child's art teacher says they're 'disruptive' in class, but your child loves art.",
    choices: [
      { text: "Punish your child for being disruptive", correct: false, feedback: "This might suppress their enthusiasm and creativity." },
      { text: "Talk to both teacher and child separately to understand", correct: true, feedback: "Gathering perspectives helps find constructive solutions." },
      { text: "Blame the teacher for not engaging them", correct: false, feedback: "Taking sides doesn't help find a real solution." }
    ]
  },
  {
    scenario: "🏆 Your child wins second place and is upset they didn't win first.",
    choices: [
      { text: "Say 'Second place is amazing, stop being ungrateful!'", correct: false, feedback: "This shames their feelings and misses a growth moment." },
      { text: "Acknowledge their feelings, then highlight their growth journey", correct: true, feedback: "Validation + perspective builds healthy competition mindset." },
      { text: "Promise them a bigger prize if they win first next time", correct: false, feedback: "This ties self-worth to winning and external rewards." }
    ]
  }
];

const EmotionMazeGame = () => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongMoves, setWrongMoves] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const maxWrong = 3;

  const handleChoice = (choice: { correct: boolean; feedback: string }) => {
    setFeedback(choice.feedback);
    setIsCorrect(choice.correct);
    if (choice.correct) {
      setScore(s => s + 1);
    } else {
      const newWrong = wrongMoves + 1;
      setWrongMoves(newWrong);
      if (newWrong >= maxWrong) {
        setGameOver(true);
        return;
      }
    }
  };

  const nextStep = () => {
    if (step + 1 >= mazeSteps.length) {
      setGameOver(true);
    } else {
      setStep(s => s + 1);
      setFeedback(null);
      setIsCorrect(null);
    }
  };

  const restart = () => {
    setStep(0); setScore(0); setWrongMoves(0);
    setFeedback(null); setIsCorrect(null); setGameOver(false);
  };

  if (gameOver) {
    const won = wrongMoves < maxWrong;
    return (
      <div className="text-center space-y-6 py-8">
        <div className="text-6xl">{won ? "🏆" : "💔"}</div>
        <h3 className="text-2xl font-bold font-comic text-foreground">
          {won ? "Maze Complete!" : "Path Blocked!"}
        </h3>
        <p className="font-comic text-muted-foreground">
          {won
            ? `You navigated ${score}/${mazeSteps.length} situations correctly!`
            : `Too many wrong turns (${wrongMoves}). The emotional path got blocked.`}
        </p>
        <div className="flex gap-3 justify-center">
          <Badge variant="secondary" className="text-lg px-4 py-2">Score: {score}/{mazeSteps.length}</Badge>
          <Badge variant={won ? "default" : "destructive"} className="text-lg px-4 py-2">
            {won ? "Well Done!" : "Try Again"}
          </Badge>
        </div>
        <Button onClick={restart} variant="fun" size="lg">
          <RotateCcw className="mr-2 h-4 w-4" /> Play Again
        </Button>
      </div>
    );
  }

  const current = mazeSteps[step];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="font-comic">Step {step + 1}/{mazeSteps.length}</Badge>
        <div className="flex gap-2">
          <Badge variant="secondary">✅ {score}</Badge>
          <Badge variant="destructive">❌ {wrongMoves}/{maxWrong}</Badge>
        </div>
      </div>
      <Progress value={((step + 1) / mazeSteps.length) * 100} className="h-3" />

      <div className="bg-primary/10 p-5 rounded-xl">
        <p className="font-comic text-lg leading-relaxed">{current.scenario}</p>
      </div>

      {!feedback ? (
        <div className="space-y-3">
          {current.choices.map((choice, i) => (
            <Button key={i} variant="outline" className="w-full text-left h-auto py-4 font-comic whitespace-normal"
              onClick={() => handleChoice(choice)}>
              {choice.text}
            </Button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border-2 ${isCorrect ? 'bg-green-50 dark:bg-green-900/30 border-green-400' : 'bg-orange-50 dark:bg-orange-900/30 border-orange-400'}`}>
            <p className="font-comic font-semibold mb-1">{isCorrect ? "✅ Right path!" : "❌ Dead end!"}</p>
            <p className="font-comic text-sm">{feedback}</p>
          </div>
          <Button onClick={nextStep} variant="fun" className="w-full">
            {step + 1 >= mazeSteps.length ? "See Results" : "Next Step →"}
          </Button>
        </div>
      )}
    </div>
  );
};

// ====== GAME 2: Patience Timer Challenge ======
interface TimerScenario {
  emoji: string;
  situation: string;
  impatientResponse: string;
  patientResponse: string;
  waitTime: number; // seconds
  insight: string;
}

const timerScenarios: TimerScenario[] = [
  {
    emoji: "👟",
    situation: "Your 4-year-old insists on tying their own shoes. You're running late for school.",
    impatientResponse: "Just let me do it, we're late!",
    patientResponse: "You're getting better! Let me help with the last loop.",
    waitTime: 8,
    insight: "Letting children struggle builds independence. Those extra minutes now save years later."
  },
  {
    emoji: "🧹",
    situation: "Your child is 'helping' clean up but making a bigger mess.",
    impatientResponse: "Move, I'll do it myself!",
    patientResponse: "Great effort! Let me show you a trick — wipe in circles like this.",
    waitTime: 10,
    insight: "Children learn through doing. Their 'mess' is actually skill-building in progress."
  },
  {
    emoji: "📖",
    situation: "Your child is reading aloud very slowly, stumbling on every other word.",
    impatientResponse: "Let me just read it for you.",
    patientResponse: "Take your time. Sound it out — you've got this!",
    waitTime: 12,
    insight: "Reading struggles are normal. Patient encouragement builds confident readers."
  },
  {
    emoji: "🛒",
    situation: "At the grocery store, your toddler wants to put each item in the cart one by one.",
    impatientResponse: "We don't have time for this, sit in the cart.",
    patientResponse: "Can you find the red apples? Put 3 in the bag!",
    waitTime: 8,
    insight: "Turning chores into learning games teaches counting, colors, and cooperation."
  }
];

const PatienceTimerGame = () => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [phase, setPhase] = useState<"intro" | "waiting" | "result">("intro");
  const [waited, setWaited] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [scores, setScores] = useState<boolean[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const current = timerScenarios[scenarioIdx];

  const startWaiting = () => {
    setPhase("waiting");
    setTimeLeft(current.waitTime);
    setWaited(false);
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          setWaited(true);
          setPhase("result");
          setScores(s => [...s, true]);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const gaveUp = () => {
    setPhase("result");
    setWaited(false);
    setScores(s => [...s, false]);
  };

  const nextScenario = () => {
    if (scenarioIdx + 1 >= timerScenarios.length) {
      setGameOver(true);
    } else {
      setScenarioIdx(i => i + 1);
      setPhase("intro");
    }
  };

  const restart = () => {
    setScenarioIdx(0); setPhase("intro"); setScores([]); setGameOver(false);
  };

  if (gameOver) {
    const patientCount = scores.filter(Boolean).length;
    return (
      <div className="text-center space-y-6 py-8">
        <div className="text-6xl">{patientCount >= 3 ? "🧘" : "⏰"}</div>
        <h3 className="text-2xl font-bold font-comic text-foreground">
          {patientCount >= 3 ? "Master of Patience!" : "Keep Practicing!"}
        </h3>
        <p className="font-comic text-muted-foreground">
          You stayed patient in {patientCount}/{timerScenarios.length} situations.
        </p>
        <Button onClick={restart} variant="fun" size="lg">
          <RotateCcw className="mr-2 h-4 w-4" /> Play Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="font-comic">Scenario {scenarioIdx + 1}/{timerScenarios.length}</Badge>
        <Badge variant="secondary">Patient: {scores.filter(Boolean).length}</Badge>
      </div>

      <div className="text-center text-5xl mb-2">{current.emoji}</div>
      <div className="bg-primary/10 p-5 rounded-xl">
        <p className="font-comic text-lg leading-relaxed">{current.situation}</p>
      </div>

      {phase === "intro" && (
        <div className="space-y-4">
          <p className="font-comic text-sm text-muted-foreground text-center">
            Can you wait patiently for {current.waitTime} seconds while your child figures it out?
          </p>
          <Button onClick={startWaiting} variant="fun" className="w-full" size="lg">
            <Timer className="mr-2 h-5 w-5" /> Start Waiting...
          </Button>
        </div>
      )}

      {phase === "waiting" && (
        <div className="space-y-4 text-center">
          <div className="text-6xl font-bold text-primary font-comic animate-pulse">{timeLeft}s</div>
          <Progress value={((current.waitTime - timeLeft) / current.waitTime) * 100} className="h-4" />
          <p className="font-comic text-sm text-muted-foreground">Breathe... they're learning...</p>
          <Button onClick={gaveUp} variant="destructive" size="sm">
            <AlertTriangle className="mr-2 h-4 w-4" /> I can't wait — do it for them!
          </Button>
        </div>
      )}

      {phase === "result" && (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border-2 ${waited ? 'bg-green-50 dark:bg-green-900/30 border-green-400' : 'bg-orange-50 dark:bg-orange-900/30 border-orange-400'}`}>
            <p className="font-comic font-semibold mb-2">{waited ? "🧘 You waited!" : "⚡ You stepped in!"}</p>
            <p className="font-comic text-sm italic mb-3">
              {waited ? `"${current.patientResponse}"` : `"${current.impatientResponse}"`}
            </p>
            <p className="font-comic text-sm">{current.insight}</p>
          </div>
          <Button onClick={nextScenario} variant="fun" className="w-full">
            {scenarioIdx + 1 >= timerScenarios.length ? "See Results" : "Next Scenario →"}
          </Button>
        </div>
      )}
    </div>
  );
};

// ====== Main Page ======
const ParentMiniGamesPage = () => {
  const [activeGame, setActiveGame] = useState<"maze" | "timer" | null>(null);

  const games = [
    {
      id: "maze" as const,
      title: "Emotion Navigation Maze",
      description: "Navigate through 5 real parenting situations. Choose wisely — 3 wrong turns and the path blocks!",
      icon: Map,
      emoji: "🧭",
      difficulty: "Medium"
    },
    {
      id: "timer" as const,
      title: "Patience Timer Challenge",
      description: "Can you wait while your child struggles? A real-time patience test with parenting scenarios.",
      icon: Timer,
      emoji: "⏳",
      difficulty: "Fun"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/parent">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-fun bg-clip-text text-transparent font-comic">
              Scenario Mini Games
            </h1>
            <p className="text-lg text-muted-foreground font-comic mt-2">
              Interactive games that test your parenting instincts
            </p>
          </div>
        </div>

        {!activeGame ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {games.map(game => (
              <Card key={game.id} className="hover-lift shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20 hover:border-primary/40 transition-all">
                <CardHeader className="text-center">
                  <div className="text-5xl mb-3">{game.emoji}</div>
                  <CardTitle className="font-comic text-foreground">{game.title}</CardTitle>
                  <Badge variant="outline" className="w-fit mx-auto">{game.difficulty}</Badge>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="font-comic text-sm text-muted-foreground">{game.description}</p>
                  <Button variant="fun" className="w-full" onClick={() => setActiveGame(game.id)}>
                    <Gamepad2 className="mr-2 h-4 w-4" /> Play Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-comic text-foreground">
                  {activeGame === "maze" ? "🧭 Emotion Navigation Maze" : "⏳ Patience Timer Challenge"}
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => setActiveGame(null)}>
                  ← Back
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeGame === "maze" ? <EmotionMazeGame /> : <PatienceTimerGame />}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ParentMiniGamesPage;
