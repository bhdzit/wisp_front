import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaqueteVO } from '../componentes/paquetes/paquetes.component';
import { PagoVO } from '../componentes/pagos/agregar-pagos/agregar-pagos.component';

@Injectable({
    providedIn: 'root'
})
export class PagosService {


    constructor(private http: HttpClient) {
    }



    realizarPagos(listaDePagos: PagoVO[]): Observable<PagoVO[]> {
        return this.http.post<PagoVO[]>("api/pagos/realizarPagos", listaDePagos);
    }

    getPagosDeCliente(cliente: any): Observable<PagoVO[]> {
        return this.http.post<PagoVO[]>("api/pagos/getPagosDeCliente", cliente);
    }
}