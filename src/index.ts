#!/usr/bin/env ts-node
"use strict";

import consola from "consola";
import { Command, Option } from "commander";
import { name, version } from "../package.json";
import fs, { existsSync } from "fs";
import { openAIApiPromise } from "./whisper";


async function main() {
  function fileOption(): Option {
    const option = new Option("-f, --file [input]", "specify input file");
    option.required = true;
    return option;
  }

  const command = await new Command()
    .name(name)
    .version(version, "-v, --version", "output the current version")
    .addOption(fileOption())
    .parseAsync(process.argv);

  const options = command.opts();

  const inputFile = options.file;
  if (!inputFile) {
    throw new Error("No file specified. Use -f or --file");
  }
  if (!existsSync(inputFile)) {
    throw new Error("File does not exist");
  }
  const openAI = await openAIApiPromise;
  const translation = await openAI.createTranscription(
    fs.createReadStream(inputFile) as any,
    "whisper-1"
    //
  );
  consola.log(translation.data.text);
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
