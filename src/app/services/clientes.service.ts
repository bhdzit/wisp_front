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

  saveClientes(clienteVO: ClienteVO): Observable<ClienteVO[]> {
    return this.http.post<ClienteVO[]>("api/clientes/saveCliente", clienteVO);
  }

  updateCliente(clienteVO: ClienteVO): Observable<ClienteVO[]> {
    return this.http.put<ClienteVO[]>("api/Clientes/updateCliente", clienteVO);
  }

  destroyClientes(Paquete: ClienteVO): Observable<ClienteVO[]> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: Paquete
    };
    return this.http.delete<ClienteVO[]>("api/Clientes/destroyCliente", options);
  }

}
