// services/navigation.service.ts
import { Injectable, computed } from '@angular/core';
import { NAV_GROUPS, NavGroup } from '@components/core/navbar/navbar_config';
import { MenuItem } from '@model/common/nav';
import { PageConfig } from '@model/page_config';
import { NavButtonConfig, ButtonVariant, IconType } from '@model/shared/button';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  // Computed
  menuItems = computed(() => {
    return NAV_GROUPS.map((group: NavGroup) =>
      this.buildMenuItem(group.config, group.children),
    ).filter((item) => !item.config.skipInNav);
  });

  navButtonConfigs = computed(() => {
    return this.menuItems().map(
      (item: MenuItem): NavButtonConfig =>
        item.config.navButtonConfig as NavButtonConfig,
    );
  });

  // Predicates
  hasChildren(item: MenuItem): boolean {
    return !!item.children?.length;
  }

  // Utiliy
  private buildMenuItem(
    config: PageConfig,
    children: PageConfig[] | undefined,
  ): MenuItem {
    const menuItem: MenuItem = {
      config,
      label: config.pageTitle,
      path: this.buildPath(config),
    };

    if (children && children.length > 0) {
      menuItem.children = children.map((child) => ({
        config: child,
        label: child.pageTitle,
        path: this.buildPath(child),
      }));
    }
    return menuItem;
  }

  private buildPath(config: PageConfig): string {
    const segments: string[] = [];
    let current: PageConfig | undefined = config;

    while (current) {
      segments.unshift(current.pathSegment);
      current = current.parent;
    }

    return '/' + segments.join('/');
  }
}
