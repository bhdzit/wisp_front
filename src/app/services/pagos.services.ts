import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaqueteVO } from '../componentes/paquetes/paquetes.component';
import { Extra, PagoVO } from '../componentes/pagos/agregar-pagos/agregar-pagos.component';

@Injectable({
    providedIn: 'root'
})
export class PagosService {


    constructor(private http: HttpClient) {
    }



    realizarPagos(listaDePagos: PagoVO[],listaDeExtras:Extra[]): Observable<PagoVO[]> {
        return this.http.post<PagoVO[]>("api/pagos/realizarPagos", {listaDePagos,listaDeExtras});
    }

    getPagosDeCliente(cliente: any): Observable<PagoVO[]> {
        return this.http.post<PagoVO[]>("api/pagos/getPagosDeCliente", cliente);
    }
    validarReferencia(referencia: string): Observable<any> {
        return this.http.get<any>("api/pagos/validarReferencia?referencia="+referencia);
    }

    getPagosDelMes(mesPagado: string): Observable<any> {
        return this.http.get<any>("api/pagos/getPagosDelMes?mesPagado="+mesPagado);
    }
    generarPDF(idPago: number): Observable<any> {
        const httpOptions = {
            responseType: 'blob' as 'json'
          };
        return this.http.get<any>("api/pagos/generarPDF?pago="+idPago,httpOptions);
    }
}