import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Trophy, Flame, Star, Lock } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";
import { UNLOCKABLE_AVATARS } from "@/data/gamificationData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BadgesPage = () => {
  const { userXP, earnedBadges, unlockedAvatars, level, levelProgress, allBadges, allAvatars, loading } = useGamification();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <div className="text-2xl font-comic animate-pulse">Loading achievements... ✨</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-6">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="h-8 w-8 text-fun-yellow animate-bounce" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-fun bg-clip-text text-transparent font-comic">
              Achievements
            </h1>
            <Trophy className="h-8 w-8 text-fun-yellow animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-lg text-muted-foreground font-comic">
            Track your progress and unlock awesome rewards!
          </p>
        </div>

        {/* XP & Level Card */}
        <Card className="shadow-fun bg-gradient-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="text-center">
                <div className="text-5xl font-bold font-comic">{userXP.total_xp}</div>
                <div className="text-sm opacity-90 font-comic">Total XP</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-6 w-6" />
                  <span className="text-3xl font-bold font-comic">Level {level}</span>
                </div>
                <Progress value={levelProgress.progress} className="h-3 bg-white/20" />
                <div className="text-xs opacity-80 font-comic mt-1">
                  {levelProgress.current} / {levelProgress.needed} XP to next level
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Flame className="h-8 w-8 text-fun-orange" />
                  <span className="text-4xl font-bold font-comic">{userXP.current_streak}</span>
                </div>
                <div className="text-sm opacity-90 font-comic">Day Streak</div>
                <div className="text-xs opacity-70 font-comic">Best: {userXP.longest_streak} days</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="shadow-activity bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl font-comic text-foreground flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-fun-yellow" />
              Badges ({earnedBadges.length}/{allBadges.length})
            </CardTitle>
            <CardDescription className="font-comic">
              Complete challenges to earn badges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allBadges.map((badge) => {
                const earned = earnedBadges.find(eb => eb.badge_id === badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl text-center transition-all duration-300 ${
                      earned
                        ? 'bg-gradient-primary text-primary-foreground shadow-fun scale-100 hover:scale-105'
                        : 'bg-muted/40 text-muted-foreground opacity-60'
                    }`}
                  >
                    <div className={`text-4xl mb-2 ${earned ? 'animate-float' : 'grayscale'}`}>
                      {badge.emoji}
                    </div>
                    <h4 className="font-bold font-comic text-sm">{badge.name}</h4>
                    <p className="text-xs mt-1 font-comic opacity-80">{badge.description}</p>
                    {earned ? (
                      <Badge variant="secondary" className="mt-2 text-xs font-comic">
                        ✅ Earned
                      </Badge>
                    ) : (
                      <p className="text-xs mt-2 font-comic italic">{badge.requirement}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Unlockable Avatars */}
        <Card className="shadow-activity bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl font-comic text-foreground flex items-center gap-2">
              🎭 Unlockable Avatars ({unlockedAvatars.length}/{allAvatars.length})
            </CardTitle>
            <CardDescription className="font-comic">
              Earn XP to unlock new avatar emojis for your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {allAvatars.map((avatar) => {
                const unlocked = unlockedAvatars.find(u => u.avatar_id === avatar.id);
                return (
                  <div
                    key={avatar.id}
                    className={`p-4 rounded-xl text-center transition-all duration-300 ${
                      unlocked
                        ? 'bg-card shadow-fun border-2 border-primary/30 hover:scale-105'
                        : 'bg-muted/30 opacity-50'
                    }`}
                  >
                    <div className={`text-5xl mb-2 ${unlocked ? '' : 'grayscale blur-sm'}`}>
                      {avatar.emoji}
                    </div>
                    <h4 className="font-bold font-comic text-sm text-foreground">{avatar.name}</h4>
                    {unlocked ? (
                      <Badge variant="outline" className="mt-2 text-xs font-comic">Unlocked</Badge>
                    ) : (
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <Lock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-comic text-muted-foreground">{avatar.xpRequired} XP</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Back button */}
        <div className="text-center pb-8">
          <Button variant="outline" asChild className="font-comic">
            <Link to="/profile">← Back to Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BadgesPage;
