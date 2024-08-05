import { FieldType, ValueType } from './types';

export const field = <T extends ValueType, D extends (() => FieldType<T>) | undefined = undefined>(type: T, defaultValue?: D): Field<T, typeof defaultValue> => ({
  type,
  defaultValue,
});

type Field<T extends ValueType, D extends (() => FieldType<T>) | undefined> = {
  type: T;
  defaultValue: D;
}

export interface Schema<D extends boolean> {
  collectionName: string;
  defaultRef: D;
  fields: { [key: string]: Field<any, any> };
}

type SchemaDefaultType<S extends Schema<D>, D extends boolean = S['defaultRef']> = {
  [key in keyof S['fields'] as S['fields'][key]['defaultValue'] extends undefined ? never : key]: FieldType<S['fields'][key]['type']>
}

type SchemaRequiredType<S extends Schema<D>, D extends boolean = S['defaultRef']> = {
  [key in keyof S['fields'] as S['fields'][key]['defaultValue'] extends undefined ? key : never]: FieldType<S['fields'][key]['type']>
}

type BaseSchemaType<S extends Schema<D>, D extends boolean = S['defaultRef']> =
  SchemaDefaultType<S, D> & SchemaRequiredType<S, D>

export type SchemaType<S extends Schema<D>, D extends boolean = S['defaultRef']> =
  D extends true ? BaseSchemaType<S, D> : BaseSchemaType<S, D> & { _ref: string };

type BaseInsertSchemaType<S extends Schema<D>, D extends boolean = S['defaultRef']> =
  Partial<SchemaDefaultType<S, D>> & SchemaRequiredType<S, D>

export type InsertSchemaType<S extends Schema<D>, D extends boolean = S['defaultRef']> =
  D extends true ? BaseInsertSchemaType<S, D> : BaseInsertSchemaType<S, D> & { _ref: string };

export function schemaDefaults<S extends Schema<D>, D extends boolean = S['defaultRef']>(schema: S): SchemaDefaultType<S, D> {
  return Object.entries(schema.fields).reduce((acc, [key, value]) =>
      value.defaultValue !== undefined ? ({ ...acc, [key]: value.defaultValue() }) : acc,
    {} as SchemaDefaultType<S, D>,
  );
}
