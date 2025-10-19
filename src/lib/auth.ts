export type UserRole = 'buyer' | 'seller';

export interface User {
  name: string;
  email: string;
  company: string;
  country: string;
  role: UserRole;
}

const AUTH_KEY = 'herblocx_user';

export const authService = {
  login: (user: User) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },

  getUser: (): User | null => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },

  isAuthenticated: (): boolean => {
    return !!authService.getUser();
  },

  getUserRole: (): UserRole | null => {
    const user = authService.getUser();
    return user?.role || null;
  }
};
