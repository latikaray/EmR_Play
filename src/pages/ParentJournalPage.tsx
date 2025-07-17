import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ArrowLeft, BookOpen, Save, Edit, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  created_at: string;
}

const ParentJournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: format(new Date(), "yyyy-MM-dd")
  });
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const journalPrompts = [
    "What parenting moment made you proud this week?",
    "Did you handle a situation calmly or reactively?", 
    "Did you break any parenting norms today?",
    "How did you support your child's emotional growth today?",
    "What challenge did you face as a parent and how did you overcome it?",
    "When did you model the behavior you want to see in your child?",
    "How did you practice patience in a difficult moment?",
    "What did you learn about your child today?",
    "How did you take care of yourself as a parent today?",
    "What family tradition or new experience brought joy today?"
  ];

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast({
        title: "Error",
        description: "Failed to load journal entries",
        variant: "destructive"
      });
    }
  };

  const saveEntry = async () => {
    if (!user || !formData.content.trim()) return;

    setLoading(true);
    try {
      const entryData = {
        user_id: user.id,
        title: formData.title || format(new Date(formData.date), "MMMM d, yyyy"),
        content: formData.content,
        date: formData.date
      };

      if (currentEntry) {
        // Update existing entry
        const { error } = await supabase
          .from('journal_entries')
          .update(entryData)
          .eq('id', currentEntry.id);

        if (error) throw error;
        toast({ title: "Entry updated successfully!" });
      } else {
        // Create new entry
        const { error } = await supabase
          .from('journal_entries')
          .insert(entryData);

        if (error) throw error;
        toast({ title: "Entry saved successfully!" });
      }

      await fetchEntries();
      resetForm();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error",
        description: "Failed to save entry",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (entryId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;
      
      toast({ title: "Entry deleted successfully!" });
      await fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: "Error", 
        description: "Failed to delete entry",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      date: format(new Date(), "yyyy-MM-dd")
    });
    setCurrentEntry(null);
    setIsEditing(false);
  };

  const editEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry);
    setFormData({
      title: entry.title,
      content: entry.content,
      date: entry.date
    });
    setIsEditing(true);
  };

  const startNewEntry = () => {
    resetForm();
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/parent">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-fun bg-clip-text text-transparent font-comic">
                Parenting Journal
              </h1>
              <p className="text-lg text-muted-foreground font-comic mt-2">
                Reflect on your parenting journey with weekly prompts
              </p>
            </div>
          </div>
          <Button onClick={startNewEntry} variant="fun" size="lg">
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Journal Entry Form */}
          <div className="lg:col-span-2">
            {isEditing && (
              <Card className="mb-6 shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="font-comic flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {currentEntry ? 'Edit Entry' : 'New Journal Entry'}
                  </CardTitle>
                  <CardDescription className="font-comic">
                    Share your thoughts and reflections on your parenting journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title" className="font-comic">Title (optional)</Label>
                      <Input
                        id="title"
                        placeholder="Entry title..."
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="font-comic"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date" className="font-comic">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-comic">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(new Date(formData.date), "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={new Date(formData.date)}
                            onSelect={(date) => date && setFormData({...formData, date: format(date, "yyyy-MM-dd")})}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="content" className="font-comic">Your Reflection</Label>
                    <Textarea
                      id="content"
                      placeholder="What's on your mind about parenting today?"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="min-h-[200px] font-comic"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={saveEntry} 
                      disabled={!formData.content.trim() || loading}
                      variant="fun"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Saving...' : 'Save Entry'}
                    </Button>
                    <Button 
                      onClick={resetForm} 
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Journal Entries */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-comic text-foreground">Your Entries</h2>
              {entries.length === 0 ? (
                <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-comic text-muted-foreground">
                      No journal entries yet. Start your first entry!
                    </p>
                    <Button onClick={startNewEntry} variant="fun" className="mt-4">
                      Write Your First Entry
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                entries.map((entry) => (
                  <Card key={entry.id} className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="font-comic text-foreground">{entry.title}</CardTitle>
                          <CardDescription className="font-comic">
                            {format(new Date(entry.date), "MMMM d, yyyy")}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editEntry(entry)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Entry</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this journal entry? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline">Cancel</Button>
                                <Button 
                                  variant="destructive"
                                  onClick={() => deleteEntry(entry.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="font-comic text-muted-foreground leading-relaxed">
                        {entry.content.length > 200 
                          ? entry.content.substring(0, 200) + "..."
                          : entry.content
                        }
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Sidebar with Prompts */}
          <div className="space-y-6">
            {/* Writing Prompts */}
            <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="font-comic text-foreground">Writing Prompts</CardTitle>
                <CardDescription className="font-comic">
                  Need inspiration? Try these prompts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {journalPrompts.slice(0, 5).map((prompt, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-primary/10 rounded-lg cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => {
                        setFormData({...formData, content: prompt + "\n\n"});
                        setIsEditing(true);
                      }}
                    >
                      <p className="text-sm font-comic text-foreground">
                        {prompt}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="shadow-fun bg-card/80 backdrop-blur border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="font-comic text-foreground">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary font-comic">{entries.length}</div>
                    <div className="text-sm text-muted-foreground font-comic">Total Entries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary font-comic">
                      {entries.filter(e => {
                        const entryDate = new Date(e.date);
                        const oneWeekAgo = new Date();
                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                        return entryDate >= oneWeekAgo;
                      }).length}
                    </div>
                    <div className="text-sm text-muted-foreground font-comic">This Week</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentJournalPage;