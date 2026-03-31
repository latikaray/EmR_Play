import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, EyeOff, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { parentingGuides, type Guide, type AgeGroup } from "@/data/parentingGuides";

const GuideDetail = ({ guide, onBack }: { guide: Guide; onBack: () => void }) => {
  const [openSections, setOpenSections] = useState<string[]>(["description"]);
  const [showHidden, setShowHidden] = useState(false);

  const toggle = (key: string) => {
    setOpenSections(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const sections = [
    { key: "description", icon: "📋", title: "About This Issue", content: guide.description, type: "text" as const },
    { key: "signs", icon: "🔍", title: "Signs to Watch For", items: guide.signs, type: "list" as const },
    { key: "hidden", icon: "🫥", title: "Hidden Behaviors (What They Won't Show You)", items: guide.hiddenBehaviors, type: "hidden" as const },
    { key: "respond", icon: "🛠️", title: "How to Respond", items: guide.howToRespond, type: "list" as const },
    { key: "talk", icon: "💬", title: "How to Talk to Your Child", items: guide.howToTalk, type: "talk" as const },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="outline" size="sm" className="mb-6" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Guides
      </Button>

      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{guide.emoji}</div>
        <h2 className="text-3xl font-bold font-comic text-foreground">{guide.title}</h2>
      </div>

      <div className="space-y-4">
        {sections.map((section) => {
          const isOpen = openSections.includes(section.key);
          return (
            <Collapsible key={section.key} open={isOpen} onOpenChange={() => toggle(section.key)}>
              <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{section.icon}</span>
                      <CardTitle className="font-comic text-foreground text-base sm:text-lg text-left">{section.title}</CardTitle>
                    </div>
                    {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />}
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 pb-5">
                    {section.type === "text" && (
                      <p className="font-comic leading-relaxed text-foreground/90">{section.content}</p>
                    )}
                    {section.type === "list" && (
                      <ul className="space-y-2">
                        {(section.items as string[]).map((item, i) => (
                          <li key={i} className="flex items-start gap-2 font-comic text-foreground/90">
                            <span className="text-primary mt-1 shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.type === "hidden" && (
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mb-4 font-comic"
                          onClick={(e) => { e.stopPropagation(); setShowHidden(!showHidden); }}
                        >
                          {showHidden ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                          {showHidden ? "Hide Indicators" : "Reveal Hidden Indicators"}
                        </Button>
                        {showHidden ? (
                          <ul className="space-y-2 animate-in fade-in duration-500">
                            {(section.items as string[]).map((item, i) => (
                              <li key={i} className="flex items-start gap-2 font-comic text-foreground/90">
                                <span className="text-destructive mt-1 shrink-0">⚠️</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="font-comic text-muted-foreground italic">Click above to reveal behaviors your child may not openly show.</p>
                        )}
                      </div>
                    )}
                    {section.type === "talk" && (
                      <div className="space-y-4">
                        {(section.items as { prompt: string; example: string }[]).map((item, i) => (
                          <div key={i} className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                            <p className="font-comic font-semibold text-primary text-sm mb-2">💡 {item.prompt}</p>
                            <p className="font-comic text-foreground/90 italic text-sm leading-relaxed">{item.example}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};

const AgeGroupSection = ({ group, onSelectGuide }: { group: AgeGroup; onSelectGuide: (g: Guide) => void }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-5">
      <span className="text-4xl">{group.emoji}</span>
      <div>
        <h2 className="text-2xl font-bold font-comic text-foreground">{group.label}</h2>
        <p className="text-sm text-muted-foreground font-comic">{group.guides.length} guides</p>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {group.guides.map((guide) => (
        <Card
          key={guide.id}
          className="hover-lift shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20 hover:border-primary/40 transition-all cursor-pointer"
          onClick={() => onSelectGuide(guide)}
        >
          <CardHeader className="text-center pb-2">
            <div className="text-4xl mb-2">{guide.emoji}</div>
            <CardTitle className="font-comic text-foreground text-base">{guide.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center pt-0">
            <p className="text-xs text-muted-foreground font-comic line-clamp-2 mb-3">{guide.description}</p>
            <Badge variant="outline" className="font-comic text-xs">
              {guide.signs.length} signs • {guide.howToTalk.length} conversation guides
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const ParentingGuidesPage = () => {
  const [activeGuide, setActiveGuide] = useState<Guide | null>(null);
  const [activeTab, setActiveTab] = useState<string>("5-12");

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
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-fun bg-clip-text text-transparent font-comic flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" /> Parenting Guide Library
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground font-comic mt-1">
              Serious, practical guides for real parenting challenges
            </p>
          </div>
        </div>

        {activeGuide ? (
          <GuideDetail guide={activeGuide} onBack={() => setActiveGuide(null)} />
        ) : (
          <>
            {/* Age group tabs */}
            <div className="flex gap-3 mb-8 justify-center flex-wrap">
              {parentingGuides.map((group) => (
                <Button
                  key={group.id}
                  variant={activeTab === group.id ? "fun" : "outline"}
                  className="font-comic"
                  onClick={() => setActiveTab(group.id)}
                >
                  {group.emoji} {group.label}
                </Button>
              ))}
            </div>

            {parentingGuides
              .filter((g) => g.id === activeTab)
              .map((group) => (
                <AgeGroupSection key={group.id} group={group} onSelectGuide={setActiveGuide} />
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ParentingGuidesPage;
