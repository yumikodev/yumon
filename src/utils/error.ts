import chalk from "chalk";

export class YumonError extends Error {
  name = chalk.red(`[${YumonError.name}]`);
}
