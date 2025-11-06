// constants/nav-page-configs.ts
import { HOME_PAGE_CONFIG } from '@pages/home/config/home_page_config';
import { SERVICES_HOME_PAGE_CONFIG } from '@pages/services/config/services_page_config';
import { HOUSE_SITTING_PAGE_CONFIG } from '@pages/services/house-sitting/config/house_sitting_page_config';
import { type PageConfig } from '@model/page_config';
import { NavButtonConfig, ButtonVariant, IconType } from '@model/shared/button';

export interface NavGroup {
  config: PageConfig;
  children?: PageConfig[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    config: HOME_PAGE_CONFIG,
  },
  {
    config: SERVICES_HOME_PAGE_CONFIG,
    children: [HOUSE_SITTING_PAGE_CONFIG],
  },
];

export const BOTTOM_NAV_LOGGED_IN: NavButtonConfig[] = [
  {
    label: '媒合保母',
    icon: 'user-search',
    menuItemVariant: 'nav-config',
    buttonVariant: ButtonVariant.ICON_LABEL_FAB,
    iconType: IconType.LUCIDE_MATERIAL,
    theme: 'base',
    routerLink: ['/services/house-sitting'],
  },
  {
    label: '服務項目',
    icon: 'paw-print',
    menuItemVariant: 'nav-config',
    buttonVariant: ButtonVariant.ICON_LABEL_FAB,
    iconType: IconType.LUCIDE_MATERIAL,
    theme: 'base',
  },
  {
    label: '如何預訂',
    icon: 'info',
    menuItemVariant: 'nav-config',
    buttonVariant: ButtonVariant.ICON_LABEL_FAB,
    iconType: IconType.LUCIDE_MATERIAL,
    theme: 'base',
  },
  {
    label: '聯絡客服',
    icon: 'line',
    menuItemVariant: 'nav-config',
    buttonVariant: ButtonVariant.ICON_LABEL_FAB,
    iconType: IconType.CUSTOM_SVG,
    theme: 'base',
  },
  {
    label: '登入/註冊',
    icon: 'log-in',
    menuItemVariant: 'nav-config',
    buttonVariant: ButtonVariant.ICON_LABEL_FAB,
    iconType: IconType.LUCIDE_MATERIAL,
    theme: 'base',
  },
];
