import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TorresService {
  constructor(private http: HttpClient) {
  }



  getTorres(): Observable<any> {
    return this.http.get<any>("api/torres/getTorres", {});
  }

}