import busboy from 'busboy';
import * as yup from 'yup';
import { Request } from 'firebase-functions/v2/https';

import { FileData } from '../utils/storage';

export const memoryFileSchema = yup.object({
  name: yup.string().required(),
  mime: yup.string().required(),
  content: yup.mixed<Buffer>().required(),
});

export function parseFormData(req: Request): Promise<{ [key: string]: string | FileData }> {
  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: req.headers });

    const result: { [key: string]: string | FileData } = {};

    bb.on('field', (fieldname, value) => {
      result[fieldname] = value;
    });

    bb.on('file', (fieldname, stream, { filename, mimeType }) => {
      const data: any[] = [];

      stream.on('data', chunk => {
        data.push(chunk);
      });
      stream.on('end', () => {
        result[fieldname] = {
          name: filename,
          mime: mimeType,
          content: Buffer.concat(data),
        };
      });
    });

    bb.on('close', () => resolve(result));
    bb.on('error', reject);

    bb.end(req.rawBody);
  });
}
