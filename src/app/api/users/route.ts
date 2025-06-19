// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Optional: Check if user is authenticated
    const session = await getServerSession()
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