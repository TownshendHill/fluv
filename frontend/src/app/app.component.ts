import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { ToolBar } from './components/core/toolbar/toolbar.component';
import { LucideIconService } from './services/lucide-icon.service';

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
    ToolBar,
  ],
})
export class AppComponent {
  readonly lucideIconService = inject(LucideIconService);
  // The title of the applicati
  title = 'frontend';
}
