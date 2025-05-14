import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat: any = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extend([
    "next/core-web-vitals",       
    "next",                       
    "plugin:@typescript-eslint/recommended", 
  ]),

  {
    rules: {
      "no-unused-vars": "warn",                          
      "no-console": "off",                               
      "react/prop-types": "off",                         
      "@typescript-eslint/no-unused-vars": "warn",        
      "@typescript-eslint/no-explicit-any": "warn",
      "react/jsx-max-props-per-line": ["warn", {         
        "maximum": 3
      }],
    },
  },
];
