// Run: node --experimental-strip-types src/utils/discovery.check.ts
import assert from "node:assert/strict";

import { flattenSchema, getMethods, pickSample } from "./discovery.ts";

const schemas = {
  ListResponse: {
    properties: { items: { type: "array", items: { $ref: "Video" } } },
  },
  Video: {
    properties: {
      id: { type: "string" },
      snippet: {
        properties: {
          tags: { type: "array", description: "Tags.", items: { type: "string" } },
        },
      },
      definition: { type: "string", enum: ["sd", "hd"] },
      localizations: { additionalProperties: { $ref: "Localization" } },
      parent: { $ref: "Video" },
    },
  },
  Localization: { properties: { title: { type: "string" } } },
};

const fields = flattenSchema(schemas, { $ref: "ListResponse" });
assert.deepEqual(
  fields.map((field) => `${field.path}:${field.type}`),
  [
    "items[].id:string",
    "items[].snippet.tags[]:string",
    "items[].definition:enum",
    "items[].localizations.*.title:string",
    "items[].parent:recursive Video",
  ]
);
assert.equal(fields[1].description, "Tags.");
assert.match(fields[2].description, /Values: sd, hd/);

const sample = {
  items: [
    { id: "x", snippet: { tags: ["a", "b"] }, localizations: { en: { title: "Hi" } } },
  ],
};
assert.equal(pickSample(sample, "items[].snippet.tags[]"), "a");
assert.equal(pickSample(sample, "items[].localizations.*.title"), "Hi");
assert.equal(pickSample(sample, "items[].definition"), undefined);

const nested = getMethods({
  a: {
    methods: { list: { id: "a.list", httpMethod: "GET", path: "a" } },
    resources: {
      b: { methods: { get: { id: "a.b.get", httpMethod: "GET", path: "b" } } },
    },
  },
});
assert.deepEqual(
  nested.map((method) => method.id),
  ["a.list", "a.b.get"]
);

console.log("discovery checks passed");
