import { configParser } from "@/utils/configParser.js";
import { Command } from "commander";
import { join } from "node:path";
import inquirer from "inquirer";
import yaml from "js-yaml";
import { writeFile } from "node:fs/promises";
import { configValidator } from "@/utils/validators.js";

export function deleteTaskController(program: Command) {
  program
    .command("delete")
    .alias("d")
    .description("Delete a task in the config file")
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
          message: "Select a task to delete:",
          choices,
        },
      ]);

      tasks.splice(answer.taskIndex, 1);

      console.log("Validating information in memory..");
      const validatedData = await configValidator({
        ...cfg,
        tasks,
      });
      console.log("Validated memory information");

      const data = yaml.dump(validatedData);

      await writeFile(configPath, data);
      console.log("Task deleted successfully!");
    });
}
