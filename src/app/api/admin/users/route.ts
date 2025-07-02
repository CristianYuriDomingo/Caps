// FILE 1: app/api/admin/users/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if user is admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user?.email! }
    })

    if (currentUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    // Fetch all users with additional data for admin dashboard
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        image: true,
        sessions: {
          orderBy: {
            expires: 'desc'
          },
          take: 1,
          select: {
            expires: true
          }
        },
        accounts: {
          select: {
            provider: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform data to match your frontend interface
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: user.name || 'No Name',
      email: user.email,
      role: user.role as 'admin' | 'user',
      status: user.emailVerified ? 'active' : 'inactive' as 'active' | 'inactive',
      createdAt: user.createdAt.toISOString(),
      lastLogin: user.sessions[0]?.expires ? new Date(user.sessions[0].expires).toISOString() : undefined,
      completedLessons: 0, // You'll need to implement this based on your lesson completion tracking
      totalScore: 0 // You'll need to implement this based on your scoring system
    }))

    return NextResponse.json(transformedUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' }, 
      { status: 500 }
    )
  }
}