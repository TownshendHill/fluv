import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreakpointService } from '@services/core/layout/breakpoint.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Group } from '@components/layouts/group/group.component';
import { SidePanelService } from '@services/core/layout/side-panel.service';
import { NavButton } from '@components/buttons/nav_button/nav_button.component';
import { ButtonVariant, NavButtonConfig, IconType } from '@model/shared/button';
import { NavigationService } from '@services/core/navigation/navigation.service';

@Component({
  selector: 'fluv-navbar',
  imports: [
    CommonModule,
    RouterModule,

    // Angular Material Components
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
  private navigationService = inject(NavigationService);

  // Signals & Computed
  menuItems = this.navigationService.menuItems;
  navButtonConfigs = this.navigationService.navButtonConfigs;

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

  // Actions
  toggleMenu() {
    this.sidePanelService.toggle();
  }
}
