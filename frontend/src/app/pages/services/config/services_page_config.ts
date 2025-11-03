import { PageConfig } from '@model/page_config';
import { NavButtonConfig, ButtonVariant, IconType } from '@model/shared/button';

export class ServicesHomePageConfig extends PageConfig {
  readonly pathSegment = 'services';
  readonly pageTitle = '服務項目';

  readonly navButtonConfig: NavButtonConfig = {
    menuItemVariant: 'nav-config',
    label: this.pageTitle,
    buttonVariant: ButtonVariant.LABEL,
    icon: 'paw-print',
    iconType: IconType.LUCIDE_MATERIAL,
    theme: 'base',
    routerLink: ['/services'],
  };

  readonly parent = undefined;
}

export const SERVICES_HOME_PAGE_CONFIG = new ServicesHomePageConfig();
