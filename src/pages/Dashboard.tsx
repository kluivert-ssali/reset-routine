import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Heart, 
  Plus, 
  Calendar, 
  Trophy, 
  Target, 
  LogOut,
  Check,
  X
} from 'lucide-react';

interface Addiction {
  id: string;
  name: string;
  description: string;
  start_date: string;
  color: string;
}

interface CheckIn {
  id: string;
  addiction_id: string;
  check_in_date: string;
  is_clean: boolean;
  notes: string;
}

const Dashboard = () => {
  const [addictions, setAddictions] = useState<Addiction[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      // Fetch addictions
      const { data: addictionsData, error: addictionsError } = await supabase
        .from('addictions')
        .select('*')
        .order('created_at', { ascending: false });

      if (addictionsError) throw addictionsError;

      // Fetch check-ins
      const { data: checkInsData, error: checkInsError } = await supabase
        .from('daily_check_ins')
        .select('*')
        .order('check_in_date', { ascending: false });

      if (checkInsError) throw checkInsError;

      setAddictions(addictionsData || []);
      setCheckIns(checkInsData || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching data',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (addictionId: string, isClean: boolean) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('daily_check_ins')
        .upsert({
          user_id: user?.id,
          addiction_id: addictionId,
          check_in_date: today,
          is_clean: isClean,
        });

      if (error) throw error;

      toast({
        title: isClean ? 'Great job!' : 'Tomorrow is a new day',
        description: isClean 
          ? 'Keep up the good work on your recovery journey!' 
          : 'Every setback is a setup for a comeback.',
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: 'Error updating check-in',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const calculateStreak = (addictionId: string) => {
    const addictionCheckIns = checkIns
      .filter(checkIn => checkIn.addiction_id === addictionId)
      .sort((a, b) => new Date(b.check_in_date).getTime() - new Date(a.check_in_date).getTime());

    let currentStreak = 0;
    const today = new Date();
    
    for (const checkIn of addictionCheckIns) {
      const checkInDate = new Date(checkIn.check_in_date);
      const daysDiff = Math.floor((today.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= currentStreak && checkIn.is_clean) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    return currentStreak;
  };

  const calculateLongestStreak = (addictionId: string) => {
    const addictionCheckIns = checkIns
      .filter(checkIn => checkIn.addiction_id === addictionId)
      .sort((a, b) => new Date(a.check_in_date).getTime() - new Date(b.check_in_date).getTime());

    let longestStreak = 0;
    let currentStreak = 0;
    
    for (const checkIn of addictionCheckIns) {
      if (checkIn.is_clean) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return longestStreak;
  };

  const getTodayCheckIn = (addictionId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return checkIns.find(
      checkIn => checkIn.addiction_id === addictionId && checkIn.check_in_date === today
    );
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-8 w-8 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <header className="border-b border-border/60 bg-card/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Reset Routine</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Your Recovery Dashboard</h2>
          <p className="text-muted-foreground">
            Track your progress and celebrate every victory, no matter how small.
          </p>
        </div>

        {addictions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Start Your Journey</h3>
              <p className="text-muted-foreground mb-6">
                Add your first addiction to begin tracking your recovery progress.
              </p>
              <Button 
                onClick={() => navigate('/add-addiction')}
                className="bg-gradient-to-r from-primary to-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Addiction
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Your Progress</h3>
              <Button 
                onClick={() => navigate('/add-addiction')}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Addiction
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {addictions.map((addiction) => {
                const currentStreak = calculateStreak(addiction.id);
                const longestStreak = calculateLongestStreak(addiction.id);
                const todayCheckIn = getTodayCheckIn(addiction.id);

                return (
                  <Card key={addiction.id} className="relative overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 w-full h-1"
                      style={{ backgroundColor: addiction.color }}
                    />
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{addiction.name}</CardTitle>
                        <div className="flex gap-2">
                          {!todayCheckIn ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCheckIn(addiction.id, true)}
                                className="border-success text-success hover:bg-success hover:text-success-foreground"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCheckIn(addiction.id, false)}
                                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Badge 
                              variant={todayCheckIn.is_clean ? "default" : "destructive"}
                              className={todayCheckIn.is_clean ? "bg-success" : ""}
                            >
                              {todayCheckIn.is_clean ? 'Clean Today' : 'Relapsed Today'}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {addiction.description && (
                        <CardDescription>{addiction.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Current</span>
                          </div>
                          <p className="text-2xl font-bold text-primary">
                            {currentStreak}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {currentStreak === 1 ? 'day' : 'days'}
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Best</span>
                          </div>
                          <p className="text-2xl font-bold text-warning">
                            {longestStreak}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {longestStreak === 1 ? 'day' : 'days'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Motivational Message */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6 text-center">
            <h4 className="text-lg font-semibold mb-2">Daily Reminder</h4>
            <p className="text-muted-foreground">
              "Progress is impossible without change, and those who cannot change their minds cannot change anything." 
              <br />
              <span className="text-sm">- George Bernard Shaw</span>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;