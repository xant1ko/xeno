export enum FilterParseType {
  Number = 'number',
  String = 'string',
  StringArray = 'stringArray',
  Boolean = 'boolean',
  BooleanOrNull = 'booleanOrNull',
  Date = 'date',
}

export const DEFAULT_TABLE_PARAMS = {
  page: 1,
  totalItems: 0,
  itemsPerPage: 10,
}

export const DEFAULT_PAGINATION = {
  limit: 10,
  offset: 0,
}
