#!/usr/bin/env node

import * as process from "process";
import scripts from "./modules";

const [script] = process.argv.slice(2);

if (
  script === "generateCsa" ||
  script === "htmlToPng" ||
  script === "mergePdf"
) {
  scripts[script]();
} else {
  throw new Error(`Unknown module "${script}".`);
}
