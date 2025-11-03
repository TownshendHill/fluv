import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  inject,
} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { MenuItem } from '@model/common/nav';
import { List } from '@components/layouts/list/list.component';
import { NavigationService } from '@services/core/navigation/navigation.service';
import { NavButton } from '@components/buttons/nav_button/nav_button.component';
import { NavButtonConfig } from '@model/shared/button';
import { ButtonVariant } from '@model/shared/button';
import { Group } from '@components/layouts/group/group.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'fluv-side-nav',
  imports: [
    // Material Components
    MatButtonModule,
    MatIcon,

    // Internal Components
    Group,
    List,
    NavButton,
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class SideNavComponent {
  // services
  private navigationService = inject(NavigationService);

  // properties
  hasChildren = this.navigationService.hasChildren;

  // signals
  expandedMenuItemsSet = signal<Set<string>>(new Set());

  menuItems = computed(() => {
    return this.navigationService.menuItems().map((item) => ({
      ...item,
      config: {
        ...item.config,
        navButtonConfig: {
          ...(item.config.navButtonConfig as NavButtonConfig),
          buttonVariant: ButtonVariant.ICON_LABEL,
        },
      },
    }));
  });

  // actions
  toggleExpand(path: string) {
    const current = this.expandedMenuItemsSet();
    const newSet = new Set(current);

    if (newSet.has(path)) {
      newSet.delete(path);
    } else {
      newSet.add(path);
    }

    this.expandedMenuItemsSet.set(newSet);
  }

  isExpanded(path: string): boolean {
    return this.expandedMenuItemsSet().has(path);
  }
}
