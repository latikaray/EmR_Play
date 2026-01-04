import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  User, 
  Calendar, 
  Trophy, 
  Star, 
  Heart, 
  Edit2, 
  Save, 
  Camera,
  Target,
  Award,
  Sparkles,
  TrendingUp,
  LogOut,
  Trash2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EnterLinkCode from "@/components/EnterLinkCode";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    age: "8",
    favoriteColor: "Rainbow",
    avatar: ""
  });
  const { user, signOut, deleteAccount, profile, role } = useAuth();
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile?.display_name) {
      setProfileData((p) => ({ ...p, name: profile.display_name || "" }));
    }
    if (profile?.avatar_url) {
      setProfileData((p) => ({ ...p, avatar: profile.avatar_url || "" }));
    }
  }, [profile?.display_name, profile?.avatar_url]);

  const achievements = [
    { name: "First Drawing", icon: "🎨", date: "2024-01-15", description: "Completed your first mood drawing!" },
    { name: "Story Master", icon: "📚", date: "2024-01-20", description: "Read 5 emotional stories" },
    { name: "Breathing Expert", icon: "🫁", date: "2024-01-25", description: "Practiced breathing for 7 days" },
    { name: "Emotion Explorer", icon: "🎭", date: "2024-02-01", description: "Identified 10 different emotions" },
    { name: "Gratitude Champion", icon: "💝", date: "2024-02-05", description: "Wrote 20 gratitude entries" },
  ];

  const moodHistory = [
    { mood: "Happy", count: 15, color: "bg-fun-yellow", emoji: "😊" },
    { mood: "Excited", count: 12, color: "bg-fun-orange", emoji: "🤩" },
    { mood: "Calm", count: 10, color: "bg-fun-teal", emoji: "😌" },
    { mood: "Proud", count: 8, color: "bg-secondary", emoji: "😎" },
    { mood: "Sad", count: 3, color: "bg-muted", emoji: "😢" },
  ];

  const stats = [
    { label: "Days Active", value: "24", icon: Calendar, color: "text-accent" },
    { label: "Activities Done", value: "42", icon: Target, color: "text-fun-pink" },
    { label: "Badges Earned", value: "5", icon: Award, color: "text-fun-yellow" },
    { label: "Mood Score", value: "8.5", icon: Star, color: "text-secondary" },
  ];

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with avatar URL in the appropriate table
      const profileTable = role === 'parent' ? 'parent_profiles' : 'child_profiles';
      const { error: updateError } = await supabase
        .from(profileTable)
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setProfileData((p) => ({ ...p, avatar: publicUrl }));
      toast.success("Profile picture updated! 📸");
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    if (!user) return;
    const profileTable = role === 'parent' ? 'parent_profiles' : 'child_profiles';
    const { error } = await supabase
      .from(profileTable)
      .update({ display_name: profileData.name })
      .eq('user_id', user.id);
    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/welcome');
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    const { error } = await deleteAccount();
    
    if (!error) {
      navigate('/welcome');
    }
    
    setDeleteLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-fun-yellow animate-float" />
            <h1 className="text-3xl md:text-5xl font-bold text-foreground font-comic">
              My Profile
            </h1>
            <Sparkles className="h-6 w-6 text-fun-pink animate-float" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        {/* Profile Info Card */}
        <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
          <CardHeader className="text-center relative">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit2 className="h-4 w-4 mr-2" />}
              {isEditing ? "Save" : "Edit"}
            </Button>
            
            <div className="relative w-24 h-24 mx-auto mb-4">
              <Avatar className="w-24 h-24 border-4 border-primary shadow-fun">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-comic">
                  {profileData.name.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleAvatarClick}
                    disabled={uploading}
                    className="absolute -bottom-2 -right-2 rounded-full h-8 w-8"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-4 max-w-md mx-auto">
                  <div>
                    <Label htmlFor="name" className="font-comic">Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="font-comic"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age" className="font-comic">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={profileData.age}
                      onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                      className="font-comic"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color" className="font-comic">Favorite Color</Label>
                    <Input
                      id="color"
                      value={profileData.favoriteColor}
                      onChange={(e) => setProfileData({...profileData, favoriteColor: e.target.value})}
                      className="font-comic"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <CardTitle className="text-2xl font-comic text-foreground">
                    {profileData.name}
                  </CardTitle>
                  <div className="flex justify-center gap-4 text-sm text-muted-foreground font-comic">
                    <span>Age: {profileData.age}</span>
                    <span>•</span>
                    <span>Favorite Color: {profileData.favoriteColor}</span>
                  </div>
                </>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={stat.label} className="hover-lift shadow-card bg-card/50 backdrop-blur">
              <CardContent className="p-4 text-center">
                <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-foreground font-comic">{stat.value}</p>
                <p className="text-sm text-muted-foreground font-comic">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mood History */}
        <Card className="shadow-activity bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-comic text-foreground flex items-center gap-2">
              <Heart className="h-5 w-5 text-fun-pink" />
              My Mood Journey
            </CardTitle>
            <CardDescription className="font-comic">
              Your most common emotions this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {moodHistory.map((mood, index) => (
                <div key={mood.mood} className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${mood.color} rounded-full flex items-center justify-center text-lg shadow-sm`}>
                    {mood.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-comic text-foreground">{mood.mood}</span>
                      <span className="text-sm font-comic text-muted-foreground">{mood.count} times</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`${mood.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${(mood.count / 15) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="shadow-activity bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-comic text-foreground flex items-center gap-2">
              <Trophy className="h-5 w-5 text-fun-yellow" />
              My Achievements
            </CardTitle>
            <CardDescription className="font-comic">
              Amazing things you've accomplished!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={achievement.name} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover-lift">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-lg shadow-sm animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold font-comic text-foreground">{achievement.name}</h4>
                    <p className="text-sm text-muted-foreground font-comic">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground font-comic mt-1">
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="font-comic">
                    <Star className="h-3 w-3 mr-1" />
                    New
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Summary */}
        <Card className="bg-gradient-fun text-white shadow-fun">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="h-6 w-6" />
              <h3 className="text-2xl font-bold font-comic">Keep Growing!</h3>
            </div>
            <p className="text-lg opacity-90 font-comic mb-4">
              You're doing amazing! Your emotional intelligence is growing every day! 🌟
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-3xl font-bold font-comic">85%</p>
                <p className="text-sm opacity-90 font-comic">Overall Progress</p>
              </div>
              <div>
                <p className="text-3xl font-bold font-comic">7</p>
                <p className="text-sm opacity-90 font-comic">Day Streak</p>
              </div>
              <div>
                <p className="text-3xl font-bold font-comic">Next</p>
                <p className="text-sm opacity-90 font-comic">Badge: Super Star ⭐</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Link to Parent (only for children) */}
        {role === 'child' && (
          <EnterLinkCode />
        )}

        {/* Account Actions */}
        {user && (
          <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl font-comic text-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Account Settings
              </CardTitle>
              <CardDescription className="font-comic">
                Manage your account and data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="flex-1 font-comic"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="flex-1 font-comic"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card/95 backdrop-blur border-2 border-destructive/20">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-comic text-foreground flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-destructive" />
                        Delete Account Forever?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="font-comic">
                        ⚠️ <strong>Warning:</strong> This action cannot be undone! 
                        <br /><br />
                        All your progress, achievements, mood history, and account data will be permanently lost.
                        <br /><br />
                        Are you absolutely sure you want to delete your account?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="font-comic">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        disabled={deleteLoading}
                        className="bg-destructive hover:bg-destructive/90 font-comic"
                      >
                        {deleteLoading ? "Deleting..." : "Yes, Delete Forever"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;