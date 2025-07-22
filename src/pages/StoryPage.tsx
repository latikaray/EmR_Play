import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ArrowRight, 
  Heart, 
  Star, 
  BookOpen, 
  Sparkles,
  CheckCircle,
  RotateCcw
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useActivityProgress } from "@/hooks/useActivityProgress";

interface Story {
  id: string;
  title: string;
  description: string;
  moral: string;
  emoji: string;
  difficulty: "Easy" | "Medium";
  duration: string;
  empathySkills: string[];
  parts: StoryPart[];
}

interface StoryPart {
  id: number;
  text: string;
  illustration: string;
  emotionCheck?: {
    question: string;
    character: string;
    emotions: string[];
    correctAnswer: string;
    explanation: string;
  };
}

interface EmotionCheckProps {
  emotionCheck: StoryPart['emotionCheck'];
  onComplete: (isCorrect: boolean) => void;
}

const EmotionCheck = ({ emotionCheck, onComplete }: EmotionCheckProps) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!emotionCheck) return null;

  const handleSubmit = () => {
    const correct = selectedEmotion === emotionCheck.correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);
    onComplete(correct);
  };

  const resetCheck = () => {
    setSelectedEmotion("");
    setIsAnswered(false);
    setIsCorrect(false);
  };

  return (
    <Card className="mt-4 bg-gradient-activity text-white shadow-activity">
      <CardHeader>
        <CardTitle className="text-lg font-comic flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Emotion Check! 💭
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-comic text-lg">
          {emotionCheck.question}
        </p>
        
        {!isAnswered ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              {emotionCheck.emotions.map((emotion) => (
                <Button
                  key={emotion}
                  variant={selectedEmotion === emotion ? "secondary" : "outline"}
                  className={`font-comic ${
                    selectedEmotion === emotion 
                      ? "bg-white text-accent scale-105" 
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                  onClick={() => setSelectedEmotion(emotion)}
                >
                  {emotion}
                </Button>
              ))}
            </div>
            
            <Button 
              onClick={handleSubmit}
              disabled={!selectedEmotion}
              variant="secondary"
              className="w-full bg-white text-accent font-comic"
            >
              Check My Answer! ✨
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <div className={`p-4 rounded-lg ${isCorrect ? "bg-success/20" : "bg-warning/20"}`}>
              <p className="font-comic text-lg flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Great job! You're right! 🌟
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5" />
                    Good try! Let's learn together! 💫
                  </>
                )}
              </p>
              <p className="font-comic mt-2 opacity-90">
                {emotionCheck.explanation}
              </p>
            </div>
            
            <Button 
              onClick={resetCheck}
              variant="outline"
              size="sm"
              className="bg-white/20 text-white hover:bg-white/30 font-comic"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const StoryPage = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentPart, setCurrentPart] = useState(0);
  const [completedChecks, setCompletedChecks] = useState<number[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const navigate = useNavigate();
  const { recordActivityCompletion } = useActivityProgress();

  const stories: Story[] = [
    {
      id: "lion-mouse",
      title: "The Lion and the Mouse",
      description: "A tiny mouse shows that even the smallest friend can make the biggest difference",
      moral: "Kindness comes back to help us, no matter how small the gesture",
      emoji: "🦁",
      difficulty: "Easy",
      duration: "8-10 min",
      empathySkills: ["Kindness", "Gratitude", "Helping Others"],
      parts: [
        {
          id: 1,
          text: "Deep in the jungle lived a mighty lion who loved to nap under his favorite tree. One sunny afternoon, while the lion slept peacefully, a tiny mouse was playing nearby. The mouse was having so much fun that he didn't notice where he was running!",
          illustration: "🌳🦁😴🐭"
        },
        {
          id: 2,
          text: "WHOOSH! The little mouse accidentally ran right over the lion's nose! The lion woke up with a ROAR and caught the trembling mouse in his huge paw. 'How dare you wake me up!' growled the lion. 'I should eat you right now!'",
          illustration: "😡🦁🐭😰",
          emotionCheck: {
            question: "How do you think the little mouse feels right now?",
            character: "the mouse",
            emotions: ["Scared", "Happy", "Angry", "Excited"],
            correctAnswer: "Scared",
            explanation: "The mouse feels scared because he's caught by a big, angry lion! When we're in trouble, it's normal to feel frightened. Understanding fear helps us be kind to others who are scared."
          }
        },
        {
          id: 3,
          text: "'Please, Mr. Lion!' squeaked the mouse. 'I'm so sorry! I didn't mean to wake you. If you let me go, I promise I'll help you someday!' The lion laughed loudly. 'You? Help ME? You're so tiny!' But the mouse looked so sincere that the lion's heart softened.",
          illustration: "🐭🙏🦁😊"
        },
        {
          id: 4,
          text: "'Alright, little one,' said the lion with a gentle smile. 'You seem like a good mouse. I'll let you go.' The mouse was so grateful! 'Thank you, thank you!' he squeaked. 'I'll never forget your kindness!' And off he scurried to tell his family about the kind lion.",
          illustration: "🦁💝🐭✨",
          emotionCheck: {
            question: "How does the lion feel after being kind to the mouse?",
            character: "the lion",
            emotions: ["Angry", "Happy", "Sad", "Confused"],
            correctAnswer: "Happy",
            explanation: "The lion feels happy because being kind to others makes us feel good inside! When we help someone, even in small ways, it fills our hearts with joy."
          }
        },
        {
          id: 5,
          text: "A few weeks later, the lion was hunting when he stepped into a trap! Strong ropes caught him and he couldn't get free. He roared and struggled, but the ropes were too tight. Just when he felt hopeless, he heard a familiar tiny voice: 'Don't worry, Mr. Lion! I'm here to help!'",
          illustration: "🦁🪢😰🐭💪"
        },
        {
          id: 6,
          text: "It was the little mouse! With his sharp teeth, he quickly gnawed through the ropes. Nibble, nibble, nibble! Soon the lion was free! 'You saved me!' said the lion in amazement. 'You were right - even someone small can be a great friend!'",
          illustration: "🐭✂️🪢🦁🤗",
          emotionCheck: {
            question: "How do both the lion and mouse feel at the end?",
            character: "both friends",
            emotions: ["Grateful", "Angry", "Bored", "Confused"],
            correctAnswer: "Grateful",
            explanation: "Both friends feel grateful! The lion is thankful the mouse saved him, and the mouse is happy he could help his friend. True friendship means caring for each other!"
          }
        }
      ]
    },
    {
      id: "ant-grasshopper",
      title: "The Ant and the Grasshopper",
      description: "Two friends learn about different ways of living and the importance of understanding each other",
      moral: "We can learn from each other's different approaches to life",
      emoji: "🐜",
      difficulty: "Easy",
      duration: "10-12 min",
      empathySkills: ["Understanding Differences", "Planning", "Friendship"],
      parts: [
        {
          id: 1,
          text: "In a beautiful meadow lived two neighbors: Ana the Ant and Gus the Grasshopper. Ana loved to work hard, collecting food and building her home. Gus loved to sing, dance, and enjoy each sunny day. They were very different, but they lived right next to each other!",
          illustration: "🌻🐜🏠🐛🎵"
        },
        {
          id: 2,
          text: "All summer long, Ana worked from sunrise to sunset. She gathered grain, stored food, and made her home cozy for winter. Meanwhile, Gus spent his days making beautiful music and dancing in the warm sunshine. 'Why work so much?' Gus would ask. 'Come dance with me!'",
          illustration: "☀️🐜💼🐛🕺",
          emotionCheck: {
            question: "How do you think Ana feels when Gus asks her to dance instead of work?",
            character: "Ana the Ant",
            emotions: ["Worried", "Angry", "Happy", "Sleepy"],
            correctAnswer: "Worried",
            explanation: "Ana feels worried because she knows winter is coming and they'll need food! Sometimes when we're concerned about the future, it's hard to relax and play."
          }
        },
        {
          id: 3,
          text: "'I need to prepare for winter,' Ana would say kindly. 'There won't be any food then!' Gus would laugh cheerfully. 'Winter is so far away! Look how beautiful today is!' And he'd play another happy song. Ana would shake her head but smile - she loved hearing Gus's music while she worked.",
          illustration: "🐜😊🐛🎼❄️"
        },
        {
          id: 4,
          text: "When winter arrived, it was cold and snowy. Ana was warm and cozy in her home, with plenty of food stored away. But poor Gus was shivering and hungry. His music couldn't keep him warm or feed him. He sadly went to Ana's door and knocked softly.",
          illustration: "❄️🏠🐜🐛😢🚪",
          emotionCheck: {
            question: "How does Gus feel when he realizes he needs help?",
            character: "Gus the Grasshopper",
            emotions: ["Proud", "Embarrassed", "Excited", "Angry"],
            correctAnswer: "Embarrassed",
            explanation: "Gus feels embarrassed because he didn't listen to Ana's advice. It's hard to ask for help when we realize we made a mistake, but good friends understand."
          }
        },
        {
          id: 5,
          text: "'Ana,' said Gus quietly, 'I'm cold and hungry. I know I should have listened to you about preparing for winter. Could you please help me?' Ana's heart felt sad seeing her friend in trouble. 'Of course!' she said warmly. 'Come in! You're my friend!'",
          illustration: "🐜🤗🐛🏠💝"
        },
        {
          id: 6,
          text: "Ana shared her food and gave Gus a warm place to stay. In return, Gus shared his gift of music, filling the house with beautiful songs that made the long winter days brighter. 'We both have something special to offer,' Ana realized. 'Your music makes work more fun, and my planning keeps us safe!'",
          illustration: "🎵🏠🐜🐛✨🍯",
          emotionCheck: {
            question: "How do both friends feel when they help each other?",
            character: "both Ana and Gus",
            emotions: ["Happy", "Sad", "Angry", "Bored"],
            correctAnswer: "Happy",
            explanation: "Both friends feel happy because they learned they each have special gifts! Ana's planning and Gus's music both make life better when shared together."
          }
        }
      ]
    },
    {
      id: "tortoise-hare",
      title: "The Tortoise and the Hare",
      description: "A race teaches us about patience, determination, and believing in ourselves",
      moral: "Slow and steady progress, with determination, can achieve great things",
      emoji: "🐢",
      difficulty: "Medium",
      duration: "12-15 min",
      empathySkills: ["Perseverance", "Self-Confidence", "Respect for Others"],
      parts: [
        {
          id: 1,
          text: "In a peaceful forest, there lived Speedy the Hare and Shelly the Tortoise. Speedy was the fastest runner in the whole forest and loved to show off his speed. Shelly was very slow but never gave up on anything she tried. All the forest animals knew them both well.",
          illustration: "🌲🐰💨🐢😊"
        },
        {
          id: 2,
          text: "One day, Speedy saw Shelly slowly making her way to the market. 'Shelly!' he called out, hopping circles around her. 'You're so slow! By the time you get to the market, it'll be closed!' Some animals laughed, but Shelly just smiled patiently.",
          illustration: "🐰😏🐢😔🏪",
          emotionCheck: {
            question: "How does Shelly feel when Speedy makes fun of her speed?",
            character: "Shelly the Tortoise",
            emotions: ["Hurt", "Happy", "Angry", "Excited"],
            correctAnswer: "Hurt",
            explanation: "Shelly feels hurt because nobody likes to be made fun of. When someone teases us about things we can't help, it makes us feel sad inside."
          }
        },
        {
          id: 3,
          text: "'You're right, Speedy,' said Shelly calmly. 'You are much faster than me. But I have an idea - would you like to race with me to the big oak tree?' Speedy laughed. 'A race? With you? That's silly! I could run there and back before you take ten steps!' But Shelly looked determined.",
          illustration: "🐢💪🐰😂🌳"
        },
        {
          id: 4,
          text: "'I accept your challenge!' said Speedy confidently. 'This will be the easiest race ever!' All the forest animals gathered to watch. The wise old owl would be the judge. Shelly felt nervous but took a deep breath. 'I may be slow,' she thought, 'but I won't give up!'",
          illustration: "🦉👥🐰🐢🏁",
          emotionCheck: {
            question: "How does Shelly feel before the race starts?",
            character: "Shelly",
            emotions: ["Nervous", "Angry", "Bored", "Sleepy"],
            correctAnswer: "Nervous",
            explanation: "Shelly feels nervous because racing against someone much faster is scary! But she's also brave for trying. It's okay to feel nervous when we challenge ourselves."
          }
        },
        {
          id: 5,
          text: "'Ready, set, GO!' hooted the owl. Speedy zoomed ahead so fast he was just a blur! Shelly started her slow, steady pace: step... step... step. Speedy was soon so far ahead that he couldn't even see Shelly anymore. 'This is too easy!' he thought.",
          illustration: "🏃💨🐰🐢👣"
        },
        {
          id: 6,
          text: "Speedy was almost halfway to the oak tree when he decided to take a break. 'I'm so far ahead, I could take a nap and still win!' He found a comfortable spot under a shady tree and closed his eyes. Meanwhile, Shelly kept going: step... step... step... never stopping.",
          illustration: "😴🐰🌳🐢🚶‍♀️"
        },
        {
          id: 7,
          text: "While Speedy slept, Shelly slowly but steadily passed him! Step... step... step. Her legs were tired, but her heart was strong. 'I can do this,' she whispered to herself. 'One step at a time.' She kept thinking about reaching that oak tree.",
          illustration: "🐢💪😴🐰🌳",
          emotionCheck: {
            question: "How does Shelly feel when she passes the sleeping Speedy?",
            character: "Shelly",
            emotions: ["Proud", "Mean", "Sad", "Confused"],
            correctAnswer: "Proud",
            explanation: "Shelly feels proud because she didn't give up! She kept trying her best even when things seemed impossible. Feeling proud of our effort is wonderful!"
          }
        },
        {
          id: 8,
          text: "When Speedy woke up, the sun was setting! 'Oh no!' he gasped. 'I slept too long!' He raced toward the finish line as fast as he could. But when he got there, he saw Shelly sitting peacefully under the oak tree, surrounded by cheering animals. She had won!",
          illustration: "🌅🐰😱🐢🏆👥"
        },
        {
          id: 9,
          text: "Speedy felt embarrassed and sad. He walked slowly to Shelly, expecting her to tease him like he had teased her. But Shelly smiled kindly. 'Thank you for the race, Speedy! It helped me believe I could do something difficult. You're still the fastest runner - I just didn't give up!'",
          illustration: "🐰😔🐢😊🤝💫",
          emotionCheck: {
            question: "How does Speedy feel when Shelly is kind to him after losing?",
            character: "Speedy",
            emotions: ["Grateful", "Angry", "Bored", "Hungry"],
            correctAnswer: "Grateful",
            explanation: "Speedy feels grateful because Shelly was kind even after he was mean to her. This teaches him that true friends forgive each other and help each other learn."
          }
        }
      ]
    }
  ];

  const handleEmotionCheckComplete = (isCorrect: boolean) => {
    if (isCorrect && !completedChecks.includes(currentPart)) {
      setCompletedChecks([...completedChecks, currentPart]);
    }
  };

  const nextPart = () => {
    if (selectedStory && currentPart < selectedStory.parts.length - 1) {
      setCurrentPart(currentPart + 1);
    }
  };

  const prevPart = () => {
    if (currentPart > 0) {
      setCurrentPart(currentPart - 1);
    }
  };

  const selectStory = (story: Story) => {
    setSelectedStory(story);
    setCurrentPart(0);
    setCompletedChecks([]);
  };

  const backToStories = () => {
    setSelectedStory(null);
    setCurrentPart(0);
    setCompletedChecks([]);
  };

  const completeStory = async () => {
    if (!selectedStory || isCompleting) return;
    
    setIsCompleting(true);
    try {
      const completionNotes = `Completed story: ${selectedStory.title}. Learned about: ${selectedStory.empathySkills.join(", ")}. Moral: ${selectedStory.moral}`;
      
      await recordActivityCompletion(
        selectedStory.title,
        "story",
        "Empathy",
        completionNotes
      );
      
      // Navigate back to activities page after a brief delay
      setTimeout(() => {
        navigate("/activities");
      }, 2000);
      
    } catch (error) {
      console.error('Error completing story:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  if (!selectedStory) {
    return (
      <div className="min-h-screen bg-gradient-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 py-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-accent animate-float" />
              <h1 className="text-3xl md:text-5xl font-bold text-foreground font-comic">
                Story Time Adventures
              </h1>
              <Sparkles className="h-6 w-6 text-fun-yellow animate-float" style={{ animationDelay: '1s' }} />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground font-comic">
              Choose a magical story to explore emotions and build empathy! 📚✨
            </p>
          </div>

          {/* Back to Activities */}
          <div className="mb-6">
            <Button variant="outline" asChild className="font-comic">
              <Link to="/activities">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Activities
              </Link>
            </Button>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, index) => (
              <Card key={story.id} className="hover-lift shadow-activity bg-card/80 backdrop-blur border-2 border-transparent hover:border-primary/20 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-fun animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                    {story.emoji}
                  </div>
                  <CardTitle className="text-xl font-comic text-foreground">
                    {story.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground font-comic">
                    {story.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Badge className="bg-success/20 text-success font-comic">
                      {story.difficulty}
                    </Badge>
                    <Badge variant="outline" className="font-comic">
                      {story.duration}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-bold text-foreground font-comic">Builds:</p>
                    <div className="flex flex-wrap gap-1">
                      {story.empathySkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs font-comic">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-sm font-comic text-muted-foreground">
                      <span className="font-bold text-foreground">Moral:</span> {story.moral}
                    </p>
                  </div>

                  <Button 
                    variant="activity" 
                    className="w-full group" 
                    onClick={() => selectStory(story)}
                  >
                    Start Reading
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentStoryPart = selectedStory.parts[currentPart];

  return (
    <div className="min-h-screen bg-gradient-background p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={backToStories} className="font-comic">
            <ArrowLeft className="h-4 w-4 mr-2" />
            All Stories
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground font-comic flex items-center gap-2">
              {selectedStory.emoji} {selectedStory.title}
            </h1>
            <p className="text-sm text-muted-foreground font-comic">
              Part {currentPart + 1} of {selectedStory.parts.length}
            </p>
          </div>

          <div className="text-sm text-muted-foreground font-comic">
            {Math.round(((currentPart + 1) / selectedStory.parts.length) * 100)}%
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-gradient-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentPart + 1) / selectedStory.parts.length) * 100}%` }}
          />
        </div>

        {/* Story Content */}
        <Card className="shadow-fun bg-card/90 backdrop-blur border-2 border-primary/20">
          <CardContent className="p-6 md:p-8">
            {/* Illustration */}
            <div className="text-center mb-6">
              <div className="text-4xl md:text-6xl mb-4 animate-float">
                {currentStoryPart.illustration}
              </div>
            </div>

            {/* Story Text */}
            <div className="prose prose-lg max-w-none">
              <p className="text-lg md:text-xl leading-relaxed text-foreground font-comic text-center">
                {currentStoryPart.text}
              </p>
            </div>

            {/* Emotion Check */}
            {currentStoryPart.emotionCheck && (
              <EmotionCheck 
                emotionCheck={currentStoryPart.emotionCheck}
                onComplete={handleEmotionCheckComplete}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={prevPart}
            disabled={currentPart === 0}
            className="font-comic"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {selectedStory.parts.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= currentPart 
                    ? "bg-primary" 
                    : "bg-muted"
                } ${
                  completedChecks.includes(index) 
                    ? "ring-2 ring-success" 
                    : ""
                }`}
              />
            ))}
          </div>

          {currentPart < selectedStory.parts.length - 1 ? (
            <Button 
              variant="default" 
              onClick={nextPart}
              className="font-comic"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              variant="fun" 
              onClick={completeStory}
              disabled={isCompleting}
              className="font-comic"
            >
              <Star className="h-4 w-4 mr-2" />
              {isCompleting ? "Saving Progress..." : "Complete Story! ✨"}
            </Button>
          )}
        </div>

        {/* Story Complete Message */}
        {currentPart === selectedStory.parts.length - 1 && (
          <Card className="bg-gradient-fun text-white shadow-fun animate-bounce-in">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold font-comic mb-2">
                Wonderful Reading!
              </h3>
              <p className="text-lg opacity-90 font-comic mb-4">
                You've completed "{selectedStory.title}" and learned about {selectedStory.empathySkills.join(", ")}!
              </p>
              <div className="bg-white/20 p-3 rounded-lg">
                <p className="font-comic">
                  <span className="font-bold">Remember:</span> {selectedStory.moral}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StoryPage;