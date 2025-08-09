import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/orders - Fetches orders for the logged-in user
router.get('/orders', authMiddleware, async (req, res) => {
  const userId = req.user.userId;

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        orderItems: { // لجلب تفاصيل المنتجات داخل كل طلب
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        orderDate: 'desc', // ترتيب الطلبات من الأحدث للأقدم
      },
    });

    res.json(orders);
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;