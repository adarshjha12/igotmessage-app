import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set up compat for legacy configs
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Export a flat config array
export default [
  // Legacy config support (e.g. extends)
  ...compat.extends([
    "next/core-web-vitals",
    "next",
    "plugin:@typescript-eslint/recommended"
  ]),

  // Custom flat config block
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn"
    }
  }
];
