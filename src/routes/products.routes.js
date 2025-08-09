import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
// لاحقًا، سنضيف "الحارس" هنا لحماية بعض المسارات
 import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();
const prisma = new PrismaClient();

// Zod Schema for product validation
const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.number().positive(),
  fileUrl: z.string().url(),
  imageUrl: z.string().url().optional(),
});

// --- 1. Route to CREATE a new product ---
// (لاحقًا، سنقوم بتأمين هذا المسار باستخدام `auth` middleware)
router.post('/products', authMiddleware, async (req, res) => {
  try {
    const validatedData = productSchema.parse(req.body);

    const newProduct = await prisma.product.create({
      data: validatedData,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Create Product Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- 2. Route to GET all products ---
router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;