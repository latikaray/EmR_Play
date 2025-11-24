import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Star, Sun, Cloud, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const GratitudeJournalPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entries, setEntries] = useState({
    gratefulFor: '',
    goodDeeds: '',
    challenges: '',
    feelings: '',
    tomorrow: ''
  });
  const [pastEntries, setPastEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewPastOpen, setViewPastOpen] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    fetchPastEntries();
  }, [user]);

  const fetchPastEntries = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching past entries:', error);
    } else {
      setPastEntries(data || []);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEntries(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEntry = async () => {
    if (!user) {
      toast.error('Please log in to save your journal entry');
      return;
    }

    setLoading(true);

    const content = JSON.stringify(entries);
    const title = `Gratitude Journal - ${today}`;

    const { error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: user.id,
        title,
        content,
        date: new Date().toISOString().split('T')[0]
      });

    setLoading(false);

    if (error) {
      toast.error('Failed to save journal entry');
      console.error('Error saving entry:', error);
    } else {
      toast.success('Journal entry saved! 💖');
      setEntries({
        gratefulFor: '',
        goodDeeds: '',
        challenges: '',
        feelings: '',
        tomorrow: ''
      });
      fetchPastEntries();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-purple-100 p-4">
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
              My Gratitude Journal
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              Let's reflect on today's wonderful moments! ✨
            </p>
          </div>
        </div>

        {/* Date Card */}
        <Card className="mb-6 border-2 border-primary/20 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Sun className="h-8 w-8 text-yellow-500 animate-bounce" />
              <div>
                <h2 className="text-2xl font-bold text-primary font-comic">Today is:</h2>
                <p className="text-xl text-muted-foreground">{today}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Gratitude Section */}
          <Card className="border-2 border-green-200 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="bg-gradient-to-r from-green-100 to-green-50">
              <CardTitle className="flex items-center gap-2 text-green-700 font-comic">
                <Heart className="h-6 w-6 text-red-500 animate-pulse" />
                What am I grateful for today?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Textarea
                placeholder="I'm grateful for my family because they love me..."
                value={entries.gratefulFor}
                onChange={(e) => handleInputChange('gratefulFor', e.target.value)}
                className="min-h-32 text-base resize-none border-green-200 focus:border-green-400"
              />
            </CardContent>
          </Card>

          {/* Good Deeds Section */}
          <Card className="border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-700 font-comic">
                <Star className="h-6 w-6 text-yellow-500 animate-spin-slow" />
                Today's Good Deeds
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Textarea
                placeholder="I helped my mom with dishes, I shared my toy with my sister..."
                value={entries.goodDeeds}
                onChange={(e) => handleInputChange('goodDeeds', e.target.value)}
                className="min-h-32 text-base resize-none border-blue-200 focus:border-blue-400"
              />
            </CardContent>
          </Card>

          {/* Challenges Section */}
          <Card className="border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-orange-50">
              <CardTitle className="flex items-center gap-2 text-orange-700 font-comic">
                <Cloud className="h-6 w-6 text-gray-500" />
                Things that were hard today
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Textarea
                placeholder="I got frustrated when I couldn't solve my math problem..."
                value={entries.challenges}
                onChange={(e) => handleInputChange('challenges', e.target.value)}
                className="min-h-32 text-base resize-none border-orange-200 focus:border-orange-400"
              />
              <p className="text-sm text-orange-600 mt-2 font-medium">
                💡 Remember: It's okay to have difficult moments. They help us grow!
              </p>
            </CardContent>
          </Card>

          {/* Feelings Section */}
          <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-50">
              <CardTitle className="flex items-center gap-2 text-purple-700 font-comic">
                <Heart className="h-6 w-6 text-pink-500" />
                How do I feel right now?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Textarea
                placeholder="I feel happy because... or I feel sad because..."
                value={entries.feelings}
                onChange={(e) => handleInputChange('feelings', e.target.value)}
                className="min-h-32 text-base resize-none border-purple-200 focus:border-purple-400"
              />
            </CardContent>
          </Card>
        </div>

        {/* Tomorrow Section */}
        <Card className="mt-6 border-2 border-pink-200 shadow-lg hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-pink-100 to-pink-50">
            <CardTitle className="flex items-center gap-2 text-pink-700 font-comic">
              <Sun className="h-6 w-6 text-yellow-500" />
              What am I excited about tomorrow?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Textarea
              placeholder="Tomorrow I want to... or I'm looking forward to..."
              value={entries.tomorrow}
              onChange={(e) => handleInputChange('tomorrow', e.target.value)}
              className="min-h-24 text-base resize-none border-pink-200 focus:border-pink-400"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleSaveEntry}
            disabled={loading}
            className="bg-gradient-to-r from-primary to-primary-glow text-white px-8 py-3 text-lg font-bold hover:scale-105 transition-transform shadow-lg font-comic"
          >
            {loading ? 'Saving...' : 'Save My Journal Entry 📝'}
          </Button>

          <Dialog open={viewPastOpen} onOpenChange={setViewPastOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="px-8 py-3 text-lg font-bold font-comic"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                View Past Entries
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-comic text-primary">
                  My Past Journal Entries 📖
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4">
                {pastEntries.length === 0 ? (
                  <p className="text-center text-muted-foreground font-comic py-8">
                    No past entries yet. Start writing today! ✨
                  </p>
                ) : (
                  <div className="space-y-4">
                    {pastEntries.map((entry) => {
                      const parsedContent = JSON.parse(entry.content);
                      const entryDate = new Date(entry.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });

                      return (
                        <Card key={entry.id} className="border-2 border-primary/20">
                          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                            <CardTitle className="text-lg font-comic text-primary">
                              {entryDate}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 space-y-3">
                            {parsedContent.gratefulFor && (
                              <div>
                                <p className="font-bold text-green-700 font-comic flex items-center gap-2">
                                  <Heart className="h-4 w-4 text-red-500" />
                                  Grateful for:
                                </p>
                                <p className="text-sm text-muted-foreground font-comic ml-6">
                                  {parsedContent.gratefulFor}
                                </p>
                              </div>
                            )}
                            {parsedContent.goodDeeds && (
                              <div>
                                <p className="font-bold text-blue-700 font-comic flex items-center gap-2">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  Good Deeds:
                                </p>
                                <p className="text-sm text-muted-foreground font-comic ml-6">
                                  {parsedContent.goodDeeds}
                                </p>
                              </div>
                            )}
                            {parsedContent.challenges && (
                              <div>
                                <p className="font-bold text-orange-700 font-comic flex items-center gap-2">
                                  <Cloud className="h-4 w-4 text-gray-500" />
                                  Challenges:
                                </p>
                                <p className="text-sm text-muted-foreground font-comic ml-6">
                                  {parsedContent.challenges}
                                </p>
                              </div>
                            )}
                            {parsedContent.feelings && (
                              <div>
                                <p className="font-bold text-purple-700 font-comic flex items-center gap-2">
                                  <Heart className="h-4 w-4 text-pink-500" />
                                  Feelings:
                                </p>
                                <p className="text-sm text-muted-foreground font-comic ml-6">
                                  {parsedContent.feelings}
                                </p>
                              </div>
                            )}
                            {parsedContent.tomorrow && (
                              <div>
                                <p className="font-bold text-pink-700 font-comic flex items-center gap-2">
                                  <Sun className="h-4 w-4 text-yellow-500" />
                                  Excited about:
                                </p>
                                <p className="text-sm text-muted-foreground font-comic ml-6">
                                  {parsedContent.tomorrow}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        <p className="text-sm text-muted-foreground mt-4 text-center">
          Your thoughts are precious and will be saved safely! 💖
        </p>
      </div>
    </div>
  );
};

export default GratitudeJournalPage;