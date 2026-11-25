import { Routes } from '@angular/router';
import { exigirSessao } from './core/sessao';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { CadastroPagina } from './pages/cadastro/cadastro';
import { Perfil } from './pages/perfil/perfil';
import { Checkout } from './pages/checkout/checkout';
import { Evento } from './pages/evento/evento';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'evento/:id', component: Evento },
  { path: 'login', component: Login },
  { path: 'cadastro', component: CadastroPagina },
  { path: 'perfil', component: Perfil, canActivate: [exigirSessao] },
  { path: 'checkout/:id', component: Checkout, canActivate: [exigirSessao] },
  {
    path: 'dashboardadm', canActivate: [exigirSessao], data: { admin: true },
    loadChildren: () => import('./pages/dashboard-adm/dashboard.routes').then(m => m.dashboardRoutes),
  },
  {
    path: 'meus-eventos', canActivate: [exigirSessao], data: { admin: true },
    loadComponent: () => import('./pages/meus-eventos/meus-eventos').then(m => m.MeusEventos),
  },
  {
    path: 'vendas', canActivate: [exigirSessao], data: { admin: true },
    loadComponent: () => import('./pages/vendas/vendas').then(m => m.Vendas),
  },
  {
    path: 'configuracoes', canActivate: [exigirSessao], data: { admin: true },
    loadComponent: () => import('./pages/configuracoes/configuracoes').then(m => m.Configuracoes),
  },
  {
    path: 'catalogo-admin', canActivate: [exigirSessao], data: { admin: true },
    loadComponent: () => import('./pages/catalogo-admin/catalogo-admin').then(m => m.CatalogoAdmin),
  },
  {
    path: 'adicionar-evento/:id', canActivate: [exigirSessao], data: { admin: true },
    loadComponent: () => import('./pages/alterar-evento/alterar-evento').then(m => m.AlterarEvento),
  },
  {
    path: 'adicionar-evento', canActivate: [exigirSessao], data: { admin: true },
    loadComponent: () => import('./pages/alterar-evento/alterar-evento').then(m => m.AlterarEvento),
  },
  { path: '**', redirectTo: '' },
];
