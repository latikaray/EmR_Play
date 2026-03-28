import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, RotateCcw, Trophy, XCircle, CheckCircle, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MazeCell {
  x: number;
  y: number;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
  isPath: boolean;
  isBlocked: boolean;
  blockedBy?: string; // scenario id that blocked this
  isStart: boolean;
  isEnd: boolean;
  scenarioId?: string;
}

interface Scenario {
  id: string;
  situation: string;
  choices: { text: string; isGood: boolean; explanation: string; undoes?: string }[];
  resolved: boolean;
  chosenIndex?: number;
}

const scenarios: Scenario[] = [
  {
    id: "peer-pressure",
    situation: "Your friends are pressuring you to skip class and hang out at the mall. What do you do?",
    choices: [
      { text: "Skip class — it's just one day, right?", isGood: false, explanation: "Skipping class sets a bad pattern and you miss important learning." },
      { text: "Say no and go to class, suggest meeting after school", isGood: true, explanation: "Standing your ground shows maturity. Real friends respect boundaries." },
      { text: "Pretend to be sick so you don't have to choose", isGood: false, explanation: "Avoiding the situation doesn't solve anything and adds dishonesty." },
    ],
    resolved: false,
  },
  {
    id: "cyberbullying",
    situation: "You see a classmate being bullied in the group chat. Everyone is laughing. What do you do?",
    choices: [
      { text: "Join in — you don't want to be the next target", isGood: false, explanation: "Joining bullying causes real harm. You become part of the problem." },
      { text: "Stand up for the person and tell a trusted adult", isGood: true, explanation: "Courage to stand up makes a huge difference. You could save someone's day.", undoes: "peer-pressure" },
      { text: "Ignore it and close the chat", isGood: false, explanation: "Silence can feel like agreement. Bystanders have power to change things." },
    ],
    resolved: false,
  },
  {
    id: "exam-cheating",
    situation: "You didn't study for the big test. A friend offers to let you copy their answers. What do you do?",
    choices: [
      { text: "Copy the answers — you can't afford a bad grade", isGood: false, explanation: "Cheating risks expulsion and you learn nothing. The grade isn't real." },
      { text: "Decline and do your best honestly, study harder next time", isGood: true, explanation: "Integrity matters more than one grade. You'll build real knowledge.", undoes: "cyberbullying" },
    ],
    resolved: false,
  },
  {
    id: "social-media",
    situation: "Someone posts an embarrassing photo of you online. You feel humiliated. What do you do?",
    choices: [
      { text: "Post something embarrassing about them for revenge", isGood: false, explanation: "Revenge escalates conflict and hurts everyone involved." },
      { text: "Talk to them privately and ask them to take it down", isGood: true, explanation: "Direct communication is mature. If they refuse, involve a trusted adult." },
      { text: "Create a fake account to bully them anonymously", isGood: false, explanation: "Anonymous bullying is still bullying. It reflects poorly on your character." },
    ],
    resolved: false,
  },
  {
    id: "friendship-conflict",
    situation: "Your best friend is spreading rumors about you because they're jealous of your new friendship. What do you do?",
    choices: [
      { text: "Spread rumors back to get even", isGood: false, explanation: "Fighting fire with fire only burns both sides." },
      { text: "Have an honest conversation about how you feel", isGood: true, explanation: "Open communication can heal friendships. Express feelings, not accusations.", undoes: "social-media" },
      { text: "Ghost them and never speak again", isGood: false, explanation: "Cutting people off without explanation prevents growth for both." },
    ],
    resolved: false,
  },
  {
    id: "substance-pressure",
    situation: "At a party, someone offers you a vape saying 'everyone does it.' What do you do?",
    choices: [
      { text: "Try it — just once won't hurt", isGood: false, explanation: "Substances are addictive. 'Just once' is how addiction starts." },
      { text: "Confidently say 'No thanks, I'm good' and walk away", isGood: true, explanation: "Saying no confidently shows real strength. Your health matters most.", undoes: "exam-cheating" },
    ],
    resolved: false,
  },
];

// 8x6 maze grid
const ROWS = 6;
const COLS = 8;

const generateMaze = (): MazeCell[][] => {
  const grid: MazeCell[][] = [];
  
  for (let y = 0; y < ROWS; y++) {
    const row: MazeCell[] = [];
    for (let x = 0; x < COLS; x++) {
      row.push({
        x, y,
        walls: { top: true, right: true, bottom: true, left: true },
        isPath: false,
        isBlocked: false,
        isStart: x === 0 && y === 0,
        isEnd: x === COLS - 1 && y === ROWS - 1,
      });
    }
    grid.push(row);
  }

  // Carve a solvable path using DFS
  const visited = new Set<string>();
  const stack: [number, number][] = [[0, 0]];
  visited.add("0,0");

  while (stack.length > 0) {
    const [cx, cy] = stack[stack.length - 1];
    const neighbors: [number, number, string, string][] = [];

    const dirs: [number, number, string, string][] = [
      [0, -1, "top", "bottom"],
      [1, 0, "right", "left"],
      [0, 1, "bottom", "top"],
      [-1, 0, "left", "right"],
    ];

    for (const [dx, dy, wall, opposite] of dirs) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS && !visited.has(`${nx},${ny}`)) {
        neighbors.push([nx, ny, wall, opposite]);
      }
    }

    if (neighbors.length === 0) {
      stack.pop();
    } else {
      const [nx, ny, wall, opposite] = neighbors[Math.floor(Math.random() * neighbors.length)];
      grid[cy][cx].walls[wall as keyof typeof grid[0][0]["walls"]] = false;
      grid[ny][nx].walls[opposite as keyof typeof grid[0][0]["walls"]] = false;
      visited.add(`${nx},${ny}`);
      stack.push([nx, ny]);
    }
  }

  // Place scenarios at specific cells along the maze
  const scenarioCells: [number, number][] = [
    [2, 1], [4, 2], [6, 1], [1, 3], [3, 4], [5, 4]
  ];
  
  scenarioCells.forEach(([sx, sy], i) => {
    if (i < scenarios.length) {
      grid[sy][sx].scenarioId = scenarios[i].id;
    }
  });

  return grid;
};

const ClassroomMazePage = () => {
  const { user } = useAuth();
  const [maze, setMaze] = useState<MazeCell[][]>(() => generateMaze());
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [scenarioStates, setScenarioStates] = useState<Record<string, { resolved: boolean; chosenGood: boolean }>>({});
  const [blockedPaths, setBlockedPaths] = useState<Record<string, boolean>>({});
  const [gameComplete, setGameComplete] = useState(false);
  const [goodChoices, setGoodChoices] = useState(0);
  const [totalChoices, setTotalChoices] = useState(0);
  const [choiceResult, setChoiceResult] = useState<{ isGood: boolean; explanation: string } | null>(null);
  const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set(["0,0"]));
  const [gameLost, setGameLost] = useState(false);

  // BFS to check if a path exists from player to exit
  const hasPathToExit = useCallback((fromX: number, fromY: number, blocked: Record<string, boolean>, mazeGrid: MazeCell[][]): boolean => {
    if (fromX === COLS - 1 && fromY === ROWS - 1) return true;
    const visited = new Set<string>();
    const queue: [number, number][] = [[fromX, fromY]];
    visited.add(`${fromX},${fromY}`);

    while (queue.length > 0) {
      const [cx, cy] = queue.shift()!;
      const cell = mazeGrid[cy][cx];
      const dirs: [number, number, keyof typeof cell.walls][] = [
        [0, -1, "top"], [1, 0, "right"], [0, 1, "bottom"], [-1, 0, "left"],
      ];
      for (const [dx, dy, wall] of dirs) {
        const nx = cx + dx;
        const ny = cy + dy;
        const key = `${nx},${ny}`;
        if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
        if (visited.has(key) || blocked[key] || cell.walls[wall]) continue;
        if (nx === COLS - 1 && ny === ROWS - 1) return true;
        visited.add(key);
        queue.push([nx, ny]);
      }
    }
    return false;
  }, []);

  const canMove = (dx: number, dy: number): boolean => {
    const nx = playerPos.x + dx;
    const ny = playerPos.y + dy;
    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return false;
    
    const current = maze[playerPos.y][playerPos.x];
    const target = maze[ny][nx];
    
    // Check walls
    if (dx === 1 && current.walls.right) return false;
    if (dx === -1 && current.walls.left) return false;
    if (dy === 1 && current.walls.bottom) return false;
    if (dy === -1 && current.walls.top) return false;
    
    // Check if target is blocked
    if (blockedPaths[`${nx},${ny}`]) return false;
    
    return true;
  };

  const move = useCallback((dx: number, dy: number) => {
    if (activeScenario || gameComplete || choiceResult) return;
    if (!canMove(dx, dy)) return;

    const nx = playerPos.x + dx;
    const ny = playerPos.y + dy;
    
    setPlayerPos({ x: nx, y: ny });
    setVisitedCells(prev => new Set(prev).add(`${nx},${ny}`));

    // Check for scenario
    const cell = maze[ny][nx];
    if (cell.scenarioId && !scenarioStates[cell.scenarioId]?.resolved) {
      const scenario = scenarios.find(s => s.id === cell.scenarioId);
      if (scenario) {
        setActiveScenario({ ...scenario });
      }
    }

    // Check win
    if (nx === COLS - 1 && ny === ROWS - 1) {
      setGameComplete(true);
      saveCompletion();
    }
  }, [playerPos, activeScenario, gameComplete, maze, scenarioStates, blockedPaths, choiceResult]);

  const handleChoice = (choiceIndex: number) => {
    if (!activeScenario) return;
    
    const choice = activeScenario.choices[choiceIndex];
    setTotalChoices(prev => prev + 1);

    const newScenarioStates = { ...scenarioStates };
    newScenarioStates[activeScenario.id] = { resolved: true, chosenGood: choice.isGood };
    
    const newBlocked = { ...blockedPaths };

    if (choice.isGood) {
      setGoodChoices(prev => prev + 1);
      // If this choice undoes a previous wrong choice, unblock that path
      if (choice.undoes && newScenarioStates[choice.undoes] && !newScenarioStates[choice.undoes].chosenGood) {
        // Find the cell that was blocked by the undone scenario and unblock it
        for (let y = 0; y < ROWS; y++) {
          for (let x = 0; x < COLS; x++) {
            if (maze[y][x].scenarioId === choice.undoes) {
              // Unblock adjacent cells that were blocked
              const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
              for (const [ddx, ddy] of dirs) {
                const bx = x + ddx;
                const by = y + ddy;
                if (bx >= 0 && bx < COLS && by >= 0 && by < ROWS) {
                  delete newBlocked[`${bx},${by}`];
                }
              }
            }
          }
        }
        toast.success("Your good choice opened a previously blocked path! 🎉");
      }
    } else {
      // Block an adjacent cell (not the current one)
      const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
      for (const [ddx, ddy] of dirs) {
        const bx = playerPos.x + ddx;
        const by = playerPos.y + ddy;
        if (bx >= 0 && bx < COLS && by >= 0 && by < ROWS && !(bx === 0 && by === 0) && !(bx === COLS-1 && by === ROWS-1)) {
          if (!newBlocked[`${bx},${by}`]) {
            newBlocked[`${bx},${by}`] = true;
            break;
          }
        }
      }
    }

    setScenarioStates(newScenarioStates);
    setBlockedPaths(newBlocked);
    setChoiceResult({ isGood: choice.isGood, explanation: choice.explanation });

    // Check if path to exit is still possible after blocking
    if (!choice.isGood && !hasPathToExit(playerPos.x, playerPos.y, newBlocked, maze)) {
      setGameLost(true);
    }
  };

  const dismissResult = () => {
    setChoiceResult(null);
    setActiveScenario(null);
  };

  const saveCompletion = async () => {
    if (!user) return;
    try {
      await supabase.from("activity_completions").insert({
        user_id: user.id,
        activity_name: "classroom-maze",
        activity_type: "game",
        eq_trait: "Decision Making",
        notes: `Completed with ${goodChoices}/${totalChoices} good choices`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const resetGame = () => {
    setMaze(generateMaze());
    setPlayerPos({ x: 0, y: 0 });
    setActiveScenario(null);
    setScenarioStates({});
    setBlockedPaths({});
    setGameComplete(false);
    setGoodChoices(0);
    setTotalChoices(0);
    setChoiceResult(null);
    setVisitedCells(new Set(["0,0"]));
  };

  // Keyboard controls
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp": case "w": move(0, -1); break;
      case "ArrowDown": case "s": move(0, 1); break;
      case "ArrowLeft": case "a": move(-1, 0); break;
      case "ArrowRight": case "d": move(1, 0); break;
    }
  }, [move]);

  const cellSize = 56;

  return (
    <div className="min-h-screen bg-gradient-background p-4 md:p-6" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link to="/activities" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Activities
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={resetGame}>
            <RotateCcw className="h-4 w-4 mr-1" /> Restart
          </Button>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground font-comic">
            🏫 Classroom Maze
          </h1>
          <p className="text-muted-foreground font-comic">
            Navigate through the maze. Each scenario presents real-life choices — choose wisely!
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="font-comic">
              <CheckCircle className="h-3 w-3 mr-1 text-green-500" /> Good: {goodChoices}
            </Badge>
            <Badge variant="outline" className="font-comic">
              <XCircle className="h-3 w-3 mr-1 text-red-500" /> Total: {totalChoices}
            </Badge>
          </div>
        </div>

        {/* Game Complete */}
        {gameComplete && (
          <Card className="bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-fun">
            <CardContent className="p-6 text-center space-y-4">
              <Trophy className="h-16 w-16 mx-auto text-yellow-300" />
              <h2 className="text-3xl font-bold font-comic">Maze Complete! 🎉</h2>
              <p className="text-lg font-comic">
                You made {goodChoices} good choices out of {totalChoices} total!
              </p>
              <p className="font-comic opacity-90">
                {goodChoices === totalChoices
                  ? "Perfect! You navigated every situation wisely! 🌟"
                  : goodChoices > totalChoices / 2
                  ? "Great job! You showed strong decision-making skills! 💪"
                  : "Keep practicing! Every choice is a learning opportunity. 📚"}
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" className="bg-white/20 hover:bg-white/30 border-white/40" onClick={resetGame}>
                  Play Again
                </Button>
                <Button variant="outline" className="bg-white/20 hover:bg-white/30 border-white/40" asChild>
                  <Link to="/activities">Back to Activities</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scenario Modal */}
        {activeScenario && !choiceResult && (
          <Card className="border-2 border-primary shadow-fun animate-in fade-in-0 zoom-in-95">
            <CardHeader className="text-center pb-2">
              <div className="text-4xl mb-2">🤔</div>
              <CardTitle className="text-xl font-comic text-foreground">Decision Time!</CardTitle>
              <CardDescription className="text-base font-comic">{activeScenario.situation}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeScenario.choices.map((choice, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="w-full text-left h-auto py-3 px-4 whitespace-normal font-comic hover:bg-primary/10 transition-all"
                  onClick={() => handleChoice(i)}
                >
                  <span className="mr-2 font-bold text-primary">{String.fromCharCode(65 + i)}.</span>
                  {choice.text}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Choice Result */}
        {choiceResult && (
          <Card className={`border-2 shadow-fun animate-in fade-in-0 zoom-in-95 ${choiceResult.isGood ? "border-green-400 bg-green-50 dark:bg-green-950/30" : "border-red-400 bg-red-50 dark:bg-red-950/30"}`}>
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-4xl">{choiceResult.isGood ? "✅" : "❌"}</div>
              <h3 className="text-xl font-bold font-comic text-foreground">
                {choiceResult.isGood ? "Great Choice!" : "Not the Best Choice..."}
              </h3>
              <p className="font-comic text-muted-foreground flex items-start gap-2 text-left">
                <Lightbulb className="h-5 w-5 mt-0.5 shrink-0 text-yellow-500" />
                {choiceResult.explanation}
              </p>
              {!choiceResult.isGood && (
                <p className="text-sm font-comic text-muted-foreground italic">
                  A path nearby has been blocked. But don't worry — making a good choice later might open it back up!
                </p>
              )}
              <Button onClick={dismissResult} className="mt-2">
                Continue Maze →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Maze Grid */}
        <Card className="bg-card/80 backdrop-blur overflow-hidden">
          <CardContent className="p-4 flex justify-center">
            <div
              className="relative bg-amber-50 dark:bg-amber-950/30 rounded-lg border-2 border-amber-200 dark:border-amber-800"
              style={{
                width: COLS * cellSize + 4,
                height: ROWS * cellSize + 4,
              }}
            >
              {/* Classroom background pattern */}
              <div className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent ${cellSize - 1}px, #000 ${cellSize}px), repeating-linear-gradient(90deg, transparent, transparent ${cellSize - 1}px, #000 ${cellSize}px)`,
                }}
              />
              
              {maze.map((row, y) =>
                row.map((cell, x) => {
                  const isPlayer = playerPos.x === x && playerPos.y === y;
                  const isVisited = visitedCells.has(`${x},${y}`);
                  const isBlockedCell = blockedPaths[`${x},${y}`];
                  const hasScenario = cell.scenarioId && !scenarioStates[cell.scenarioId]?.resolved;
                  const scenarioResolved = cell.scenarioId && scenarioStates[cell.scenarioId]?.resolved;
                  const scenarioGood = cell.scenarioId && scenarioStates[cell.scenarioId]?.chosenGood;

                  return (
                    <div
                      key={`${x}-${y}`}
                      className="absolute flex items-center justify-center transition-colors duration-200"
                      style={{
                        left: x * cellSize + 2,
                        top: y * cellSize + 2,
                        width: cellSize,
                        height: cellSize,
                        borderTop: cell.walls.top ? "2px solid hsl(var(--foreground) / 0.3)" : "2px solid transparent",
                        borderRight: cell.walls.right ? "2px solid hsl(var(--foreground) / 0.3)" : "2px solid transparent",
                        borderBottom: cell.walls.bottom ? "2px solid hsl(var(--foreground) / 0.3)" : "2px solid transparent",
                        borderLeft: cell.walls.left ? "2px solid hsl(var(--foreground) / 0.3)" : "2px solid transparent",
                        backgroundColor: isPlayer
                          ? "hsl(var(--primary) / 0.3)"
                          : isBlockedCell
                          ? "hsl(var(--destructive) / 0.2)"
                          : cell.isEnd
                          ? "hsl(142 76% 50% / 0.2)"
                          : isVisited
                          ? "hsl(var(--primary) / 0.08)"
                          : "transparent",
                      }}
                    >
                      {isPlayer && <span className="text-2xl animate-bounce">🧑‍🎓</span>}
                      {!isPlayer && cell.isStart && !isVisited && <span className="text-lg">🚪</span>}
                      {!isPlayer && cell.isEnd && <span className="text-lg">🏆</span>}
                      {!isPlayer && hasScenario && <span className="text-lg animate-pulse">❓</span>}
                      {!isPlayer && scenarioResolved && scenarioGood && <span className="text-sm">✅</span>}
                      {!isPlayer && scenarioResolved && !scenarioGood && <span className="text-sm">❌</span>}
                      {!isPlayer && isBlockedCell && <span className="text-lg">🚧</span>}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        {!gameComplete && (
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-2 w-fit">
              <div />
              <Button variant="outline" size="icon" onClick={() => move(0, -1)} disabled={!!activeScenario || !!choiceResult}>
                <ArrowUp className="h-5 w-5" />
              </Button>
              <div />
              <Button variant="outline" size="icon" onClick={() => move(-1, 0)} disabled={!!activeScenario || !!choiceResult}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => move(0, 1)} disabled={!!activeScenario || !!choiceResult}>
                <ArrowDown className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => move(1, 0)} disabled={!!activeScenario || !!choiceResult}>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Legend */}
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex flex-wrap justify-center gap-4 text-sm font-comic">
              <span>🧑‍🎓 You</span>
              <span>❓ Scenario</span>
              <span>🚧 Blocked</span>
              <span>🏆 Exit</span>
              <span>✅ Good Choice</span>
              <span>❌ Bad Choice</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClassroomMazePage;
