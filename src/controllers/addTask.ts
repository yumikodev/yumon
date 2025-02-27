import { configParser } from "@/utils/configParser.js";
import { Command } from "commander";
import { join } from "node:path";
import inquirer from "inquirer";
import yaml from "js-yaml";
import { writeFile } from "node:fs/promises";
import { configValidator } from "@/utils/validators.js";

export function addTaskController(program: Command) {
  program
    .command("add")
    .alias("a")
    .description("Add a new task in the config file")
    .action(async function () {
      const { config } = this.optsWithGlobals();
      const configPath = join(process.cwd(), config);

      const { name, action, alias, description } = await inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "Task name:",
          required: true,
        },
        {
          name: "description",
          type: "input",
          message: "Task description:",
          required: false,
        },
        {
          name: "alias",
          type: "input",
          message: 'Task aliases (separated by ","):',
          required: false,
        },
        {
          name: "action",
          type: "input",
          message: "Task action:",
          required: true,
        },
      ]);

      const { tasks, ...cfg } = await configParser(configPath);

      tasks.push({
        name,
        ...(alias && { alias: alias.split(",") }),
        ...(description && { description }),
        action,
      });

      console.log("Validating information in memory..");
      const validatedData = await configValidator({
        ...cfg,
        tasks,
      });
      console.log("Validated memory information");

      const data = yaml.dump(validatedData);

      await writeFile(configPath, data);
      console.log("Task added successfully!");
    });
}
