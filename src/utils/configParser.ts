import { existsSync } from "node:fs";
import { YumonError } from "./error.js";
import { readFile } from "node:fs/promises";
import yaml from "js-yaml";
import { configSchema } from "./validators.js";
import { ValidationError } from "joi";

export async function configParser(path: string) {
  if (!existsSync(path))
    throw new YumonError("Yumon config file doesn't exists");

  const configContent = await readFile(path, "utf-8");
  const parsedConfig = yaml.load(configContent);

  const { tasks } = await configSchema
    .validateAsync(parsedConfig)
    .catch((e: ValidationError) => {
      throw new YumonError(e.message, {
        cause: e.cause,
      });
    });

  return tasks;
}
