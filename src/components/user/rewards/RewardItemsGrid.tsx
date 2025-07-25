import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/types/supabase/user';
import { AdminRewardItem } from '@/types/supabase/rewards';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Gift, Star, Book, Calendar, Award } from 'lucide-react';

interface RewardItemsGridProps {
  user: UserProfile | null;
}

const RewardItemsGrid: React.FC<RewardItemsGridProps> = ({ user }) => {
  const [rewardItems, setRewardItems] = useState<AdminRewardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  const userPoints = user?.reward_points || 0;

  useEffect(() => {
    fetchRewardItems();
  }, []);

  const fetchRewardItems = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_reward_items')
        .select('*')
        .eq('is_active', true)
        .order('points_required', { ascending: true });

      if (error) throw error;
      setRewardItems(data || []);
    } catch (error) {
      console.error('Error fetching reward items:', error);
      toast.error('Failed to load reward items');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (item: AdminRewardItem) => {
    if (!user) {
      toast.error('Please log in to redeem rewards');
      return;
    }

    if (userPoints < item.points_required) {
      toast.error('Insufficient points for this reward');
      return;
    }

    setRedeeming(item.id);

    try {
      // Create redemption record
      const { error: redemptionError } = await supabase
        .from('user_reward_redemptions')
        .insert({
          user_id: user.id,
          reward_item_id: item.id,
          points_spent: item.points_required,
          status: 'pending'
        });

      if (redemptionError) throw redemptionError;

      // Deduct points from user (via RPC to ensure atomicity)
      const { error: pointsError } = await supabase.rpc('deduct_reward_points', {
        user_id: user.id,
        points_to_deduct: item.points_required,
        redemption_description: `Redeemed: ${item.name}`
      });

      if (pointsError) throw pointsError;

      toast.success(`Successfully redeemed ${item.name}! You will receive it shortly.`);
      
      // Refresh user profile to update points
      window.location.reload();
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast.error('Failed to redeem reward. Please try again.');
    } finally {
      setRedeeming(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'course': return <Book className="h-4 w-4" />;
      case 'session': return <Calendar className="h-4 w-4" />;
      case 'retreat': return <Star className="h-4 w-4" />;
      case 'event': return <Award className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'course': return 'bg-blue-500';
      case 'session': return 'bg-green-500';
      case 'retreat': return 'bg-purple-500';
      case 'event': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading rewards...</div>
        </CardContent>
      </Card>
    );
  }

  if (rewardItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No rewards available at the moment. Check back later!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Available Rewards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewardItems.map((item) => {
            const canAfford = userPoints >= item.points_required;
            const isAvailable = !item.max_redemptions || item.current_redemptions < item.max_redemptions;
            
            return (
              <Card key={item.id} className={`relative ${!canAfford ? 'opacity-60' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-full ${getCategoryColor(item.category)} text-white`}>
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{item.points_required}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                  
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  )}
                  
                  {item.max_redemptions && (
                    <div className="text-xs text-muted-foreground mb-3">
                      {item.current_redemptions}/{item.max_redemptions} redeemed
                    </div>
                  )}
                  
                  <Button
                    size="sm"
                    className="w-full"
                    disabled={!canAfford || !isAvailable || redeeming === item.id}
                    onClick={() => handleRedeem(item)}
                  >
                    {redeeming === item.id ? 'Redeeming...' : 
                     !canAfford ? 'Insufficient Points' :
                     !isAvailable ? 'Sold Out' : 'Redeem'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardItemsGrid;