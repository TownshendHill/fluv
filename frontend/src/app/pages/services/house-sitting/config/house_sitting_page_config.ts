import { PageConfig } from '@model/page_config';
import { NavButtonConfig, ButtonVariant, IconType } from '@model/shared/button';
import { SERVICES_HOME_PAGE_CONFIG } from '@pages/services/config/services_page_config';

export class HouseSittingPageConfig extends PageConfig {
  readonly pathSegment = 'house-sitting';
  readonly pageTitle = '到府照顧';

  readonly navButtonConfig: NavButtonConfig = {
    menuItemVariant: 'nav-config',
    label: 'Services',
    buttonVariant: ButtonVariant.ICON_LABEL,
    icon: 'settings_ethernet',
    iconType: IconType.LUCIDE_MATERIAL,
    theme: 'primary',
    routerLink: ['/services/house-sitting'],
  };

  readonly parent = SERVICES_HOME_PAGE_CONFIG;
}

export const HOUSE_SITTING_PAGE_CONFIG = new HouseSittingPageConfig();
