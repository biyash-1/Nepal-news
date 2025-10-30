import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axiosInstance from '@/lib/axios'
import toast from 'react-hot-toast'
interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthState {
  user: User | null
  isLoading?: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>    
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,



      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await axiosInstance.post('/users/login', {
            email,
            password
          })

          const { user } = response.data

          set({
            user,
            isAuthenticated: true,
            isLoading: false
          })
          toast.success('Login successful')
        } catch (error: any) {
          set({ isLoading: false })
          const errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
          throw new Error(errorMessage)
        }
      },

      signup: async (username: string, email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await axiosInstance.post('/users/register', {
            username,
            email,
            password
          })

          const { user } = response.data

          set({
            user,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error: any) {
          set({ isLoading: false })
          const errorMessage = error.response?.data?.message || 'Account creation failed. Please try again.'
          console.error('Signup error:', errorMessage)
          toast.error(errorMessage)
          throw new Error(errorMessage)
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post('/users/logout')
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({
            user: null,
            isAuthenticated: false
          })
          toast.success('Logged out successfully')
        }
      },

   checkAuth: async () => {
  try {
    const res = await axiosInstance.get('/users/profile', { withCredentials: true });

    if (res.data.success && res.data.user) {
      set({
        user: {
          id: res.data.user._id,
          name: res.data.user.username,
          email: res.data.user.email,
          avatar: res.data.user.avatar,
        },
        isAuthenticated: true,
      });
      console.log('User is authenticated from checkAuth function', res.data.user);
    } else {
      set({ user: null, isAuthenticated: false });
    }
  } catch (error: any) {
    if (error.response?.status !== 401) {
      console.error('Fetching profile failed', error);
      // Log the response data for 500 errors to see the server message
      if (error.response?.status === 500) {
        console.error('Server 500 error details:', error.response.data);
      }
    }
    set({ user: null, isAuthenticated: false });
  }
}

    }),
    {
      name: 'auth-storage',
    
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)