import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Play, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ParentRolePlayPage = () => {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [userResponse, setUserResponse] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const scenarios = [
    {
      id: 1,
      title: "Dinner Refusal",
      description: "Your child refuses to eat dinner",
      situation: "It's dinnertime and you've prepared a healthy meal. Your 6-year-old sits at the table, crosses their arms, and declares 'I'm not eating this! It looks yucky!' They push the plate away and start to get up from the table.",
      guidedResponse: "Stay calm and acknowledge their feelings: 'I can see you don't like how this looks.' Offer choices: 'Would you like to try just one bite, or would you prefer to help me make something together?' Avoid forcing or bribing with dessert.",
      completed: false,
      difficulty: "Easy"
    },
    {
      id: 2,
      title: "Sibling Conflict",
      description: "Your child hits their sibling",
      situation: "You hear crying from the living room. When you arrive, you see your 5-year-old has just hit their 3-year-old sibling over a toy. Both children are upset and the younger one is crying loudly.",
      guidedResponse: "First, ensure both children are safe and comfort the hurt child. Then address the hitter calmly: 'I see you wanted the toy, but hitting hurts. When we're angry, we use words, not hands.' Help them practice saying 'Can I have a turn please?'",
      completed: true,
      difficulty: "Medium"
    },
    {
      id: 3,
      title: "Public Tantrum",
      description: "Your child has a meltdown in the grocery store",
      situation: "You're in the cereal aisle when your 4-year-old sees their favorite sugary cereal. When you say no, they throw themselves on the floor, screaming and kicking. Other shoppers are staring and you feel embarrassed.",
      guidedResponse: "Stay calm and get down to their level. Use a quiet, firm voice: 'I can see you're really upset about the cereal.' Don't give in to avoid embarrassment. If needed, calmly pick them up and continue shopping or step outside to let them calm down.",
      completed: false,
      difficulty: "Hard"
    },
    {
      id: 4,
      title: "Bedtime Resistance",
      description: "Your child keeps getting out of bed",
      situation: "It's 8 PM, bedtime routine is done, but your child keeps coming out of their room with different excuses: 'I need water,' 'I forgot to tell you something,' 'I heard a scary noise.' This has been going on for 45 minutes.",
      guidedResponse: "Be consistent and calm. The first time, briefly address their need, then say: 'It's bedtime now. I'll see you in the morning.' Each subsequent time, calmly walk them back without engaging in conversation. Stay patient and consistent.",
      completed: false,
      difficulty: "Medium"
    },
    {
      id: 5,
      title: "Homework Meltdown", 
      description: "Your child gets frustrated with homework",
      situation: "Your 8-year-old is working on math homework and suddenly crumples up the paper, throws their pencil, and shouts 'This is too hard! I'm stupid!' They put their head down and start to cry.",
      guidedResponse: "Validate their feelings: 'Math can be really frustrating sometimes.' Help them take a break: 'Let's take three deep breaths together.' Then break the problem into smaller steps: 'Let's just try this first part together.' Praise effort over results.",
      completed: false,
      difficulty: "Medium"
    },
    {
      id: 6,
      title: "Morning Rush Chaos",
      description: "Your child moves slowly during morning routine",
      situation: "You need to leave for school in 10 minutes, but your child is still in pajamas, hasn't brushed teeth, and is playing with toys. You've reminded them three times and you're feeling stressed about being late.",
      guidedResponse: "Stay calm and avoid rushing them more. Give clear, specific instructions: 'First brush teeth, then get dressed.' Consider setting up the night before and using visual schedules. If late, accept it and focus on keeping the morning positive.",
      completed: true,
      difficulty: "Easy"
    }
  ];

  const handleScenarioComplete = () => {
    if (selectedScenario !== null) {
      setShowFeedback(true);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "Hard": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/parent">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-fun bg-clip-text text-transparent font-comic">
              Role Play Scenarios
            </h1>
            <p className="text-lg text-muted-foreground font-comic mt-2">
              Practice handling real parenting situations with guided feedback
            </p>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-8 shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-comic font-semibold text-lg">Your Progress</h3>
                <p className="text-sm text-muted-foreground font-comic">
                  {scenarios.filter(s => s.completed).length} of {scenarios.length} scenarios completed
                </p>
              </div>
              <div className="text-3xl font-bold text-primary font-comic">
                {Math.round((scenarios.filter(s => s.completed).length / scenarios.length) * 100)}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <Card key={scenario.id} className={`hover-lift shadow-fun bg-card/80 backdrop-blur border-2 transition-all duration-300 ${scenario.completed ? 'border-green-400' : 'border-primary/20 hover:border-primary/40'}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="font-comic text-foreground flex items-center gap-2">
                      {scenario.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {scenario.title}
                    </CardTitle>
                    <CardDescription className="font-comic mt-2">
                      {scenario.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge className={getDifficultyColor(scenario.difficulty)}>
                    {scenario.difficulty}
                  </Badge>
                  {scenario.completed && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="fun" 
                      className="w-full"
                      onClick={() => setSelectedScenario(scenario.id)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {scenario.completed ? 'Review Scenario' : 'Start Scenario'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-comic">{scenario.title}</DialogTitle>
                      <DialogDescription className="font-comic">
                        Read the situation and think about how you would respond
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {/* Situation */}
                      <div>
                        <h4 className="font-semibold font-comic mb-2 text-primary">The Situation:</h4>
                        <p className="text-sm text-muted-foreground font-comic leading-relaxed">
                          {scenario.situation}
                        </p>
                      </div>

                      {/* Response Input */}
                      <div>
                        <h4 className="font-semibold font-comic mb-2 text-primary">How would you respond?</h4>
                        <Textarea
                          placeholder="Type your response here..."
                          value={userResponse}
                          onChange={(e) => setUserResponse(e.target.value)}
                          className="min-h-[100px] font-comic"
                        />
                      </div>

                      {/* Show Response Button */}
                      {!showFeedback && (
                        <Button 
                          onClick={handleScenarioComplete}
                          disabled={!userResponse.trim()}
                          className="w-full"
                          variant="fun"
                        >
                          See Guided Response
                        </Button>
                      )}

                      {/* Guided Response */}
                      {showFeedback && (
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <h4 className="font-semibold font-comic mb-2 text-primary">Guided Response:</h4>
                          <p className="text-sm font-comic leading-relaxed">
                            {scenario.guidedResponse}
                          </p>
                          <div className="mt-4 p-3 bg-card rounded border">
                            <p className="text-xs font-comic text-muted-foreground">
                              💡 <strong>Remember:</strong> Every child and situation is different. Use this as guidance, but trust your instincts and adapt to your child's unique needs.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentRolePlayPage;