import { Command } from "commander";

export const CONFIG_FILE = "yumonrc.yaml";

export class Task {
  name: string;
  description: string;
  action: string;
}

export interface Config {
  tasks: Task[];
}

export function configController(program: Command) {
  program.option(
    "-c, --config <path>",
    "Define your custom config file location.",
    CONFIG_FILE
  );
}
