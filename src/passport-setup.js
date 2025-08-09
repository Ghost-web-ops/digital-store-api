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

        let userResult = await prisma.user.findUnique({ where: { googleId } });

        if (userResult.rows.length > 0) {
          // User exists, log them in
          return done(null, userResult.rows[0]);
        }

        // 2. If not, check if user exists with this email

        userResult = await prisma.user.findUnique({ where: { email } });

        if (userResult.rows.length > 0) {
          // User exists by email, so LINK their Google ID
          const updatedUser = await prisma.user.update({
            where: { email },
            data: { googleId, username },
          });
          return done(null, updatedUser.rows[0]);
        }

        // 3. If no user exists at all, create a new one
        const newUser = await prisma.user.create({
          data: {
            googleId,
            email,
            username,
          },
        });
        return done(null, newUser.rows[0]);
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
