import {
  register,
  expandTypesMap,
  permutateThemes,
} from "@tokens-studio/sd-transforms";
import StyleDictionary from "style-dictionary";
import { readFile, writeFile, mkdir } from "fs/promises";
import {
  logBrokenReferenceLevels,
  logVerbosityLevels,
  logWarningLevels,
} from "style-dictionary/enums";
import path from "node:path";

/* File Path constants */
const TOKENS_SRC_DIR = "./src/assets/tokens";
const TOKENS_SRC_FILE = path.join(TOKENS_SRC_DIR, "tokens.json");

const TOKENS_DEST_DIR = "./tokens";

const BUILD_DEST_DIR = "./src/styles/";

/**
 * 1: REGISTER SD-TRANSFORMS CAPABILITIES
 * This adds all tokens-studio transforms to StyleDictionary
 */

// optional
// StyleDictionary.registerTransform({
//   name: 'my/size/px',
//   type: 'value',
//   filter: token => ['dimension', 'spacing'].includes(token.type),
//   transform: token => transformDimension(token.value)
// });

StyleDictionary.registerTransform({
  name: "custom/size/lineHeightPx",
  type: "value",
  filter: (token) => token.type === "lineHeight",
  transform: (token) => {
    const value = token.value.toString();
    if (!value.includes("px")) {
      return value + "px";
    }
    return value;
  },
});

// For Debug
// StyleDictionary.registerTransform({
//   name: "debug/attributes",
//   type: "value",
//   filter: () => true,
//   transform: function (token) {
//     // This is "transform", not "transformer"
//     console.log(`Token: ${token.name}`);
//     console.log(`  type: ${token.type}`);
//     console.log(`  attributes:`, token.attributes);
//     return token.value;
//   },
// });
StyleDictionary.registerTransform({
  name: "debug/log",
  type: "value",
  filter: () => true,
  transform: (token) => {
    console.log(`Token: ${token.path.join(".")}, Type: ${token.type}`);
    return token.value;
  },
});

register(StyleDictionary, {
  excludeParentKeys: false,
  platform: "css",
  name: "tokens-studio",
  "ts/color/modifiers": {
    format: "hex",
  },
});

/**
 * 2. CREATE STYLEDICTIONARY INSTANCE WITH CONFIGURATION
 */
const sd = new StyleDictionary({
  source: [path.join(TOKENS_DEST_DIR, "**/*.json")],
  preprocessors: ["tokens-studio"],
  expand: {
    typesMap: expandTypesMap,
  },
  resolveReferences: true,
  platforms: {
    scss: {
      transforms: [
        "ts/size/px",
        "ts/opacity",
        "name/kebab",
        "ts/typography/fontWeight",
        "custom/size/lineHeightPx",
        "ts/typography/compose/shorthand",
      ],
      buildPath: BUILD_DEST_DIR,
      files: [
        {
          destination: "variables.scss",
          format: "scss/variables",
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
  log: {
    warnings: logWarningLevels.warn, // 'warn' | 'error' | 'disabled'
    verbosity: logVerbosityLevels.verbose, // 'default' | 'silent' | 'verbose'
    errors: {
      brokenReferences: logBrokenReferenceLevels.throw, // 'throw' | 'console'
    },
  },
});

/**
 * 3: MAIN PROCESS
 * Execute the build process
 */
async function main() {
  // First split the tokens file
  await splitTokensIntoFiles();

  // Then build using the predefined StyleDictionary instance
  await sd.cleanAllPlatforms();
  await sd.buildAllPlatforms();

  console.log("Build completed successfully!");
}

// Utilities
/**
 * Figma Token Studios free version only supports single token file
 * Utiliy function to split token file into separate files by parent key
 * @param {*} tokenFilePath
 * @returns
 */
async function splitTokensIntoFiles() {
  // Read the tokens file
  const tokens = JSON.parse(await readFile(TOKENS_SRC_FILE, "utf-8"));

  // Extract token sets (excluding themes)
  const { $themes, $metadata, ...sets } = tokens;

  // Function to save each set as a file
  const persistSet = async ([setName, setTokens]) => {
    const formattedSetName = setName.replace(/\s+/g, "_");
    // const fileName = `tokens/${formattedSetName}.json`;
    const fileName = path.join(TOKENS_DEST_DIR, `${formattedSetName}.json`);
    const dirName = path.dirname(fileName);
    try {
      await mkdir(dirName, { recursive: true });
    } catch (e) {
      // do nothing, dir already exists
    }
    await writeFile(fileName, JSON.stringify(setTokens, null, 2), "utf-8");
  };

  // Save all sets as files
  await Promise.all(Object.entries(sets).map(persistSet));
}

// Execute the main function
main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
