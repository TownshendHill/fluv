import type { Preview } from '@storybook/angular-vite';

// The app's global stylesheet. Without it components render with no Material
// theme, no typography and none of the --spacing-* custom properties, and
// html { font-size: 62.5% } is missing so every rem is 1.6x too large.
import '../src/styles.scss';

/**
 * The app's surfaces, so a component can be viewed against the background it
 * actually sits on. A "base" themed button is white text on teal; on a white
 * canvas it is invisible.
 *
 * These are copied from src/styles/variables.scss, which is generated from the
 * Figma tokens. They are hardcoded because the tokens package emits SCSS only,
 * so there is no JavaScript form to import. If these drift, that is why.
 */
const SURFACES = {
  navbar: { name: 'Navbar (base surface)', value: '#78c5cb' },
  page: { name: 'Page (main surface)', value: '#fff3ed' },
  white: { name: 'White', value: '#ffffff' },
  dark: { name: 'Emphasis', value: '#304f51' },
};

const preview: Preview = {
  parameters: {
    backgrounds: { options: SURFACES },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' shows violations in the test UI only, 'error' fails CI, 'off' skips
      test: 'todo',
    },
  },
  initialGlobals: {
    // The nav buttons live on the navbar, so that is the honest default.
    backgrounds: { value: 'navbar' },
  },
};

export default preview;
