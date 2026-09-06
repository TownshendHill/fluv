import StyleDictionary from "style-dictionary";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { registerCustomTransforms } from "../src/transforms.ts";
import {
  registerTokensStudio,
  writeTokenFiles,
  tokensStudioTransforms,
  tokensStudioPreprocessors,
  tokensStudioExpand,
} from "../src/sources/tokens-studio.ts";
import { createConfig } from "../src/config.ts";
import { build } from "../src/build.ts";

/**
 * Entry point. The only place real paths live, so every unit below it takes
 * its paths as arguments and can be tested against a fixture directory.
 */

/* Resolved from this file rather than the working directory, so the script
   behaves the same however it is invoked. */
const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = path.resolve(PKG_ROOT, "..");

/** The Figma export, written by Tokens Studio. */
const SOURCE_FILE = path.join(PKG_ROOT, "source", "tokens.json");
/** The export split into one file per token set. */
const TOKEN_DIR = path.join(PKG_ROOT, "build");
/** The Angular app is the only consumer of the SCSS. */
const OUTPUT_DIR = path.join(REPO_ROOT, "frontend", "src", "styles");

registerCustomTransforms(StyleDictionary);
registerTokensStudio(StyleDictionary);

await build({
  prepare: () => writeTokenFiles(SOURCE_FILE, TOKEN_DIR),
  config: createConfig({
    tokenDir: TOKEN_DIR,
    outputDir: OUTPUT_DIR,
    transforms: tokensStudioTransforms,
    preprocessors: tokensStudioPreprocessors,
    expand: tokensStudioExpand,
  }),
});

console.log("Build completed successfully!");
