// Run: node --experimental-strip-types src/utils/utils.check.ts
import assert from "node:assert/strict";

import {
  flattenSchema,
  getMethods,
  pickSample,
  undocumentedPaths,
} from "./discovery.ts";
import {
  formatTotalCount,
  getFormattedDuration,
  getFormattedTime,
} from "./format.ts";

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

assert.deepEqual(
  undocumentedPaths(fields, {
    items: [{ id: "x", localizations: { fr: { title: "Salut" } }, publishTime: "now" }],
  }),
  ["items[].publishTime"]
);

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

assert.equal(formatTotalCount("4550000"), "4.55M");
assert.equal(formatTotalCount("1823557663"), "1.82B");
assert.equal(formatTotalCount("999"), "999");

assert.equal(getFormattedDuration("PT3M33S"), "3:33");
assert.equal(getFormattedDuration("PT1H2M3S"), "1:02:03");
assert.equal(getFormattedDuration("P1DT1M"), "24:01:00");
assert.equal(getFormattedDuration("P0D"), "");

const now = Date.parse("2026-10-06T00:00:00Z");
assert.equal(getFormattedTime("2009-10-25T06:57:33Z", now), "16 years ago");
assert.equal(getFormattedTime("2026-10-04T00:00:00Z", now), "2 days ago");
assert.equal(getFormattedTime("2026-10-06T00:00:00Z", now), "0 seconds ago");

console.log("utils checks passed");
