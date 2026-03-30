import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ArticleTask {
  id: string;
  emoji: string;
  task: string;
  reflection: string;
}

interface ArticleSection {
  emoji: string;
  title: string;
  content: string;
  tasks: ArticleTask[];
}

interface Article {
  id: number;
  title: string;
  subtitle: string;
  headerEmoji: string;
  color: string;
  sections: ArticleSection[];
}

const articles: Article[] = [
  {
    id: 1,
    title: "Fathers Wear Pink 👨‍👧",
    subtitle: "Breaking Gender Stereotypes at Home",
    headerEmoji: "💪🩷",
    color: "from-pink-400 to-rose-500",
    sections: [
      {
        emoji: "🩷",
        title: "Pink is Just a Color",
        content: "Until the 1940s, pink was considered a 'strong' color for boys! Colors don't have gender. When fathers wear pink, paint nails with daughters, or choose 'non-traditional' colors, they silently teach that confidence isn't about conformity.",
        tasks: [
          { id: "1a", emoji: "👕", task: "Wear something pink this week. Take a photo with your kid!", reflection: "How did it feel? Did anyone comment?" },
          { id: "1b", emoji: "🎨", task: "Let your child pick your outfit color for a day", reflection: "Did you feel self-conscious? Why or why not?" }
        ]
      },
      {
        emoji: "🍳",
        title: "Cooking is a Superpower",
        content: "Children who see fathers cook grow up understanding that feeding a family isn't 'women's work' — it's love in action. 🥘 Gordon Ramsay, a father of 6, says cooking together is his favorite bonding time.",
        tasks: [
          { id: "1c", emoji: "👨‍🍳", task: "Cook one meal this week entirely by yourself. Let kids help!", reflection: "What did you make? How did the family react?" },
          { id: "1d", emoji: "📋", task: "Plan the weekly meal menu together as a family", reflection: "Who usually does this? How did sharing it feel?" }
        ]
      },
      {
        emoji: "🧸",
        title: "Play Without Boundaries",
        content: "When dads play tea party 🫖, style hair 💇, or read fairy tales — they're not 'babysitting.' They're parenting. Research shows children with involved fathers have higher self-esteem and better social skills.",
        tasks: [
          { id: "1e", emoji: "🫖", task: "Have a tea party or play dolls with your child this week", reflection: "What did you learn about your child during play?" },
          { id: "1f", emoji: "📖", task: "Read a bedtime story using silly voices for every character", reflection: "Which voice was your child's favorite?" }
        ]
      },
      {
        emoji: "🧹",
        title: "Chores Don't Have Gender",
        content: "When children see dad do laundry, dishes, and vacuuming — they internalize equality. 🏠 Studies show daughters of involved fathers are more likely to pursue ambitious careers.",
        tasks: [
          { id: "1g", emoji: "🧺", task: "Do the laundry this week including folding and putting away", reflection: "Is this normally your responsibility? How did it feel?" },
          { id: "1h", emoji: "🫧", task: "Wash dishes together with your child — make it fun with music!", reflection: "Did your child enjoy the shared task?" }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Kids Learn by Watching 👀",
    subtitle: "Being a Gentleman Starts at Home",
    headerEmoji: "🪞👨‍👩‍👧‍👦",
    color: "from-blue-400 to-indigo-500",
    sections: [
      {
        emoji: "🍽️",
        title: "Wash Your Own Plate",
        content: "When kids see dad get up after dinner and wash his own plate 🍽️, they learn: cleaning up after yourself isn't someone else's job. It's self-respect. This one small act teaches responsibility louder than any lecture.",
        tasks: [
          { id: "2a", emoji: "🫧", task: "Wash your own plate after every meal this week — visibly!", reflection: "Did your children notice? Did they start doing the same?" },
          { id: "2b", emoji: "🤝", task: "Thank your partner for cooking before you start eating", reflection: "How did your partner react? Did kids follow?" }
        ]
      },
      {
        emoji: "💬",
        title: "Ask Mom's Opinion",
        content: "When dad says 'Let me ask mom what she thinks' or 'Your mother's opinion matters here' 💭 — children learn that decision-making is shared. It teaches respect, teamwork, and that both parents' voices matter equally.",
        tasks: [
          { id: "2c", emoji: "🗣️", task: "Make a family decision together this week — ask everyone's input", reflection: "Was this different from how decisions usually happen?" },
          { id: "2d", emoji: "👂", task: "When your child asks you something, say 'Let's ask mom/dad too!'", reflection: "Did this change the dynamic of the conversation?" }
        ]
      },
      {
        emoji: "🧹",
        title: "Help Without Being Asked",
        content: "A gentleman doesn't wait to be told. When dad sees a mess, he cleans it. When the groceries arrive, he puts them away. 🛒 Children who see proactive helping grow up to be thoughtful partners and colleagues.",
        tasks: [
          { id: "2e", emoji: "🛒", task: "Notice 3 things that need doing today and do them without being asked", reflection: "Was it hard to notice things you usually ignore?" },
          { id: "2f", emoji: "🧽", task: "Clean a common area before anyone else wakes up", reflection: "How did it feel to contribute silently?" }
        ]
      },
      {
        emoji: "❤️",
        title: "Show Affection Openly",
        content: "When children see dad hug mom, say 'I love you,' hold her hand, or compliment her — they learn what healthy love looks like. 💕 Boys learn to express feelings. Girls learn what respect looks like in a partner.",
        tasks: [
          { id: "2g", emoji: "💐", task: "Compliment your partner in front of the kids this week", reflection: "How did your children react to seeing affection?" },
          { id: "2h", emoji: "🤗", task: "Hug your partner and say 'thank you for everything you do'", reflection: "Did this moment feel natural or awkward? Why?" }
        ]
      },
      {
        emoji: "🙏",
        title: "Apologize When Wrong",
        content: "The most powerful thing a father can do is say 'I was wrong, I'm sorry' — especially to their partner in front of the kids. 🙇 It teaches humility, accountability, and that being strong means owning mistakes.",
        tasks: [
          { id: "2i", emoji: "💬", task: "If you raised your voice or made a mistake this week, apologize openly", reflection: "How did your child react to seeing a parent apologize?" },
          { id: "2j", emoji: "📝", task: "Write a note to your partner about something you appreciate", reflection: "When was the last time you expressed gratitude in writing?" }
        ]
      }
    ]
  }
];

const ParentArticlesPage = () => {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [activeArticle, setActiveArticle] = useState<number | null>(null);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev =>
      prev.includes(sectionKey) ? prev.filter(k => k !== sectionKey) : [...prev, sectionKey]
    );
  };

  const article = activeArticle !== null ? articles.find(a => a.id === activeArticle) : null;

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
              Interactive Articles
            </h1>
            <p className="text-lg text-muted-foreground font-comic mt-2">
              Read, reflect, and take action with emoji-powered guides
            </p>
          </div>
        </div>

        {!article ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {articles.map(a => {
              const totalTasks = a.sections.reduce((sum, s) => sum + s.tasks.length, 0);
              const done = a.sections.reduce((sum, s) => sum + s.tasks.filter(t => completedTasks.includes(t.id)).length, 0);
              return (
                <Card key={a.id} className="hover-lift shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20 hover:border-primary/40 transition-all cursor-pointer"
                  onClick={() => setActiveArticle(a.id)}>
                  <CardHeader className="text-center">
                    <div className="text-5xl mb-3">{a.headerEmoji}</div>
                    <CardTitle className="font-comic text-foreground">{a.title}</CardTitle>
                    <p className="text-sm text-muted-foreground font-comic">{a.subtitle}</p>
                  </CardHeader>
                  <CardContent className="text-center space-y-3">
                    <Badge variant="outline" className="font-comic">{a.sections.length} sections • {totalTasks} tasks</Badge>
                    {done > 0 && (
                      <Badge variant="secondary" className="ml-2 font-comic">{done}/{totalTasks} done</Badge>
                    )}
                    <Button variant="fun" className="w-full mt-3">Read & Reflect 📖</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Button variant="outline" size="sm" className="mb-6" onClick={() => setActiveArticle(null)}>
              ← Back to Articles
            </Button>

            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{article.headerEmoji}</div>
              <h2 className="text-3xl font-bold font-comic text-foreground">{article.title}</h2>
              <p className="text-muted-foreground font-comic mt-2">{article.subtitle}</p>
            </div>

            <div className="space-y-4">
              {article.sections.map((section, sIdx) => {
                const sectionKey = `${article.id}-${sIdx}`;
                const isOpen = openSections.includes(sectionKey);
                const sectionDone = section.tasks.filter(t => completedTasks.includes(t.id)).length;

                return (
                  <Collapsible key={sIdx} open={isOpen} onOpenChange={() => toggleSection(sectionKey)}>
                    <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
                      <CollapsibleTrigger className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{section.emoji}</span>
                            <div className="text-left">
                              <CardTitle className="font-comic text-foreground text-lg">{section.title}</CardTitle>
                              {sectionDone > 0 && (
                                <Badge variant="secondary" className="text-xs mt-1">{sectionDone}/{section.tasks.length} tasks done</Badge>
                              )}
                            </div>
                          </div>
                          {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="space-y-5">
                          <p className="font-comic leading-relaxed text-foreground/90">{section.content}</p>

                          <div className="space-y-3">
                            <h4 className="font-comic font-semibold text-primary">✏️ This Week's Tasks:</h4>
                            {section.tasks.map(task => {
                              const isDone = completedTasks.includes(task.id);
                              return (
                                <div key={task.id} className={`p-4 rounded-lg border-2 transition-all ${isDone ? 'bg-green-50 dark:bg-green-900/20 border-green-400' : 'bg-card border-border hover:border-primary/40'}`}>
                                  <div className="flex items-start gap-3">
                                    <button onClick={() => toggleTask(task.id)} className="mt-1 shrink-0">
                                      {isDone ? (
                                        <CheckCircle className="h-6 w-6 text-green-500" />
                                      ) : (
                                        <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/40" />
                                      )}
                                    </button>
                                    <div className="flex-1">
                                      <p className={`font-comic ${isDone ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                        {task.emoji} {task.task}
                                      </p>
                                      {isDone && (
                                        <div className="mt-2 bg-primary/10 p-3 rounded-lg">
                                          <p className="text-sm font-comic text-primary font-semibold">🪞 Reflect:</p>
                                          <p className="text-sm font-comic text-muted-foreground">{task.reflection}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentArticlesPage;
