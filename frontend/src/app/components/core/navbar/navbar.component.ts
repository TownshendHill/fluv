import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NAV_GROUPS, NavGroup } from '../navbar/navbar_config';
import { PageConfig } from '@model/page_config';
import { MenuItem } from '@model/common/nav';
import { BreakpointService } from '@services/breakpoint.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { Group } from '@components/layouts/group/group.component';
import { SidePanelService } from '@services/core/side-panel.service';
import { NavButton } from '@components/buttons/nav_button/nav_button.component';
import { ButtonVariant, NavButtonConfig, IconType } from '@model/shared/button';

@Component({
  selector: 'fluv-navbar',
  imports: [
    CommonModule,
    RouterModule,

    // Angular Material Components
    MatIcon,
    MatToolbarModule,

    // Internal Components
    Group,
    NavButton,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBar {
  private breakpointService = inject(BreakpointService);
  private sidePanelService = inject(SidePanelService);

  isDesktop = this.breakpointService.isDesktop;
  isMobileMenuOpen = signal(false);

  // Constants
  menuIcon: NavButtonConfig = {
    label: 'Menu',
    icon: 'menu',
    menuItemVariant: 'nav-config',
    buttonVariant: ButtonVariant.ICON,
    iconType: IconType.LUCIDE_MATERIAL,
    theme: 'base',
  };

  // Computed
  menuItems = computed(() => {
    return NAV_GROUPS.map((group: NavGroup) =>
      this.buildMenuItem(group.config, group.children),
    );
  });

  // Actions
  toggleMenu() {
    this.sidePanelService.toggle();
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
