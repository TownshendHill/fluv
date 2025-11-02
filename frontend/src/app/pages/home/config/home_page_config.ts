import { NavButtonConfig } from '@model/shared/button';
import { PageConfig } from '@model/page_config';

export class HomePageConfig extends PageConfig {
  readonly pathSegment = '';
  readonly pageTitle = '首頁';
  readonly navButtonConfig: NavButtonConfig = {
    menuItemVariant: 'nav-config',
    label: 'Home',
  };
  readonly parent = undefined;
}

export const HOME_PAGE_CONFIG = new HomePageConfig();
