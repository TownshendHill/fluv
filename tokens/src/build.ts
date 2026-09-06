import StyleDictionary from "style-dictionary";
import type { Config } from "style-dictionary/types";

export interface BuildOptions {
  /** Writes the token files the config points at. Runs before anything reads them. */
  prepare: () => Promise<string[]>;
  config: Config;
}

/**
 * Runs the token build.
 *
 * Order is the whole point. Style Dictionary reads its source files when the
 * instance is constructed, so the instance must be created AFTER prepare() has
 * written them. Constructing it first makes every build emit the previous
 * run's tokens, which is a bug this project shipped for months.
 */
export async function build({ prepare, config }: BuildOptions): Promise<string[]> {
  const written = await prepare();

  const sd = new StyleDictionary(config);
  await sd.cleanAllPlatforms();
  await sd.buildAllPlatforms();

  return written;
}
