import type { StorybookConfig } from '@storybook/angular-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: '@storybook/angular-vite',
  // LucideIconService registers the sprite with MatIconRegistry using the URL
  // 'assets/icons/fluv-sprite.svg'. The Angular build target serves src/assets,
  // but the Vite builder does not inherit that, so without this every svgIcon
  // 404s and renders nothing.
  staticDirs: [{ from: '../src/assets', to: '/assets' }],
  // The app's stylesheets use bare imports such as @use "fluv-layout", which
  // resolve through stylePreprocessorOptions in angular.json. Vite needs the
  // same load path or the global stylesheet fails to compile.
  viteFinal: async (viteConfig) => {
    viteConfig.css ??= {};
    viteConfig.css.preprocessorOptions ??= {};
    viteConfig.css.preprocessorOptions['scss'] = {
      ...(viteConfig.css.preprocessorOptions['scss'] ?? {}),
      loadPaths: ['src/styles'],
    };
    return viteConfig;
  },
};
export default config;
