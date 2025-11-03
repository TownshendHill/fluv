import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  FileIcon,
  House,
  Menu,
  UserCheck,
} from 'lucide-angular';
import {
  type NavButtonConfig,
  ButtonVariant,
  IconType,
} from '../../../types/shared/button';

const DEFAULT_NAV_CONFIG = ButtonVariant.ICON_LABEL;

@Component({
  selector: 'fluv-nav-button',
  imports: [
    CommonModule,
    // Material Modules
    MatButtonModule,
    MatIconModule,
    // Common Modules
    RouterModule,

    // Other Modules
    LucideAngularModule,
  ],
  templateUrl: './nav_button.component.html',
  styleUrl: './nav_button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'nav-button',
    '[class]': 'class()',
  },
})
export class NavButton {
  // Input Signals
  navConfig = input<NavButtonConfig>();

  // Computed Signals
  variant = computed<ButtonVariant>(
    () => this.navConfig()?.buttonVariant ?? DEFAULT_NAV_CONFIG,
  );
  routerLink = computed<string | string[]>(
    () => this.navConfig()?.routerLink ?? '',
  );
  label = computed<string | undefined>(() => this.navConfig()?.label);
  icon = computed<string | undefined>(() => this.navConfig()?.icon);
  isLucideMaterialIcon = computed<boolean>(
    () => this.navConfig()?.iconType === IconType.LUCIDE_MATERIAL,
  );

  // Utility classes for theme and button type
  themeClass = computed<string>(() => {
    const theme = this.navConfig()?.theme;
    return theme ?? '';
  });

  buttonTypeClass = computed<string>(() => {
    switch (this.navConfig()?.buttonVariant) {
      case ButtonVariant.ICON_LABEL_FAB:
        return 'fab';
      case ButtonVariant.ICON_LABEL_FLAT:
        return 'icon-label-flat';
      case ButtonVariant.ICON_LABEL:
        return 'icon-label';
      case ButtonVariant.ICON:
        return 'icon';
      case ButtonVariant.LABEL:
        return 'label';
      default:
        return '';
    }
  });

  class = computed<string>(() => {
    const classes: string[] = [];

    const themeClass = this.themeClass();
    const buttonTypeClass = this.buttonTypeClass();

    if (themeClass) classes.push(themeClass);
    if (buttonTypeClass) classes.push(buttonTypeClass);

    return classes.join(' ');
  });

  // For UI switch case
  readonly Variant = ButtonVariant;
}
