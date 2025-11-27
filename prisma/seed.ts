import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Get admin details from environment variables or use defaults
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
  const adminName = process.env.ADMIN_NAME || 'Admin';

  // Generate a secure random password
  const password = crypto.randomBytes(16).toString('hex');

  // Hash the password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // Check if admin user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingUser) {
    console.log('\n⚠️  Admin user already exists with email:', adminEmail);
    console.log('   Skipping seed. Delete the user first if you want to recreate.\n');
    return;
  }

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
    },
  });

  console.log('\n✅ Admin user created successfully!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Email:    ', admin.email);
  console.log('👤 Name:     ', admin.name);
  console.log('🔑 Password: ', password);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n⚠️  IMPORTANT: Save this password securely!');
  console.log('   This is the only time it will be displayed.\n');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
