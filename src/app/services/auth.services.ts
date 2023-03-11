import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService implements CanActivate {
  constructor(private http: HttpClient, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (route.routeConfig?.path == "login" && this.isAuthenticated()) {
      this.router.navigate([""]);
    }
    if (!this.isAuthenticated() && route.routeConfig?.path != "login") this.router.navigate(["login"]);
    return true;
  }

  setToken(token: string) {
    sessionStorage.setItem("token", token);
  }

  removeToken() {
    sessionStorage.removeItem("token");
  }
  getToken(){
    return sessionStorage.getItem('token');
  }

  // ...
  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    return token != "" && token != undefined;
  }

  login(params: any): Observable<any> {
    return this.http.post<any>("api/auth/login", params);
  }

}