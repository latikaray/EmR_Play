import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface GuideSection {
  id: string;
  title: string;
  emoji: string;
  color: string;
  scenario: string;
  scenarioEmoji: string;
  whyItHappens: string;
  whatToSay: string[];
  whatToRemember: string;
  funFact: string;
}

const guideSections: GuideSection[] = [
  {
    id: "bunking",
    title: "Bunking School / Classes",
    emoji: "🏫",
    color: "bg-red-100 dark:bg-red-900/20",
    scenario: "Your friends want to skip class and go to the mall. They call you 'boring' for wanting to stay.",
    scenarioEmoji: "🚪",
    whyItHappens: "Teens feel the need to prove they're 'cool' and not a rule-follower. Skipping class feels rebellious and exciting in the moment.",
    whatToSay: [
      "🗣️ \"I've got a test coming up — can't risk it.\"",
      "🗣️ \"I'll hang out after school instead.\"",
      "🗣️ \"Nah, I don't want to deal with my parents finding out.\"",
      "💪 \"I'm staying. You do you.\"",
    ],
    whatToRemember: "The 'fun' of bunking lasts an hour. The consequences (bad grades, parent anger, school record) last much longer.",
    funFact: "📊 Studies show students who skip classes regularly are 3x more likely to fall behind academically.",
  },
  {
    id: "relationships",
    title: "Being in a Relationship",
    emoji: "💑",
    color: "bg-pink-100 dark:bg-pink-900/20",
    scenario: "Everyone in your group has a boyfriend/girlfriend. They keep asking why you're 'still single' and try to set you up.",
    scenarioEmoji: "💘",
    whyItHappens: "Movies, social media, and peers create a false narrative that you NEED to be in a relationship to be happy or 'normal.'",
    whatToSay: [
      "🗣️ \"I'm focusing on myself right now.\"",
      "🗣️ \"I'll date when I actually like someone, not to fit in.\"",
      "🗣️ \"Being single isn't a disease — it's a choice!\"",
      "💪 \"My relationship status isn't your business.\"",
    ],
    whatToRemember: "Your teenage years are for discovering WHO YOU ARE. A relationship won't define you — your character will.",
    funFact: "🧠 The prefrontal cortex (decision-making part of the brain) isn't fully developed until age 25. Give yourself time!",
  },
  {
    id: "sneakers",
    title: "Wearing Cool Sneakers / Brands",
    emoji: "👟",
    color: "bg-orange-100 dark:bg-orange-900/20",
    scenario: "Your classmates all have ₹8000+ sneakers. You get comments about your 'basic' shoes.",
    scenarioEmoji: "🛍️",
    whyItHappens: "Brands spend billions on marketing to make teens believe expensive = cool. Social media influencers amplify this message.",
    whatToSay: [
      "🗣️ \"I like what I wear. Comfort > brand.\"",
      "🗣️ \"These shoes have never let me down — unlike trends!\"",
      "🗣️ \"I'd rather save money for something that actually matters.\"",
      "💪 \"I don't need ₹8000 shoes to be cool.\"",
    ],
    whatToRemember: "Trends change every 3 months. That 'must-have' shoe will be 'so last season' soon. Your confidence never goes out of style.",
    funFact: "💰 The average teen trend lasts only 3-6 months. That's ₹8000 for 90 days of 'coolness' — about ₹89/day!",
  },
  {
    id: "cafes",
    title: "Showing Up at Cafes & Parties",
    emoji: "☕",
    color: "bg-amber-100 dark:bg-amber-900/20",
    scenario: "Your friend group always hangs out at expensive cafes. You can't always afford it but feel left out when you don't go.",
    scenarioEmoji: "🎭",
    whyItHappens: "Social media has created a 'lifestyle culture' where being seen at the right places = being popular. FOMO (Fear of Missing Out) is real.",
    whatToSay: [
      "🗣️ \"How about we hang at the park / my place this weekend?\"",
      "🗣️ \"I'm saving up for something — let's do something free!\"",
      "🗣️ \"We don't need to spend money to have fun together.\"",
      "💪 \"Real friends hang out anywhere, not just cafes.\"",
    ],
    whatToRemember: "The best memories aren't the most expensive ones. A game night at home beats an awkward cafe outing any day!",
    funFact: "🌳 Research shows teens who spend time in nature report lower stress and higher happiness than those in commercial spaces.",
  },
  {
    id: "social-media",
    title: "Being Active on Social Media",
    emoji: "📱",
    color: "bg-blue-100 dark:bg-blue-900/20",
    scenario: "You feel pressure to post stories daily, maintain Snapchat streaks, get likes, and keep up a perfect online image. It's exhausting.",
    scenarioEmoji: "🔔",
    whyItHappens: "Social media platforms are literally DESIGNED to be addictive. Notifications, likes, and streaks trigger dopamine — the 'feel good' chemical.",
    whatToSay: [
      "🗣️ \"I'm doing a social media detox this week.\"",
      "🗣️ \"I'd rather live my life than post about it.\"",
      "🗣️ \"Streaks aren't friendships — conversations are.\"",
      "💪 \"My self-worth isn't measured in likes.\"",
    ],
    whatToRemember: "Everyone's social media is a highlight reel. No one posts their bad days, failures, or boring moments. Don't compare your real life to someone's curated feed.",
    funFact: "😱 The average teen spends 7+ hours/day on screens. That's nearly 2,555 hours/year — more than a full-time job!",
  },
  {
    id: "trends",
    title: "Following Trends & Challenges",
    emoji: "🔥",
    color: "bg-purple-100 dark:bg-purple-900/20",
    scenario: "A new viral challenge is going around. Some are funny, some are dangerous. Your friends want you to participate and film it.",
    scenarioEmoji: "📹",
    whyItHappens: "Viral content creates a feeling of belonging. When everyone's doing something, NOT doing it feels like being left out of an inside joke.",
    whatToSay: [
      "🗣️ \"I'll watch but I'm not doing something risky for views.\"",
      "🗣️ \"Let's do a fun challenge that won't get us hurt or in trouble.\"",
      "🗣️ \"I'd rather go viral for something I created myself.\"",
      "💪 \"My safety > your entertainment.\"",
    ],
    whatToRemember: "A viral moment lasts days. An injury or embarrassment can last forever. Think before you trend.",
    funFact: "🏥 Emergency rooms report a spike in teen injuries every time a dangerous challenge goes viral. Don't be a statistic!",
  },
  {
    id: "web-series",
    title: "Watching the Latest Web Series",
    emoji: "🎬",
    color: "bg-emerald-100 dark:bg-emerald-900/20",
    scenario: "There's a new show everyone's binge-watching. It has mature content. You feel left out of conversations because you haven't seen it.",
    scenarioEmoji: "🍿",
    whyItHappens: "Shared cultural experiences create bonds. When everyone's discussing a show, not watching it feels like being excluded from the group.",
    whatToSay: [
      "🗣️ \"It's not really my type — what else are you watching?\"",
      "🗣️ \"I'm more into [genre you actually like]. Any recs?\"",
      "🗣️ \"I'll check it out when I'm ready.\"",
      "💪 \"I choose what I watch based on what I enjoy, not what's trending.\"",
    ],
    whatToRemember: "Content rated for older audiences is rated that way for a reason. Trust your own comfort level — there's no rush to grow up faster than you're ready.",
    funFact: "🎭 The average person will watch approximately 78,000 hours of content in their lifetime. Choose quality over peer pressure!",
  },
  {
    id: "phone",
    title: "Getting a New Costly Phone",
    emoji: "📲",
    color: "bg-cyan-100 dark:bg-cyan-900/20",
    scenario: "Your classmates all have the latest flagship phone. Your phone works fine but it's not the newest model. People mock you for it.",
    scenarioEmoji: "💎",
    whyItHappens: "Tech companies release new phones every year on purpose — they want you to feel 'behind' if you don't upgrade. It's called planned obsolescence.",
    whatToSay: [
      "🗣️ \"My phone calls, texts, and runs apps. What more do I need?\"",
      "🗣️ \"I'd rather my parents save that money for something important.\"",
      "🗣️ \"A phone doesn't define my worth.\"",
      "💪 \"I judge people by their character, not their gadgets.\"",
    ],
    whatToRemember: "The person behind the phone matters more than the phone itself. Steve Jobs himself limited his kids' screen time!",
    funFact: "♻️ 1.5 billion phones are sold globally each year. Most perfectly good phones end up in landfills. Being happy with what you have is also good for the planet!",
  },
];

const masterTips = [
  { emoji: "🛡️", tip: "The Broken Record: Keep repeating your answer calmly. \"No thanks. No thanks. No, but thanks!\"" },
  { emoji: "🚶", tip: "The Exit Strategy: Always have an exit plan. \"My mom's calling, gotta go!\"" },
  { emoji: "👥", tip: "Find Your Tribe: Surround yourself with people who respect your choices." },
  { emoji: "🧠", tip: "The 10-10-10 Rule: Will this matter in 10 minutes? 10 months? 10 years?" },
  { emoji: "💪", tip: "Practice Saying No: The more you practice, the easier it gets!" },
  { emoji: "📱", tip: "Blame Your Parents: It's totally okay to say 'My parents won't allow it' — it takes the pressure off you!" },
  { emoji: "❤️", tip: "Self-Worth Check: Your value doesn't decrease based on someone's inability to see it." },
];

const PeerPressureGuidePage = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild><Link to="/activities"><ArrowLeft className="h-4 w-4 mr-2" />Back</Link></Button>
        </div>

        <div className="text-center space-y-3 py-4">
          <div className="text-6xl">🛡️</div>
          <h1 className="text-3xl md:text-4xl font-bold font-comic text-foreground">
            Your Guide to Handling Peer Pressure
          </h1>
          <p className="text-muted-foreground font-comic text-lg">
            Interactive tips for EVERY situation teens face 💪
          </p>
          <Badge className="bg-primary/10 text-primary font-comic">Ages 13-16</Badge>
        </div>

        {/* Quick Master Tips */}
        <Card className="bg-card/90 backdrop-blur border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg font-comic text-foreground flex items-center gap-2">
              ⚡ Quick Power Moves
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {masterTips.map((t, i) => (
                <div key={i} className="flex items-start gap-3 bg-muted/50 rounded-xl p-3">
                  <span className="text-2xl">{t.emoji}</span>
                  <p className="text-sm font-comic text-foreground">{t.tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scenario Guides */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-comic text-foreground text-center">📚 Situation-by-Situation Guide</h2>
          {guideSections.map((section) => {
            const isOpen = expandedSections.includes(section.id);
            return (
              <Collapsible key={section.id} open={isOpen} onOpenChange={() => toggleSection(section.id)}>
                <Card className={`${section.color} border-2 border-transparent hover:border-primary/20 transition-all`}>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{section.emoji}</span>
                        <CardTitle className="text-lg font-comic text-foreground text-left">{section.title}</CardTitle>
                      </div>
                      {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4 pt-0">
                      {/* The Scenario */}
                      <div className="bg-background/80 rounded-xl p-4 border border-border">
                        <p className="text-xs font-comic text-muted-foreground font-bold mb-1">{section.scenarioEmoji} THE SITUATION:</p>
                        <p className="text-sm font-comic text-foreground">{section.scenario}</p>
                      </div>

                      {/* Why It Happens */}
                      <div className="bg-background/80 rounded-xl p-4 border border-border">
                        <p className="text-xs font-comic text-muted-foreground font-bold mb-1">🧠 WHY THIS PRESSURE EXISTS:</p>
                        <p className="text-sm font-comic text-foreground">{section.whyItHappens}</p>
                      </div>

                      {/* What To Say */}
                      <div className="bg-background/80 rounded-xl p-4 border border-border">
                        <p className="text-xs font-comic text-muted-foreground font-bold mb-2">💬 THINGS YOU CAN SAY:</p>
                        <div className="space-y-2">
                          {section.whatToSay.map((line, i) => (
                            <p key={i} className="text-sm font-comic text-foreground bg-muted/50 rounded-lg px-3 py-2">{line}</p>
                          ))}
                        </div>
                      </div>

                      {/* Remember */}
                      <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                        <p className="text-xs font-comic text-primary font-bold mb-1">❤️ REMEMBER:</p>
                        <p className="text-sm font-comic text-foreground">{section.whatToRemember}</p>
                      </div>

                      {/* Fun Fact */}
                      <div className="bg-background/80 rounded-xl p-3 border border-border">
                        <p className="text-sm font-comic text-foreground">{section.funFact}</p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>

        {/* CTA */}
        <Card className="bg-gradient-fun text-white">
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-4xl">🎮</div>
            <h3 className="text-xl font-bold font-comic">Ready to Practice?</h3>
            <p className="font-comic opacity-90">Try the Peer Pressure Simulator to test your skills in real scenarios!</p>
            <Button variant="outline" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/activities/peer-pressure-sim">Start Simulator <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PeerPressureGuidePage;
