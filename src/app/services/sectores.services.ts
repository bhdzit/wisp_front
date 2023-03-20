import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SectorVO } from '../componentes/sector/sector.component';

@Injectable({
  providedIn: 'root'
})

export class SectorsService {
  constructor(private http: HttpClient) {
  }

  testServices(): Observable<SectorVO[]> {
    return this.http.get<SectorVO[]>("api/test_services", {});
  }

  getSectors(): Observable<SectorVO[]> {
    return this.http.get<SectorVO[]>("api/sector/getSector", {});
  }

  saveSector(sector: SectorVO): Observable<SectorVO[]> {
    return this.http.post<SectorVO[]>("api/sector/saveSector", sector);
  }

  updateSector(sector: SectorVO): Observable<SectorVO[]> {
    return this.http.put<SectorVO[]>("api/sector/updateSector", sector);
  }

  destroySector(sector: SectorVO): Observable<SectorVO[]> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: sector
    };
    return this.http.delete<SectorVO[]>("api/sector/destroySector", options);
  }

}