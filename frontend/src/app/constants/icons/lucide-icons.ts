import {
  provideLucideIcons,
  LucideChevronDown,
  LucideChevronLeft,
  LucideChevronsUp,
  LucideCircleQuestionMark,
  LucideCircleUserRound,
  LucideClipboardList,
  LucideFileText,
  LucideGlobe,
  LucideHouse,
  LucideInfo,
  LucideLink2,
  LucideLogIn,
  LucideLogOut,
  LucideMenu,
  LucideMessageCircleMore,
  LucidePawPrint,
  LucideRepeat,
  LucideSearch,
  LucideUserRoundPlus,
  LucideUserSearch,
} from '@lucide/angular';

/**
 * Icons available to IconType.LUCIDE, which renders them as live Lucide
 * components through <svg [lucideIcon]="name">. Only registered icons resolve,
 * so adding a name to a nav config means adding its class here.
 *
 * This mirrors the SVG sprite in src/assets/icons, which IconType.LUCIDE_MATERIAL
 * uses instead. Three sprite icons have no entry: facebook, instagram and
 * youtube, because Lucide moved brand icons out of the core package. A fourth,
 * circle-help, was renamed upstream to circle-question-mark.
 *
 * LucideHouse is registered even though the sprite has no house icon, because
 * the debug demo page names it. Lucide has it; Material Icons calls it "home".
 */
export const LUCIDE_ICONS = provideLucideIcons(
  LucideChevronDown,
  LucideChevronLeft,
  LucideChevronsUp,
  LucideCircleQuestionMark,
  LucideCircleUserRound,
  LucideClipboardList,
  LucideFileText,
  LucideGlobe,
  LucideHouse,
  LucideInfo,
  LucideLink2,
  LucideLogIn,
  LucideLogOut,
  LucideMenu,
  LucideMessageCircleMore,
  LucidePawPrint,
  LucideRepeat,
  LucideSearch,
  LucideUserRoundPlus,
  LucideUserSearch,
);
