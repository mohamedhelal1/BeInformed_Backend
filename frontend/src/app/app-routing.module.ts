import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/auth/login/login.component';
import {RegisterComponent} from './components/auth/register/register.component';
import { ArticlesComponent } from './components/articles/articles.component';
import{ReadlaterComponent} from './components/readlater/readlater.component'
import{ CoronaCasesComponent } from './components/corona-cases/corona-cases.component'
import {AuthGuard} from './gaurds/auth.gaurd';


const routes: Routes = [
  {path:'login',component: LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'',component:ArticlesComponent},
  {path:'readlater',component:ReadlaterComponent,canActivate:[AuthGuard]},
  {path:'cases',component: CoronaCasesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
