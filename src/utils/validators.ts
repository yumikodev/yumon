import { Config, Task } from "@/controllers/config.js";
import Joi, { ValidationError } from "joi";
import { YumonError } from "./error.js";

export const configSchema = Joi.object<Config>({
  tasks: Joi.array().items(
    Joi.object<Task>({
      name: Joi.string().required(),
      alias: Joi.array().items(Joi.string().required()).optional(),
      description: Joi.string().optional(),
      action: Joi.string().required(),
    })
  ),
});

export async function configValidator<T>(obj: T) {
  const config = await configSchema
    .validateAsync(obj)
    .catch((e: ValidationError) => {
      throw new YumonError(e.message, {
        cause: e.cause,
      });
    });

  return config;
}
