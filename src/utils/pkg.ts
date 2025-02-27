import { readFileSync } from "node:fs";
import { join } from "node:path";

interface Pkg {
  name: string;
  version: string;
  description: string;
  type: string;
  main: string;
  license: string;
  author: string;
  keywords: string[];
}

export const pkg: Pkg = JSON.parse(
  readFileSync(join(import.meta.dirname, "../../package.json"), "utf-8")
);
