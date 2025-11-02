import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MenuItem } from '@model/common/nav';

@Component({
  selector: 'fluv-menu-mobile',
  imports: [
    RouterModule,

    // Angular Material Components
    MatSidenavModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './menu-mobile.component.html',
  styleUrl: './menu-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuMobile {
  menuItems = input.required<MenuItem[]>();
  isOpen = input.required<boolean>();
  toggleMenu = output<void>();
  closeMenu = output<void>();
}
