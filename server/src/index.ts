import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './lib/db';
import pillarRoutes from './routes/pillars';
import keywordRoutes from './routes/keywords';
import importRoutes from './routes/import';

dotenv.config();

async function main() {
  await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/topic_cluster');

  const app = express();
  app.use(morgan('dev'));
  app.use(express.json({ limit: '5mb' }));
  app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));

  app.use('/api/pillars', pillarRoutes);
  app.use('/api/keywords', keywordRoutes);
  app.use('/api/import', importRoutes);

  const PORT = Number(process.env.PORT || 4000);
  app.listen(PORT, () => console.log('API on :' + PORT));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
