import { NavButton } from '../../../components/buttons/nav_button/nav_button.component';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Group } from '../../../components/layouts/group/group.component';
import { List } from '../../../components/layouts/list/list.component';
import { ButtonVariant, NavButtonConfig, IconType } from '@model/shared/button';

@Component({
  selector: 'fluv-demo',
  imports: [NavButton, Group, List],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoComponent {
  protected readonly navButtons: NavButtonConfig[] = [
    {
      label: '媒合保母',
      buttonVariant: ButtonVariant.ICON,
      menuItemVariant: 'nav-config',
      icon: 'house',
      iconType: IconType.LUCIDE,
      routerLink: '/home',
    },
    {
      label: '媒合保母',
      buttonVariant: ButtonVariant.ICON_LABEL_FAB,
      menuItemVariant: 'nav-config',
      icon: 'house',
      iconType: IconType.MATERIAL,
      routerLink: '/home',
    },
    {
      label: '服務項目',
      buttonVariant: ButtonVariant.ICON_LABEL_FAB,
      menuItemVariant: 'nav-config',
      icon: 'paw-print',
      iconType: IconType.LUCIDE_MATERIAL,
      routerLink: '/home',
    },
    {
      label: '幫毛孩找個保姆吧！',
      buttonVariant: ButtonVariant.ICON_LABEL_FLAT,
      menuItemVariant: 'nav-config',
      icon: 'search',
      iconType: IconType.MATERIAL,
      theme: 'primary',
      routerLink: '/home',
    },
    {
      label: '如何預訂',
      buttonVariant: ButtonVariant.ICON_LABEL,
      menuItemVariant: 'nav-config',
      icon: 'info',
      iconType: IconType.LUCIDE_MATERIAL,
      theme: 'emphasis',
      routerLink: '/home',
    },
    {
      label: '幫毛孩找個保姆吧！',
      buttonVariant: ButtonVariant.LABEL,
      menuItemVariant: 'nav-config',
      icon: '',
      iconType: IconType.UNDEFINED,
      routerLink: '/home',
    },
  ];
}
