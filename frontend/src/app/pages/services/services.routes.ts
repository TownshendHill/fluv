import { Routes } from '@angular/router';
import { SERVICES_HOME_PAGE_CONFIG } from '@pages/services/config/services_page_config';
import { HOUSE_SITTING_PAGE_CONFIG } from './house-sitting/config/house_sitting_page_config';

export const SERVICES_ROUTES: Routes = [
  {
    path: 'services',
    loadComponent: () =>
      import('./services.component').then((m) => m.ServicesComponent),
    // children: [
    //   {
    //     path: 'house-sitting',
    //     loadComponent: () =>
    //       import('./house-sitting/house-sitting.component').then(
    //         (m) => m.HouseSittingComponent,
    //       ),
    //   },
    //   // other children...
    // ],
  },
  {
    path: 'services/house-sitting',
    loadComponent: () =>
      import('./house-sitting/house-sitting.component').then(
        (m) => m.HouseSittingComponent,
      ),
  },
];
