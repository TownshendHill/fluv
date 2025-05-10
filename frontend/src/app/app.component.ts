import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ToolBar } from './components/core/toolbar/toolbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    // Angular Material Components
    MatSidenavModule,

    // Internal Components
    ToolBar,
  ],
})
export class AppComponent {
  title = 'frontend';
}
