import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
   console.log("--- New Request ---");
  console.log("Authorization Header Received:", req.headers['authorization']);
  console.log("JWT_SECRET on Server:", process.env.JWT_SECRET ? `Exists (starts with: ${process.env.JWT_SECRET.substring(0, 4)}...)` : "!!! SECRET NOT FOUND !!!");
  // ------------------------------------
  // 1. احصل على التوكن من الهيدر
  const authHeader = req.header('Authorization');

  // 2. تحقق مما إذا كان الهيدر موجودًا
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  // 3. تحقق من أن التنسيق صحيح ("Bearer token")
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid token format.' });
  }

const token = authHeader.replace('Bearer ', '').trim();

  try {
    // 4. تحقق من صحة التوكن باستخدام المفتاح السري
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    // 5. أضف بيانات المستخدم إلى كائن الطلب (req)
    req.user = decoded;
    
    // 6. اسمح للطلب بالمرور إلى وجهته التالية
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

export default authMiddleware;