import { Routes } from '@angular/router';
import { HOME_ROUTES } from '@pages/home/home.routes';
import { SERVICES_ROUTES } from '@pages/services/services.routes';

export const routes: Routes = [
  ...HOME_ROUTES,
  ...SERVICES_ROUTES,
  {
    path: 'debug',
    loadComponent: () =>
      import('./pages/debug/demo/demo.component').then((m) => m.DemoComponent),
  },
];
