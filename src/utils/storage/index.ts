import { v4 as uuidv4 } from 'uuid';
import { Storage } from 'firebase-admin/storage';

interface StorageFile {
  id: string;
  data: FileData;
}

export interface FileData {
  name: string;
  mime: string;
  content: Buffer;
}

export async function saveFile(storage: Storage, data: FileData): Promise<StorageFile> {
  const fileId = uuidv4();
  await storage.bucket().file(fileId).save(data.content, { contentType: data.mime });
  await storage.bucket().file(fileId).setMetadata({ metadata: { originalName: data.name } });
  return { id: fileId, data };
}
