export const TextString = <N extends boolean = false>(nullable?: N) => ({
  name: 'Text',
  nullable: nullable ?? false,
}) as const;
export const Integer = <N extends boolean = false>(nullable?: N) => ({
  name: 'Integer',
  nullable: nullable ?? false,
}) as const;
export const Datetime = <N extends boolean = false>(nullable?: N) => ({
  name: 'Datetime',
  nullable: nullable ?? false,
}) as const;

export type ValueType =
  ReturnType<typeof TextString> |
  ReturnType<typeof Integer> |
  ReturnType<typeof Datetime>;

type IsNullable<T, N extends boolean> = N extends false ? T : (T | null);

type BaseType<C extends ValueType> =
  C['name'] extends ReturnType<typeof TextString>['name'] ? string :
    C['name'] extends ReturnType<typeof Integer>['name'] ? number :
      C['name'] extends ReturnType<typeof Datetime>['name'] ? Date :
        never;

export type FieldType<C extends ValueType> = IsNullable<BaseType<C>, C['nullable']>
