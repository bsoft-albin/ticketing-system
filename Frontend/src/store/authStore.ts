import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserDto, AuthResponseDto } from '../types';


interface AuthState {
  user: UserDto | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (auth: AuthResponseDto) => void;
  logout: () => void;
  updateUser: (user: UserDto) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (auth) =>
        set({
          user: auth.user,
          token: auth.token,
          refreshToken: auth.refreshToken,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
      updateUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
