import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import 'dotenv/config';


const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
  const googleId = profile.id;
  const email = profile.emails[0].value;
  const username = profile.displayName;

  try {
    // 1. Check if user exists with this Google ID
    let user = await prisma.user.findUnique({
      where: { googleId: googleId },
    });

    if (user) {
      // User exists, log them in
      return done(null, user);
    }
    
    // 2. If not, check if user exists with this email
    user = await prisma.user.findUnique({
      where: { email: email },
    });
    
    if (user) {
      // User exists by email, so LINK their Google ID
      const updatedUser = await prisma.user.update({
        where: { email: email },
        data: { googleId: googleId },
      });
      return done(null, updatedUser);
    }
    
    // 3. If no user exists at all, create a new one
    const newUser = await prisma.user.create({
      data: {
        username: username,
        email: email,
        googleId: googleId,
      },
    });
    return done(null, newUser);

  } catch (error) {
    return done(error, false);
  }
}
  )
);

// (The serializeUser and deserializeUser functions remain the same)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return done(new Error("User not found"), null);
    }
    done(null, user.rows[0]);
  } catch (error) {
    done(error, null);
  }
});
