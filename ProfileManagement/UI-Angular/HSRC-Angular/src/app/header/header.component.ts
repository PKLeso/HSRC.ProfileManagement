import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../_services/user-auth.service';
import { UserService } from '../_services/user.service';

declare const sign_in_btn:any;
declare const sign_up_btn:any;
declare const mySignUpbtn:any;
declare const mySignInbtn:any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['../../assets/style.css'],
  
})
export class HeaderComponent implements OnInit {
  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    public userService: UserService
  ) {}

  signUp() {
    mySignUpbtn();
    sign_up_btn();
  };
  
  signIn() {
    mySignInbtn();
    sign_in_btn();
  };


  ngOnInit(): void {}

  public isLoggedIn() {
    return this.userAuthService.isLoggedIn();
  }

  public logout() {
    this.userAuthService.clear();
    this.router.navigate(['/home']);
  }
  

}
