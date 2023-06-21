import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ClienteVO } from '../componentes/clientes/clientes.component';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  
  constructor(private http: HttpClient) {
  }



  getClientes(): Observable<ClienteVO[]> {
    return this.http.get<ClienteVO[]>("api/clientes/getClientes", {}).pipe(map((clientes)=>clientes.map(cliente=> {
      if(cliente.primer_pago!=null){
        let fechaStr=cliente.primer_pago.split("T");
        fechaStr=fechaStr[0].split("-");
        let fecha=new Date(new Date(Number(fechaStr[0]),Number(fechaStr[1])-1,Number(fechaStr[2])));
        cliente.primer_pago=fecha.getFullYear()+"-"+("00"+(fecha.getMonth()+1)).slice(-2)+"-"+("00"+fecha.getDate()).slice(-2);
      }
      return cliente;
    })));
  }

  getClientesSuspendidos(): Observable<ClienteVO[]> {
    return this.http.get<ClienteVO[]>("api/clientes/getClientesSuspendidos", {});
  }

  saveClientes(clienteVO: ClienteVO): Observable<ClienteVO[]> {
    return this.http.post<ClienteVO[]>("api/clientes/saveCliente", clienteVO).pipe(map((clientes)=>clientes.map(cliente=> {
      if(cliente.primer_pago!=null){
        let fechaStr=cliente.primer_pago.split("T");
        fechaStr=fechaStr[0].split("-");
        let fecha=new Date(new Date(Number(fechaStr[0]),Number(fechaStr[1])-1,Number(fechaStr[2])));
        cliente.primer_pago=fecha.getFullYear()+"-"+("00"+(fecha.getMonth()+1)).slice(-2)+"-"+("00"+fecha.getDate()).slice(-2);
      }
      return cliente;
    })));
  }

  updateCliente(clienteVO: ClienteVO): Observable<ClienteVO[]> {
    return this.http.put<ClienteVO[]>("api/Clientes/updateCliente", clienteVO).pipe(map((clientes)=>clientes.map(cliente=> {
      if(cliente.primer_pago!=null){
        let fechaStr=cliente.primer_pago.split("T");
        fechaStr=fechaStr[0].split("-");
        let fecha=new Date(new Date(Number(fechaStr[0]),Number(fechaStr[1])-1,Number(fechaStr[2])));
        cliente.primer_pago=fecha.getFullYear()+"-"+("00"+(fecha.getMonth()+1)).slice(-2)+"-"+("00"+fecha.getDate()).slice(-2);
      }
      return cliente;
    })));
  }

  destroyClientes(cliente: ClienteVO): Observable<ClienteVO[]> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: cliente
    };
    return this.http.delete<ClienteVO[]>("api/Clientes/destroyCliente", options).pipe(map((clientes)=>clientes.map(cliente=> {
      if(cliente.primer_pago!=null){
        let fechaStr=cliente.primer_pago.split("T");
        fechaStr=fechaStr[0].split("-");
        let fecha=new Date(new Date(Number(fechaStr[0]),Number(fechaStr[1])-1,Number(fechaStr[2])));
        cliente.primer_pago=fecha.getFullYear()+"-"+("00"+(fecha.getMonth()+1)).slice(-2)+"-"+("00"+fecha.getDate()).slice(-2);
      }
      return cliente;
    })));;
  }
  suspenderCliente(cliente: ClienteVO): Observable<ClienteVO[]> {

    return this.http.post<ClienteVO[]>("api/Clientes/suspenderCliente", cliente);
  }
  activarCliente(cliente: ClienteVO): Observable<ClienteVO[]> {

    return this.http.post<ClienteVO[]>("api/Clientes/activarCliente", cliente);
  }

}
