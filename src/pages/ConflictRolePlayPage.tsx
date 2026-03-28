import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw, Lightbulb, Star, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DialogueOption {
  text: string;
  tone: "aggressive" | "passive" | "assertive";
  response: string;
  points: number;
  nextSceneId?: string;
}

interface Scene {
  id: string;
  character: string;
  characterEmoji: string;
  setting: string;
  dialogue: string;
  options: DialogueOption[];
}

interface RolePlayScenario {
  id: string;
  title: string;
  description: string;
  emoji: string;
  scenes: Scene[];
}

const scenarios: RolePlayScenario[] = [
  {
    id: "group-project",
    title: "The Group Project",
    description: "Your teammate isn't doing their share of work and the deadline is tomorrow.",
    emoji: "📋",
    scenes: [
      {
        id: "start",
        character: "Alex",
        characterEmoji: "😤",
        setting: "School library after class",
        dialogue: "Hey, so I haven't started my part of the project yet. Can you just do it? You're better at this stuff anyway.",
        options: [
          { text: "Are you serious?! You NEVER do any work! I'm telling the teacher.", tone: "aggressive", response: "Whoa, calm down! Fine, I won't ask you for help ever again. *storms off*", points: 1, nextSceneId: "escalated" },
          { text: "Oh... okay, I guess I can try to do it...", tone: "passive", response: "Great, thanks! You're the best. I knew I could count on you. *leaves quickly*", points: 1, nextSceneId: "doormat" },
          { text: "I understand you're struggling, but I can't do your part too. Let's split it differently — what part feels doable for you?", tone: "assertive", response: "Hmm, I guess you're right. Maybe I can handle the research part if you help me get started?", points: 3, nextSceneId: "resolved" },
        ],
      },
      {
        id: "escalated",
        character: "Alex",
        characterEmoji: "😠",
        setting: "Next day in class",
        dialogue: "Thanks to you making a scene, now everyone thinks I'm lazy. The teacher wants to talk to both of us.",
        options: [
          { text: "Good! Maybe now you'll learn to do your own work!", tone: "aggressive", response: "The teacher gives you both a warning for not communicating properly.", points: 0 },
          { text: "Look, I was frustrated yesterday. I should've talked to you calmly. Can we figure this out together before the meeting?", tone: "assertive", response: "...Yeah, I was wrong too. Let me do the conclusion section at least. Sorry for dumping it on you.", points: 3 },
        ],
      },
      {
        id: "doormat",
        character: "Alex",
        characterEmoji: "😏",
        setting: "A week later, new assignment",
        dialogue: "Hey, so about this new assignment... you'll cover for me again, right?",
        options: [
          { text: "Actually, no. Last time wasn't fair to me. I need you to do your part this time.", tone: "assertive", response: "Oh... I didn't realize it bothered you. Okay, I'll step up this time.", points: 3 },
          { text: "I guess...", tone: "passive", response: "You feel resentful and exhausted. This pattern isn't healthy.", points: 0 },
        ],
      },
      {
        id: "resolved",
        character: "Alex",
        characterEmoji: "😊",
        setting: "After finishing the project",
        dialogue: "Hey, thanks for being patient with me. I actually learned a lot doing the research. Maybe we can be partners again next time?",
        options: [
          { text: "Sure! As long as we plan the work split early. Deal?", tone: "assertive", response: "Deal! 🤝 You both get an A on the project.", points: 3 },
        ],
      },
    ],
  },
  {
    id: "friend-betrayal",
    title: "The Leaked Secret",
    description: "Your close friend told someone your personal secret. Now others know.",
    emoji: "🤫",
    scenes: [
      {
        id: "start",
        character: "Jordan",
        characterEmoji: "😬",
        setting: "School hallway",
        dialogue: "Hey... so I might have accidentally told Sam about, you know, your thing. I'm sorry, it just slipped out!",
        options: [
          { text: "How could you?! You're the worst friend ever! We're done!", tone: "aggressive", response: "I said I was sorry! It was an accident! You're overreacting!", points: 1, nextSceneId: "fight" },
          { text: "It's fine, don't worry about it...", tone: "passive", response: "Oh good, I was worried you'd be mad. So anyway, did you hear about...", points: 0, nextSceneId: "suppressed" },
          { text: "I'm really hurt. That was private and I trusted you with it. I need you to understand how serious this is to me.", tone: "assertive", response: "You're right... I messed up. I feel terrible. What can I do to make it right?", points: 3, nextSceneId: "healing" },
        ],
      },
      {
        id: "fight",
        character: "Jordan",
        characterEmoji: "😢",
        setting: "The next day",
        dialogue: "I've been thinking all night. I know 'sorry' isn't enough. I told Sam to keep it quiet and not spread it further.",
        options: [
          { text: "I appreciate that. I was really angry yesterday, but I do value our friendship. Can we talk about boundaries?", tone: "assertive", response: "Yes, absolutely. I never want to break your trust again. What boundaries would help?", points: 3 },
          { text: "Whatever. The damage is done.", tone: "aggressive", response: "Jordan walks away sadly. You lose a friend who made a mistake but genuinely cared.", points: 0 },
        ],
      },
      {
        id: "suppressed",
        character: "Jordan",
        characterEmoji: "😊",
        setting: "Two weeks later, it happens again",
        dialogue: "Oops, I accidentally mentioned to the group chat that you—",
        options: [
          { text: "Jordan, stop. This is the second time. I need you to take my privacy seriously. If you can't, I need to reconsider what I share with you.", tone: "assertive", response: "Oh wow, I... I didn't realize I was doing it again. You're right, I need to be more careful. I'm truly sorry.", points: 3 },
          { text: "It's okay...", tone: "passive", response: "The pattern continues. You feel increasingly unsafe in the friendship.", points: 0 },
        ],
      },
      {
        id: "healing",
        character: "Jordan",
        characterEmoji: "🤝",
        setting: "A few days later",
        dialogue: "I talked to Sam and they promised to keep it private. I also want you to know — I'm working on being more trustworthy. You mean a lot to me.",
        options: [
          { text: "Thank you for taking it seriously. Trust takes time to rebuild, but I appreciate the effort.", tone: "assertive", response: "I understand. I'll earn it back. Thank you for giving me the chance. 💛", points: 3 },
        ],
      },
    ],
  },
  {
    id: "online-drama",
    title: "The Social Media Callout",
    description: "Someone posted something mean about you online and people are taking sides.",
    emoji: "📱",
    scenes: [
      {
        id: "start",
        character: "Online Post",
        characterEmoji: "📱",
        setting: "Your phone, 10 PM",
        dialogue: "You see a post: '@You is so fake lol, acts nice but talks behind everyone's back 🐍' — 47 likes, 12 comments agreeing.",
        options: [
          { text: "Post a savage clap-back exposing their secrets", tone: "aggressive", response: "Your response goes viral. Now BOTH of you look bad. Teachers get involved.", points: 0, nextSceneId: "viral" },
          { text: "Delete all your social media and cry", tone: "passive", response: "You feel isolated and powerless. The post stays up and the narrative is one-sided.", points: 0, nextSceneId: "withdrawn" },
          { text: "Screenshot it, don't respond publicly. Talk to a trusted adult and your real friends first.", tone: "assertive", response: "Your friends rally around you. An adult helps you report the post. You feel supported.", points: 3, nextSceneId: "supported" },
        ],
      },
      {
        id: "viral",
        character: "Teacher",
        characterEmoji: "👩‍🏫",
        setting: "Principal's office",
        dialogue: "Both of you are here because this online conflict has disrupted the school. What happened from your side?",
        options: [
          { text: "I was defending myself! They started it!", tone: "aggressive", response: "The teacher notes you both escalated. You get a warning.", points: 0 },
          { text: "I reacted out of hurt, and I shouldn't have responded that way publicly. I'd like to resolve this properly.", tone: "assertive", response: "The teacher appreciates your maturity. They mediate a conversation between you two.", points: 3 },
        ],
      },
      {
        id: "withdrawn",
        character: "Best Friend",
        characterEmoji: "💕",
        setting: "Next day at school",
        dialogue: "Hey, I saw the post. Why didn't you tell me? I would've had your back! Are you okay?",
        options: [
          { text: "I didn't want to bother anyone... I just want it to go away.", tone: "passive", response: "You're NOT a bother. Let's report it together and I'll set the record straight.", points: 1 },
          { text: "You're right, I should've reached out. Can you help me figure out how to handle this?", tone: "assertive", response: "Absolutely! Let's talk to the counselor and get this sorted. You don't deserve this. 💛", points: 3 },
        ],
      },
      {
        id: "supported",
        character: "The poster",
        characterEmoji: "😳",
        setting: "School hallway, after the post was removed",
        dialogue: "Look... the post was stupid. I was jealous because everyone likes you. I shouldn't have done that.",
        options: [
          { text: "That really hurt me. But I appreciate you saying that. Maybe we can start over?", tone: "assertive", response: "I'd like that. I'm sorry. Really. 🤝", points: 3 },
          { text: "Yeah, it WAS stupid. Don't do it again.", tone: "aggressive", response: "They walk away feeling small. The conflict technically ends but no growth happens.", points: 1 },
        ],
      },
    ],
  },
];

const toneColors: Record<string, string> = {
  aggressive: "border-destructive/30 hover:bg-destructive/10 text-destructive",
  passive: "border-muted-foreground/30 hover:bg-muted/50 text-muted-foreground",
  assertive: "border-primary/30 hover:bg-primary/10 text-primary",
};

const toneLabels: Record<string, string> = {
  aggressive: "🔥 Aggressive",
  passive: "😶 Passive",
  assertive: "💪 Assertive",
};

const ConflictRolePlayPage = () => {
  const { user } = useAuth();
  const [selectedScenario, setSelectedScenario] = useState<RolePlayScenario | null>(null);
  const [currentSceneId, setCurrentSceneId] = useState("start");
  const [totalPoints, setTotalPoints] = useState(0);
  const [maxPoints, setMaxPoints] = useState(0);
  const [history, setHistory] = useState<{ scene: Scene; chosenOption: DialogueOption }[]>([]);
  const [showResult, setShowResult] = useState<DialogueOption | null>(null);
  const [finished, setFinished] = useState(false);

  const currentScene = selectedScenario?.scenes.find(s => s.id === currentSceneId);

  const handleChoice = (option: DialogueOption) => {
    if (!currentScene) return;
    setTotalPoints(prev => prev + option.points);
    setMaxPoints(prev => prev + 3);
    setHistory(prev => [...prev, { scene: currentScene, chosenOption: option }]);
    setShowResult(option);
  };

  const continueAfterResult = () => {
    if (!showResult) return;
    if (showResult.nextSceneId) {
      setCurrentSceneId(showResult.nextSceneId);
    } else {
      setFinished(true);
      saveCompletion();
    }
    setShowResult(null);
  };

  const saveCompletion = async () => {
    if (!user) return;
    try {
      await supabase.from("activity_completions").insert({
        user_id: user.id,
        activity_name: "conflict-roleplay",
        activity_type: "roleplay",
        eq_trait: "Conflict Resolution",
        notes: `Scored ${totalPoints + (showResult?.points || 0)}/${maxPoints + 3} points`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const reset = () => {
    setSelectedScenario(null);
    setCurrentSceneId("start");
    setTotalPoints(0);
    setMaxPoints(0);
    setHistory([]);
    setShowResult(null);
    setFinished(false);
  };

  const getGrade = () => {
    const pct = maxPoints > 0 ? totalPoints / maxPoints : 0;
    if (pct >= 0.85) return { emoji: "🌟", label: "Conflict Resolution Pro", desc: "You handle tough situations with empathy and assertiveness!" };
    if (pct >= 0.5) return { emoji: "💪", label: "Getting There", desc: "You showed some great instincts. Keep practicing assertive communication!" };
    return { emoji: "📚", label: "Learning Opportunity", desc: "Conflict is hard! Review the assertive responses to build your skills." };
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link to="/activities" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Activities
            </Link>
          </Button>
          {selectedScenario && (
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-1" /> Start Over
            </Button>
          )}
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground font-comic">🎭 Conflict Resolution Roleplay</h1>
          <p className="text-muted-foreground font-comic">Practice handling real-life conflicts with different communication styles</p>
        </div>

        {/* Scenario Selection */}
        {!selectedScenario && (
          <div className="grid gap-4">
            <p className="text-center font-comic text-muted-foreground">Choose a scenario to practice:</p>
            {scenarios.map(scenario => (
              <Card key={scenario.id} className="hover-lift cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all" onClick={() => { setSelectedScenario(scenario); setCurrentSceneId("start"); }}>
                <CardContent className="p-6 flex items-center gap-4">
                  <span className="text-4xl">{scenario.emoji}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold font-comic text-foreground">{scenario.title}</h3>
                    <p className="text-sm text-muted-foreground font-comic">{scenario.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Active Scene */}
        {selectedScenario && currentScene && !showResult && !finished && (
          <Card className="border-2 border-primary/20 shadow-fun">
            <CardHeader className="text-center pb-2">
              <Badge variant="outline" className="w-fit mx-auto mb-2 font-comic">{currentScene.setting}</Badge>
              <div className="text-4xl mb-2">{currentScene.characterEmoji}</div>
              <CardTitle className="text-lg font-comic text-foreground">{currentScene.character}</CardTitle>
              <CardDescription className="text-base font-comic italic">"{currentScene.dialogue}"</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-center font-comic text-muted-foreground">How do you respond?</p>
              {currentScene.options.map((option, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className={`w-full text-left h-auto py-3 px-4 whitespace-normal font-comic transition-all ${toneColors[option.tone]}`}
                  onClick={() => handleChoice(option)}
                >
                  <div className="w-full">
                    <Badge variant="outline" className="mb-1 text-xs">{toneLabels[option.tone]}</Badge>
                    <p className="text-sm">{option.text}</p>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Result after choice */}
        {showResult && (
          <Card className={`border-2 shadow-fun animate-in fade-in-0 zoom-in-95 ${showResult.points >= 3 ? "border-green-400 bg-green-50 dark:bg-green-950/30" : showResult.points >= 1 ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30" : "border-red-400 bg-red-50 dark:bg-red-950/30"}`}>
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-4xl">{showResult.points >= 3 ? "✅" : showResult.points >= 1 ? "⚠️" : "❌"}</div>
              <h3 className="text-xl font-bold font-comic text-foreground">
                {showResult.points >= 3 ? "Great Response!" : showResult.points >= 1 ? "Could Be Better" : "That Backfired..."}
              </h3>
              <p className="font-comic text-muted-foreground italic">"{showResult.response}"</p>
              <div className="flex items-center justify-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-comic text-muted-foreground">
                  {showResult.tone === "assertive" ? "Assertive communication respects both yourself and others." : showResult.tone === "aggressive" ? "Aggression often escalates conflict and damages relationships." : "Being passive may avoid conflict short-term but builds resentment."}
                </span>
              </div>
              <Badge className="font-comic">+{showResult.points} points</Badge>
              <Button onClick={continueAfterResult} className="mt-2">
                {showResult.nextSceneId ? "Continue Story →" : "See Results →"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Finished */}
        {finished && (
          <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/30 shadow-fun">
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-5xl">{getGrade().emoji}</div>
              <h2 className="text-2xl font-bold font-comic text-foreground">{getGrade().label}</h2>
              <p className="font-comic text-muted-foreground">{getGrade().desc}</p>
              <div className="flex justify-center gap-2">
                {Array.from({ length: Math.min(5, Math.ceil(totalPoints / maxPoints * 5)) }).map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-sm font-comic text-muted-foreground">Score: {totalPoints}/{maxPoints} points</p>

              <div className="space-y-2 text-left mt-4">
                <h4 className="font-bold font-comic text-foreground">Your Journey:</h4>
                {history.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="text-xs shrink-0">{toneLabels[h.chosenOption.tone]}</Badge>
                    <span className="font-comic text-muted-foreground">{h.chosenOption.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-3 mt-4">
                <Button onClick={reset}>Try Another Scenario</Button>
                <Button variant="outline" asChild>
                  <Link to="/activities">Back to Activities</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        {!selectedScenario && (
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-4 text-center space-y-2">
              <h3 className="font-bold font-comic text-foreground">💡 Communication Styles</h3>
              <div className="grid grid-cols-3 gap-3 text-sm font-comic">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <p className="font-bold text-destructive">🔥 Aggressive</p>
                  <p className="text-muted-foreground text-xs">Attacks others, escalates conflict</p>
                </div>
                <div className="p-2 rounded-lg bg-muted">
                  <p className="font-bold text-muted-foreground">😶 Passive</p>
                  <p className="text-muted-foreground text-xs">Avoids conflict, ignores own needs</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <p className="font-bold text-primary">💪 Assertive</p>
                  <p className="text-muted-foreground text-xs">Respects self and others</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ConflictRolePlayPage;
