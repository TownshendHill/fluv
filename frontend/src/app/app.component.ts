import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { NavBar } from '@components/core/navbar/navbar.component';
import { SidePanelService } from '@services/core/layout/side-panel.service';
import { LucideIconService } from './services/lucide-icon.service';
import { SideNavComponent } from '@components/core/side-nav/side-nav.component';
import { BottomNavComponent } from '@components/mobile/bottom-nav/bottom-nav.component';
import { BreakpointService } from '@services/core/layout/breakpoint.service';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [LucideIconService],
  imports: [
    RouterOutlet,
    // Angular Material Components
    MatSidenavModule,
    MatIconModule,

    // Internal Components
    BottomNavComponent,
    NavBar,
    SideNavComponent,
  ],
})
export class AppComponent {
  readonly lucideIconService = inject(LucideIconService);
  readonly sidePanelService = inject(SidePanelService);
  readonly breakpointService = inject(BreakpointService);
  // The title of the applicati
  title = 'frontend';
}
