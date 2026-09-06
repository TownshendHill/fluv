import type StyleDictionary from "style-dictionary";
import type { DesignToken } from "style-dictionary/types";

/**
 * Transforms this project defines itself, as opposed to the ones sd-transforms
 * or Style Dictionary provide.
 */
export function registerCustomTransforms(sd: typeof StyleDictionary): void {
  sd.registerTransform({
    name: "custom/size/lineHeightPx",
    type: "value",
    filter: (token: DesignToken) => token.type === "lineHeight",
    transform: (token: DesignToken) => {
      const value = String(token.value);
      return value.includes("px") ? value : `${value}px`;
    },
  });
}
