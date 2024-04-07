import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NapVO } from '../componentes/nap/nap.component';

@Injectable({
  providedIn: 'root'
})

export class NapService {
  constructor(private http: HttpClient) {
  }



  getNaps(): Observable<NapVO[]> {
    return this.http.get<NapVO[]>("api/naps/getNaps", {});
  }

  saveNaps(nap: NapVO): Observable<NapVO[]> {
    return this.http.post<NapVO[]>("api/naps/saveNap", nap);
  }

  updateNap(nap: NapVO): Observable<NapVO[]> {
    return this.http.put<NapVO[]>("api/naps/updateNap", nap);
  }

  destroyNap(nap: NapVO): Observable<NapVO[]> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: nap
    };
    return this.http.delete<NapVO[]>("api/naps/destroyNaps", options);
  }

}