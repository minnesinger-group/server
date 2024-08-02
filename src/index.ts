import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';

initializeApp();

export const upload = onRequest(
  async (req, res) => {
    res.status(200);
    res.send('OK');
  },
);
