import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as readline from 'readline';

const prisma = new PrismaClient();

// Create interface for reading user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log('\n🔐 Password Change Utility\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Get admin email
  const email = await question('Enter admin email address: ');

  if (!email || !email.trim()) {
    console.log('\n❌ Email is required!\n');
    process.exit(1);
  }

  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: email.trim() }
  });

  if (!user) {
    console.log(`\n❌ No user found with email: ${email}\n`);
    process.exit(1);
  }

  // Get new password
  const newPassword = await question('Enter new password: ');

  if (!newPassword || newPassword.length < 18) {
    console.log('\n❌ Password must be at least 18 characters long!\n');
    process.exit(1);
  }

  // Confirm password
  const confirmPassword = await question('Confirm new password: ');

  if (newPassword !== confirmPassword) {
    console.log('\n❌ Passwords do not match!\n');
    process.exit(1);
  }

  // Hash the new password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(newPassword, salt);

  // Update the user's password
  await prisma.user.update({
    where: { email: email.trim() },
    data: { password: hashedPassword }
  });

  console.log('\n✅ Password updated successfully!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Email:   ', user.email);
  console.log('🔑 New password has been set');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('\n❌ Error changing password:', e);
    process.exit(1);
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });
