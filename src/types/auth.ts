
export type UserRole = 'user' | 'expert' | 'admin' | 'super_admin';

export interface BaseUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string;
}

export interface RegularUser extends BaseUser {
  role: 'user';
  profile?: {
    name?: string;
    avatar?: string;
    preferences?: Record<string, any>;
  };
}

export interface ExpertUser extends BaseUser {
  role: 'expert';
  expertProfile: {
    specializations: string[];
    bio: string;
    rating?: number;
    availability?: Record<string, any>;
    verificationStatus: 'pending' | 'verified' | 'rejected';
  };
}

export interface AdminUser extends BaseUser {
  role: 'admin' | 'super_admin';
  username: string;
  permissions: {
    canManageUsers: boolean;
    canManageExperts: boolean;
    canManageContent: boolean;
    canViewAnalytics: boolean;
    canManageServices: boolean;
    canManagePrograms: boolean;
    canDeleteContent: boolean;
    canApproveExperts: boolean;
    canManageBlog: boolean;
    canManageTestimonials: boolean;
  };
}

export type User = RegularUser | ExpertUser | AdminUser;

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: User | null;
  sessionType: 'none' | 'user' | 'expert' | 'admin' | 'dual';
  error: string | null;
}
