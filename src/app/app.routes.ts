import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    canActivate: [authGuard],
    component: MainLayout,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
        children: [
          {
            path: '',
            redirectTo: 'front-page',
            pathMatch: 'full',
          },
          {
            path: 'front-page',
            loadComponent: () =>
              import('./features/front-page/front-page.component').then(
                (m) => m.FrontPageComponent,
              ),
          },
          {
            path: 'wallet',
            children: [
              {
                path: 'top_up',
                loadComponent: () =>
                  import('./features/top-up/top-up.component').then((m) => m.TopUpComponent),
              },

              {
                path: 'financial_records',
                loadComponent: () =>
                  import('./features/financial-records/financial-records.component').then(
                    (m) => m.FinancialRecordsComponent,
                  ),
              },
            ],
          },
          {
            path: 'card_management',
            children: [
              {
                path: 'card_grouping',
                loadComponent: () =>
                  import('./features/card-grouping/card-grouping.component').then(
                    (m) => m.CardGroupingComponent,
                  ),
              },
              {
                path: 'appy_a_card',
                loadComponent: () =>
                  import('./features/apply-card/apply-card.component').then(
                    (m) => m.ApplyCardComponent,
                  ),
              },
              {
                path: 'transaction_records',
                loadComponent: () =>
                  import('./features/transaction-records/transaction-records.compnent').then(
                    (m) => m.TransactionRecordsComponent,
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () => import('./shared/pages/auth/auth.page').then((m) => m.AuthPage),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./shared/components/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./shared/components/auth/register/register.component').then(
            (m) => m.RegisterComponent,
          ),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
];
