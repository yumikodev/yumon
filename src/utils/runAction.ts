import { spawn } from "node:child_process";
import { YumonError } from "./error.js";
import chalk from "chalk";

export function runAction(action: string) {
  const [commandName, ...args] = action.split(" ");

  console.log(
    `${chalk.magenta("$")} ${chalk.green(commandName)} ${args.join(" ")}`
  );
  const child = spawn(commandName, args, {
    stdio: "inherit",
    shell: true,
  });

  child.on("error", (error) => {
    throw new YumonError(error.message, {
      cause: error.cause,
    });
  });
}
