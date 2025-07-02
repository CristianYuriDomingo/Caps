// app/api/admin/modules/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET - Fetch all modules with lesson count
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const modules = await prisma.module.findMany({
      include: {
        _count: {
          select: {
            lessons: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match your frontend interface
    const transformedModules = modules.map(module => ({
      id: module.id,
      title: module.title,
      image: module.image,
      lessonCount: module._count.lessons
    }));

    return NextResponse.json(transformedModules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new module
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, image } = body;

    if (!title || !image) {
      return NextResponse.json({ error: 'Title and image are required' }, { status: 400 });
    }

    const module = await prisma.module.create({
      data: {
        title,
        image
      }
    });

    return NextResponse.json({
      id: module.id,
      title: module.title,
      image: module.image,
      lessonCount: 0
    });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update a module
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, image } = body;

    if (!id) {
      return NextResponse.json({ error: 'Module ID is required' }, { status: 400 });
    }

    if (!title || !image) {
      return NextResponse.json({ error: 'Title and image are required' }, { status: 400 });
    }

    const module = await prisma.module.update({
      where: { id },
      data: {
        title,
        image
      },
      include: {
        _count: {
          select: {
            lessons: true
          }
        }
      }
    });

    return NextResponse.json({
      id: module.id,
      title: module.title,
      image: module.image,
      lessonCount: module._count.lessons
    });
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a module
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('id');

    if (!moduleId) {
      return NextResponse.json({ error: 'Module ID is required' }, { status: 400 });
    }

    // First check if the module exists and has lessons
    const moduleWithLessons = await prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        _count: {
          select: {
            lessons: true
          }
        }
      }
    });

    if (!moduleWithLessons) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // Delete the module (lessons will be deleted automatically due to cascade)
    await prisma.module.delete({
      where: { id: moduleId }
    });

    return NextResponse.json({ 
      message: 'Module deleted successfully',
      deletedLessons: moduleWithLessons._count.lessons
    });
  } catch (error) {
    console.error('Error deleting module:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}