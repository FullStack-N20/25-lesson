import readline, { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import fs from "node:fs/promises";
import path from "node:path";
import os from "os";
import { cwd, chdir } from "node:process";

const rl = createInterface({ input: stdin, output: stdout }); 

const commands = `\nCommands:
  1. ls        2. cd        3. cd ..
  4. pwd       5. cat       6. clear
  7. mkdir     8. rm        9. cls
 10. cp       11. mv       12. echo
 13. touch    14. exit`;

async function main() {
  console.log("Welcome to virtual cmd!");
  console.log(commands);

  while (true) {
    const input = (await rl.question(`${cwd()}> `)).trim();
    const [command, ...args] = input.split(/\s+/);
    const param = args.join(" ");

    switch (command) {
      case "ls":
        try {
          const items = await fs.readdir(cwd(), { withFileTypes: true });
          for (const item of items) {
            console.log(item.isDirectory() ? `[DIR]  ${item.name}` : `       ${item.name}`);
          }
        } catch (err) {
          console.log("Error listing directory:", err.message);
        }
        break;

      case "cd":
        if (!param) {
          console.log("Missing path.");
          break;
        }
        try {
          chdir(param);
        } catch (err) {
          console.log("Cannot change directory:", err.message);
        }
        break;

      case "cd..":
      case "cd..":
        try {
          chdir("..");
        } catch (err) {
          console.log("Cannot move up a directory.");
        }
        break;

      case "pwd":
        console.log(cwd());
        break;

      case "cat":
        if (!param) {
          console.log("Missing filename.");
          break;
        }
        try {
          const content = await fs.readFile(param, "utf-8");
          console.log(content);
        } catch (err) {
          console.log("Error reading file:", err.message);
        }
        break;

      case "clear":
      case "cls":
        console.clear();
        break;

      case "mkdir":
        if (!param) {
          console.log("Missing folder name.");
          break;
        }
        try {
          await fs.mkdir(param);
          console.log("Folder created.");
        } catch (err) {
          console.log("Error creating folder:", err.message);
        }
        break;

      case "rm":
        if (!param) {
          console.log("Missing file/folder name.");
          break;
        }
        try {
          await fs.rm(param, { recursive: true, force: true });
          console.log("Removed.");
        } catch (err) {
          console.log("Error removing:", err.message);
        }
        break;

      case "cp":
        if (args.length < 2) {
          console.log("Usage: cp <source> <destination>");
          break;
        }
        try {
          await fs.copyFile(args[0], args[1]);
          console.log("Copied.");
        } catch (err) {
          console.log("Error copying file:", err.message);
        }
        break;

      case "mv":
        if (args.length < 2) {
          console.log("Usage: mv <source> <destination>");
          break;
        }
        try {
          await fs.rename(args[0], args[1]);
          console.log("Moved/Renamed.");
        } catch (err) {
          console.log("Error moving/renaming:", err.message);
        }
        break;

      case "echo":
        console.log(param);
        break;

      case "touch":
        if (!param) {
          console.log("Missing filename.");
          break;
        }
        try {
          await fs.writeFile(param, "");
          console.log("File created.");
        } catch (err) {
          console.log("Error creating file:", err.message);
        }
        break;

      case "exit":
        console.log("Goodbye!");
        rl.close();
        return;

      default:
        console.log("Unknown command. Type something valid.");
        break;
    }
  }
}

main();
