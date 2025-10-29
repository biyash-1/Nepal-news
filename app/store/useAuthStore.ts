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