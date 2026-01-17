import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create companies
  const company1 = await prisma.company.create({
    data: {
      name: 'Acme Corp',
      domain: 'acme.com',
      isActive: true,
    },
  });

  const company2 = await prisma.company.create({
    data: {
      name: 'TechStart Inc',
      domain: 'techstart.com',
      isActive: true,
    },
  });

  const company3 = await prisma.company.create({
    data: {
      name: 'Global Solutions',
      domain: 'global.com',
      isActive: false,
    },
  });

  console.log('✅ Companies created');

  // Create users
  const superAdminPassword = await bcrypt.hash('password123', 10);
  const superAdmin = await prisma.user.create({
    data: {
      email: 'super@admin.com',
      password: superAdminPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  const companyAdmin = await prisma.user.create({
    data: {
      email: 'admin@acme.com',
      password: await bcrypt.hash('password123', 10),
      firstName: 'John',
      lastName: 'Doe',
      role: 'COMPANY_ADMIN',
      companyId: company1.id,
      isActive: true,
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'manager@acme.com',
      password: await bcrypt.hash('password123', 10),
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'MANAGER',
      companyId: company1.id,
      isActive: true,
    },
  });

  const employee = await prisma.user.create({
    data: {
      email: 'employee@acme.com',
      password: await bcrypt.hash('password123', 10),
      firstName: 'Bob',
      lastName: 'Johnson',
      role: 'EMPLOYEE',
      companyId: company1.id,
      isActive: true,
    },
  });

  console.log('✅ Users created');

  // Create roles
  await prisma.role.createMany({
    data: [
      {
        name: 'Company Admin',
        description: 'Full access to company resources',
        isSystem: true,
        permissions: JSON.stringify([]),
      },
      {
        name: 'Manager',
        description: 'Manage team members',
        isSystem: true,
        permissions: JSON.stringify([]),
      },
      {
        name: 'Employee',
        description: 'Basic access',
        isSystem: true,
        permissions: JSON.stringify([]),
      },
    ],
  });

  console.log('✅ Roles created');

  // Create activities
  await prisma.activity.createMany({
    data: [
      {
        action: 'New user registered',
        userId: superAdmin.id,
      },
      {
        action: 'Role updated',
        userId: companyAdmin.id,
      },
      {
        action: 'Company settings changed',
        userId: companyAdmin.id,
      },
      {
        action: 'Permission granted',
        userId: manager.id,
      },
    ],
  });

  console.log('✅ Activities created');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📝 Login credentials:');
  console.log('Super Admin:');
  console.log('  Email: super@admin.com');
  console.log('  Password: password123');
  console.log('\nCompany Admin:');
  console.log('  Email: admin@acme.com');
  console.log('  Password: password123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
