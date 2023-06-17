import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private _authService: AuthService, private _router: Router){}
  logOut(){
    this._authService.setToken("");
    this._router.navigate(["login"]);
  }
}
