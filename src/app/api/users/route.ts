// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth' // Import your auth config
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Pass authOptions to getServerSession
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Fetch all users with their accounts
    const users = await prisma.user.findMany({
      include: {
        accounts: {
          select: {
            provider: true,
            type: true,
            createdAt: true,
          }
        },
        _count: {
          select: {
            sessions: true,
            accounts: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' }, 
      { status: 500 }
    )
  }
}