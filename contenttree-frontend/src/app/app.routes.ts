import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'tree', pathMatch: 'full' },
  { path: 'tree', loadComponent: () => import('./tree-page/tree-page').then((m) => m.TreePage) },
  {
    path: 'about',
    loadComponent: () => import('./about-page/about-page').then((m) => m.AboutPage),
  },
];
