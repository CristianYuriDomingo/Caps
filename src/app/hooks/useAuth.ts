'use client'

import { useSession } from 'next-auth/react'
import type { Session } from 'next-auth'

interface UseAuthReturn {
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  user: Session['user'] | undefined
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession()

  return {
    session,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    user: session?.user,
  }
}