import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Plus } from 'lucide-react';

const colors = [
  '#ef4444', // red
  '#f97316', // orange  
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
];

const AddAddiction = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[3]); // Default to green
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('addictions')
        .insert({
          user_id: user.id,
          name: name.trim(),
          description: description.trim() || null,
          color: selectedColor,
        });

      if (error) throw error;

      toast({
        title: 'Addiction added successfully',
        description: `Started tracking your journey to overcome ${name}`,
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error adding addiction',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <header className="border-b border-border/60 bg-card/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold">Add New Addiction</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Start Your Recovery Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Addiction Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Smoking, Drinking, Social Media..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Why do you want to overcome this? What motivates you?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label>Choose a Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color 
                          ? 'border-foreground scale-110' 
                          : 'border-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  This color will help you identify this addiction in your dashboard
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="flex-1 bg-gradient-to-r from-primary to-primary/90"
                >
                  {loading ? 'Adding...' : 'Start Tracking'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6 bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">💡 Tips for Success</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Be honest with your daily check-ins</li>
              <li>• Focus on progress, not perfection</li>
              <li>• Celebrate small victories along the way</li>
              <li>• Remember that setbacks are part of the journey</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddAddiction;