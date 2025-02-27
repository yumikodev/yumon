import { program } from "commander";
import { configController } from "@/controllers/config.js";
import { taskListController } from "@/controllers/tasksList.js";
import { pkg } from "@/utils/pkg.js";
import { taskRunnerController } from "@/controllers/taskRunner.js";
import { initController } from "@/controllers/init.js";
import { addTaskController } from "@/controllers/addTask.js";
import { editTaskController } from "@/controllers/editTask.js";
import { deleteTaskController } from "@/controllers/deleteTask.js";

program
  .version(pkg.version, "-v, --version")
  .description(`${pkg.description} - by ${pkg.author}`);

configController(program);
initController(program);
taskListController(program);
taskRunnerController(program);
addTaskController(program);
editTaskController(program);
deleteTaskController(program);

program.parse(process.argv);
