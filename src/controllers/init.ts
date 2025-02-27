import { YumonError } from "@/utils/error.js";
import { Command } from "commander";
import { existsSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import { writeFile } from "node:fs/promises";

export function initController(program: Command) {
  program
    .command("init")
    .description("Create a default yumonrc.yaml config file")
    .action(async function () {
      const { config } = this.optsWithGlobals();
      const configPath = join(process.cwd(), config);

      if (existsSync(configPath))
        throw new YumonError("Yumon config file already exists");

      const data = yaml.dump({
        tasks: [
          {
            name: "Example task",
            description: "Example description for task (optional)",
            action: 'echo "The action to execute in a child process"',
          },
          {
            name: "Example task 2",
            action: 'echo "This is a second task"',
          },
        ],
      });

      await writeFile(configPath, data);
      console.log("Yumon config file generated successfully!");
    });
}
