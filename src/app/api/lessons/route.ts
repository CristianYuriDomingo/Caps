// app/api/admin/lessons/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET lessons (can filter by moduleId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    const whereClause = moduleId ? { moduleId } : {};

    const lessons = await prisma.lesson.findMany({
      where: whereClause,
      include: {
        tips: true,
        module: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}

// POST create new lesson
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, bubbleSpeech, timer, moduleId, tips } = body;

    // Validate required fields
    if (!title || !description || !moduleId) {
      return NextResponse.json(
        { error: 'Title, description, and moduleId are required' },
        { status: 400 }
      );
    }

    // Validate that module exists
    const moduleExists = await prisma.module.findUnique({
      where: { id: moduleId }
    });

    if (!moduleExists) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Create lesson with tips
    const lesson = await prisma.lesson.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        bubbleSpeech: bubbleSpeech?.trim() || '',
        timer: timer || 300,
        moduleId: moduleId,
        tips: {
          create: tips?.map((tip: any) => ({
            title: tip.title.trim(),
            description: tip.description.trim()
          })) || []
        }
      },
      include: {
        tips: true,
        module: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}

// DELETE lesson by ID (from query params)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Lesson ID is required' },
        { status: 400 }
      );
    }

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