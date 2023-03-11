import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AuthService } from './services/auth.services';


@Injectable()
export class AllHttpInterceptor implements HttpInterceptor {

  constructor(private _authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let preloader = document.getElementById("preloader");
    preloader?.classList.remove("d-none");
    const httpReq = req.clone({
      url: "http://" + environment.serverURL + "/" + req.url,
      headers: req.headers.set('Authorization', `Bearer ${this._authService.getToken()}`),
    });
    return next.handle(httpReq).pipe(map((res) => {
      if (res.type != 0) preloader?.classList.add("d-none");
      return res;
    }), catchError(x => this.handleAuthError(x)));
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    let preloader = document.getElementById("preloader");
    preloader?.classList.add("d-none");
    Swal.fire({
      title: 'Error!',
      text: 'Parece que hubo un problema con la conexion, por favor intenta mas tarde!',
      icon: 'error',
      confirmButtonText: 'OK'
    })
    if (err.status == 400) {
      return new Observable;
    }
    //handle your auth error or rethrow
    if (err.status === 401 || err.status === 403) {

    }
    return throwError(err);
  }


}
