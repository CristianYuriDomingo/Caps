// app/api/admin/lessons/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET single lesson by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Add authentication check
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        tips: {
          orderBy: {
            createdAt: 'asc'
          }
        },
        module: {
          select: {
            id: true,
            title: true,
            image: true
          }
        }
      }
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}

// PUT update lesson by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Add authentication check
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { title, description, bubbleSpeech, timer, tips } = body;

    // Validation
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
      include: { tips: true }
    });

    if (!existingLesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Update lesson and tips in a transaction
    const updatedLesson = await prisma.$transaction(async (prisma) => {
      // Update lesson basic info
      const lesson = await prisma.lesson.update({
        where: { id },
        data: {
          title: title.trim(),
          description: description.trim(),
          bubbleSpeech: bubbleSpeech?.trim() || '',
          timer: timer || 300
        }
      });

      // If tips are provided, replace all tips
      if (tips && Array.isArray(tips)) {
        // Delete existing tips
        await prisma.tip.deleteMany({
          where: { lessonId: id }
        });

        // Create new tips
        if (tips.length > 0) {
          await prisma.tip.createMany({
            data: tips.map((tip: any) => ({
              lessonId: id,
              title: tip.title.trim(),
              description: tip.description.trim(),
              image: tip.image || null
            }))
          });
        }
      }

      // Return updated lesson with tips
      return prisma.lesson.findUnique({
        where: { id },
        include: {
          tips: {
            orderBy: {
              createdAt: 'asc'
            }
          },
          module: {
            select: {
              id: true,
              title: true,
              image: true
            }
          }
        }
      });
    });

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    );
  }
}

// DELETE lesson by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Add authentication check
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id }
    });

    if (!existingLesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Delete lesson (tips will be cascade deleted)
    await prisma.lesson.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    );
  }
}