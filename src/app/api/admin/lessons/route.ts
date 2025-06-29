// app/api/admin/lessons/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET - Fetch lessons for a specific module
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    if (!moduleId) {
      return NextResponse.json({ error: 'Module ID is required' }, { status: 400 });
    }

    const lessons = await prisma.lesson.findMany({
      where: { moduleId },
      include: {
        tips: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new lesson
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, bubbleSpeech, timer, moduleId, tips } = body;

    if (!title || !description || !moduleId) {
      return NextResponse.json({ error: 'Title, description, and module ID are required' }, { status: 400 });
    }

    // Create lesson with tips in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      const lesson = await prisma.lesson.create({
        data: {
          title,
          description,
          bubbleSpeech: bubbleSpeech || '',
          timer: timer || 300,
          moduleId
        }
      });

      // Create tips if provided
      if (tips && tips.length > 0) {
        await prisma.tip.createMany({
          data: tips.map((tip: any) => ({
            title: tip.title,
            description: tip.description,
            lessonId: lesson.id
          }))
        });
      }

      // Return lesson with tips
      return await prisma.lesson.findUnique({
        where: { id: lesson.id },
        include: { tips: true }
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a lesson
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('id');

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }

    await prisma.lesson.delete({
      where: { id: lessonId }
    });

    return NextResponse.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}