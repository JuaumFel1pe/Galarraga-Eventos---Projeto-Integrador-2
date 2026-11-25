import { Routes } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { DashboardAdm } from './dashboard-adm';

export const dashboardRoutes: Routes = [
  { path: '', component: DashboardAdm, providers: [provideCharts(withDefaultRegisterables())] },
];
