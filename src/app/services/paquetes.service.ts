import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaqueteVO } from '../componentes/paquetes/paquetes.component';

@Injectable({
  providedIn: 'root'
})
export class PaquetesService {

  
  constructor(private http: HttpClient) {
  }



  getpaquetes(): Observable<PaqueteVO[]> {
    return this.http.get<PaqueteVO[]>("api/paquetes/getPaquetes", {});
  }

  savePaquetes(Paquete: PaqueteVO): Observable<PaqueteVO[]> {
    return this.http.post<PaqueteVO[]>("api/paquetes/savePaquete", Paquete);
  }

  updatePaquete(Paquete: PaqueteVO): Observable<PaqueteVO[]> {
    return this.http.put<PaqueteVO[]>("api/paquetes/updatePaquete", Paquete);
  }

  destroyPaquetes(Paquete: PaqueteVO): Observable<PaqueteVO[]> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: Paquete
    };
    return this.http.delete<PaqueteVO[]>("api/paquetes/destroypaquete", options);
  }

}
