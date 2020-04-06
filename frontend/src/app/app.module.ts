import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertsModule } from 'angular-alert-module';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import {ValidateService} from './services/validate.service';
import {AuthService} from './services/auth.service';
import {AuthGuard} from './gaurds/auth.gaurd';
import { ArticlesComponent } from './components/articles/articles.component';
import { ArticleComponent } from './components/article/article.component';
import { ArticleService} from './services/article.service';
import { ReadlaterComponent } from './components/readlater/readlater.component';
import { CoronaCasesComponent } from './components/corona-cases/corona-cases.component'
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    ArticlesComponent,
    ArticleComponent,
    ReadlaterComponent,
    CoronaCasesComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ChartsModule,
    AlertsModule.forRoot(),
    
  ],
  providers: [ValidateService,AuthService,AuthGuard,ArticleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
