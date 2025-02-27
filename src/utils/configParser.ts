import { existsSync } from "node:fs";
import { YumonError } from "./error.js";
import { readFile } from "node:fs/promises";
import yaml from "js-yaml";
import { configValidator } from "./validators.js";

export async function configParser(path: string) {
  if (!existsSync(path))
    throw new YumonError("Yumon config file doesn't exists");

  const configContent = await readFile(path, "utf-8");
  const parsedConfig = yaml.load(configContent);

  const config = await configValidator(parsedConfig);

  return config;
}
