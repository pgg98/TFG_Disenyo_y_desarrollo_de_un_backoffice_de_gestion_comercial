import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LeadsComponent } from './admin/leads/leads.component';
import { EditorComponent } from '../commons/editor/editor.component'
import { DemosComponent } from './admin/demos/demos.component';
import { ClientesComponent } from './admin/clientes/clientes.component';
import { BajasComponent } from './admin/bajas/bajas.component';


const routes: Routes = [
  { path: 'admin', component: AdminLayoutComponent, canActivate: [ AuthGuard], data: {rol: 'ROL_ADMIN'},
    children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
      canLoad: [ AuthGuard ],
      loadChildren: () => import('src/app/pages/admin/dashboard/dashboard.module').then(m => m.DashboardModule),
      data: {
        rol: 'ROL_ADMIN',
        titulo: 'Estadísticas',
        // breadcrums: []
      },
    },
    {
      path: 'leads',
      component: LeadsComponent,
      canLoad: [ AuthGuard ],
      loadChildren: () => import('src/app/pages/admin/leads/leads.module').then(m => m.LeadsModule),
      data: {
        rol: 'ROL_ADMIN',
        titulo: 'Leads',
        // breadcrums: []
      },
    },
    {
      path: 'leads/lead',
      component: EditorComponent,
      canLoad: [ AuthGuard ],
      loadChildren: () => import('../commons/editor/editor.module').then(m => m.EditorModule),
      data: {
        rol: 'ROL_ADMIN',
        titulo: 'Editor de Lead',
        breadcrums: [{titulo: 'Tabla Leads', url: '/admin/leads'}]
      },
    },
    {
      path: 'demos',
      component: DemosComponent,
      canLoad: [ AuthGuard ],
      loadChildren: () => import('src/app/pages/admin/demos/demos.module').then(m => m.DemosModule),
      data: {
        rol: 'ROL_ADMIN',
        titulo: 'Demos',
        // breadcrums: []
      },
    },
    {
      path: 'demos/demo',
      component: EditorComponent,
      canLoad: [ AuthGuard ],
      loadChildren: () => import('../commons/editor/editor.module').then(m => m.EditorModule),
      data: {
        rol: 'ROL_ADMIN',
        titulo: 'Editor de Demo',
        breadcrums: [{titulo: 'Tabla Demos', url: '/admin/demos'}]
      },
    },
    {
      path: 'clientes',
      component: ClientesComponent,
      canLoad: [ AuthGuard ],
      loadChildren: () => import('src/app/pages/admin/clientes/clientes.module').then(m => m.ClientesModule),
      data: {
        rol: 'ROL_ADMIN',
        titulo: 'Clientes',
        // breadcrums: []
      },
    },
    {
      path: 'clientes/cliente',
      component: EditorComponent,
      canLoad: [ AuthGuard ],
      loadChildren: () => import('../commons/editor/editor.module').then(m => m.EditorModule),
      data: {
        rol: 'ROL_ADMIN',
        titulo: 'Editor de Cliente',
        breadcrums: [{titulo: 'Tabla Clientes', url: '/admin/clientes'}]
      },
    },
    {
      path: 'bajas',
      component: BajasComponent,
      canLoad: [ AuthGuard ],
      loadChildren: () => import('src/app/pages/admin/bajas/bajas.module').then(m => m.BajasModule),
      data: {
        rol: 'ROL_ADMIN',
        titulo: 'Bajas',
        // breadcrums: []
      },
    },
    { path: '**', redirectTo: 'dashboard'}
  ]},
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
