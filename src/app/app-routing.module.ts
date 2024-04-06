import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { AllHttpInterceptor } from './allhttp.interceptor';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { SectorComponent } from './componentes/sector/sector.component';
import { TorreComponent } from './componentes/torre/torre.component';
import { DeactivateGuard } from './deactivate-guard';
import { PaquetesComponent } from './componentes/paquetes/paquetes.component';
import { AuthService } from './services/auth.services';
import { ClientesComponent } from './componentes/clientes/clientes.component';
import { AgregarPagosComponent } from './componentes/pagos/agregar-pagos/agregar-pagos.component';
import { PagosMesComponent } from './componentes/pagos/pagos-mes/pagos-mes.component';
import { ReportePagosComponent } from './componentes/pagos/reporte-pagos/reporte-pagos.component';
import { OltComponent } from './componentes/olt/olt.component';

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
      },
      {
        path: 'paquete',
        component: PaquetesComponent,
        canDeactivate: [DeactivateGuard],
      },
      {
        path: 'cliente',
        component: ClientesComponent,
        canDeactivate: [DeactivateGuard],
      },
      {
        path: 'pagos/agregar_pago',
        component: AgregarPagosComponent,
        canDeactivate: [DeactivateGuard],
      },
      {
        path: 'pagos/pago_mes',
        component: PagosMesComponent,
        canDeactivate: [DeactivateGuard],
      },
      {
        path: 'pagos/reporte_pago',
        component: ReportePagosComponent,
        canDeactivate: [DeactivateGuard],
      },
      {
        path:"olt",
        component:OltComponent,
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
