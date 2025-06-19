import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function seed() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.create({
    data: {
      email: 'admin@bantaybayan.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin'
    }
  });
}

seed();