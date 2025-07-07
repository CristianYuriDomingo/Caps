// app/api/users/lessons/route.ts
/**
 * USER-FACING API for fetching lessons for a specific module
 * This API is for users to view lessons in a module
 * 
 * Key features:
 * - Only GET operations (read-only for users)
 * - Returns lessons for a specific module
 * - No authentication required (lessons are public content)
 * - Returns data formatted for user interface
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET lessons for a specific module
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    if (!moduleId) {
      return NextResponse.json({
        success: false,
        error: 'Module ID is required',
        data: []
      }, { status: 400 });
    }

    // First check if module exists
    const module = await prisma.module.findUnique({
      where: { id: moduleId }
    });

    if (!module) {
      return NextResponse.json({
        success: false,
        error: 'Module not found',
        data: []
      }, { status: 404 });
    }

    // Fetch lessons for the module
    const lessons = await prisma.lesson.findMany({
      where: { moduleId },
      orderBy: {
        createdAt: 'asc'
      },
      select: {
        id: true,
        title: true,
        description: true,
        bubbleSpeech: true,
        timer: true,
        moduleId: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      data: lessons,
      total: lessons.length
    });

  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch lessons',
      data: []
    }, { status: 500 });
  }
}