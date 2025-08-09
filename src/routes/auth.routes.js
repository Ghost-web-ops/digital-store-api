import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import passport from 'passport';


const router = Router();
const prisma = new PrismaClient();

// Zod Schema for validation
const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

// --- Register Route ---
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: hashedPassword,
      },
    });

    const { password_hash, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Registration Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- Login Route ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.json({ token });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        console.error("Login Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/google', passport.authenticate('google'));

// --- المسار الثاني: الرابط الذي يعود إليه جوجل ---
// هذا المسار يستقبل بيانات المستخدم من جوجل
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // إذا نجحت المصادقة، سيكون req.user متاحًا
    // الآن ننشئ JWT تمامًا كما في تسجيل الدخول العادي
    const payload = {
      id: req.user.id,
      username: req.user.username,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    // إعادة توجيه المستخدم إلى الواجهة الأمامية مع إرسال التوكن
   // This is the line inside your /api/auth/google/callback route
res.redirect(`${process.env.NEXT_PUBLIC_API_URL}/google-callback?token=${token}`);
  }
);

export default router;