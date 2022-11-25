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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../assets/style.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private userService: UserService,
    private userAuthService: UserAuthService,
    private router: Router
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

  
  login(loginForm: NgForm) {
    this.userService.login(loginForm.value).subscribe(
      (response: any) => {
        this.userAuthService.setToken(response.jwtToken);
        this.userAuthService.setRoles(response.roles);
        this.userAuthService.setId(response.id);

        console.log('response: ', response);
        const role = response.roles[0];
        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
