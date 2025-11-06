import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavButton } from '../../components/buttons/nav_button/nav_button.component';
import { Card } from '@components/cards/card/card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    // Material Modules
    MatButtonModule,
    MatIconModule,

    // Internal Components
    Card,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
