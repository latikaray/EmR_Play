import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Play, CheckCircle, ArrowLeft, Lightbulb, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { quizData } from "@/data/parentQuizData";

const ParentQuizzesPage = () => {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedIds, setCompletedIds] = useState<number[]>([]);

  const handleSubmitAnswer = (quizId: number) => {
    setShowFeedback(true);
    if (!completedIds.includes(quizId)) {
      setCompletedIds(prev => [...prev, quizId]);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswer("");
    setShowFeedback(false);
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
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
              Test your parenting instincts with thoughtful scenarios
            </p>
          </div>
        </div>

        <Card className="mb-8 shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-comic font-semibold text-lg">Your Progress</h3>
                <p className="text-sm text-muted-foreground font-comic">
                  {completedIds.length} of {quizData.length} quizzes completed
                </p>
              </div>
              <div className="text-3xl font-bold text-primary font-comic">
                {Math.round((completedIds.length / quizData.length) * 100)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizData.map((quiz) => {
            const isCompleted = completedIds.includes(quiz.id);
            return (
              <Card key={quiz.id} className={`hover-lift shadow-fun bg-card/80 backdrop-blur border-2 transition-all duration-300 ${isCompleted ? 'border-green-400' : 'border-primary/20 hover:border-primary/40'}`}>
                <CardHeader>
                  <CardTitle className="font-comic text-foreground flex items-center gap-2">
                    {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {quiz.title}
                  </CardTitle>
                  <CardDescription className="font-comic text-sm">
                    {quiz.question.length > 80 ? quiz.question.substring(0, 80) + "..." : quiz.question}
                  </CardDescription>
                  {isCompleted && (
                    <Badge variant="outline" className="text-green-600 border-green-600 w-fit">
                      Completed
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="fun" className="w-full" onClick={resetQuiz}>
                        <Play className="mr-2 h-4 w-4" />
                        {isCompleted ? 'Retake Quiz' : 'Take Quiz'}
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
                        <div>
                          <h4 className="font-semibold font-comic mb-4 text-primary">Scenario:</h4>
                          <p className="font-comic leading-relaxed bg-primary/10 p-4 rounded-lg">
                            {quiz.question}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold font-comic mb-3 text-primary">What would you do?</h4>
                          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={showFeedback}>
                            {quiz.options.map((option) => {
                              const isCorrect = option.value === quiz.bestAnswer;
                              const isSelected = selectedAnswer === option.value;
                              let optionClass = "hover:bg-primary/5";
                              if (showFeedback) {
                                if (isCorrect) optionClass = "bg-green-100 dark:bg-green-900/40 border-2 border-green-500";
                                else if (isSelected && !isCorrect) optionClass = "bg-orange-100 dark:bg-orange-900/40 border-2 border-orange-400";
                              }
                              return (
                                <div key={option.id} className={`flex items-start space-x-2 p-3 rounded-lg transition-colors ${optionClass}`}>
                                  <RadioGroupItem value={option.value} id={`${quiz.id}-${option.id}`} className="mt-1" />
                                  <Label htmlFor={`${quiz.id}-${option.id}`} className="font-comic cursor-pointer flex-1 leading-relaxed flex items-center gap-2">
                                    {option.text}
                                    {showFeedback && isCorrect && (
                                      <Star className="h-4 w-4 text-green-600 fill-green-600 shrink-0" />
                                    )}
                                  </Label>
                                </div>
                              );
                            })}
                          </RadioGroup>
                        </div>

                        {!showFeedback && (
                          <Button
                            onClick={() => handleSubmitAnswer(quiz.id)}
                            disabled={!selectedAnswer}
                            className="w-full"
                            variant="fun"
                          >
                            Get Feedback
                          </Button>
                        )}

                        {showFeedback && selectedAnswer && (
                          <div className="space-y-4">
                            {/* User's choice feedback */}
                            <div className={`p-4 rounded-lg ${selectedAnswer === quiz.bestAnswer ? 'bg-green-100 dark:bg-green-900/40 border border-green-400' : 'bg-orange-100 dark:bg-orange-900/40 border border-orange-400'}`}>
                              <h4 className="font-semibold font-comic mb-2 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4" />
                                {selectedAnswer === quiz.bestAnswer ? "✅ Great Choice!" : "Your Choice:"}
                              </h4>
                              <p className="text-sm font-comic leading-relaxed">
                                {quiz.feedback[selectedAnswer as keyof typeof quiz.feedback]}
                              </p>
                            </div>

                            {/* Show correct answer if user chose wrong */}
                            {selectedAnswer !== quiz.bestAnswer && (
                              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-400">
                                <h4 className="font-semibold font-comic mb-2 text-green-700 dark:text-green-300 flex items-center gap-2">
                                  <Star className="h-4 w-4 fill-green-600 text-green-600" />
                                  Best Approach:
                                </h4>
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

                            <Button onClick={resetQuiz} variant="outline" className="w-full">
                              Try Again
                            </Button>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ParentQuizzesPage;
