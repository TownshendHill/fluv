import path from "node:path";
import type { Config } from "style-dictionary/types";
import {
  logBrokenReferenceLevels,
  logVerbosityLevels,
  logWarningLevels,
} from "style-dictionary/enums";

export interface ConfigOptions {
  /** Directory holding the token files that sources have written. */
  tokenDir: string;
  /** Directory the SCSS output is written to. */
  outputDir: string;
  transforms: string[];
  preprocessors: string[];
  expand: Config["expand"];
}

/**
 * Builds the Style Dictionary config. Pure: paths in, object out, no disk
 * access and no side effects, so a test can assert on the result directly.
 */
export function createConfig({
  tokenDir,
  outputDir,
  transforms,
  preprocessors,
  expand,
}: ConfigOptions): Config {
  return {
    source: [path.join(tokenDir, "**/*.json")],
    preprocessors,
    expand,
    platforms: {
      scss: {
        transforms,
        buildPath: outputDir.endsWith(path.sep) ? outputDir : `${outputDir}${path.sep}`,
        files: [
          {
            destination: "variables.scss",
            format: "scss/variables",
            options: { outputReferences: true },
          },
        ],
      },
    },
    log: {
      warnings: logWarningLevels.warn,
      verbosity: logVerbosityLevels.verbose,
      errors: { brokenReferences: logBrokenReferenceLevels.throw },
    },
  };
}
