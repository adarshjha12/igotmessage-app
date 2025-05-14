import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// This creates a compat instance for using old-style config in new flat config
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Export config — must be an array
export default [
  // Spread the result of compat.config() or compat.extends()
  ...compat.config({
    extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  }),

  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
