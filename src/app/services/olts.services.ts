import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OltVO } from '../componentes/olt/olt.component';


@Injectable({
  providedIn: 'root'
})

export class OLTSService {
  constructor(private http: HttpClient) {
  }



  getOlts(): Observable<OltVO[]> {
    return this.http.get<OltVO[]>("api/olts/getOlts", {});
  }

  saveOlts(olt: OltVO): Observable<OltVO[]> {
    return this.http.post<OltVO[]>("api/olts/saveOlt", olt);
  }

  updateOlt(olt: OltVO): Observable<OltVO[]> {
    return this.http.put<OltVO[]>("api/olts/updateOlt", olt);
  }

  destroyOlts(olt: OltVO): Observable<OltVO[]> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: olt
    };
    return this.http.delete<OltVO[]>("api/olts/destroyOlts", options);
  }

}