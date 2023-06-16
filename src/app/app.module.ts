import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AllHttpInterceptor } from './allhttp.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { TorreComponent } from './componentes/torre/torre.component';
import { TorreInfoComponent } from './componentes/torre/torre-info/torre-info.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MapViewComponent } from './shared-componentes/map-view.component';
import { SectorComponent } from './componentes/sector/sector.component';
import { DeactivateGuard } from './deactivate-guard';
import { PaquetesComponent } from './componentes/paquetes/paquetes.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ClientesComponent } from './componentes/clientes/clientes.component';
import { ClientesInfoComponent } from './componentes/clientes/clientes-info/clientes-info.component';
import { AgregarPagosComponent } from './componentes/pagos/agregar-pagos/agregar-pagos.component';
import { PagosMesComponent } from './componentes/pagos/pagos-mes/pagos-mes.component';
import { ReportePagosComponent } from './componentes/pagos/reporte-pagos/reporte-pagos.component';
import { FiltroComponent } from './shared-componentes/filtro/filtro.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    TorreComponent,
    TorreInfoComponent,
    MapViewComponent,
    SectorComponent,
    PaquetesComponent,
    ClientesComponent,
    ClientesInfoComponent,
    AgregarPagosComponent,
    PagosMesComponent,
    ReportePagosComponent,
    FiltroComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSortModule,
    MatRadioModule
  ],
  providers: [AllHttpInterceptor,DeactivateGuard, {
    provide: MatDialogRef,
    useValue: {}
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
