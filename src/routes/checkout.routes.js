
import { Router } from 'express';
import Stripe from 'stripe';
import authMiddleware from '../middleware/auth.middleware.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = Router();

router.post('/create-checkout-session', authMiddleware, async (req, res) => {
  const { items } = req.body; // نستقبل المنتجات من الفرونت إند
const userId = req.user.userId; // نحصل على معرف المستخدم من التوكن
  try {
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(parseFloat(item.price) * 100), // السعر بالسنتات
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/success`, // صفحة سننشئها لاحقًا
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/cart`, // يعود للسلة إذا ألغى الدفع
      metadata: { // <-- إضافة هوية المستخدم هنا
        userId: userId,
      }
    });

    res.json({ id: session.id, url: session.url });

  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

export default router;