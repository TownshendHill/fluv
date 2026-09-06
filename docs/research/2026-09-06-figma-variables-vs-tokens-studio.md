# Can Figma Variables replace Tokens Studio as our token source?

Researched 2026-09-06. Sources are Figma's developer and help docs, the W3C DTCG draft, Style Dictionary's docs, Tokens Studio's docs, and the repo itself.

## Answer first

No, not for this project as it stands today. Two things block it.

The first is that our largest token set is built on typography composite tokens, and Figma Variables cannot hold one. Figma Variables come in exactly four types, color, number, string and boolean ([Overview of variables, collections, and modes](https://help.figma.com/hc/en-us/articles/14506821864087-Overview-of-variables-collections-and-modes)). A typography token bundles nine properties into a single value, and there is no Figma primitive for that. Our `Font/App` set has 12 of them and they drive every text style in the Angular app.

The second is that the Variables REST API is Enterprise-only, so the fully automated path is closed unless we buy the top tier. That leaves either a manual JSON export from the Figma UI or a plugin, both of which involve a human clicking export, which is exactly the workflow we already have with Tokens Studio.

There is a real reason to revisit this later. The free Tokens Studio licence cannot create themes, and it can only sync a single file, which is why `tokens/scripts/build-output.js` has a split step. If we ever need light and dark, we either pay Tokens Studio or we move colors onto Figma Variable modes. That is a colors-only migration and it can happen without touching typography. See the recommendation at the end.

## What we actually have today

I verified this against the repo rather than the task description.

`tokens/source/tokens.json` is 16 KB and holds four token sets plus `$themes` and `$metadata`. The sets are `Font/App` (65 tokens), `primitiveColor/Mode 1` (34), `semanticColor/Light` (11) and `AppBar` (13), 123 tokens in total. `$metadata.tokenSetOrder` lists all four. `$themes` is an empty array, which matters, because it means we are not currently using the one Tokens Studio concept that has no Figma equivalent.

The file is in the legacy Tokens Studio format, not DTCG. Tokens are written with `value` and `type`, not `$value` and `$type`, and the type names are the Tokens Studio plural ones.

```json
"lineHeight": { "Display-L": { "value": "41", "type": "lineHeights" } }
```

Values carry no units. Font weights are strings such as `Bold` and `Regular`. References use the Tokens Studio curly brace syntax, for example `"{Fluv.primary.50}"` in `semanticColor/Light` and `"{base.surface}"` in `AppBar`, and they resolve across token sets rather than within a file. There are no math expressions in the file and no color modifiers, so those two Tokens Studio features are available but unused.

The composite typography tokens look like this.

```json
"Display-L": {
  "value": {
    "fontFamily": "{fontFamilies.Android-CH}",
    "fontWeight": "{fontWeight.Display-L}",
    "lineHeight": "{lineHeight.Display-L}",
    "fontSize": "{fontSize.Display-L}",
    "letterSpacing": "{letterSpacing.Display-L}",
    "paragraphSpacing": "{paragraphSpacing.0}",
    "paragraphIndent": "{paragraphIndent.0}",
    "textCase": "{textCase.none}",
    "textDecoration": "{textDecoration.none}"
  },
  "type": "typography"
}
```

`tokens/scripts/build-output.js` splits the single file into `tokens/build/<set>.json`, then runs Style Dictionary 5.5.2 with the `tokens-studio` preprocessor and `expandTypesMap`, and writes `frontend/src/styles/variables.scss`. The comment in that script names the reason for the split, which is that the free Tokens Studio licence only supports a single token file.

One detail worth knowing before any migration. The `scss` platform lists its transforms explicitly.

```js
transforms: [
  "ts/size/px",
  "ts/opacity",
  "name/kebab",
  "ts/typography/fontWeight",
  "custom/size/lineHeightPx",
  "ts/typography/compose/shorthand",
]
```

Listing transforms this way replaces the `tokens-studio` transform group that `register()` installs, it does not extend it. I read `dist/register.js` in the installed `@tokens-studio/sd-transforms@2.0.3`, and the group it registers is `['ts/descriptionToComment', 'ts/resolveMath', 'ts/size/px', 'ts/opacity', 'ts/size/lineheight', 'ts/typography/fontWeight', 'ts/color/modifiers', ...css extras, ...builtin css group, 'name/camel']`. So `ts/resolveMath`, `ts/color/modifiers`, `ts/size/lineheight`, `ts/color/css/hexrgba`, `ts/size/css/letterspacing`, `ts/shadow/innerShadow` and every built-in CSS transform are currently switched off. That is fine given what is in the file today, and it is also a landmine if anyone adds a math expression or a color modifier in Figma, because those values would pass through unresolved.

## 1. Getting Figma Variables into a repo

There are three paths, and the price tag differs sharply between them.

### The REST API, Enterprise only

Figma exposes three variables endpoints ([Variables endpoints](https://developers.figma.com/docs/rest-api/variables-endpoints/)).

- `GET /v1/files/:file_key/variables/local`
- `GET /v1/files/:file_key/variables/published`
- `POST /v1/files/:file_key/variables`

All three are gated. The Variables reference page states, verbatim, "To use this API, you must have a Full seat in an Enterprise org; guests cannot use the API" ([Variables](https://developers.figma.com/docs/rest-api/variables/)). The read endpoints need the `file_variables:read` scope and view access to the file, and the write endpoint needs `file_variables:write`, edit access, and a Full seat or admin. The gating is not a scope problem that a token can solve. It is a plan problem.

Figma's own plans comparison confirms it independently. In the plans table the Variables REST API row carries a check mark in the Enterprise column only, and nothing in Starter, Professional or Organization ([Figma plans and features](https://help.figma.com/hc/en-us/articles/360040328273-Figma-plans-and-features)).

So the CI-friendly, no-human-in-the-loop path costs an Enterprise contract. That is the crux. Everything below is a workaround for not having one.

### Native export from the Figma UI, free

This is the part that is easy to miss, and it is the strongest argument for Figma Variables on a non-Enterprise plan. Figma ships manual import and export of variable modes as JSON in the product, no plugin and no API required ([Modes for variables](https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables)).

Right-clicking a mode gives Export mode, right-clicking a collection gives Export modes, and importing works by dragging JSON files into the Variables view, where "A new mode will be created for each file you import." The format is specified. The same page states that "Design tokens must be in a JSON file and follow the Design Tokens Community Group (DTCG) format," and lists Color, Dimension, Font family, Duration, Number and String as the importable token types.

Two caveats I could not resolve from primary sources. Figma documents the DTCG requirement for import but does not publish a schema for what export produces, so I cannot confirm from Figma's own docs whether export emits DTCG `dimension` values as the `{ value, unit }` object the current draft requires, or whether it emits bare numbers. That needs a five minute test in a real file before anyone plans around it. Separately, the export commands are documented on the modes page, and modes themselves are restricted to Education and paid plans, so I cannot confirm from Figma's docs whether export is reachable on a Starter file that has only the single default mode.

### Plugins, free

The Plugin API reads variables with `figma.variables.getLocalVariablesAsync()` and `figma.variables.getLocalVariableCollectionsAsync()`, plus `getVariableByIdAsync` and `getVariableCollectionByIdAsync` ([figma.variables](https://developers.figma.com/docs/plugins/api/figma-variables/), [Working with variables](https://developers.figma.com/docs/plugins/working-with-variables/)). Those pages state no plan restriction on reading local variables. The only Enterprise gate named there is extended collections.

Figma maintains a first-party sample, `variables-import-export`, in [figma/plugin-samples](https://github.com/figma/plugin-samples/tree/master/variables-import-export). It imports and exports variables "formatted using the W3C Design Tokens spec." Its README is candid about limits. Import does not support multiple modes, because the W3C spec has no concept of modes, so only one collection and one mode move at a time, and only color, number and alias tokens are supported, since those are the types that exist in both the spec and Figma. It is sample code, not a product.

Community plugins go further. Tokens Bruecke ([tokens-bruecke/figma-plugin](https://github.com/tokens-bruecke/figma-plugin)) converts Figma variables and styles to DTCG JSON, and there are several others of varying maintenance quality. These are third-party and unaffiliated with Figma, and picking one is a supply-chain decision, not a free lunch.

### What is free and what is paid, plainly

Free on any paid-or-not Figma plan: reading variables via a plugin, and manual JSON export from the Variables view. Both need a person in Figma to press a button.

Paid, Enterprise only: the REST API, which is the only path that a CI job can drive on its own.

That is the same shape as our current situation. Tokens Studio free also needs a person to press push in the plugin. Moving to Figma Variables on a non-Enterprise plan does not buy automation.

## 2. The shape of the data, and what Style Dictionary would need

### What the REST API returns

The response is not design tokens. It is a database dump ([Variables endpoints](https://developers.figma.com/docs/rest-api/variables-endpoints/)).

```
{
  "status": 200,
  "error": false,
  "meta": {
    "variables": { "VariableID:1:2": { ... } },
    "variableCollections": { "VariableCollectionId:1:1": { ... } }
  }
}
```

Both maps are keyed by opaque Figma ids. A variable carries `id`, `name`, `key`, `variableCollectionId`, `resolvedType`, `valuesByMode`, `remote`, `description`, `hiddenFromPublishing`, `scopes` and `codeSyntax`. `resolvedType` is one of `BOOLEAN`, `FLOAT`, `STRING` or `COLOR`. Colors are `{ r, g, b, a }` with floats from 0 to 1, not hex strings. A reference to another variable is `{ "type": "VARIABLE_ALIAS", "id": "VariableID:..." }`, an id, not a name path. Values live under `valuesByMode`, keyed by mode id, and the collection object holds `modes` and `defaultModeId`.

Nothing about that is DTCG. Every one of those five properties would need converting. Hierarchy has to be rebuilt from the slash-separated `name` field, colors converted to hex or `rgba()`, aliases dereferenced from ids into `{group.token}` paths, `valuesByMode` flattened into one file per mode, and `resolvedType` mapped onto DTCG `$type`, which is lossy because `FLOAT` alone cannot tell you whether a token is a `dimension`, a `number`, a `duration` or a `fontWeight`.

### What the native UI export returns

Figma says import must be DTCG, and the plugin sample says it exports W3C format, so this path is the one with a plausible claim to conformance. I could not find a Figma-published schema for the export output, so I am not going to assert it is clean DTCG. Test it.

### What DTCG requires

The current draft defines seven base types, color, dimension, fontFamily, fontWeight, duration, cubicBezier and number, and six composite types, strokeStyle, border, transition, shadow, gradient and typography ([Design Tokens Format Module](https://www.designtokens.org/TR/drafts/format/)). Tokens use `$value` and `$type` with an optional `$description`, and references use `{group.token}` curly braces. Dimensions are strict. The value "MUST be an object containing a numeric `value` (integer or floating-point) and `unit` of measurement (`"px"` or `"rem"`)", and the unit "is still required even if value is `0`". Font weights are numeric 1 to 1000 or one of the named aliases such as `bold` and `regular`.

Two of those rules bite us. Our `Font/App` values are bare strings such as `"41"` and `"Bold"`, which sd-transforms normalises today via `ts/size/px` and `ts/typography/fontWeight`. Anything that emits real DTCG has to solve the same problem at the source instead.

### Does Style Dictionary 5 eat it directly?

For DTCG in general, yes. "As of version 4, Style Dictionary has first-class support for the DTCG format" ([DTCG format](https://styledictionary.com/info/dtcg/)). The same page adds the caveat that "The latest format 2025.10 does not have full support yet in Style Dictionary. This is a work in progress in v5", so a strictly current-draft file may still hit edges on 5.5.2, which is the version installed here.

For the REST API payload, no. It would need a parser hook, which is Style Dictionary's extension point for reading token files in any shape, matching on a file path pattern and returning a plain object ([Parsers](https://styledictionary.com/reference/hooks/parsers/)). In practice you would not write it as a parser at all, you would write a fetch-and-convert script that lands DTCG JSON on disk, then point Style Dictionary at that. Same amount of code, easier to test, and it keeps the network call out of the build graph.

So the honest comparison is this. We do not remove a transform layer by switching, we replace one. Today `@tokens-studio/sd-transforms` is maintained by Tokens Studio and covers the Tokens Studio format. Tomorrow we would own a Figma-to-DTCG converter ourselves, or depend on a community plugin to write it for us.

## 3. Multi-theme, and what modes actually give us

### Mode limits per plan

From Figma's plans table ([Figma plans and features](https://help.figma.com/hc/en-us/articles/360040328273-Figma-plans-and-features)):

| Plan | Modes per collection |
| --- | --- |
| Starter | Not included |
| Professional | "Up to 10 modes per collection" |
| Organization | "Up to 20 modes per collection" |
| Enterprise | "Unlimited modes with extended collections" |

The modes help page agrees on who can create them at all, stating that "Anyone on Education, Professional, Organization, and Enterprise plans can create and use modes for variables" ([Modes for variables](https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables)). Starter is out.

The Professional and Organization numbers are recent. Figma raised them at Schema 2025, and the announcement gives the same figures ([What's new from Schema 2025](https://help.figma.com/hc/en-us/articles/35794667554839-What-s-new-from-Schema-2025)). Older writing on the web still says four, so ignore anything that does. The same announcement puts extended collections, the multi-brand mechanism, behind "users with Full seats on the Enterprise plan."

Variables themselves are available on any plan, and each collection holds up to 5,000 of them ([Create and manage variables and collections](https://help.figma.com/hc/en-us/articles/15145852043927-Create-and-manage-variables-and-collections)). Only modes are tiered.

For us, light and dark is two modes. A Professional plan covers that with eight to spare.

### How modes map onto Style Dictionary

A Figma mode is a column of values for the same set of variable names. A Style Dictionary theme is a different set of source files feeding the same platform config. The mapping is direct. One mode becomes one source file, and you run the build once per mode.

Style Dictionary's own guidance for this is its multi-brand multi-platform example, which "shows how to set up Style Dictionary to support a multi-brand (for brand theming) and multi-platform (web, iOS, Android) solution, with token values depending on brand and platforms" by looping over an array of brands and constructing a config for each ([Examples](https://styledictionary.com/getting-started/examples/), [source](https://github.com/style-dictionary/style-dictionary/tree/main/examples/advanced/multi-brand-multi-platform)). That is a loop in a build script, not a config option.

Concretely, a light and dark pipeline would look like this. Primitives that do not change per mode, our `primitiveColor` set, stay in one shared file. Semantic colors get one file per mode, `semantic.light.json` and `semantic.dark.json`, each aliasing into the primitives. The build script loops over `['light', 'dark']`, and for each one constructs a Style Dictionary instance whose `source` is the shared files plus that mode's file, and whose scss platform writes `variables.light.scss` and `variables.dark.scss`. Angular then either imports one at build time or, more usefully, a custom format emits both into a single file under `:root` and `[data-theme="dark"]` selectors so the app can switch at runtime without a rebuild.

Note that this pattern works identically under Tokens Studio, using sd-transforms' `permutateThemes` helper against `$themes`. Modes are not what makes theming possible. They are just a different place to author the second column.

## 4. What we would lose by leaving Tokens Studio

### Themes

Tokens Studio themes are named combinations of enabled token sets, and sd-transforms ships `permutateThemes` to expand them, including multi-dimensional theming across theme groups. Figma has no equivalent, because a Figma mode is a column inside one collection, not a named selection of sets.

This costs us nothing right now. Our `$themes` is `[]`. It also is not a thing the free Tokens Studio licence gives us, since creating and updating themes is Pro-only ([Pro licence](https://docs.tokens.studio/get-started/pro-licence)). Free can only apply and toggle themes that already exist.

### The token type set

Tokens Studio supports 24 token types ([Token types](https://docs.tokens.studio/manage-tokens/token-types/)), including the composites Typography, Border and Box Shadow, plus Asset, Composition, Opacity, Dimension, Border Radius, Border Width, Spacing, Sizing, Font Family, Font Weight, Font Size, Line Height, Letter Spacing, Paragraph Spacing, Paragraph Indent, Text Case, Text Decoration, Text, Number and Boolean.

Figma Variables support four, color, number, string and boolean ([Overview of variables, collections, and modes](https://help.figma.com/hc/en-us/articles/14506821864087-Overview-of-variables-collections-and-modes)). Everything that is not one of those four either collapses into a number with a scope hint, or has no home at all. Figma's answer for shadows, blurs and text styling is styles, which are a separate system from variables and are not returned by the variables endpoints.

Our repo hits this immediately. `Font/App` alone contains `fontFamilies`, `lineHeights`, `fontWeights`, `fontSizes`, `letterSpacing`, `paragraphSpacing`, `textCase`, `textDecoration` and `typography`. The scalar ones survive as numbers and strings. The 12 `typography` composites do not.

### Math and references

Tokens Studio evaluates arithmetic in token values, and the docs state that all token types accepting numeric values can use math equations mixing literals and references to other tokens ([Using math in token values](https://docs.tokens.studio/manage-tokens/token-values/math)). sd-transforms resolves it with `ts/resolveMath`. Figma Variables store literal values, and I found no Figma documentation describing arithmetic or expressions in a variable value, so I am recording that as unsupported rather than as confirmed absent.

References survive the move in principle. Figma aliases one variable to another, and the plugin sample handles aliases explicitly. The cost is that the REST payload expresses them as `VariableID:` strings, so a converter has to resolve every alias back to a name path before Style Dictionary sees it.

The other reference-shaped feature we would lose is color modifiers, the lighten, darken and mix operations that `ts/color/modifiers` resolves. Free Tokens Studio can apply existing modified colors but not create them, so this is already half-lost. We use none today.

### The sd-transforms set our config depends on

Six transforms are named in `tokens/scripts/build-output.js`, and four of them are Tokens Studio's.

`ts/size/px` adds `px` to unitless dimensions, which is why `"41"` becomes `41px`. `ts/opacity` converts percentage opacity to the 0 to 1 range. `ts/typography/fontWeight` turns `Bold` into `700`, which is visible in the generated `variables.scss` as `$font-weight-display-l: 700`. `ts/typography/compose/shorthand` handles the composite typography shorthand. The remaining two are `name/kebab`, a Style Dictionary built-in, and our own `custom/size/lineHeightPx`. Alongside these, `register()` installs the `tokens-studio` preprocessor, which "aligns Tokens Studio token types with DTCG token types", and `expandTypesMap` teaches Style Dictionary's `expand` about the extra Tokens Studio properties on typography and shadow tokens ([sd-transforms](https://github.com/tokens-studio/sd-transforms)).

Under a Figma Variables source, `ts/typography/*` and `expandTypesMap` become dead code, because there are no composite typography tokens left to expand. `ts/size/px` and `ts/opacity` would either become unnecessary, if Figma's export emits DTCG dimensions with units, or would need reimplementing against whatever Figma actually emits. The preprocessor goes away entirely. That is the whole reason the dependency exists, so leaving Tokens Studio means dropping `@tokens-studio/sd-transforms` and owning the equivalent ourselves.

## 5. Recommendation

Stay on Tokens Studio, and do not plan a migration around the REST API unless the company buys Enterprise.

The reasoning is short. The one thing Figma Variables would buy us over free Tokens Studio is native multi-mode authoring for light and dark, and it costs us the 12 typography composites that carry the type system, plus a converter we would have to write and maintain. The automation argument does not apply, because without Enterprise both workflows end in a human pressing export.

If light and dark becomes a real requirement, there are three moves, in the order I would try them.

Move colors, and only colors, onto Figma Variable modes, and keep `Font/App` in Tokens Studio. Colors are the only part of our token set that Figma Variables model without loss, and they are the only part that varies by theme. This is the hybrid, and it is the option I would actually pick. It does mean two sources feeding one Style Dictionary build, which is more moving parts, so weigh it against the next option.

Buy the Tokens Studio Pro licence. It unlocks theme creation and multi-file folder sync ([Pro licence](https://docs.tokens.studio/get-started/pro-licence)), which deletes the split step and gives us `permutateThemes` for free. Compared against an Enterprise Figma contract this is not a close call on price.

Author the second mode by hand in `semanticColor/Dark`, and pick the set in the build script. Free, ugly, works, and it is the right answer if dark mode is a one-off rather than the start of a theming system.

For React Native and the React admin app, none of this changes the decision. Style Dictionary emits per-platform output from the same source either way, and the token source is not what makes that hard.

### Would we still need the split step?

Under the REST API, no, and also yes. The single-file split exists purely because free Tokens Studio pushes one `tokens.json` ([Pro licence](https://docs.tokens.studio/get-started/pro-licence), free tier is "Sync Tokens as a single file to any Git provider"). One REST call returns everything in one payload, so there is no upstream file to split. But the converter that turns that payload into DTCG has to write one file per collection and mode anyway, so the same code lives on under a different name. Net change is roughly zero lines.

Under the native UI export, no. Figma exports one file per mode already, so the files land on disk in the shape Style Dictionary wants and `splitTokensIntoFiles` deletes cleanly.

The `$metadata` handling is a separate matter. The script persists `$metadata` so that `tokenSetOrder` stays in sync, and the comment records why, which is that a stale copy silently drops whole token sets. Figma has no equivalent to `tokenSetOrder`, so under a Figma source that ordering guarantee would need reconstructing from collection order, or replaced by an explicit ordered `source` array in the Style Dictionary config. Prefer the explicit array. It is one place to look when the order is wrong.

## Sources

- [Figma REST API, Variables](https://developers.figma.com/docs/rest-api/variables/)
- [Figma REST API, Variables endpoints](https://developers.figma.com/docs/rest-api/variables-endpoints/)
- [Figma Plugin API, figma.variables](https://developers.figma.com/docs/plugins/api/figma-variables/)
- [Figma Plugin API, Working with variables](https://developers.figma.com/docs/plugins/working-with-variables/)
- [figma/plugin-samples, variables-import-export](https://github.com/figma/plugin-samples/tree/master/variables-import-export)
- [Figma plans and features](https://help.figma.com/hc/en-us/articles/360040328273-Figma-plans-and-features)
- [Modes for variables](https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables)
- [Overview of variables, collections, and modes](https://help.figma.com/hc/en-us/articles/14506821864087-Overview-of-variables-collections-and-modes)
- [Create and manage variables and collections](https://help.figma.com/hc/en-us/articles/15145852043927-Create-and-manage-variables-and-collections)
- [What's new from Schema 2025](https://help.figma.com/hc/en-us/articles/35794667554839-What-s-new-from-Schema-2025)
- [W3C DTCG, Design Tokens Format Module draft](https://www.designtokens.org/TR/drafts/format/)
- [Style Dictionary, DTCG format](https://styledictionary.com/info/dtcg/)
- [Style Dictionary, Parsers](https://styledictionary.com/reference/hooks/parsers/)
- [Style Dictionary, Examples](https://styledictionary.com/getting-started/examples/)
- [Style Dictionary, multi-brand multi-platform example source](https://github.com/style-dictionary/style-dictionary/tree/main/examples/advanced/multi-brand-multi-platform)
- [Tokens Studio, Pro licence](https://docs.tokens.studio/get-started/pro-licence)
- [Tokens Studio, Token types](https://docs.tokens.studio/manage-tokens/token-types/)
- [Tokens Studio, Using math in token values](https://docs.tokens.studio/manage-tokens/token-values/math)
- [tokens-studio/sd-transforms](https://github.com/tokens-studio/sd-transforms)
- [tokens-bruecke/figma-plugin](https://github.com/tokens-bruecke/figma-plugin)

## Not confirmed from primary sources

I could not verify the following, and I am flagging them rather than guessing.

Figma does not publish a schema for what the Variables view's Export mode command writes. The DTCG requirement is documented for import only. Whether export emits DTCG `dimension` objects with units, and whether it round-trips aliases as `{group.token}` references, needs a test in a real file.

Whether Export mode is reachable on a Starter plan file, where a collection has only the default mode, is not stated anywhere I found. The export commands are documented on a page whose stated plan requirement covers creating modes, not exporting them.

Whether Figma Variables support any form of expression or arithmetic in a value. I found no Figma documentation describing it, which is evidence of absence but not a statement of it.
