
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type UserTransaction = {
  id: string;
  date: string;
  type: 'recharge' | 'payment';
  amount: number;
  currency: string;
  description: string;
};

export type Expert = {
  id: number;
  name: string;
  specialization: string;
  image?: string;
  rating?: number;
};

export type Review = {
  id: string;
  expertId: number;
  rating: number;
  comment: string;
  date: string;
};

export type Report = {
  id: string;
  expertId: number;
  reason: string;
  details: string;
  date: string;
  status: 'pending' | 'reviewed' | 'resolved';
};

export type Course = {
  id: string;
  title: string;
  expertId: number;
  expertName: string;
  enrollmentDate: string;
  progress: number;
  completed: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city?: string;
  currency: string;
  walletBalance: number;
  favoriteExperts: Expert[];
  enrolledCourses: Course[];
  transactions: UserTransaction[];
  reviews: Review[];
  reports: Report[];
};

type UserAuthContextType = {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city?: string;
  }) => Promise<boolean>;
  logout: () => void;
  addToFavorites: (expert: Expert) => void;
  removeFromFavorites: (expertId: number) => void;
  rechargeWallet: (amount: number) => void;
  addReview: (expertId: number, rating: number, comment: string) => void;
  reportExpert: (expertId: number, reason: string, details: string) => void;
  getExpertShareLink: (expertId: number) => string;
  hasTakenServiceFrom: (expertId: number) => boolean;
};

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

type UserWithPassword = User & { password: string };

const DEFAULT_CURRENCY_MAP: Record<string, string> = {
  'India': 'INR',
  'United States': 'USD',
  'United Kingdom': 'GBP',
  'Canada': 'CAD',
  'Australia': 'AUD',
  // Add more as needed
};

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserWithPassword[]>([]);
  const navigate = useNavigate();

  // Load users and current user from localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem('ifindlife-users');
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (e) {
        console.error("Error loading users:", e);
      }
    }

    const storedUser = localStorage.getItem('ifindlife-user-auth');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('ifindlife-user-auth');
      }
    }
  }, []);

  // Update localStorage whenever users state changes
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('ifindlife-users', JSON.stringify(users));
    }
  }, [users]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would call an API
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('ifindlife-user-auth', JSON.stringify(userWithoutPassword));
      toast.success(`Welcome back, ${user.name}!`);
      return true;
    } else {
      toast.error('Invalid email or password');
      return false;
    }
  };

  const signup = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city?: string;
  }): Promise<boolean> => {
    // Check if email already exists
    if (users.some(user => user.email === userData.email)) {
      toast.error('Email already exists');
      return false;
    }

    // Determine currency based on country
    const currency = DEFAULT_CURRENCY_MAP[userData.country] || 'USD';

    const newUser: UserWithPassword = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      country: userData.country,
      city: userData.city,
      currency,
      walletBalance: 0,
      favoriteExperts: [],
      enrolledCourses: [],
      transactions: [],
      reviews: [],
      reports: []
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    // Log the user in automatically
    const { password, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('ifindlife-user-auth', JSON.stringify(userWithoutPassword));
    
    toast.success('Account created successfully!');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ifindlife-user-auth');
    navigate('/login');
    toast.info('You have been logged out');
  };

  const addToFavorites = (expert: Expert) => {
    if (!currentUser) return;

    // Check if already in favorites
    if (currentUser.favoriteExperts.some(e => e.id === expert.id)) {
      toast.info('This expert is already in your favorites');
      return;
    }

    const updatedUser = {
      ...currentUser,
      favoriteExperts: [...currentUser.favoriteExperts, expert]
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('ifindlife-user-auth', JSON.stringify(updatedUser));

    // Update the user in the users array
    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        return { ...user, favoriteExperts: [...user.favoriteExperts, expert] };
      }
      return user;
    });

    setUsers(updatedUsers);
    toast.success(`${expert.name} added to favorites`);
  };

  const removeFromFavorites = (expertId: number) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      favoriteExperts: currentUser.favoriteExperts.filter(e => e.id !== expertId)
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('ifindlife-user-auth', JSON.stringify(updatedUser));

    // Update the user in the users array
    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        return { 
          ...user, 
          favoriteExperts: user.favoriteExperts.filter(e => e.id !== expertId) 
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    toast.success('Expert removed from favorites');
  };

  const rechargeWallet = (amount: number) => {
    if (!currentUser) return;

    const transaction: UserTransaction = {
      id: `txn_${Date.now()}`,
      date: new Date().toISOString(),
      type: 'recharge',
      amount,
      currency: currentUser.currency,
      description: 'Wallet recharge'
    };

    const updatedUser = {
      ...currentUser,
      walletBalance: currentUser.walletBalance + amount,
      transactions: [transaction, ...currentUser.transactions]
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('ifindlife-user-auth', JSON.stringify(updatedUser));

    // Update the user in the users array
    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        return {
          ...user,
          walletBalance: user.walletBalance + amount,
          transactions: [transaction, ...user.transactions]
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    toast.success(`Recharged wallet with ${amount} ${currentUser.currency}`);
  };

  const hasTakenServiceFrom = (expertId: number): boolean => {
    if (!currentUser) return false;
    
    // Check if the user has enrolled in any course from this expert
    const hasEnrolled = currentUser.enrolledCourses.some(course => course.expertId === expertId);
    
    // Check if the user has any transactions related to this expert
    const hasTransaction = currentUser.transactions.some(
      txn => txn.type === 'payment' && txn.description.includes(`expert_${expertId}`)
    );
    
    return hasEnrolled || hasTransaction;
  };

  const addReview = (expertId: number, rating: number, comment: string) => {
    if (!currentUser) return;
    
    // Check if user has taken service from this expert
    if (!hasTakenServiceFrom(expertId)) {
      toast.error('You can only review experts after taking their service');
      return;
    }
    
    const review: Review = {
      id: `review_${Date.now()}`,
      expertId,
      rating,
      comment,
      date: new Date().toISOString()
    };
    
    const updatedUser = {
      ...currentUser,
      reviews: [review, ...currentUser.reviews]
    };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('ifindlife-user-auth', JSON.stringify(updatedUser));
    
    // Update the user in the users array
    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        return {
          ...user,
          reviews: [review, ...user.reviews]
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    toast.success('Review submitted successfully');
  };
  
  const reportExpert = (expertId: number, reason: string, details: string) => {
    if (!currentUser) return;
    
    // Check if user has taken service from this expert
    if (!hasTakenServiceFrom(expertId)) {
      toast.error('You can only report experts after taking their service');
      return;
    }
    
    const report: Report = {
      id: `report_${Date.now()}`,
      expertId,
      reason,
      details,
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    const updatedUser = {
      ...currentUser,
      reports: [report, ...currentUser.reports]
    };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('ifindlife-user-auth', JSON.stringify(updatedUser));
    
    // Update the user in the users array
    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        return {
          ...user,
          reports: [report, ...user.reports]
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    toast.success('Report submitted successfully');
  };
  
  const getExpertShareLink = (expertId: number): string => {
    // In a real app, this might generate a unique link with a tracking code
    return `${window.location.origin}/experts/${expertId}?ref=${currentUser?.id || 'guest'}`;
  };

  return (
    <UserAuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        signup,
        logout,
        addToFavorites,
        removeFromFavorites,
        rechargeWallet,
        addReview,
        reportExpert,
        getExpertShareLink,
        hasTakenServiceFrom
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};
