import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Group } from '@components/layouts/group/group.component';
import { NavButtonConfig, ButtonVariant, IconType } from '@model/shared/button';
import { NavButton } from '@components/buttons/nav_button/nav_button.component';
import { BOTTOM_NAV_LOGGED_IN } from '@constants/common/nav/nav';

@Component({
  selector: 'fluv-bottom-nav',
  imports: [
    // Internal Components
    Group,
    NavButton,
  ],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavComponent {
  readonly navButtonConfigs: NavButtonConfig[] = BOTTOM_NAV_LOGGED_IN;
}
