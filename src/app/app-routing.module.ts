import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { AllHttpInterceptor } from './allhttp.interceptor';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { TorreComponent } from './componentes/torre/torre.component';
import { AuthService } from './services/auth.services';

const routes: Routes = [

  { path: 'login', component: LoginComponent, canActivate: [AuthService] },
  {
    path: '', component: HomeComponent,
    canActivate: [AuthService],
    children: [
      {
        path: 'torre',
        component: TorreComponent,
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AllHttpInterceptor, multi: true }],
})
export class AppRoutingModule { }
