import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Heart, Shield, Star, Trophy, AlertTriangle, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useActivityProgress } from "@/hooks/useActivityProgress";

interface Choice {
  text: string;
  emoji: string;
  type: "assertive" | "passive" | "risky";
  response: string;
  points: number;
}

interface Scenario {
  id: string;
  title: string;
  emoji: string;
  location: string;
  locationEmoji: string;
  setup: string;
  pressure: string;
  choices: Choice[];
  tip: string;
}

const scenarios: Scenario[] = [
  {
    id: "party-drink",
    title: "The Party Invite",
    emoji: "🎉",
    location: "House Party",
    locationEmoji: "🏠",
    setup: "You're at a classmate's birthday party. The music is loud, everyone's having fun. Suddenly, a group of popular kids pulls out some drinks and offers you one.",
    pressure: "\"Come on, everyone's doing it! Don't be such a baby. One sip won't hurt.\"",
    choices: [
      { text: "\"No thanks, I'm good with my soda!\"", emoji: "🥤", type: "assertive", response: "Nice! You said no confidently. The group shrugs and moves on. Your real friends respect your choice and you keep having a great time.", points: 30 },
      { text: "Take the drink to fit in", emoji: "😬", type: "risky", response: "You took the drink to avoid feeling left out. But now you feel uncomfortable and anxious. Remember — real friends never force you into things you don't want to do.", points: 0 },
      { text: "Make an excuse and leave quietly", emoji: "🚶", type: "passive", response: "You left the situation, which is okay! But next time, you could try saying no directly — it builds confidence and shows people your boundaries.", points: 15 },
    ],
    tip: "💡 You can always say NO. A simple 'No thanks' is a complete sentence. Real friends won't pressure you.",
  },
  {
    id: "bunk-class",
    title: "Bunking School",
    emoji: "🏫",
    location: "School Corridor",
    locationEmoji: "🚪",
    setup: "It's the middle of the school day. Your friends are planning to skip the next two classes and sneak out to the mall. They say the teacher won't notice.",
    pressure: "\"Don't be a nerd! No one actually cares about history class. Come on, live a little!\"",
    choices: [
      { text: "\"I'll pass, I don't want to risk getting caught.\"", emoji: "📚", type: "assertive", response: "Smart move! You stayed in class and actually enjoyed a surprise quiz (extra credit!). Your friends got caught and had to face the principal. Standing your ground paid off!", points: 30 },
      { text: "Go along with the plan", emoji: "🏃", type: "risky", response: "You bunked class but felt anxious the entire time. The security guard noticed and now there's a note going home to your parents. Was it worth it?", points: 0 },
      { text: "\"Maybe next time, I have a test coming up.\"", emoji: "😅", type: "passive", response: "You found a way out this time, but using excuses means you'll face the same pressure again. Try being direct about your choice!", points: 15 },
    ],
    tip: "💡 Missing class can affect your grades and your record. It's okay to be the one who stays — that takes real courage.",
  },
  {
    id: "relationship-pressure",
    title: "Dating Drama",
    emoji: "💑",
    location: "School Cafeteria",
    locationEmoji: "🍽️",
    setup: "Everyone in your friend group seems to be in a relationship. They keep teasing you for being single and trying to set you up with someone you barely know.",
    pressure: "\"You're the only one without a boyfriend/girlfriend! Just say yes to Raj/Priya — they like you! Stop being so picky.\"",
    choices: [
      { text: "\"I'm happy being single right now, thanks!\"", emoji: "😊", type: "assertive", response: "Perfect response! You know yourself and you're comfortable with who you are. Your friends eventually stop teasing and some even admit they wish they'd waited too.", points: 30 },
      { text: "Agree to date someone just to fit in", emoji: "💔", type: "risky", response: "You started 'dating' someone you don't really like. Now it's awkward, stressful, and unfair to both of you. Relationships should happen when YOU'RE ready, not when others tell you to be.", points: 0 },
      { text: "Laugh it off and change the topic", emoji: "😂", type: "passive", response: "Deflecting works for now, but the teasing might continue. It's okay to be clear about your boundaries — your love life is YOUR business!", points: 15 },
    ],
    tip: "💡 There's no right age to start dating. Being single is perfectly normal and healthy. Focus on friendships and self-growth!",
  },
  {
    id: "expensive-phone",
    title: "The Phone Upgrade",
    emoji: "📱",
    location: "School Bench",
    locationEmoji: "🪑",
    setup: "Your classmates all have the latest iPhone/Samsung. Your phone works perfectly fine but it's not the newest model. People keep making comments about it.",
    pressure: "\"Dude, you're still using THAT phone? That's like 2 years old! Ask your parents for a new one. It's embarrassing.\"",
    choices: [
      { text: "\"My phone works great, I don't need a new one.\"", emoji: "💪", type: "assertive", response: "Confident answer! A phone is a tool, not a status symbol. Your self-worth isn't defined by what gadget you carry. The comments stop when you stop caring about them.", points: 30 },
      { text: "Beg your parents for an expensive phone", emoji: "🙏", type: "risky", response: "You pressured your parents and they either felt bad or stretched their budget. Material things don't earn real respect — your character does.", points: 0 },
      { text: "Hide your phone and avoid showing it", emoji: "🫣", type: "passive", response: "Hiding your phone means you're letting others control how you feel. Your phone doesn't define you — own what you have with confidence!", points: 15 },
    ],
    tip: "💡 Your worth isn't measured by your possessions. People who judge you by your phone aren't worth impressing.",
  },
  {
    id: "social-media",
    title: "Social Media Overload",
    emoji: "📲",
    location: "Home / Bedroom",
    locationEmoji: "🛏️",
    setup: "Everyone at school is on Instagram, Snapchat, and TikTok. You feel pressured to post constantly, get likes, and keep up streaks. It's eating into your sleep and study time.",
    pressure: "\"You only got 20 likes? That's so embarrassing. You need to post more. And why did you break our Snap streak?!\"",
    choices: [
      { text: "\"I'm taking a social media break for my mental health.\"", emoji: "🧘", type: "assertive", response: "Brave choice! You set screen time limits and focused on real-life connections. Your sleep improved, grades went up, and you felt happier. Many friends quietly wished they could do the same.", points: 30 },
      { text: "Stay up late posting and maintaining streaks", emoji: "😴", type: "risky", response: "You sacrificed sleep, got anxious about likes, and your grades dropped. Social media should be fun, not a source of stress. Your real life matters more than your online one.", points: 0 },
      { text: "Reduce usage quietly without telling anyone", emoji: "🤫", type: "passive", response: "Good start! But being open about your boundaries can inspire others to do the same. You might be surprised how many people feel the same way.", points: 15 },
    ],
    tip: "💡 Social media is a tool, not a lifestyle. Your real experiences matter more than likes and followers.",
  },
  {
    id: "sneakers",
    title: "The Cool Sneakers",
    emoji: "👟",
    location: "Shopping Mall",
    locationEmoji: "🛍️",
    setup: "There's a new pair of trendy sneakers everyone's wearing. They cost ₹8,000 and your parents have said it's too expensive. Your friends keep showing off theirs.",
    pressure: "\"You STILL don't have the new Jordans? Everyone has them. You look so basic in those shoes.\"",
    choices: [
      { text: "\"I like my shoes. I don't need expensive ones to be cool.\"", emoji: "😎", type: "assertive", response: "Absolute confidence! Real style comes from how you carry yourself, not a brand name. The trend will die in months, but self-respect lasts forever.", points: 30 },
      { text: "Secretly use your savings to buy them", emoji: "💸", type: "risky", response: "You spent your savings on shoes that'll go out of style in 3 months. Now you have no money for things that actually matter. Was temporary 'coolness' worth it?", points: 0 },
      { text: "Ask your parents to buy a cheaper alternative", emoji: "🤝", type: "passive", response: "A practical compromise! But remember — you don't owe anyone an explanation for what you wear. Wear what makes YOU comfortable.", points: 15 },
    ],
    tip: "💡 Trends change every few months. Your parents work hard for their money — respect their budget and your own values.",
  },
  {
    id: "cafe-culture",
    title: "Cafe Culture Pressure",
    emoji: "☕",
    location: "After School",
    locationEmoji: "🏙️",
    setup: "Your friend group hangs out at expensive cafes every weekend, ordering ₹500 coffees and posting photos. You can't always afford it but feel left out if you don't go.",
    pressure: "\"You're never at our hangouts! What's the point of being friends if you never come? Just ask your parents for more pocket money.\"",
    choices: [
      { text: "\"Let's hang out at the park sometimes — it's free and fun!\"", emoji: "🌳", type: "assertive", response: "Great idea! You suggested a free alternative and some friends actually loved it. Real friendships aren't built on spending money — they're built on shared experiences.", points: 30 },
      { text: "Borrow money to keep up appearances", emoji: "💳", type: "risky", response: "You borrowed money and now you're stressed about paying it back. Financial stress at your age isn't worth any friendship. True friends adapt to everyone's budget.", points: 0 },
      { text: "Go but only order water", emoji: "💧", type: "passive", response: "You went to be present, which is sweet. But if the hang-out requires spending money you don't have, it's okay to suggest something different!", points: 15 },
    ],
    tip: "💡 Friendship isn't about how much you spend together. Suggest free activities — the best memories don't have a price tag.",
  },
  {
    id: "web-series",
    title: "The Binge-Watch Pressure",
    emoji: "🎬",
    location: "Group Chat",
    locationEmoji: "💬",
    setup: "There's a new web series that everyone's binge-watching. It has mature content that makes you uncomfortable, but everyone's talking about it and you feel out of the loop.",
    pressure: "\"You haven't watched it yet?! What are you, 10 years old? It's not even that bad. You're missing all the references!\"",
    choices: [
      { text: "\"It's not my thing. What else are you watching?\"", emoji: "🎯", type: "assertive", response: "Mature response! You redirected the conversation without being preachy. You found other shows to discuss and your friends realized there's more to talk about than one series.", points: 30 },
      { text: "Watch it even though it makes you uncomfortable", emoji: "😰", type: "risky", response: "You watched content that made you uneasy just to fit in. If something doesn't feel right for you, trust that instinct. You know your boundaries better than anyone.", points: 0 },
      { text: "\"I'll watch it later\" (but don't plan to)", emoji: "⏳", type: "passive", response: "This buys you time, but the pressure will come back. Being honest about your preferences builds authentic relationships.", points: 15 },
    ],
    tip: "💡 Not every show/movie is for every person. Your media choices should be based on YOUR comfort level, not group pressure.",
  },
  {
    id: "trend-following",
    title: "Following Trends",
    emoji: "🔥",
    location: "School / Online",
    locationEmoji: "🌐",
    setup: "There's a new viral challenge/trend on social media. Some kids at school are doing it — it's slightly dangerous but looks cool. Everyone's filming it.",
    pressure: "\"Come on, it'll get so many views! Don't be scared — it's just for fun. Everyone's doing it!\"",
    choices: [
      { text: "\"That looks dangerous. I'm not risking it for views.\"", emoji: "🛡️", type: "assertive", response: "Hero move! You prioritized safety over clout. One of the kids who did the challenge actually got hurt later. Your decision might have saved you from a trip to the hospital.", points: 30 },
      { text: "Do the challenge to get views and likes", emoji: "📹", type: "risky", response: "You did the challenge and luckily didn't get hurt — this time. But viral fame fades in days while injuries can last forever. Is it really worth the risk?", points: 0 },
      { text: "Film others doing it instead", emoji: "🎥", type: "passive", response: "You avoided doing it yourself but encouraged others by filming. Think about whether you'd want someone to film you doing something risky. Be the voice of reason, not the camera crew!", points: 10 },
    ],
    tip: "💡 'Everyone's doing it' is the oldest trick in the book. Think for yourself — your brain is your best superpower.",
  },
];

const PeerPressureSimPage = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState<number[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const { saveCompletion } = useActivityProgress();

  const scenario = scenarios[currentScenario];
  const progress = ((completedScenarios.length) / scenarios.length) * 100;

  const handleChoice = (index: number) => {
    if (selectedChoice !== null) return;
    setSelectedChoice(index);
    const choice = scenario.choices[index];
    setTotalScore(prev => prev + choice.points);
    setCompletedScenarios(prev => [...prev, currentScenario]);
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setSelectedChoice(null);
    } else {
      setGameComplete(true);
      saveCompletion("peer-pressure-sim", "simulation", "Assertiveness");
    }
  };

  const getScoreGrade = () => {
    const maxScore = scenarios.length * 30;
    const pct = (totalScore / maxScore) * 100;
    if (pct >= 80) return { emoji: "🏆", title: "Peer Pressure Pro!", desc: "You handle social pressure like a champion. Keep being authentically YOU!" };
    if (pct >= 50) return { emoji: "💪", title: "Getting Stronger!", desc: "You're learning to stand your ground. Practice makes perfect!" };
    return { emoji: "🌱", title: "Growing & Learning", desc: "Every choice is a learning opportunity. You'll get better with practice!" };
  };

  const getChoiceBorder = (type: string) => {
    switch (type) {
      case "assertive": return "border-green-500/50 bg-green-500/5";
      case "passive": return "border-yellow-500/50 bg-yellow-500/5";
      case "risky": return "border-red-500/50 bg-red-500/5";
      default: return "";
    }
  };

  const getChoiceRevealBg = (type: string) => {
    switch (type) {
      case "assertive": return "bg-green-100 dark:bg-green-900/30 border-green-400";
      case "passive": return "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400";
      case "risky": return "bg-red-100 dark:bg-red-900/30 border-red-400";
      default: return "";
    }
  };

  if (gameComplete) {
    const grade = getScoreGrade();
    return (
      <div className="min-h-screen bg-gradient-background p-4 md:p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="text-center bg-card/90 backdrop-blur border-2 border-primary/20">
            <CardContent className="p-8 space-y-6">
              <div className="text-7xl">{grade.emoji}</div>
              <h1 className="text-3xl font-bold font-comic text-foreground">{grade.title}</h1>
              <p className="text-lg text-muted-foreground font-comic">{grade.desc}</p>
              <div className="bg-muted rounded-2xl p-6 space-y-3">
                <p className="text-4xl font-bold text-foreground font-comic">{totalScore} / {scenarios.length * 30}</p>
                <p className="text-muted-foreground font-comic">Total Score</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {completedScenarios.map(i => (
                    <Badge key={i} className="bg-primary/10 text-primary font-comic">{scenarios[i].emoji} {scenarios[i].title}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button variant="fun" onClick={() => { setCurrentScenario(0); setSelectedChoice(null); setTotalScore(0); setCompletedScenarios([]); setGameComplete(false); }}>
                  Play Again 🔄
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/activities/peer-pressure-guide">📖 Read the Guide</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/activities">Back to Activities</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild><Link to="/activities"><ArrowLeft className="h-4 w-4 mr-2" />Back</Link></Button>
          <Badge className="bg-primary/10 text-primary font-comic">Score: {totalScore} ⭐</Badge>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-comic text-muted-foreground">
            <span>Scenario {currentScenario + 1} of {scenarios.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Scenario Card */}
        <Card className="bg-card/90 backdrop-blur border-2 border-primary/10 overflow-hidden">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-comic mb-2">
              <span className="text-xl">{scenario.locationEmoji}</span>
              <span>{scenario.location}</span>
            </div>
            <div className="text-5xl mb-3">{scenario.emoji}</div>
            <CardTitle className="text-xl font-comic text-foreground">{scenario.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Setup */}
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="font-comic text-foreground text-sm leading-relaxed">{scenario.setup}</p>
            </div>

            {/* Pressure Quote */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-comic text-red-600 dark:text-red-400 mb-1 font-bold">THE PRESSURE:</p>
                  <p className="font-comic text-foreground text-sm italic">{scenario.pressure}</p>
                </div>
              </div>
            </div>

            {/* Choices */}
            <div className="space-y-3">
              <p className="text-sm font-comic text-muted-foreground font-bold">What do you do? 🤔</p>
              {scenario.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(i)}
                  disabled={selectedChoice !== null}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-comic text-sm ${
                    selectedChoice === i
                      ? getChoiceRevealBg(choice.type)
                      : selectedChoice !== null
                        ? "opacity-50 border-muted"
                        : "border-border hover:border-primary/30 hover:bg-muted/50 cursor-pointer"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{choice.emoji}</span>
                    <span className="text-foreground">{choice.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Response */}
            {selectedChoice !== null && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className={`rounded-xl p-4 border-2 ${getChoiceBorder(scenario.choices[selectedChoice].type)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {scenario.choices[selectedChoice].type === "assertive" && <ThumbsUp className="h-5 w-5 text-green-600" />}
                    {scenario.choices[selectedChoice].type === "passive" && <Shield className="h-5 w-5 text-yellow-600" />}
                    {scenario.choices[selectedChoice].type === "risky" && <AlertTriangle className="h-5 w-5 text-red-600" />}
                    <Badge className={
                      scenario.choices[selectedChoice].type === "assertive" ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" :
                      scenario.choices[selectedChoice].type === "passive" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300" :
                      "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                    }>
                      {scenario.choices[selectedChoice].type === "assertive" ? "Great Choice! +30⭐" : scenario.choices[selectedChoice].type === "passive" ? "Okay Choice +15⭐" : "Risky Choice +0⭐"}
                    </Badge>
                  </div>
                  <p className="text-sm font-comic text-foreground">{scenario.choices[selectedChoice].response}</p>
                </div>

                {/* Tip */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <p className="text-sm font-comic text-foreground">{scenario.tip}</p>
                </div>

                <Button variant="fun" className="w-full" onClick={handleNext}>
                  {currentScenario < scenarios.length - 1 ? "Next Scenario" : "See Results"} <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PeerPressureSimPage;
