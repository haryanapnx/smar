export type JsonApiResourceIdentifier = {
  id: string;
  type: string;
};

export type JsonApiRelationship =
  | { data: JsonApiResourceIdentifier | null }
  | { data: JsonApiResourceIdentifier[] }
  | { links?: { self?: string; related?: string } };

export type JsonApiResource<TAttributes = Record<string, unknown>> = {
  id: string;
  type: string;
  attributes: TAttributes;
  relationships?: Record<string, JsonApiRelationship>;
  links?: { self?: string };
};

export type JsonApiLinks = {
  first?: string;
  last?: string;
  next?: string;
  prev?: string;
};

export type JsonApiResponse<TAttributes = Record<string, unknown>> = {
  data: JsonApiResource<TAttributes> | JsonApiResource<TAttributes>[] | null;
  included?: JsonApiResource[];
  links?: JsonApiLinks;
  meta?: { page?: { offset: number; limit: number } } & Record<string, unknown>;
  jsonapi?: { version: string };
};

export type JsonApiCollection<TAttributes = Record<string, unknown>> = {
  items: JsonApiResource<TAttributes>[];
  included: JsonApiResource[];
  total: number | null;
};

export const resourceKey = (type: string, id: string): string => `${type}:${id}`;
