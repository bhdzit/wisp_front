import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TorreVO } from '../componentes/torre/torre.component';

@Injectable({
  providedIn: 'root'
})

export class TorresService {
  constructor(private http: HttpClient) {
  }



  getTorres(): Observable<TorreVO[]> {
    return this.http.get<TorreVO[]>("api/torres/getTorres", {});
  }

  saveTorres(torre: TorreVO): Observable<TorreVO[]> {
    return this.http.post<TorreVO[]>("api/torres/saveTorre", torre);
  }

  updateTorre(torre: TorreVO): Observable<TorreVO[]> {
    return this.http.put<TorreVO[]>("api/torres/updateTorre", torre);
  }

  destroyTorres(torre: TorreVO): Observable<TorreVO[]> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: torre
    };
    return this.http.delete<TorreVO[]>("api/torres/destroyTorres", options);
  }

}