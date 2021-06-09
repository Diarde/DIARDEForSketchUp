import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ToolGuard } from './tool/tool.guard';
import { SelectorComponent } from './tool/selector/selector.component';

const routes: Routes = [  {
  path: 'login', component: LoginComponent
},
{
  path: 'tool',
  component: SelectorComponent,
  canActivate: [ToolGuard]
},
{
  path: '',
  redirectTo: '/tool',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
