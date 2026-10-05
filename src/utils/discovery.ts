export type Schema = {
  $ref?: string;
  type?: string;
  format?: string;
  description?: string;
  enum?: string[];
  items?: Schema;
  properties?: Record<string, Schema>;
  additionalProperties?: Schema;
};

export type Method = {
  id: string;
  httpMethod: string;
  path: string;
  response?: Schema;
};

export type Resource = {
  methods?: Record<string, Method>;
  resources?: Record<string, Resource>;
};

export type Discovery = {
  revision: string;
  resources: Record<string, Resource>;
  schemas: Record<string, Schema>;
};

export type Field = { path: string; type: string; description: string };

export const getMethods = (resources: Record<string, Resource>): Method[] =>
  Object.values(resources).flatMap((resource) => [
    ...Object.values(resource.methods ?? {}),
    ...getMethods(resource.resources ?? {}),
  ]);

// One row per leaf field of a response: arrays add "[]", maps add ".*"
export const flattenSchema = (
  schemas: Record<string, Schema>,
  schema: Schema,
  path = "",
  seen: string[] = []
): Field[] => {
  if (schema.$ref) {
    if (seen.includes(schema.$ref)) {
      return [{ path, type: `recursive ${schema.$ref}`, description: "" }];
    }
    const target = schemas[schema.$ref] ?? {};
    return flattenSchema(
      schemas,
      { ...target, description: schema.description ?? target.description },
      path,
      [...seen, schema.$ref]
    );
  }
  if (schema.items) {
    return flattenSchema(
      schemas,
      { ...schema.items, description: schema.items.description ?? schema.description },
      `${path}[]`,
      seen
    );
  }
  if (schema.properties) {
    return Object.entries(schema.properties).flatMap(([key, child]) =>
      flattenSchema(schemas, child, path ? `${path}.${key}` : key, seen)
    );
  }
  if (schema.additionalProperties) {
    return flattenSchema(schemas, schema.additionalProperties, `${path}.*`, seen);
  }
  const values = schema.enum ? ` Values: ${schema.enum.join(", ")}` : "";
  return [
    {
      path,
      type: schema.enum ? "enum" : schema.format ?? schema.type ?? "unknown",
      description: `${schema.description ?? ""}${values}`,
    },
  ];
};

// Follows a field path into a real response: "[]" takes the first element, "*" the first map entry
export const pickSample = (data: unknown, path: string) =>
  path.split(".").reduce<unknown>((value, segment) => {
    if (value === null || typeof value !== "object") return undefined;
    if (segment === "*") return Object.values(value)[0];
    const [key, ...arrayLevels] = segment.split("[]");
    return arrayLevels.reduce<unknown>(
      (item) => (Array.isArray(item) ? item[0] : undefined),
      (value as Record<string, unknown>)[key]
    );
  }, data);

// Leaf paths in a real response, written the way flattenSchema writes them
export const livePaths = (value: unknown, path = ""): string[] => {
  if (Array.isArray(value)) {
    return value.length
      ? [...new Set(value.flatMap((item) => livePaths(item, `${path}[]`)))]
      : [`${path}[]`];
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      livePaths(child, path ? `${path}.${key}` : key)
    );
  }
  return [path];
};

// Live fields the schema doesn't document; a "*" in a schema path matches any map key
export const undocumentedPaths = (fields: Field[], data: unknown) => {
  const documented = fields.map(
    ({ path }) =>
      new RegExp(
        `^${path.replace(/[.[\]]/g, "\\$&").replace(/\\\.\*/g, "\\.[^.]+")}$`
      )
  );
  return [...new Set(livePaths(data))].filter(
    (path) => !documented.some((pattern) => pattern.test(path))
  );
};
