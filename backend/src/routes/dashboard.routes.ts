import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Get dashboard stats
router.get('/stats', authenticate, async (req: AuthRequest, res) => {
  try {
    const isSuperAdmin = req.user?.role === 'SUPER_ADMIN';
    const companyId = req.user?.companyId;

    let stats: any = {};

    if (isSuperAdmin) {
      const [totalCompanies, totalUsers, activeUsers, totalRoles, activityCount] = await Promise.all([
        prisma.company.count(),
        prisma.user.count(),
        prisma.user.count({ where: { isActive: true } }),
        prisma.role.count(),
        prisma.activity.count(),
      ]);

      stats = {
        totalCompanies,
        totalUsers,
        activeUsers,
        totalRoles,
        activityCount,
      };
    } else {
      const [totalUsers, activeUsers, totalRoles, activityCount] = await Promise.all([
        prisma.user.count({ where: { companyId } }),
        prisma.user.count({ where: { companyId, isActive: true } }),
        prisma.role.count({ where: { companyId } }),
        prisma.activity.count(),
      ]);

      stats = {
        totalUsers,
        activeUsers,
        totalRoles,
        activityCount,
      };
    }

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
    });
  }
});

// Get recent activity
router.get('/activity', authenticate, async (req: AuthRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const activities = await prisma.activity.findMany({
      take: limit,
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const formattedActivities = activities.map((activity) => ({
      id: activity.id,
      action: activity.action,
      user: `${activity.user.firstName} ${activity.user.lastName}`,
      timestamp: activity.timestamp.toISOString(),
    }));

    res.json({
      success: true,
      data: formattedActivities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activity',
    });
  }
});

export default router;
