import next from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...next,
  ...nextTs,
  { ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts", "reports/**"] },
  { files: ["scripts/**"], rules: { "@typescript-eslint/no-unused-expressions": "off" } },
];

export default config;
