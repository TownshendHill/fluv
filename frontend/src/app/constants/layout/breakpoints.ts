// constants/breakpoints.ts
export const BREAKPOINTS = {
  mobile: '(max-width: 767px)', // Below tablet
  tablet: '(min-width: 768px) and (max-width: 991px)', // md to lg
  laptop: '(min-width: 992px) and (max-width: 1199px)', // lg to xl
  desktop: '(min-width: 1200px)', // xl and above

  // Utility breakpoints
  tabletAndBelow: '(max-width: 991px)', // mobile + tablet
  tabletAndAbove: '(min-width: 768px)', // tablet + laptop + desktop
  laptopAndAbove: '(min-width: 992px)', // laptop + desktop
} as const;

// Breakpoint values (matching your SCSS)
export const BREAKPOINT_VALUES = {
  mobile: 420, // sm
  tablet: 768, // md
  laptop: 992, // lg
  desktop: 1200, // xl
} as const;
