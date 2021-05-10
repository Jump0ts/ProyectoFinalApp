import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SemanaPage } from './semana.page';

const routes: Routes = [
  {
    path: '',
    component: SemanaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SemanaPageRoutingModule {}
