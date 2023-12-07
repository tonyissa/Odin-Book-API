import express from 'express'
import path from 'path'
import url from 'url';
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors';
import 'dotenv/config'

import apiRouter from './routes/api.js';

// mongoose setup
import mongoose from 'mongoose';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

mongoose.set("strictQuery", false);
const mongoDB: any = process.env.MONGODB_URI;

async function main() {
  await mongoose.connect(mongoDB);
}

main().catch(err => console.log(err)).then(() => console.log('i shiggy diggy'));

const app = express();

app.use(logger(process.env.NODE_ENV === 'prod' ? 'common' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// cors setup
app.use(cors());

app.use('/api', apiRouter);

export default app;