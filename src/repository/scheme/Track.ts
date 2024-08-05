import { field } from '../../utils/firestore/Schema';
import { Datetime, Integer, TextString } from '../../utils/firestore/types';

export const trackSchema = {
  collectionName: 'tracks',
  defaultRef: true,
  fields: {
    title: field(TextString()),
    audioFile: field(TextString()),
    previewFile: field(TextString(true), () => null),
    artists: field(TextString(true), () => null),
    album: field(TextString(true), () => null),
    year: field(Integer(true), () => null),
    createdAt: field(Datetime(), () => new Date()),
  },
};
