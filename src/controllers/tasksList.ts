import { Command } from "commander";
import inquirer from "inquirer";
import { join } from "node:path";
import { configParser } from "@/utils/configParser.js";
import { runAction } from "@/utils/runAction.js";

export function taskListController(program: Command) {
  program
    .command("select", {
      isDefault: true,
    })
    .alias("s")
    .description('Select a script to execute (based on the "yumonrc.yaml")')
    .action(async function () {
      try {
        const { config } = this.optsWithGlobals();
        const configPath = join(process.cwd(), config);

        const tasks = await configParser(configPath);

        const choices = tasks.map((t) => ({
          name: t.name,
          description: t.description,
          value: t.action,
        }));

        const answer = await inquirer.prompt([
          {
            name: "action",
            type: "select",
            message: "Select a task to execute an action:",
            choices,
          },
        ]);

        runAction(answer.action);
      } catch (e) {
        throw e;
      }
    });
}
