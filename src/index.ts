import { onRequest } from 'firebase-functions/v2/https';

export const upload = onRequest(
  async (req, res) => {
    res.status(200);
    res.send('OK');
  },
);
