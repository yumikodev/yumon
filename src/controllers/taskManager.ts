import { configParser } from "@/utils/configParser.js";
import { configValidator } from "@/utils/validators.js";
import { Command } from "commander";
import { writeFile } from "fs/promises";
import inquirer from "inquirer";
import { join } from "path";
import yaml from "js-yaml";
import chalk from "chalk";

export class TaskManagerController {
  constructor(private program: Command) {
    const switcher = async (action: string, program: Command) => {
      switch (action) {
        case "list":
          await this.list(program);
          break;
        case "add":
          await this.add(program);
          break;
        case "edit":
          await this.edit(program);
          break;
        case "delete":
          await this.delete(program);
          break;
        default:
          console.log("Unknown action");
          break;
      }
    };

    this.program
      .command("manager")
      .alias("m")
      .description("Tasks manager CLI")
      .action(async function () {
        const answer = await inquirer.prompt([
          {
            name: "action",
            type: "select",
            message: "What action do you want to take?",
            choices: [
              {
                name: "List tasks",
                description: "List al tasks in the config file",
                value: "list",
              },
              {
                name: "Add a task",
                description: "Add a new task in the config file",
                value: "add",
              },
              {
                name: "Edit a task",
                description: "Edit a task in the config file",
                value: "edit",
              },
              {
                name: "Delete a task",
                description: "Delete a task in the config file",
                value: "delete",
              },
            ],
          },
        ]);

        switcher(answer.action, this);
      });
  }

  async list(program: Command) {
    const { config } = program.optsWithGlobals();
    const configPath = join(process.cwd(), config);

    const { tasks } = await configParser(configPath);

    console.table(tasks);
    console.log(`Total items found: ${tasks.length}`);
  }

  async add(program: Command) {
    const { config } = program.optsWithGlobals();
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

    console.log(chalk.yellow("* Validating information in memory.."));
    const validatedData = await configValidator({
      ...cfg,
      tasks,
    });
    console.log(chalk.green("✔ Validated memory information"));

    const data = yaml.dump(validatedData);

    await writeFile(configPath, data);
    console.log(chalk.green("✔ Task added successfully!"));
  }

  async edit(program: Command) {
    const { config } = program.optsWithGlobals();
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

    console.log(chalk.yellow("* Validating information in memory.."));
    const validatedData = await configValidator({
      ...cfg,
      tasks,
    });
    console.log(chalk.green("✔ Validated memory information"));

    const data = yaml.dump(validatedData);

    await writeFile(configPath, data);
    console.log(chalk.green("✔ Task edited successfully!"));
  }

  async delete(program: Command) {
    const { config } = program.optsWithGlobals();
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

    console.log(chalk.yellow("* Validating information in memory.."));
    const validatedData = await configValidator({
      ...cfg,
      tasks,
    });
    console.log(chalk.green("✔ Validated memory information"));

    const data = yaml.dump(validatedData);

    await writeFile(configPath, data);
    console.log(chalk.green("✔ Task deleted successfully!"));
  }
}
