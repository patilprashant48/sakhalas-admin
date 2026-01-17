import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.middleware';
import { sendEmail } from '../utils/email';

const router = Router();
const prisma = new PrismaClient();

const userSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'EMPLOYEE']),
  password: z.string().min(6).optional(),
  companyId: z.string().optional(),
  isActive: z.boolean().optional(),
});

// Get all users
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const search = req.query.search as string;
    const role = req.query.role as string;

    const where: any = {};

    // Filter by company for non-super admins
    if (req.user?.role !== 'SUPER_ADMIN' && req.user?.companyId) {
      where.companyId = req.user.companyId;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const [total, data] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { company: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const users = data.map(({ password, ...user }) => user);

    res.json({
      success: true,
      data: {
        data: users,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
});

// Get user by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { company: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
    });
  }
});

// Create user
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = userSchema.parse(req.body);

    if (!data.password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        isActive: data.isActive ?? true,
      },
      include: { company: true },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: `New user created: ${user.firstName} ${user.lastName}`,
        userId: req.user!.id,
      },
    });

    // Send email to the new user with their credentials
    try {
      await sendEmail({
        to: user.email,
        subject: 'Your account has been created',
        text: `Hello ${user.firstName},\n\nYour account has been created.\n\nLogin Email: ${user.email}\nPassword: ${data.password}\n\nPlease log in and change your password after first login.`,
        html: `<p>Hello ${user.firstName},</p><p>Your account has been created.</p><p><b>Login Email:</b> ${user.email}<br/><b>Password:</b> ${data.password}</p><p>Please log in and change your password after first login.</p>`,
      });
    } catch (emailError) {
      // Optionally log email sending errors
      console.error('Failed to send user creation email:', emailError);
    }

    const { password, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
    });
  }
});

// Update user
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = userSchema.partial().parse(req.body);

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      include: { company: true },
    });

    await prisma.activity.create({
      data: {
        action: `User updated: ${user.firstName} ${user.lastName}`,
        userId: req.user!.id,
      },
    });

    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
    });
  }
});

// Delete user
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    await prisma.user.delete({
      where: { id: req.params.id },
    });

    await prisma.activity.create({
      data: {
        action: `User deleted: ${user?.firstName} ${user?.lastName}`,
        userId: req.user!.id,
      },
    });

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
    });
  }
});

// Toggle user active status
router.patch('/:id/toggle-active', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive: !user.isActive },
      include: { company: true },
    });

    await prisma.activity.create({
      data: {
        action: `User ${updated.isActive ? 'activated' : 'deactivated'}: ${updated.firstName} ${updated.lastName}`,
        userId: req.user!.id,
      },
    });

    const { password, ...userWithoutPassword } = updated;

    res.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle user status',
    });
  }
});

export default router;
