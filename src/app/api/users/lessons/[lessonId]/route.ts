// app/api/users/lessons/[lessonId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET single lesson by ID with all related data
export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const { lessonId } = params;

    if (!lessonId) {
      return NextResponse.json({
        success: false,
        error: 'Lesson ID is required',
        data: null
      }, { status: 400 });
    }

    // Fetch lesson with all related data
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
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
      return NextResponse.json({
        success: false,
        error: 'Lesson not found',
        data: null
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: lesson
    });

  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch lesson',
      data: null
    }, { status: 500 });
  }
}