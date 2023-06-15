import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClienteVO } from '../componentes/clientes/clientes.component';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  
  constructor(private http: HttpClient) {
  }



  getClientes(): Observable<ClienteVO[]> {
    return this.http.get<ClienteVO[]>("api/clientes/getClientes", {});
  }

  getClientesSuspendidos(): Observable<ClienteVO[]> {
    return this.http.get<ClienteVO[]>("api/clientes/getClientesSuspendidos", {});
  }

  saveClientes(clienteVO: ClienteVO): Observable<ClienteVO[]> {
    return this.http.post<ClienteVO[]>("api/clientes/saveCliente", clienteVO);
  }

  updateCliente(clienteVO: ClienteVO): Observable<ClienteVO[]> {
    return this.http.put<ClienteVO[]>("api/Clientes/updateCliente", clienteVO);
  }

  destroyClientes(cliente: ClienteVO): Observable<ClienteVO[]> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: cliente
    };
    return this.http.delete<ClienteVO[]>("api/Clientes/destroyCliente", options);
  }
  suspenderCliente(cliente: ClienteVO): Observable<ClienteVO[]> {

    return this.http.post<ClienteVO[]>("api/Clientes/suspenderCliente", cliente);
  }
  activarCliente(cliente: ClienteVO): Observable<ClienteVO[]> {

    return this.http.post<ClienteVO[]>("api/Clientes/activarCliente", cliente);
  }

}
