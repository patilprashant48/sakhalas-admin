import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Get all roles
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 50;

    const [total, data] = await Promise.all([
      prisma.role.count(),
      prisma.role.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const roles = data.map((role) => ({
      ...role,
      permissions: role.permissions ? JSON.parse(role.permissions) : [],
    }));

    res.json({
      success: true,
      data: {
        data: roles,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roles',
    });
  }
});

// Get role by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const role = await prisma.role.findUnique({
      where: { id: req.params.id },
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    res.json({
      success: true,
      data: {
        ...role,
        permissions: role.permissions ? JSON.parse(role.permissions) : [],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch role',
    });
  }
});

export default router;
