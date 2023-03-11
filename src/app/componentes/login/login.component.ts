import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.services';
import * as $ from 'jquery';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario: string = "";
  password: string = "";
  errMsg = "";

  constructor(private _authService: AuthService, private _router: Router) {

  }
  ngOnInit(): void {

  }

  login() {
    this._authService.login({ correo: this.usuario, password: this.password })
      .subscribe(then => {
        console.log(then);
        if (then?.msg) {
          this.errMsg = then.msg;
        } else {
          this._authService.setToken(then.token);
          this._router.navigate(["torre"]);
        }
      })
  }
}
