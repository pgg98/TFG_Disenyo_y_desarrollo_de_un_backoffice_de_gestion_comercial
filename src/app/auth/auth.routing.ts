import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';
import { NoauthGuard } from '../guards/noauth.guard';

const routes: Routes = [
  { 
    path: 'login',
    component: AuthLayoutComponent,
    canLoad: [ NoauthGuard],
    loadChildren: () => import('src/app/auth/login/login.module').then(m => m.LoginModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
