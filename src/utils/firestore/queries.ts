import { Firestore } from 'firebase-admin/firestore';

import { InsertSchemaType, Schema, schemaDefaults, SchemaType } from './Schema';

export async function insertDoc<S extends Schema<D>, D extends boolean = S['defaultRef']>(
  db: Firestore,
  schema: S,
  data: InsertSchemaType<S, D>,
): Promise<SchemaType<S, D>> {
  const fulfilledData = {
    ...schemaDefaults(schema),
    ...data,
  };
  if ('_ref' in fulfilledData && typeof fulfilledData._ref === 'string') {
    const ref = db.collection(schema.collectionName).doc(fulfilledData._ref);
    await ref.set(fulfilledData);
    return fulfilledData;
  } else {
    const result = await db.collection(schema.collectionName).add(fulfilledData);
    return { ...fulfilledData, _ref: result.id };
  }
}
