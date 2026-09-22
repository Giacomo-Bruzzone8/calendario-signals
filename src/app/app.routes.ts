import { Routes } from '@angular/router';
import { Home } from './home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  /*{
    path: 'day/:date',
    loadComponent: () =>
      import('./day-detail/day-detail').then(m => m.DayDetail),
  },
  */
  {
    path: '**',
    redirectTo: '',
  },
];