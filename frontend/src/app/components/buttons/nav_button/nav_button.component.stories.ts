import { inject, provideAppInitializer } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import {
  applicationConfig,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular-vite';

import { NavButton } from './nav_button.component';
import { LucideIconService } from '@services/lucide-icon.service';
import { LUCIDE_ICONS } from '@constants/icons/lucide-icons';
import {
  ButtonVariant,
  IconType,
  type NavButtonConfig,
} from '@model/shared/button';

/** Icon ids in src/assets/icons/fluv-sprite.svg. */
const SPRITE_ICONS = [
  'chevron-down', 'chevron-left', 'chevrons-up', 'circle-help',
  'circle-user-round', 'clipboard-list', 'facebook', 'file-text', 'globe',
  'info', 'instagram', 'link-2', 'log-in', 'log-out', 'menu',
  'message-circle-more', 'paw-print', 'repeat', 'search', 'user-round-plus',
  'user-search', 'youtube',
] as const;

/**
 * Names that resolve in both the sprite and the Material Icons font, verified
 * in a browser. Anything else in SPRITE_ICONS renders only under
 * IconType.LUCIDE_MATERIAL; the Material path shows the raw word instead.
 */
const DUAL_NAMESPACE_ICONS = ['search', 'info', 'menu', 'repeat'] as const;

const THEMES = ['primary', 'secondary', 'emphasis', 'base'] as const;

/** Variants the template has a @case for. LINK and TEXT do not, see issue #13. */
const RENDERED_VARIANTS = [
  ButtonVariant.ICON_LABEL_FAB,
  ButtonVariant.ICON_LABEL_FLAT,
  ButtonVariant.ICON_LABEL,
  ButtonVariant.ICON,
  ButtonVariant.LABEL,
] as const;

const UNIMPLEMENTED_VARIANTS = [ButtonVariant.LINK, ButtonVariant.TEXT] as const;

interface NavButtonArgs {
  label: string;
  icon: string;
  iconType: IconType;
  buttonVariant: ButtonVariant;
  theme: (typeof THEMES)[number];
}

const toConfig = (args: NavButtonArgs): NavButtonConfig => ({
  menuItemVariant: 'nav-config',
  label: args.label,
  icon: args.icon,
  iconType: args.iconType,
  buttonVariant: args.buttonVariant,
  theme: args.theme,
});

const meta: Meta<NavButtonArgs> = {
  title: 'Components/NavButton',
  component: NavButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Takes one input, `navConfig`, holding the whole configuration as an',
          'object. Storybook builds Controls from a component\'s inputs, so binding',
          'it directly would give a single raw JSON editor. These stories expose',
          'each field of `NavButtonConfig` as its own control and assemble the',
          'object in `render()`. The component is untouched.',
          '',
          '### Two things render nothing, on purpose',
          '',
          '`ButtonVariant.LINK` and `.TEXT` have no `@case` in the template, so they',
          'produce an empty button. They are shown in their own story rather than',
          'mixed in with the working ones. See issue #13.',
          '',
'`IconType` has four values and three behaviours. `LUCIDE_MATERIAL` draws from',
          'the SVG sprite, `LUCIDE` renders a live Lucide component, and `MATERIAL`',
          'uses a Material Icons ligature. `CUSTOM_SVG` has no case of its own and',
          'falls through to the Material path. See issue #21.',
          '',
          'The paths use different icon name spaces. The sprite and Lucide both use',
          '`user-search`; Material Icons has `search`. Only `search`, `info`, `menu`',
          'and `repeat` exist in all three, so the default here is `search`.',
          '',
          'Lucide only resolves names registered through `provideLucideIcons`, listed',
          'in `constants/icons/lucide-icons.ts`.',
        ].join('\n'),
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: [NavButton] }),
    applicationConfig({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideAnimationsAsync(),
        // Registers the Lucide components that IconType.LUCIDE can name.
        LUCIDE_ICONS,
        // Registers the sprite with MatIconRegistry in its constructor. Nothing
        // else in a story would instantiate it, and without it every svgIcon
        // resolves to nothing.
        provideAppInitializer(() => {
          inject(LucideIconService);
        }),
      ],
    }),
  ],
  argTypes: {
    navConfig: {
      name: 'navConfig',
      control: false,
      description: 'The only input. Assembled from the fields below.',
      table: { category: 'Component input', type: { summary: 'NavButtonConfig' } },
    },
    label: {
      control: 'text',
      description: 'Button text',
      table: { category: 'NavButtonConfig fields' },
    },
    icon: {
      control: 'select',
      options: SPRITE_ICONS,
      description:
        'Sprite id. Only search, info, menu and repeat also exist in Material ' +
        'Icons; the rest render as raw text under any iconType other than ' +
        'LUCIDE_MATERIAL.',
      table: { category: 'NavButtonConfig fields' },
    },
    iconType: {
      control: 'select',
      options: Object.values(IconType).filter((t) => t !== IconType.UNDEFINED),
      description:
        'Four values, three behaviours. CUSTOM_SVG has no case and falls ' +
        'through to MATERIAL.',
      table: { category: 'NavButtonConfig fields' },
    },
    buttonVariant: {
      control: 'select',
      options: RENDERED_VARIANTS,
      description:
        'Only the five variants the template implements are offered here. ' +
        'LINK and TEXT are in the enum but render nothing, see the Unimplemented ' +
        'Variants story.',
      table: { category: 'NavButtonConfig fields' },
    },
    theme: {
      control: 'select',
      options: THEMES,
      table: { category: 'NavButtonConfig fields' },
    },
  },
  args: {
    label: '媒合保母',
    // Chosen because it resolves in both the sprite and Material Icons, so
    // every iconType renders something.
    icon: 'search',
    iconType: IconType.LUCIDE_MATERIAL,
    buttonVariant: ButtonVariant.ICON_LABEL_FAB,
    theme: 'base',
  },
  render: (args) => ({
    props: { config: toConfig(args) },
    template: `<fluv-nav-button [navConfig]="config" />`,
  }),
};
export default meta;

type Story = StoryObj<NavButtonArgs>;

/** One button. Every field is editable in the Controls panel. */
export const Default: Story = {};

/**
 * The five variants the template implements. All render.
 *
 * Themed `primary` rather than the default `base`, because `base` and
 * `emphasis` have no rules for `icon-label-flat`, so its icon falls back to the
 * global colour and is barely visible on a coloured surface. `primary` and
 * `secondary` are the two themes with rules for every variant. Switching this
 * story to `base` is the fastest way to see that gap.
 */
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => ({
    props: {
      configs: RENDERED_VARIANTS.map((buttonVariant) =>
        toConfig({ ...args, theme: 'primary', buttonVariant, label: buttonVariant }),
      ),
    },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:2rem;align-items:flex-start;padding:1rem">
        @for (config of configs; track config.buttonVariant) {
          <div style="display:flex;flex-direction:column;gap:.5rem;align-items:center;min-width:9rem">
            <fluv-nav-button [navConfig]="config" />
            <code style="font-size:.7rem;opacity:.6">{{ config.buttonVariant }}</code>
          </div>
        }
      </div>
    `,
  }),
};

/**
 * LINK and TEXT, which the template has no case for.
 *
 * These are blank because the component does not implement them, not because
 * the story is wrong. Kept separate so the Variants story contains no blanks.
 * Issue #13.
 */
export const UnimplementedVariants: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => ({
    props: {
      configs: UNIMPLEMENTED_VARIANTS.map((buttonVariant) =>
        toConfig({ ...args, buttonVariant, label: buttonVariant }),
      ),
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;padding:1rem">
        <p style="margin:0;font-size:.8rem;opacity:.75">
          Expected to be empty. Neither has a &#64;case in the template, and the
          class switch falls through to ''. Issue #13.
        </p>
        @for (config of configs; track config.buttonVariant) {
          <div style="display:flex;gap:1rem;align-items:center">
            <div style="min-width:6rem;outline:1px dashed rgba(0,0,0,.25);min-height:2rem">
              <fluv-nav-button [navConfig]="config" />
            </div>
            <code style="font-size:.75rem;opacity:.7">{{ config.buttonVariant }} renders nothing</code>
          </div>
        }
      </div>
    `,
  }),
};

/**
 * Each IconType with an icon name valid for it.
 *
 * Three of the four are identical, because the template branches only on
 * LUCIDE_MATERIAL and sends everything else down the Material ligature path.
 * Issue #21.
 */
export const IconTypes: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => ({
    props: {
      iconName: args.icon,
      rows: [
        { iconType: IconType.LUCIDE_MATERIAL, note: 'SVG sprite, via MatIconRegistry' },
        { iconType: IconType.LUCIDE, note: 'live Lucide component, via @lucide/angular' },
        { iconType: IconType.MATERIAL, note: 'Material Icons ligature' },
        { iconType: IconType.CUSTOM_SVG, note: 'no case in the template, falls through to MATERIAL' },
      ].map((r) => ({ ...r, config: toConfig({ ...args, iconType: r.iconType }) })),
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;padding:1rem">
        <p style="margin:0;font-size:.8rem;opacity:.75">
          All four use the icon "{{ iconName }}", which exists in every name space.
          The first two draw Lucide artwork by different mechanisms, the last two
          are the same Material glyph.
        </p>
        @for (row of rows; track row.iconType) {
          <div style="display:flex;gap:1rem;align-items:center">
            <fluv-nav-button [navConfig]="row.config" />
            <code style="font-size:.75rem;opacity:.7">{{ row.iconType }} &mdash; {{ row.note }}</code>
          </div>
        }
      </div>
    `,
  }),
};

/** The same button in each theme. */
export const Themes: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => ({
    props: {
      configs: THEMES.map((theme) => toConfig({ ...args, theme, label: theme })),
    },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:2rem;align-items:flex-start;padding:1rem">
        @for (config of configs; track config.theme) {
          <div style="display:flex;flex-direction:column;gap:.5rem;align-items:center;min-width:9rem">
            <fluv-nav-button [navConfig]="config" />
            <code style="font-size:.7rem;opacity:.6">{{ config.theme }}</code>
          </div>
        }
      </div>
    `,
  }),
};

/** Every icon in the sprite, through the sprite path. All render. */
export const SpriteIcons: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => ({
    props: {
      configs: SPRITE_ICONS.map((icon) =>
        toConfig({ ...args, icon, iconType: IconType.LUCIDE_MATERIAL, label: icon }),
      ),
    },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:flex-start;padding:1rem">
        @for (config of configs; track config.icon) {
          <div style="display:flex;flex-direction:column;gap:.4rem;align-items:center;min-width:8rem">
            <fluv-nav-button [navConfig]="config" />
          </div>
        }
      </div>
    `,
  }),
};
