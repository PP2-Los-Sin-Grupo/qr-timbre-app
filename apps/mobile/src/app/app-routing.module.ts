import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

const authGuard = () => {
  const auth = inject( AuthService );
  const router = inject( Router );
  return auth.isLoggedIn() ? true : router.createUrlTree( [ '/login' ] );
};
const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import( './login/login.module' ).then( m => m.LoginPageModule )
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadChildren: () => import( './home/home.module' ).then( m => m.HomePageModule )
  },
  {
    path: 'ajustes',
    canActivate: [authGuard],
    loadChildren: () => import( './ajustes/ajustes.module' ).then( m => m.AjustesPageModule )
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule( {
  imports: [
    RouterModule.forRoot( routes, { preloadingStrategy: PreloadAllModules } )
  ],
  exports: [ RouterModule ]
} )
export class AppRoutingModule { }
