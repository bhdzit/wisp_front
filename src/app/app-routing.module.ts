import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { AllHttpInterceptor } from './allhttp.interceptor';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { SectorComponent } from './componentes/sector/sector.component';
import { TorreComponent } from './componentes/torre/torre.component';
import { DeactivateGuard } from './deactivate-guard';
import { AuthService } from './services/auth.services';

const routes: Routes = [

  { path: 'login', component: LoginComponent, canActivate: [AuthService] },
  {
    path: '', component: HomeComponent,
    canActivate: [AuthService],
    canDeactivate: [DeactivateGuard],
    children: [
      {
        path: 'torre',
        component: TorreComponent,
      },
      {
        path: 'sector',
        component: SectorComponent,
        canDeactivate: [DeactivateGuard],
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
