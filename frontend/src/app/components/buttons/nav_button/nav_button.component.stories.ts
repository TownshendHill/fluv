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
import {
  ButtonVariant,
  IconType,
  type NavButtonConfig,
} from '@model/shared/button';

/**
 * NavButton takes a single NavButtonConfig object rather than separate inputs.
 * Storybook builds its Controls panel from a component's inputs, so binding
 * navConfig directly gives one raw JSON editor and nothing discoverable.
 *
 * These stories flatten the config into individual args and reassemble it in
 * render(), so each field gets a real control. The component is untouched.
 */

/** Every icon id in src/assets/icons/fluv-sprite.svg. */
const SPRITE_ICONS = [
  'chevron-down', 'chevron-left', 'chevrons-up', 'circle-help',
  'circle-user-round', 'clipboard-list', 'facebook', 'file-text', 'globe',
  'info', 'instagram', 'link-2', 'log-in', 'log-out', 'menu',
  'message-circle-more', 'paw-print', 'repeat', 'search', 'user-round-plus',
  'user-search', 'youtube',
] as const;

const THEMES = ['primary', 'secondary', 'emphasis', 'base'] as const;

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
  decorators: [
    moduleMetadata({ imports: [NavButton] }),
    applicationConfig({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideAnimationsAsync(),
        // LucideIconService registers the SVG sprite with MatIconRegistry in
        // its constructor. Nothing in a story would otherwise instantiate it,
        // and without it every svgIcon resolves to nothing.
        provideAppInitializer(() => {
          inject(LucideIconService);
        }),
      ],
    }),
  ],
  argTypes: {
    label: { control: 'text', description: 'Button text' },
    icon: {
      control: 'select',
      options: SPRITE_ICONS,
      description: 'Icon id from the fluv sprite',
    },
    iconType: {
      control: 'select',
      options: Object.values(IconType).filter((t) => t !== IconType.UNDEFINED),
      description: 'How the icon is resolved. Only LUCIDE_MATERIAL is branched on in the template.',
    },
    buttonVariant: {
      control: 'select',
      options: Object.values(ButtonVariant).filter((v) => v !== ButtonVariant.UNDEFINED),
      description: 'Layout. LINK and TEXT have no case in the template, see issue #13.',
    },
    theme: { control: 'select', options: THEMES },
  },
  args: {
    label: '媒合保母',
    icon: 'user-search',
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
 * Every ButtonVariant side by side.
 *
 * LINK and TEXT render as empty buttons. They are declared in the enum but the
 * template has no case for them, and the class switch falls through to ''.
 */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => ({
    props: {
      configs: Object.values(ButtonVariant)
        .filter((v) => v !== ButtonVariant.UNDEFINED)
        .map((buttonVariant) => toConfig({ ...args, buttonVariant, label: buttonVariant })),
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

/** Every icon in the sprite, at the variant used throughout the nav. */
export const SpriteIcons: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => ({
    props: {
      configs: SPRITE_ICONS.map((icon) => toConfig({ ...args, icon, label: icon })),
    },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:flex-start;padding:1rem">
        @for (config of configs; track config.icon) {
          <div style="display:flex;flex-direction:column;gap:.5rem;align-items:center;min-width:8rem">
            <fluv-nav-button [navConfig]="config" />
          </div>
        }
      </div>
    `,
  }),
};

/**
 * The exact six configurations from the debug demo page, so this can be
 * compared against src/app/pages/debug/demo/demo.component.ts.
 *
 * Two of them do not resolve, and that is the point of showing them here.
 * The first uses IconType.LUCIDE, which the template has no branch for, and
 * both of the first two ask for a "house" icon that is not in the sprite.
 */
export const DemoPageSet: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      configs: [
        { menuItemVariant: 'nav-config', label: '媒合保母', buttonVariant: ButtonVariant.ICON, icon: 'house', iconType: IconType.LUCIDE },
        { menuItemVariant: 'nav-config', label: '媒合保母', buttonVariant: ButtonVariant.ICON_LABEL_FAB, icon: 'house', iconType: IconType.MATERIAL },
        { menuItemVariant: 'nav-config', label: '服務項目', buttonVariant: ButtonVariant.ICON_LABEL_FAB, icon: 'paw-print', iconType: IconType.LUCIDE_MATERIAL },
        { menuItemVariant: 'nav-config', label: '幫毛孩找個保姆吧！', buttonVariant: ButtonVariant.ICON_LABEL_FLAT, icon: 'search', iconType: IconType.MATERIAL, theme: 'primary' },
        { menuItemVariant: 'nav-config', label: '如何預訂', buttonVariant: ButtonVariant.ICON_LABEL, icon: 'info', iconType: IconType.LUCIDE_MATERIAL, theme: 'emphasis' },
        { menuItemVariant: 'nav-config', label: '幫毛孩找個保姆吧！', buttonVariant: ButtonVariant.LABEL, icon: '', iconType: IconType.UNDEFINED },
      ] satisfies NavButtonConfig[],
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:2rem;padding:1rem">
        <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center">
          @for (config of configs; track $index) {
            <fluv-nav-button [navConfig]="config" />
          }
        </div>
        <div style="display:flex;flex-direction:column;gap:1.5rem;align-items:flex-start">
          @for (config of configs; track $index) {
            <fluv-nav-button [navConfig]="config" />
          }
        </div>
      </div>
    `,
  }),
};
