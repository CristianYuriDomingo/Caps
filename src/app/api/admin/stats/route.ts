// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all counts in parallel
    const [totalUsers, totalModules, totalLessons, totalTips] = await Promise.all([
      prisma.user.count(),
      prisma.module.count(),
      prisma.lesson.count(),
      prisma.tip.count()
    ]);

    return NextResponse.json({
      totalUsers,
      totalModules,
      totalLessons,
      totalTips
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}