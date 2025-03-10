
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, CreditCard, Download, Heart, History, ListChecks, Share2, Star, UserCircle, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUserAuth, Expert } from '@/contexts/UserAuthContext';
import { toast } from 'sonner';

const UserDashboard = () => {
  const { currentUser, logout, removeFromFavorites, rechargeWallet, getExpertShareLink } = useUserAuth();
  const navigate = useNavigate();
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [currentExpert, setCurrentExpert] = useState<Expert | null>(null);

  // If user is not logged in, redirect to login page
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null; // Prevents the rest of the component from rendering while redirecting
  }

  const handleRecharge = () => {
    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    rechargeWallet(amount);
    setRechargeAmount('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const shareExpertProfile = (expert: Expert) => {
    setCurrentExpert(expert);
    const shareLink = getExpertShareLink(expert.id);
    
    // In a real app, you'd implement proper sharing functionality
    // For now, let's copy to clipboard
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        toast.success(`Link copied to clipboard`);
      })
      .catch(err => {
        toast.error('Failed to copy link');
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {currentUser.name}</h1>
            <p className="text-muted-foreground">Manage your account, view courses, and more</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="px-4 py-2 bg-ifind-aqua/10 rounded-lg text-ifind-aqua font-medium">
              Balance: {currentUser.walletBalance} {currentUser.currency}
            </div>
            <Button onClick={logout} variant="outline">Logout</Button>
          </div>
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-6">
            <TabsTrigger value="courses">
              <ListChecks className="h-4 w-4 mr-2" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="wallet">
              <CreditCard className="h-4 w-4 mr-2" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Star className="h-4 w-4 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="reports">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="profile">
              <UserCircle className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <div className="grid gap-4">
              {currentUser.enrolledCourses.length > 0 ? (
                currentUser.enrolledCourses.map((course) => (
                  <Card key={course.id}>
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>Expert: {course.expertName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm">Enrolled on: {formatDate(course.enrollmentDate)}</p>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-ifind-aqua" 
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <p className="text-sm">{course.progress}% completed</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-ifind-aqua hover:bg-ifind-teal transition-colors">
                        {course.completed ? "View Certificate" : "Continue Learning"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <ListChecks className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No courses enrolled</h3>
                  <p className="mt-2 text-muted-foreground">
                    You haven't enrolled in any courses yet.
                  </p>
                  <Button 
                    className="mt-4 bg-ifind-aqua hover:bg-ifind-teal transition-colors"
                    onClick={() => navigate('/experts')}
                  >
                    Browse Experts
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Balance</CardTitle>
                  <CardDescription>Your current balance and recharge options</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-6">
                    {currentUser.walletBalance.toFixed(2)} {currentUser.currency}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Recharge Wallet</h3>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        min="1"
                        placeholder={`Amount in ${currentUser.currency}`}
                        value={rechargeAmount}
                        onChange={(e) => setRechargeAmount(e.target.value)}
                      />
                      <Button 
                        onClick={handleRecharge}
                        className="bg-ifind-aqua hover:bg-ifind-teal transition-colors"
                      >
                        Recharge
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Your recent transactions</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentUser.transactions.length > 0 ? (
                      currentUser.transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(transaction.date)}
                            </div>
                          </div>
                          <div className={`font-medium ${transaction.type === 'recharge' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'recharge' ? '+' : '-'}
                            {transaction.amount} {transaction.currency}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <History className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">No transactions yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {currentUser.favoriteExperts.length > 0 ? (
                currentUser.favoriteExperts.map((expert) => (
                  <Card key={expert.id} className="overflow-hidden">
                    <CardHeader className="pb-0">
                      <div className="flex justify-between items-start">
                        <CardTitle>{expert.name}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeFromFavorites(expert.id)}
                        >
                          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                        </Button>
                      </div>
                      <CardDescription>{expert.specialization}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex items-center space-x-1 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-4 w-4 ${star <= (expert.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="text-sm ml-1">
                          {expert.rating || 'No ratings'}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        onClick={() => navigate(`/experts/${expert.id}`)}
                        className="bg-ifind-aqua hover:bg-ifind-teal transition-colors"
                      >
                        View Profile
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => shareExpertProfile(expert)}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No favorite experts</h3>
                  <p className="mt-2 text-muted-foreground">
                    You haven't added any experts to your favorites yet.
                  </p>
                  <Button 
                    className="mt-4 bg-ifind-aqua hover:bg-ifind-teal transition-colors"
                    onClick={() => navigate('/experts')}
                  >
                    Browse Experts
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="grid gap-4">
              {currentUser.reviews.length > 0 ? (
                currentUser.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Expert #{review.expertId}</CardTitle>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <CardDescription>{formatDate(review.date)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{review.comment}</p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/experts/${review.expertId}`)}
                      >
                        View Expert
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Star className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No reviews yet</h3>
                  <p className="mt-2 text-muted-foreground">
                    You haven't reviewed any experts yet.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="grid gap-4">
              {currentUser.reports.length > 0 ? (
                currentUser.reports.map((report) => (
                  <Card key={report.id}>
                    <CardHeader>
                      <CardTitle>Report: {report.reason}</CardTitle>
                      <CardDescription>
                        Status: <span className={`capitalize font-medium ${
                          report.status === 'pending' ? 'text-yellow-500' : 
                          report.status === 'reviewed' ? 'text-blue-500' : 
                          'text-green-500'
                        }`}>{report.status}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Submitted on {formatDate(report.date)}
                        </div>
                        <p>{report.details}</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/experts/${report.expertId}`)}
                      >
                        View Expert
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No reports</h3>
                  <p className="mt-2 text-muted-foreground">
                    You haven't reported any experts.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>View and manage your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                      <p className="text-lg">{currentUser.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                      <p className="text-lg">{currentUser.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                      <p className="text-lg">{currentUser.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Country</h3>
                      <p className="text-lg">{currentUser.country}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">City</h3>
                      <p className="text-lg">{currentUser.city || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Currency</h3>
                      <p className="text-lg">{currentUser.currency}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-ifind-aqua hover:bg-ifind-teal transition-colors">
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
      
      {/* Share Expert Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <span className="hidden">Share</span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Expert Profile</DialogTitle>
            <DialogDescription>
              Share this expert with your friends and family.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{currentExpert?.name}</p>
            <p className="text-sm text-muted-foreground">{currentExpert?.specialization}</p>
          </div>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button className="bg-ifind-aqua hover:bg-ifind-teal transition-colors">
              Copy Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
