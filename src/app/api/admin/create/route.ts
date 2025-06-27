// app/api/admin/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  // 1. Verify the requesting user is an admin
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized: Only admins can create new admins' },
      { status: 401 }
    );
  }

  // 2. Parse and validate input
  const { name, email, password, secret } = await req.json();
  
  if (!name || !email || !password || !secret) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // 3. Verify the admin creation secret
  if (secret !== process.env.ADMIN_CREATION_SECRET) {
    return NextResponse.json(
      { error: 'Invalid admin creation secret' },
      { status: 403 }
    );
  }

  // 4. Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return NextResponse.json(
      { error: 'User already exists with this email' },
      { status: 409 }
    );
  }

  // 5. Create the new admin user
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'admin'
      },
      select: {  // Don't return sensitive data
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    // 6. Log the admin creation (you should implement proper logging)
    console.log(`New admin created by ${session.user.email}:`, newAdmin.email);

    return NextResponse.json(
      { 
        success: true,
        admin: newAdmin 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Admin creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}