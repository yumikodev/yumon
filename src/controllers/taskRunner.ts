import { configParser } from "@/utils/configParser.js";
import { YumonError } from "@/utils/error.js";
import { runAction } from "@/utils/runAction.js";
import { Command } from "commander";
import { join } from "node:path";

export function taskRunnerController(program: Command) {
  program
    .command("run <taskName>")
    .alias("r")
    .action(async function (taskName: string) {
      try {
        const { config } = this.optsWithGlobals();
        const configPath = join(process.cwd(), config);

        const tasks = await configParser(configPath);

        const task = tasks.find((t) => t.name === taskName);

        if (!task) throw new YumonError("Unknown task name");

        runAction(task.action);
      } catch (e) {
        throw e;
      }
    });
}
