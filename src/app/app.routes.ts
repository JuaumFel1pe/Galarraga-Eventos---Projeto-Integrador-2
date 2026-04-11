import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { DashboardAdm } from './pages/dashboard-adm/dashboard-adm';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'login', component: Login},
    {path: 'dashboardadm', component: DashboardAdm}
];
