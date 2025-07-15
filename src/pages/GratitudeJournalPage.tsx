import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Star, Sun, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GratitudeJournalPage = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState({
    gratefulFor: '',
    goodDeeds: '',
    challenges: '',
    feelings: '',
    tomorrow: ''
  });

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleInputChange = (field: string, value: string) => {
    setEntries(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEntry = () => {
    // Here you would save to Supabase
    console.log('Saving journal entry:', entries);
    // Show success message
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

        {/* Save Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={handleSaveEntry}
            className="bg-gradient-to-r from-primary to-primary-glow text-white px-8 py-3 text-lg font-bold hover:scale-105 transition-transform shadow-lg font-comic"
          >
            Save My Journal Entry 📝
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Your thoughts are precious and will be saved safely! 💖
          </p>
        </div>
      </div>
    </div>
  );
};

export default GratitudeJournalPage;