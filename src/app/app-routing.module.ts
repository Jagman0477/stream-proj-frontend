import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackendTestComponent } from './backend-test/backend-test.component';

const routes: Routes = [
  { path: 'test', component: BackendTestComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
