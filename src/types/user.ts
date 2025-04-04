
// Basic user type for consistent use across the application
export interface UserBasic {
  id: string;
  name: string;
  email?: string;
}

export interface UserAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserBasic | null;
}
