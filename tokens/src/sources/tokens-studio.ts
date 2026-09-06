import { register, expandTypesMap } from "@tokens-studio/sd-transforms";
import type StyleDictionary from "style-dictionary";
import type { Config } from "style-dictionary/types";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * The Tokens Studio source adapter.
 *
 * It owns two things: teaching Style Dictionary to read the Tokens Studio
 * format, and turning the single synced file into the per-set files the build
 * reads. A second source (Figma Variables, say) would be a sibling module
 * exposing the same shape.
 */

/**
 * Transforms this source needs, in order. Style Dictionary applies them in
 * sequence.
 *
 * Listing transforms explicitly REPLACES the transform group that register()
 * installs rather than extending it, so anything omitted here is switched off.
 * The list below restores the group's members that this project had lost, each
 * verified to leave the current output unchanged.
 *
 * ts/size/lineheight is deliberately absent. It targets the same tokens as
 * custom/size/lineHeightPx and produces different values, so the two together
 * work only because ours runs last. Reordering would silently change output.
 */
export const tokensStudioTransforms: string[] = [
  "ts/descriptionToComment",
  "ts/resolveMath",
  "ts/size/px",
  "ts/opacity",
  "ts/color/modifiers",
  "ts/color/css/hexrgba",
  "ts/size/css/letterspacing",
  "ts/shadow/innerShadow",
  "name/kebab",
  "ts/typography/fontWeight",
  "custom/size/lineHeightPx",
  "ts/typography/compose/shorthand",
];

export const tokensStudioPreprocessors: string[] = ["tokens-studio"];

/** Teaches Style Dictionary's expand step about Tokens Studio composite tokens. */
export const tokensStudioExpand: Config["expand"] = { typesMap: expandTypesMap };

/** Installs the tokens-studio preprocessor and transform group onto the class. */
export function registerTokensStudio(sd: typeof StyleDictionary): void {
  register(sd, { platform: "css", name: "tokens-studio" });
}

interface TokensStudioFile {
  [key: string]: unknown;
}

/**
 * The free Tokens Studio licence syncs one file. Style Dictionary wants one
 * file per token set, so split it.
 *
 * $metadata is written out alongside the sets because it carries
 * tokenSetOrder, which decides which sets are included and in what order. A
 * stale copy silently drops whole sets, which is how the AppBar tokens went
 * missing for months.
 *
 * Returns the paths written, so a caller (or a test) can assert on them.
 */
export async function writeTokenFiles(
  sourceFile: string,
  destDir: string,
): Promise<string[]> {
  const parsed = JSON.parse(await readFile(sourceFile, "utf-8")) as TokensStudioFile;

  // Everything not prefixed with $ is a token set. $themes and $metadata are not.
  const sets = Object.entries(parsed).filter(([name]) => !name.startsWith("$"));
  const metadata = parsed["$metadata"];

  const toWrite: [string, unknown][] = [...sets];
  if (metadata !== undefined) toWrite.push(["$metadata", metadata]);

  return Promise.all(toWrite.map(([name, contents]) => writeSet(destDir, name, contents)));
}

async function writeSet(destDir: string, name: string, contents: unknown): Promise<string> {
  const file = path.join(destDir, `${name.replace(/\s+/g, "_")}.json`);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(contents, null, 2), "utf-8");
  return file;
}
