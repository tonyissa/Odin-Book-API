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
import { Strategy as FacebookStrategy } from 'passport-facebook';
import UserModel, { User } from './models/User.js';
import bcrypt from 'bcryptjs';

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
  new LocalStrategy(async (username, password, done) => {
    try {
      const user: User | undefined | null = await UserModel.findOne({ $or: [{ email: username }, { username }] });
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

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      const user: any = UserModel.findOne({ $or: [{ facebookId: profile.id }, { email: profile.emails![0] }, { username: profile.displayName }] }).exec();
      if (!user) {
        const newUser = new UserModel({
          username: profile.displayName,
          email: profile.emails![0],
          password: '',
          bio: '',
          friends: [],
          requests: [],
          facebookId: profile.id
        })
        await newUser.save();
        return cb(null, newUser);
      } else if (!user.facebookId) {
        const response = await UserModel.findByIdAndUpdate(user._id, {
          facebookId: profile.id
        }).exec();
        return cb(null, response);
      }
      return cb(null, user);
    } catch (err) {
      console.log(err);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
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

// cors setup
app.use(cors());

app.use('/api', apiRouter);

export default app;