// app/api/admin/modules/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all modules
export async function GET() {
  try {
    const modules = await prisma.module.findMany({
      include: {
        lessons: {
          include: {
            tips: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data to match your admin interface expectations
    const transformedModules = modules.map(module => ({
      id: module.id,
      title: module.title,
      image: module.image,
      lessonCount: module.lessons.length,
      status: 'active' as const, // You can add this field to your schema later
      createdAt: module.createdAt,
      updatedAt: module.updatedAt
    }));

    return NextResponse.json(transformedModules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    );
  }
}

// POST create new module
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, image } = body;

    // Validate required fields
    if (!title || !image) {
      return NextResponse.json(
        { error: 'Title and image are required' },
        { status: 400 }
      );
    }

    const module = await prisma.module.create({
      data: {
        title: title.trim(),
        image: image
      },
      include: {
        lessons: {
          include: {
            tips: true
          }
        }
      }
    });

    // Transform response to match admin interface
    const transformedModule = {
      id: module.id,
      title: module.title,
      image: module.image,
      lessonCount: module.lessons.length,
      status: 'active' as const,
      createdAt: module.createdAt,
      updatedAt: module.updatedAt
    };

    return NextResponse.json(transformedModule, { status: 201 });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json(
      { error: 'Failed to create module' },
      { status: 500 }
    );
  }
}

// DELETE module by ID (from query params)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Module ID is required' },
        { status: 400 }
      );
    }

    // Check if module exists
    const existingModule = await prisma.module.findUnique({
      where: { id }
    });

    if (!existingModule) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Delete module (lessons and tips will be cascade deleted)
    await prisma.module.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error('Error deleting module:', error);
    return NextResponse.json(
      { error: 'Failed to delete module' },
      { status: 500 }
    );
  }
}