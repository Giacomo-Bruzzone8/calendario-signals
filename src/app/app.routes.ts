import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { Home } from './home/home';
import { formatDate, parseDate } from './pages/date-utils';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: Home,
  },

  { path: 'home', redirectTo: '', pathMatch: 'full' },

  // Calendar
  {
    path: 'calendar',
    loadComponent: () => import('./pages/calendar-page').then(m => m.CalendarPage),
  },
  
  // Goals
  {
    path: 'goals',
    data: { title: 'NavbarComponent.Goals' },
    loadComponent: () => import('./pages/coming-soon-page').then(m => m.ComingSoonPage),
  },

  // Profile
  {
    path: 'profile',
    data: { title: 'NavbarComponent.Profile' },
    loadComponent: () => import('./pages/coming-soon-page').then(m => m.ComingSoonPage),
  },

  // Detail current Day
  { path: 'day', redirectTo: () => `day/${formatDate(new Date())}`, pathMatch: 'full' },

  // Detail specific Day
  {
    path: 'day/:date',
    canActivate: [
      route => parseDate(route.paramMap.get('date') ?? '') !== null
        || inject(Router).createUrlTree(['/calendar']),
    ],
    loadComponent: () => import('./pages/day-page').then(m => m.DayPage),
  },

  {
    path: '**',
    redirectTo: '',
  },
];
