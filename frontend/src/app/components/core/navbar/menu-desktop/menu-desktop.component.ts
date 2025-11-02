import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MenuItem } from '@model/common/nav';
import { RouterModule } from '@angular/router';
import { R } from '@angular/material/ripple.d-a31a65af';

@Component({
  selector: 'fluv-menu-desktop',
  imports: [RouterModule],
  templateUrl: './menu-desktop.component.html',
  styleUrl: './menu-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuDesktop {
  menuItems = input.required<MenuItem[]>();
}
