import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Play, CheckCircle, ArrowLeft, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

const ParentQuizzesPage = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const quizzes = [
    {
      id: 1,
      title: "Quitting Activities",
      question: "Your child wants to quit their piano lessons midway through the term. They say it's 'too hard' and 'boring'. What do you do?",
      options: [
        { id: "a", text: "Let them quit immediately - forcing won't help", value: "quit" },
        { id: "b", text: "Make them finish the term, then decide", value: "finish" },
        { id: "c", text: "Explore what's making it hard and find solutions together", value: "explore" },
        { id: "d", text: "Bribe them with rewards to continue", value: "bribe" }
      ],
      bestAnswer: "explore",
      feedback: {
        explore: "Excellent! This approach validates their feelings while problem-solving together. You might discover they need more practice time, a different teaching style, or just encouragement through a difficult phase.",
        finish: "Good thinking about commitment, but consider exploring the root cause first. Sometimes 'boring' or 'hard' signals a need for different support rather than pure perseverance.",
        quit: "While avoiding force is good, immediately quitting might miss learning opportunities about working through challenges and finding solutions.",
        bribe: "Rewards might work short-term but don't address the underlying issue and can create dependency on external motivation."
      },
      completed: false,
      insight: "Teaching problem-solving skills helps children handle future challenges independently."
    },
    {
      id: 2,
      title: "Emotional Expression",
      question: "Your son starts crying during a sad movie scene. Other family members say 'boys don't cry.' How do you respond?",
      options: [
        { id: "a", text: "Agree and tell him to toughen up", value: "agree" },
        { id: "b", text: "Ignore the comment and comfort your son", value: "comfort" },
        { id: "c", text: "Address the comment and validate his emotions publicly", value: "validate" },
        { id: "d", text: "Take him away from the situation", value: "remove" }
      ],
      bestAnswer: "validate",
      feedback: {
        validate: "Perfect! You're modeling emotional intelligence and challenging harmful gender stereotypes. This teaches everyone that emotions are human, not gendered.",
        comfort: "Good instinct to comfort, but addressing the harmful comment is important too. This is a teaching moment for everyone present.",
        agree: "This reinforces harmful stereotypes and teaches children to suppress emotions, which can lead to mental health issues later.",
        remove: "While protecting your child's feelings, this misses the opportunity to educate and normalize emotional expression for everyone."
      },
      completed: true,
      insight: "Emotional expression is healthy regardless of gender. Modeling this teaches emotional intelligence."
    },
    {
      id: 3,
      title: "Gender Role Expectations",
      question: "Your daughter refuses to wear a dress to a family wedding, preferring her dinosaur shirt and shorts. Your partner insists she 'dress like a girl.' What do you do?",
      options: [
        { id: "a", text: "Force her to wear the dress to keep peace", value: "force" },
        { id: "b", text: "Find a compromise like a dress with dinosaurs", value: "compromise" },
        { id: "c", text: "Support her choice and discuss with your partner privately", value: "support" },
        { id: "d", text: "Let your partner handle it", value: "avoid" }
      ],
      bestAnswer: "support",
      feedback: {
        support: "Excellent! You're respecting her autonomy and sense of self while addressing the conflict constructively. This teaches her that her preferences matter and that she has bodily autonomy.",
        compromise: "Good problem-solving, but be careful not to always compromise on a child's personal expression. Sometimes standing firm on their autonomy is important.",
        force: "This teaches children that others' opinions matter more than their own comfort and self-expression, which can impact self-esteem and decision-making skills.",
        avoid: "Avoiding the situation doesn't help your child feel supported and may send the message that their preferences don't matter to you."
      },
      completed: false,
      insight: "Supporting children's self-expression builds confidence and teaches them to trust their own judgment."
    },
    {
      id: 4,
      title: "Sharing vs. Boundaries",
      question: "Your 4-year-old doesn't want to share their favorite toy with a visiting cousin. The cousin is crying. What's your approach?",
      options: [
        { id: "a", text: "Force them to share - it's the polite thing to do", value: "force" },
        { id: "b", text: "Explain that some things can be special and help find alternatives", value: "boundaries" },
        { id: "c", text: "Distract both children with a different activity", value: "distract" },
        { id: "d", text: "Take the toy away from both children", value: "remove" }
      ],
      bestAnswer: "boundaries",
      feedback: {
        boundaries: "Wonderful! You're teaching that it's okay to have boundaries while being kind. This helps children understand consent and respect for personal belongings while developing empathy.",
        distract: "This can work in the moment but misses the teaching opportunity about boundaries, sharing, and problem-solving.",
        force: "Forced sharing can teach children that their boundaries don't matter and that they must give up their things to please others, which can be problematic later.",
        remove: "This punishes both children and doesn't teach problem-solving or respect for boundaries and ownership."
      },
      completed: false,
      insight: "Teaching healthy boundaries is as important as teaching generosity and sharing."
    },
    {
      id: 5,
      title: "Academic Pressure",
      question: "Your child brings home a B+ on a test they studied hard for. They seem disappointed. How do you respond?",
      options: [
        { id: "a", text: "Tell them a B+ is great and they should be happy", value: "dismiss" },
        { id: "b", text: "Ask what they think they could do differently next time", value: "improve" },
        { id: "c", text: "Acknowledge their disappointment and celebrate their effort", value: "validate" },
        { id: "d", text: "Set up tutoring to ensure better grades next time", value: "tutor" }
      ],
      bestAnswer: "validate",
      feedback: {
        validate: "Excellent! You're validating their feelings while emphasizing effort over outcome. This builds resilience and intrinsic motivation while showing emotional support.",
        improve: "Good growth mindset, but address their emotions first. Once they feel heard, they'll be more open to problem-solving.",
        dismiss: "This minimizes their feelings and may make them less likely to share disappointments with you in the future.",
        tutor: "This might send the message that the grade wasn't good enough and could increase pressure rather than building confidence."
      },
      completed: false,
      insight: "Validating emotions first creates space for learning and builds emotional trust."
    },
    {
      id: 6,
      title: "Peer Pressure Situations",
      question: "Your 8-year-old says their friends are making fun of them for not having the latest video game. They're begging you to buy it. What's your response?",
      options: [
        { id: "a", text: "Buy the game to help them fit in", value: "buy" },
        { id: "b", text: "Tell them real friends don't care about possessions", value: "lecture" },
        { id: "c", text: "Discuss peer pressure and help them practice responses", value: "discuss" },
        { id: "d", text: "Arrange playdates with different children", value: "avoid" }
      ],
      bestAnswer: "discuss",
      feedback: {
        discuss: "Perfect! You're teaching them about peer pressure while building their confidence to stand up for themselves. This builds critical thinking and social skills.",
        lecture: "While technically true, this dismisses their real social struggle and doesn't give them practical tools to handle the situation.",
        buy: "This teaches that material possessions determine social acceptance and doesn't help them develop resilience against peer pressure.",
        avoid: "While finding good friends is important, they need skills to handle peer pressure in any group situation."
      },
      completed: true,
      insight: "Teaching children to handle peer pressure builds confidence and critical thinking skills."
    }
  ];

  const handleSubmitAnswer = () => {
    setShowFeedback(true);
  };

  const resetQuiz = () => {
    setSelectedAnswer("");
    setShowFeedback(false);
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
              What Would You Do? Quizzes
            </h1>
            <p className="text-lg text-muted-foreground font-comic mt-2">
              Test your parenting instincts with thoughtful scenarios and reflection
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
                  {quizzes.filter(q => q.completed).length} of {quizzes.length} quizzes completed
                </p>
              </div>
              <div className="text-3xl font-bold text-primary font-comic">
                {Math.round((quizzes.filter(q => q.completed).length / quizzes.length) * 100)}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className={`hover-lift shadow-fun bg-card/80 backdrop-blur border-2 transition-all duration-300 ${quiz.completed ? 'border-green-400' : 'border-primary/20 hover:border-primary/40'}`}>
              <CardHeader>
                <CardTitle className="font-comic text-foreground flex items-center gap-2">
                  {quiz.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {quiz.title}
                </CardTitle>
                <CardDescription className="font-comic text-sm">
                  {quiz.question.length > 80 ? quiz.question.substring(0, 80) + "..." : quiz.question}
                </CardDescription>
                {quiz.completed && (
                  <Badge variant="outline" className="text-green-600 border-green-600 w-fit">
                    Completed
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="fun" 
                      className="w-full"
                      onClick={() => {
                        setSelectedQuiz(quiz.id);
                        resetQuiz();
                      }}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {quiz.completed ? 'Retake Quiz' : 'Take Quiz'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-comic">{quiz.title}</DialogTitle>
                      <DialogDescription className="font-comic">
                        Think carefully about this scenario and choose your response
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {/* Question */}
                      <div>
                        <h4 className="font-semibold font-comic mb-4 text-primary">Scenario:</h4>
                        <p className="font-comic leading-relaxed bg-primary/10 p-4 rounded-lg">
                          {quiz.question}
                        </p>
                      </div>

                      {/* Options */}
                      <div>
                        <h4 className="font-semibold font-comic mb-3 text-primary">What would you do?</h4>
                        <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                          {quiz.options.map((option) => (
                            <div key={option.id} className="flex items-start space-x-2 p-3 rounded-lg hover:bg-primary/5 transition-colors">
                              <RadioGroupItem value={option.value} id={option.id} className="mt-1" />
                              <Label htmlFor={option.id} className="font-comic cursor-pointer flex-1 leading-relaxed">
                                {option.text}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      {/* Submit Button */}
                      {!showFeedback && (
                        <Button 
                          onClick={handleSubmitAnswer}
                          disabled={!selectedAnswer}
                          className="w-full"
                          variant="fun"
                        >
                          Get Feedback
                        </Button>
                      )}

                      {/* Feedback */}
                      {showFeedback && selectedAnswer && (
                        <div className="space-y-4">
                          <div className={`p-4 rounded-lg ${selectedAnswer === quiz.bestAnswer ? 'bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700' : 'bg-orange-100 dark:bg-orange-900 border border-orange-300 dark:border-orange-700'}`}>
                            <h4 className="font-semibold font-comic mb-2 flex items-center gap-2">
                              <Lightbulb className="h-4 w-4" />
                              Feedback on Your Choice:
                            </h4>
                            <p className="text-sm font-comic leading-relaxed">
                              {quiz.feedback[selectedAnswer as keyof typeof quiz.feedback]}
                            </p>
                          </div>

                          {selectedAnswer !== quiz.bestAnswer && (
                            <div className="bg-primary/10 p-4 rounded-lg">
                              <h4 className="font-semibold font-comic mb-2 text-primary">Consider This Approach:</h4>
                              <p className="text-sm font-comic leading-relaxed">
                                {quiz.feedback[quiz.bestAnswer as keyof typeof quiz.feedback]}
                              </p>
                            </div>
                          )}

                          <div className="bg-card p-4 rounded-lg border">
                            <h4 className="font-semibold font-comic mb-2 text-primary">Key Insight:</h4>
                            <p className="text-sm font-comic leading-relaxed">
                              💡 {quiz.insight}
                            </p>
                          </div>

                          <Button 
                            onClick={resetQuiz}
                            variant="outline"
                            className="w-full"
                          >
                            Try Again
                          </Button>
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

export default ParentQuizzesPage;