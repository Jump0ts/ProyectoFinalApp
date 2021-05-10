import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'recetas',
    loadChildren: () => import('./comida/recetas/recetas.module').then( m => m.RecetasPageModule)
  },
  {
    path: 'semana',
    loadChildren: () => import('./semana/semana.module').then( m => m.SemanaPageModule)
  },
  {
    path: 'config',
    loadChildren: () => import('./config/config.module').then( m => m.ConfigPageModule)
  },
  {
    path: 'receta/:rec',
    loadChildren: () => import('./comida/receta/receta.module').then( m => m.RecetaPageModule)
  },
  
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
    
  },
  {
    path: 'new-receta',
    loadChildren: () => import('./comida/new-receta/new-receta.module').then( m => m.NewRecetaPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
