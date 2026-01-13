const path = require("path");
const tsconfig = require("./tsconfig.json");

const paths = tsconfig?.compilerOptions?.paths ?? {};
const aliasTargets = paths["@/*"];

if (!Array.isArray(aliasTargets) || aliasTargets.length === 0) {
  throw new Error("Missing @/* alias mapping in tsconfig.json");
}

const expectedTarget = "src/*";
if (aliasTargets[0] !== expectedTarget) {
  throw new Error(`@/* alias should map to ${expectedTarget}`);
}

const resolvedSample = path.resolve(__dirname, aliasTargets[0].replace("*", "index"));
console.log(`Alias mapping verified. Resolved sample path: ${resolvedSample}`);
