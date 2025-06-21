// Create this file: app/api/debug-session/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    console.log('🔍 Debug session route called')
    
    // Try to get session
    const session = await getServerSession(authOptions)
    
    console.log('Session data:', {
      hasSession: !!session,
      user: session?.user,
      expires: session?.expires
    })

    return NextResponse.json({
      hasSession: !!session,
      session: session,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Session debug error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      hasSession: false
    })
  }
}