import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { DashboardAdm } from './pages/dashboard-adm/dashboard-adm';
import { MeusEventos } from './pages/meus-eventos/meus-eventos';
import { Vendas } from './pages/vendas/vendas';
import { Configuracoes } from './pages/configuracoes/configuracoes';
import { Evento } from './pages/evento/evento';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'login', component: Login},
    {path: 'dashboardadm', component: DashboardAdm},
    {path: 'meus-eventos', component:MeusEventos},
    {path: 'vendas', component: Vendas},
    {path: 'configuracoes', component:Configuracoes},
    {path: 'evento', component:Evento}
];
