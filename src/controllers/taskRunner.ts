import { configParser } from "@/utils/configParser.js";
import { YumonError } from "@/utils/error.js";
import { runAction } from "@/utils/runAction.js";
import { Command } from "commander";
import { join } from "node:path";

export function taskRunnerController(program: Command) {
  program
    .command("run <taskName>")
    .alias("r")
    .description("Execute a task by the name/alias")
    .action(async function (taskName: string) {
      try {
        const { config } = this.optsWithGlobals();
        const configPath = join(process.cwd(), config);

        const { tasks } = await configParser(configPath);

        const task = tasks.find(
          (t) =>
            t.name === taskName ||
            (t.alias && t.alias.some((a) => taskName === a))
        );

        if (!task) throw new YumonError("Unknown task");

        runAction(task.action);
      } catch (e) {
        throw e;
      }
    });
}
