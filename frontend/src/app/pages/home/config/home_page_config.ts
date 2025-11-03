import { NavButtonConfig } from '@model/shared/button';
import { PageConfig } from '@model/page_config';
import { ButtonVariant, IconType } from '@model/shared/button';

export class HomePageConfig extends PageConfig {
  readonly pathSegment = '';
  readonly pageTitle = '首頁';
  readonly navButtonConfig: NavButtonConfig = {
    menuItemVariant: 'nav-config',
    label: this.pageTitle,
    routerLink: this.pathSegment,
    buttonVariant: ButtonVariant.LABEL,
    icon: 'home',
    iconType: IconType.LUCIDE_MATERIAL,
    theme: 'base',
  };
  readonly parent = undefined;

  override readonly skipInNav = true;
}

export const HOME_PAGE_CONFIG = new HomePageConfig();
