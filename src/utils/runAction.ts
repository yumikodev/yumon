import { spawn } from "node:child_process";
import { YumonError } from "./error.js";

export function runAction(action: string) {
  const [commandName, ...args] = action.split(" ");

  console.log(`$ ${action}`);
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
