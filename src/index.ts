import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { Storage, getStorage } from 'firebase-admin/storage';

import trackRoutes from './routes/track';

initializeApp();

declare global {
  namespace Express {
    export interface Request {
      db: Firestore,
      storage: Storage
    }
  }
}

const app = express();

app.use((req, _, next) => {
  req.db = getFirestore();
  req.storage = getStorage();
  next();
});

app.use(trackRoutes);

exports.app = onRequest({ timeoutSeconds: 30, maxInstances: 10 }, app);
