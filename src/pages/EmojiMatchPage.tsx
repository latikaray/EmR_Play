import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Trophy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MatchTask {
  id: number;
  emotion: string;
  emoji: string;
  situation: string;
  options: string[];
  correctAnswer: string;
}

const matchTasks: MatchTask[] = [
  {
    id: 1,
    emotion: "Happy",
    emoji: "😊",
    situation: "When you get a surprise gift from a friend",
    options: ["😢", "😊", "😡", "😴"],
    correctAnswer: "😊"
  },
  {
    id: 2,
    emotion: "Sad",
    emoji: "😢",
    situation: "When your favorite toy breaks",
    options: ["😢", "😂", "😡", "😎"],
    correctAnswer: "😢"
  },
  {
    id: 3,
    emotion: "Angry",
    emoji: "😡",
    situation: "When someone takes your turn without asking",
    options: ["😊", "😢", "😡", "😴"],
    correctAnswer: "😡"
  },
  {
    id: 4,
    emotion: "Excited",
    emoji: "🤩",
    situation: "When you're going to your favorite playground",
    options: ["😴", "🤩", "😢", "😡"],
    correctAnswer: "🤩"
  },
  {
    id: 5,
    emotion: "Confused",
    emoji: "😕",
    situation: "When you don't understand your homework",
    options: ["😊", "😡", "😕", "🤩"],
    correctAnswer: "😕"
  },
  {
    id: 6,
    emotion: "Surprised",
    emoji: "😲",
    situation: "When you find a butterfly in your garden",
    options: ["😲", "😴", "😢", "😡"],
    correctAnswer: "😲"
  }
];

const EmojiMatchPage = () => {
  const navigate = useNavigate();
  const [currentTask, setCurrentTask] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleEmojiSelect = (emoji: string) => {
    if (showResult) return;
    
    setSelectedEmoji(emoji);
    setShowResult(true);
    setAttempts(attempts + 1);

    if (emoji === matchTasks[currentTask].correctAnswer) {
      setScore(score + 1);
      setTimeout(() => {
        if (currentTask < matchTasks.length - 1) {
          setCurrentTask(currentTask + 1);
          setSelectedEmoji(null);
          setShowResult(false);
        } else {
          setGameComplete(true);
        }
      }, 2000);
    } else {
      setTimeout(() => {
        setSelectedEmoji(null);
        setShowResult(false);
      }, 2000);
    }
  };

  const resetGame = () => {
    setCurrentTask(0);
    setScore(0);
    setSelectedEmoji(null);
    setShowResult(false);
    setGameComplete(false);
    setAttempts(0);
  };

  const currentTaskData = matchTasks[currentTask];

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-green-50 to-blue-100 p-4 flex items-center justify-center">
        <Card className="max-w-lg mx-auto border-2 border-primary/20 shadow-2xl">
          <CardContent className="p-8 text-center">
            <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-3xl font-bold text-primary font-comic mb-4">
              Congratulations! 🎉
            </h2>
            <p className="text-xl mb-4">
              You completed the Emoji Match game!
            </p>
            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-xl mb-6">
              <p className="text-2xl font-bold text-primary">
                Final Score: {score}/{matchTasks.length}
              </p>
              <p className="text-lg text-muted-foreground">
                Total Attempts: {attempts}
              </p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-primary to-primary-glow text-white font-bold py-3 hover:scale-105 transition-transform"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Play Again
              </Button>
              <Button
                onClick={() => navigate('/activities')}
                variant="outline"
                className="w-full"
              >
                Back to Activities
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-green-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/activities')}
            className="text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-primary font-comic">
              Emoji Match Game
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              Match the emoji to the feeling! 🎯
            </p>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-6 border-2 border-primary/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" />
                <span className="text-lg font-bold">
                  Question {currentTask + 1} of {matchTasks.length}
                </span>
              </div>
              <div className="text-lg font-bold text-primary">
                Score: {score}/{matchTasks.length}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
              <div
                className="bg-gradient-to-r from-primary to-primary-glow h-3 rounded-full transition-all duration-500"
                style={{ width: `${((currentTask + 1) / matchTasks.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Game Content */}
        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary-glow/10">
            <CardTitle className="text-center text-2xl font-comic text-primary">
              How would you feel in this situation?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {/* Situation */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 mb-6">
                <p className="text-xl md:text-2xl font-bold text-primary mb-2 font-comic">
                  Situation:
                </p>
                <p className="text-lg md:text-xl text-gray-700">
                  {currentTaskData.situation}
                </p>
              </div>
            </div>

            {/* Emoji Options */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {currentTaskData.options.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiSelect(emoji)}
                  disabled={showResult}
                  className={`
                    p-6 rounded-2xl border-3 transition-all transform hover:scale-110 
                    ${selectedEmoji === emoji 
                      ? emoji === currentTaskData.correctAnswer
                        ? 'border-green-500 bg-green-100 scale-110'
                        : 'border-red-500 bg-red-100 scale-110'
                      : 'border-gray-300 bg-white hover:border-primary hover:shadow-lg'
                    }
                    ${showResult && emoji === currentTaskData.correctAnswer && selectedEmoji !== emoji
                      ? 'border-green-500 bg-green-100 animate-pulse'
                      : ''
                    }
                  `}
                >
                  <div className="text-4xl md:text-6xl">{emoji}</div>
                </button>
              ))}
            </div>

            {/* Result Message */}
            {showResult && (
              <div className={`text-center p-4 rounded-xl transition-all ${
                selectedEmoji === currentTaskData.correctAnswer
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedEmoji === currentTaskData.correctAnswer ? (
                  <div>
                    <p className="text-xl font-bold mb-2">🎉 Correct!</p>
                    <p className="text-lg">
                      Yes! {currentTaskData.emoji} shows feeling {currentTaskData.emotion.toLowerCase()}!
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xl font-bold mb-2">Try again!</p>
                    <p className="text-lg">
                      The correct answer is {currentTaskData.correctAnswer} for feeling {currentTaskData.emotion.toLowerCase()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6 border-2 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💡</span>
              <h3 className="text-lg font-bold text-primary font-comic">How to Play:</h3>
            </div>
            <p className="text-gray-700">
              Read the situation and click on the emoji that best matches how you would feel. 
              Take your time to think about it! 🤔
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmojiMatchPage;