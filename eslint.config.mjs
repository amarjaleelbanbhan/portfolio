import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "public/**",
      "node_modules/**",
      "tsconfig.json",
      "postcss.config.js",
      "tailwind.config.js",
      "*.md"
    ],
  }
];

export default eslintConfig;

