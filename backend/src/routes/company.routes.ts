import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

const companySchema = z.object({
  name: z.string().min(1),
  domain: z.string().min(1),
  isActive: z.boolean().optional(),
  logo: z.string().optional(),
});

// Get all companies (Super Admin only)
router.get('/', authenticate, authorize('SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const search = req.query.search as string;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { domain: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      prisma.company.count({ where }),
      prisma.company.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: {
            select: { users: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const companies = data.map((c) => ({
      ...c,
      userCount: c._count.users,
      _count: undefined,
    }));

    res.json({
      success: true,
      data: {
        data: companies,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch companies',
    });
  }
});

// Get company by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    res.json({
      success: true,
      data: {
        ...company,
        userCount: company._count.users,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company',
    });
  }
});

// Create company
router.post('/', authenticate, authorize('SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const data = companySchema.parse(req.body);

    const company = await prisma.company.create({
      data: {
        ...data,
        isActive: data.isActive ?? true,
      },
    });

    res.status(201).json({
      success: true,
      data: company,
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
        message: 'Domain already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create company',
    });
  }
});

// Update company
router.put('/:id', authenticate, authorize('SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const data = companySchema.partial().parse(req.body);

    const company = await prisma.company.update({
      where: { id: req.params.id },
      data,
    });

    res.json({
      success: true,
      data: company,
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update company',
    });
  }
});

// Delete company
router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    await prisma.company.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      message: 'Company deleted successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to delete company',
    });
  }
});

// Toggle company active status
router.patch('/:id/toggle-active', authenticate, authorize('SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    const updated = await prisma.company.update({
      where: { id: req.params.id },
      data: { isActive: !company.isActive },
    });

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle company status',
    });
  }
});

export default router;
