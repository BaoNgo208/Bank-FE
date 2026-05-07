import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout.component';
import { authGuard } from './guards/auth.guard';
import { adminAuthGuard } from './guards/admin-auth.guardd';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/lading-page/lading-page.component').then((m) => m.LandingPageComponent),
  },
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
            loadComponent: () =>
              import('./features/wallet/wallet.component').then((m) => m.WalletComponent),
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
                  import('./features/card_transactions/card_transactions.compnent').then(
                    (m) => m.CardTransactionsComponent,
                  ),
              },
            ],
          },
          {
            path: 'apply_card',
            loadComponent: () =>
              import('./features/apply-card/apply-card.component').then(
                (m) => m.ApplyCardComponent,
              ),
          },
          {
            path: 'card_transactions',
            loadComponent: () =>
              import('./features/card_transactions/card_transactions.compnent').then(
                (m) => m.CardTransactionsComponent,
              ),
          },
          {
            path: 'inquiry_card',
            loadComponent: () =>
              import('./features/inquiry-card/inquiry-card.component').then(
                (m) => m.InquiryCardComponent,
              ),
          },
          {
            path: 'cashback',
            loadComponent: () =>
              import('./features/cashback/cashback.component').then((m) => m.CashbackComponent),
          },
          {
            path: 'wallet_transactions',
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'deposit',
              },
              {
                path: 'deposit',
                loadComponent: () =>
                  import('./features/wallet-transactions/deposits/deposit-transactions.component').then(
                    (m) => m.DepositTransactionsComponent,
                  ),
              },
              {
                path: 'withdrawal',
                loadComponent: () =>
                  import('./features/wallet-transactions/withdrawals/withdrawal-transactions.component').then(
                    (m) => m.WithdrawalTransactionComponent,
                  ),
              },
            ],
          },
          {
            path: 'invitation_commission',
            loadComponent: () =>
              import('./features/invitation-commission/invitation-commission.component').then(
                (m) => m.InvitationCommissionComponent,
              ),
          },
        ],
      },
    ],
  },
  {
    path: 'admin/auth',
    loadComponent: () => import('./shared/pages/auth/admin-auth.page').then((m) => m.AdminAuthPage),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/admin/auth/login/admin-login.component').then(
            (m) => m.AdminLoginComponent,
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/admin/auth/register/admin-register.component').then(
            (m) => m.AdminRegisterComponent,
          ),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent,
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/user-management/user-management.component').then(
            (m) => m.UserManagementComponent,
          ),
      },
      {
        path: 'withdrawals',
        loadComponent: () =>
          import('./features/admin/withdrawals-management/withdrawals-management.component').then(
            (m) => m.WithdrawalsManagementComponent,
          ),
      },
      {
        path: 'deposits',
        loadComponent: () =>
          import('./features/admin/deposit-orders-management/deposit-orders.component').then(
            (m) => m.DepositOrdersComponent,
          ),
      },
      {
        path: 'deposits',
        children: [
          {
            path: '',
            redirectTo: 'address',
            pathMatch: 'full',
          },
          {
            path: 'address',
            loadComponent: () =>
              import('./features/admin/deposit-management/deposit-address/deposit-address.component').then(
                (m) => m.DepositAddressComponent,
              ),
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./features/admin/deposit-management/deposit-setting/deposit-setting.component').then(
                (m) => m.DepositSettingComponent,
              ),
          },
        ],
      },
      {
        path: 'cashback',
        children: [
          {
            path: '',
            redirectTo: 'cashback-rules',
            pathMatch: 'full',
          },
          {
            path: 'cashback-rules',
            loadComponent: () =>
              import('./features/admin/cashback/components/rules/cashback-rule.component').then(
                (m) => m.CashbackRuleComponent,
              ),
          },
          {
            path: 'pending-cashbacks',
            loadComponent: () =>
              import('./features/admin/cashback/components/pendings/pending-cashbacks.component').then(
                (m) => m.PendingCashbacksComponent,
              ),
          },
        ],
      },
      {
        path: 'card',
        loadComponent: () =>
          import('./features/admin/card-management/card-management.component').then(
            (m) => m.CardManagementComponent,
          ),
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
