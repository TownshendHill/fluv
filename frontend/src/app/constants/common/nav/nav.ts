// constants/nav-page-configs.ts
import { HOME_PAGE_CONFIG } from '@pages/home/config/home_page_config';
import { SERVICES_HOME_PAGE_CONFIG } from '@pages/services/config/services_page_config';
import { HOUSE_SITTING_PAGE_CONFIG } from '@pages/services/house-sitting/config/house_sitting_page_config';
import { type PageConfig } from '@model/page_config';

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
