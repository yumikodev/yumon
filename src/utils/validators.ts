import { Config, Task } from "@/controllers/config.js";
import Joi from "joi";

export const configSchema = Joi.object<Config>({
  tasks: Joi.array().items(
    Joi.object<Task>({
      name: Joi.string().required(),
      description: Joi.string().optional(),
      action: Joi.string().required(),
    })
  ),
});
