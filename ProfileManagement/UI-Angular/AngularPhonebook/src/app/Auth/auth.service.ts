import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private jwtHelper: JwtHelperService, private router: Router) { }

  public getToken(): any {
    return localStorage.getItem('JwtToken');
  }

  
  public removeToken(): any {
    this.router.navigate(['/login']);
    return localStorage.removeItem('JwtToken');    
  }

  public setToken(token: any) {
      localStorage.setItem("JwtToken", token); // one can also use the session storage for the token
  }

  public refreshToken(){}

}
