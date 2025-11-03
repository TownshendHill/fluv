/**
 * NavButton Variant
 */
export enum ButtonVariant {
  // A button with a large icon above and a label text below
  ICON_LABEL_FAB = 'icon-label-fab',

  // A flat button with icon on the left and label text on the right
  ICON_LABEL_FLAT = 'icon-label-flat',

  // A button with icon on the left and label text on the right
  ICON_LABEL = 'icon-label',

  // A material button with only an icon
  ICON = 'icon',

  // A Material button with only a label text
  LABEL = 'label',

  // A standard HTML anchor element with text
  LINK = 'link',

  // A simple HTML span element displaying text
  TEXT = 'text',
}

/**
 * Variants of Menu Item
 */
export type MemuItemVariant = 'nav-config' | 'section-heading';

/**
 * Icon types: lucide icon registered as material icon, material icon, lucide icon, or custom svg icon
 */
export enum IconType {
  // Lucide icon registered as material icon
  LUCIDE_MATERIAL = 'lucide-material',
  // Material icon
  MATERIAL = 'material',
  // Lucide Icon
  LUCIDE = 'lucide',
  // Custom SVG icon
  CUSTOM_SVG = 'custom-svg',
  // Undefined
  UNDEFINED = '',
}

/**
 * Base Menu Item Config
 */
export declare interface BaseMenuItemConfig {
  // Nav button variant
  buttonVariant?: ButtonVariant;

  menuItemVariant?: MemuItemVariant;

  label?: string;

  // The Icon of the nav button
  icon?: string;

  // The Icon type
  iconType?: IconType;

  // Color theme of the nav button
  theme?: 'primary' | 'secondary' | 'emphasis' | 'base';

  // The path of the nav button to redirect ot.
  routerLink?: string | string[];
}

/**
 * NavButton Config
 */
export declare interface NavButtonConfig extends BaseMenuItemConfig {
  menuItemVariant: 'nav-config';

  label: string;
}
