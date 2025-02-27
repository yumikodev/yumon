import { configParser } from "@/utils/configParser.js";
import { Command } from "commander";
import { join } from "node:path";
import inquirer from "inquirer";
import yaml from "js-yaml";
import { writeFile } from "node:fs/promises";
import { configValidator } from "@/utils/validators.js";

export function editTaskController(program: Command) {
  program
    .command("edit")
    .description("Edit a task in the config file")
    .action(async function () {
      const { config } = this.optsWithGlobals();
      const configPath = join(process.cwd(), config);

      const { tasks, ...cfg } = await configParser(configPath);

      const choices = tasks.map((t, index) => ({
        name: t.alias ? `${t.name} (alias: ${t.alias.join()})` : t.name,
        description: t.description,
        value: index,
      }));

      const answer = await inquirer.prompt([
        {
          name: "taskIndex",
          type: "select",
          message: "Select a task to edit:",
          choices,
        },
      ]);

      const task = tasks[answer.taskIndex];

      const { name, action, alias, description } = await inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "Task name:",
          default: task.name,
        },
        {
          name: "description",
          type: "input",
          message: "Task description:",
          default: task.description,
        },
        {
          name: "alias",
          type: "input",
          message: 'Task aliases (separated by ","):',
          default: task.alias?.join(),
        },
        {
          name: "action",
          type: "input",
          message: "Task action:",
          default: task.action,
        },
      ]);

      tasks[answer.taskIndex] = {
        name,
        ...(alias && { alias: alias.split(",") }),
        ...(description && { description }),
        action,
      };

      console.log("Validating information in memory..");
      const validatedData = await configValidator({
        ...cfg,
        tasks,
      });
      console.log("Validated memory information");

      const data = yaml.dump(validatedData);

      await writeFile(configPath, data);
      console.log("Task edited successfully!");
    });
}
