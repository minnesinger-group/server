import { Router } from 'express';
import { Request } from 'firebase-functions/v2/https';
import * as yup from 'yup';

import { saveFile } from '../utils/storage';
import { insertDoc } from '../utils/firestore/queries';
import { trackSchema } from '../repository/scheme/Track';
import { parseFormData, memoryFileSchema } from './utils';

const router = Router();

const uploadSchema = yup.object({
  title: yup.string().required(),
  artists: yup.string().nullable().default(null),
  album: yup.string().nullable().default(null),
  year: yup.number().nullable().default(null),
  audio: memoryFileSchema.required(),
  preview: memoryFileSchema.nullable().default(null),
});

router.post('/upload', async (req, res, next) => {
  try {
    const body = await parseFormData(req as Request);
    const data = await uploadSchema.validate(body);

    const audioFile = await saveFile(req.storage, data.audio);
    const previewFile = data.preview ? await saveFile(req.storage, data.preview) : null;

    const track = await insertDoc(req.db, trackSchema, {
      title: data.title,
      artists: data.artists,
      album: data.album,
      year: data.year,
      audioFile: audioFile.id,
      previewFile: previewFile?.id ?? null,
    });

    res.send(track);
  } catch (err) {
    next(err);
  }
});

export default router;
