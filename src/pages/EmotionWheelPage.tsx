import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Emotion {
  name: string;
  emoji: string;
  color: string;
  explanation: string;
  situations: string[];
  tips: string[];
}

const emotions: Emotion[] = [
  {
    name: "Angry",
    emoji: "😡",
    color: "bg-red-500",
    explanation: "Anger is a strong feeling that happens when things don't go the way we want them to.",
    situations: [
      "When your sibling takes your toy without asking",
      "When someone breaks your favorite thing",
      "When you can't play outside because it's raining",
      "When parents say 'no' to something you really want"
    ],
    tips: [
      "Take 5 deep breaths",
      "Count to 10 slowly",
      "Tell an adult how you feel",
      "Go to a quiet place to calm down"
    ]
  },
  {
    name: "Sad",
    emoji: "😢",
    color: "bg-blue-500",
    explanation: "Sadness is what we feel when something disappointing or hurtful happens.",
    situations: [
      "When your pet is sick",
      "When you miss your friend who moved away",
      "When you don't get invited to a party",
      "When you lose something important to you"
    ],
    tips: [
      "Talk to someone you trust",
      "Draw or write about your feelings",
      "Give yourself a hug",
      "Remember that sad feelings will pass"
    ]
  },
  {
    name: "Frustrated",
    emoji: "😤",
    color: "bg-orange-500",
    explanation: "Frustration happens when we try hard but can't do something we want to do.",
    situations: [
      "When you can't solve a puzzle",
      "When you keep losing at a game",
      "When your crayon keeps breaking",
      "When you can't reach something high up"
    ],
    tips: [
      "Take a break and try again later",
      "Ask for help from someone",
      "Try a different way to do it",
      "Remember that practice makes better"
    ]
  },
  {
    name: "Worried",
    emoji: "😰",
    color: "bg-purple-500",
    explanation: "Worry is when we think about bad things that might happen, even if they probably won't.",
    situations: [
      "Before going to a new school",
      "When you think you might be in trouble",
      "During a thunderstorm",
      "When someone you love is late coming home"
    ],
    tips: [
      "Talk to an adult about your worries",
      "Think about good things that could happen instead",
      "Do something fun to distract yourself",
      "Practice your breathing exercises"
    ]
  },
  {
    name: "Jealous",
    emoji: "😒",
    color: "bg-green-500",
    explanation: "Jealousy is when we want something that someone else has and feel upset about it.",
    situations: [
      "When your friend gets a new toy you want",
      "When your sibling gets more attention",
      "When someone else wins a game you wanted to win",
      "When your friend plays with someone else"
    ],
    tips: [
      "Remember all the good things you have",
      "Be happy for your friend",
      "Talk about your feelings",
      "Focus on what makes you special"
    ]
  },
  {
    name: "Disappointed",
    emoji: "😞",
    color: "bg-gray-500",
    explanation: "Disappointment is when something we were looking forward to doesn't happen.",
    situations: [
      "When a fun trip gets cancelled",
      "When you don't get the toy you wanted for your birthday",
      "When your friend can't come over to play",
      "When it rains on the day you planned to go swimming"
    ],
    tips: [
      "It's okay to feel disappointed",
      "Think of something else fun you can do",
      "Talk to someone about how you feel",
      "Remember there will be other chances"
    ]
  },
  {
    name: "Scared",
    emoji: "😨",
    color: "bg-indigo-500",
    explanation: "Fear is what we feel when we think something dangerous or bad might happen.",
    situations: [
      "During a loud thunderstorm",
      "When watching a scary movie",
      "When you're alone in the dark",
      "Before getting a shot at the doctor"
    ],
    tips: [
      "Tell an adult you feel scared",
      "Think of something that makes you brave",
      "Hold a favorite toy or blanket",
      "Remember you are safe"
    ]
  },
  {
    name: "Confused",
    emoji: "😕",
    color: "bg-yellow-500",
    explanation: "Confusion happens when we don't understand something or don't know what to do.",
    situations: [
      "When you don't understand your homework",
      "When adults use big words you don't know",
      "When you can't find something you put down",
      "When people give you different instructions"
    ],
    tips: [
      "Ask questions when you don't understand",
      "It's okay not to know everything",
      "Ask for help from a teacher or parent",
      "Take your time to figure things out"
    ]
  }
];

const EmotionWheelPage = () => {
  const navigate = useNavigate();
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const spins = 5 + Math.random() * 5; // 5-10 spins
    const finalRotation = rotation + (spins * 360) + (Math.random() * 360);
    setRotation(finalRotation);
    
    setTimeout(() => {
      const emotionIndex = Math.floor((finalRotation % 360) / (360 / emotions.length));
      const selectedIndex = (emotions.length - 1 - emotionIndex + emotions.length) % emotions.length;
      setSelectedEmotion(emotions[selectedIndex]);
      setIsSpinning(false);
    }, 3000);
  };

  const resetWheel = () => {
    setSelectedEmotion(null);
    setRotation(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
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
              Emotion Wheel Adventure
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              Spin the wheel to learn about different emotions! 🎡
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Wheel Section */}
          <Card className="border-2 border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-comic text-primary">
                Spin the Emotion Wheel!
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col items-center">
                {/* Wheel */}
                <div className="relative w-80 h-80 mb-6">
                  {/* Pointer */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-primary"></div>
                  </div>
                  
                  {/* Wheel */}
                  <div
                    className="w-full h-full rounded-full border-4 border-primary shadow-2xl transition-transform duration-3000 ease-out"
                    style={{ 
                      transform: `rotate(${rotation}deg)`,
                      background: `conic-gradient(${emotions.map((emotion, index) => {
                        const start = (index / emotions.length) * 360;
                        const end = ((index + 1) / emotions.length) * 360;
                        return `${emotion.color.replace('bg-', '')} ${start}deg ${end}deg`;
                      }).join(', ')})`
                    }}
                  >
                    {emotions.map((emotion, index) => {
                      const angle = (index / emotions.length) * 360 + (360 / emotions.length / 2);
                      const radius = 120;
                      const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
                      const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
                      
                      return (
                        <div
                          key={emotion.name}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
                          style={{
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                            transform: `translate(-50%, -50%) rotate(${angle}deg)`
                          }}
                        >
                          <div className="text-2xl">{emotion.emoji}</div>
                          <div className="text-xs font-bold text-white transform rotate-180" style={{ transform: `rotate(${-angle}deg)` }}>
                            {emotion.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Spin Button */}
                <Button
                  onClick={spinWheel}
                  disabled={isSpinning}
                  className="bg-gradient-to-r from-primary to-primary-glow text-white px-8 py-3 text-lg font-bold hover:scale-105 transition-transform shadow-lg font-comic mb-4"
                >
                  {isSpinning ? "Spinning..." : "Spin the Wheel! 🎲"}
                </Button>

                <Button
                  onClick={resetWheel}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Result Section */}
          <Card className="border-2 border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-comic text-primary">
                Learn About This Emotion
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {selectedEmotion ? (
                <div className="space-y-6">
                  {/* Emotion Header */}
                  <div className="text-center">
                    <div className="text-6xl mb-2">{selectedEmotion.emoji}</div>
                    <h3 className="text-3xl font-bold text-primary font-comic mb-2">
                      {selectedEmotion.name}
                    </h3>
                    <p className="text-lg text-gray-700">
                      {selectedEmotion.explanation}
                    </p>
                  </div>

                  {/* Situations */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-bold text-lg mb-3 text-blue-700 flex items-center gap-2">
                      <span className="text-xl">🌟</span>
                      When might you feel this way?
                    </h4>
                    <ul className="space-y-2">
                      {selectedEmotion.situations.map((situation, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span className="text-gray-700">{situation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tips */}
                  <div className="bg-green-50 rounded-xl p-4">
                    <h4 className="font-bold text-lg mb-3 text-green-700 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      What can help you feel better?
                    </h4>
                    <ul className="space-y-2">
                      {selectedEmotion.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎡</div>
                  <p className="text-xl text-gray-500 font-comic">
                    Spin the wheel to discover an emotion and learn about it!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8 border-2 border-yellow-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-primary font-comic mb-4">
                🎯 How to Use the Emotion Wheel
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl mb-2">1️⃣</div>
                  <p><strong>Spin the wheel</strong> by clicking the button</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl mb-2">2️⃣</div>
                  <p><strong>Learn about</strong> the emotion it lands on</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl mb-2">3️⃣</div>
                  <p><strong>Practice</strong> the helpful tips when you feel this way</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmotionWheelPage;