/**
 * Main entry point when using as an executable/CLI application.
 *
 * Primarily used for Vapor deployments where vendor libraries are not available.
 */

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
