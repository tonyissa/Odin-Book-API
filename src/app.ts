import express from 'express'
import path from 'path'
import url from 'url';
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors';
import 'dotenv/config'
import apiRouter from './routes/api.js';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import User from './models/User.js';
import bcrypt from 'bcrypt';

// mongoose setup
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;

async function main() {
  await mongoose.connect(mongoDB!);
}

main().catch(err => console.log(err)).then(() => console.log('MongoDB Connected'));

// passport setup
const app = express()

passport.use(
  new LocalStrategy({ usernameField: 'id' }, async (username, password, done) => {
    try {
      const user: any = await User.findOne({ $or: [{ email: username }, { username }] }).exec();
      if (!user) {
        return done(null, false, { message: "Username/email not found" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      };
      
      return done(null, user);
    } catch(err) {
      return done(err);
    };
  })
);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: 'http://localhost:3000/api/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ googleId: profile.id }).exec();
    if (!user) {
      const currentUser = await User.findOne({ email: profile.emails?.[0].value }).exec();
      if (currentUser) {
        user = currentUser
      }
    }
    if (!user) {
      const newUser = await User.create({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails?.[0].value,
        password: ''
      })
      return done(null, newUser)
    } else {
      return done(null, user)
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    const user: any = await User.findById(_id).exec();
    done(null, user);
  } catch(err) {
    done(err);
  };
});

app.use(session({ secret: process.env.SESSION_SEKRET!, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(logger(process.env.NODE_ENV === 'prod' ? 'common' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// cors
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));

app.use('/api', apiRouter);

export default app;