import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Heart, Shield, Target, Trophy, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 rounded-full bg-primary">
              <Heart className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Reset Routine
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your personal companion for tracking addiction recovery. 
            Build streaks, celebrate victories, and reclaim your freedom.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/90 text-lg px-8 py-6"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6"
            >
              <Shield className="mr-2 h-5 w-5" />
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Reset Routine?</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center border-border/60 hover:shadow-lg transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Your Progress</h3>
              <p className="text-muted-foreground">
                Monitor your daily progress with simple check-ins. 
                See your streaks grow and celebrate every milestone.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-border/60 hover:shadow-lg transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="p-4 rounded-full bg-success/10 w-fit mx-auto mb-4">
                <Trophy className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Celebrate Victories</h3>
              <p className="text-muted-foreground">
                Every clean day counts. Track your current streak and 
                remember your personal best achievements.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-border/60 hover:shadow-lg transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="p-4 rounded-full bg-warning/10 w-fit mx-auto mb-4">
                <Heart className="h-8 w-8 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Stay Motivated</h3>
              <p className="text-muted-foreground">
                Get daily motivation and remember that every setback 
                is a setup for a stronger comeback.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-8 pb-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Take Control?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of people who have started their recovery journey. 
              Your future self will thank you for taking this step today.
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/90"
            >
              Begin Your Recovery
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
