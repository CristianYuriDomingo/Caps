// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No search query provided'
      });
    }

    const searchTerm = query.trim().toLowerCase();

    // Search in modules and lessons
    const modules = await prisma.module.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          {
            lessons: {
              some: {
                title: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              }
            }
          }
        ]
      },
      include: {
        lessons: {
          where: {
            title: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // If no direct matches, get all modules and filter lessons
    let allModules = [];
    if (modules.length === 0) {
      allModules = await prisma.module.findMany({
        include: {
          lessons: {
            where: {
              title: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }

    const searchResults = (modules.length > 0 ? modules : allModules)
      .filter(module => 
        module.title.toLowerCase().includes(searchTerm) || 
        module.lessons.length > 0
      )
      .map(module => ({
        category: module.title,
        image: module.image,
        moduleId: module.id,
        lessons: module.lessons.map(lesson => ({
          title: lesson.title,
          path: `/lessons/${lesson.id}`, // Adjust path as needed
          lessonId: lesson.id
        }))
      }));

    return NextResponse.json({
      success: true,
      data: searchResults,
      total: searchResults.length
    });

  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to perform search',
      data: []
    }, { status: 500 });
  }
}