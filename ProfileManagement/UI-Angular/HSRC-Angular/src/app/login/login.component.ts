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

  invalidLogin: boolean = false;
  registeredSuccessfully: boolean = false;
  public response: {dbPath: '' };

  registerUser: any = {
    email: "user@example.com",
    password: "string",
    firstName: "string",
    lastName: "string",
    roles: [
      "string"
    ],
    status: "string",
    imagePath: "string"
  }

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

  
  AddUserEntry(signUpForm: NgForm) {
    this.registerUser = {
      email: signUpForm.value.Email,
      password: signUpForm.value.Password,
      firstName: signUpForm.value.FirstName,
      lastName: signUpForm.value.LastName,
      roles: [
        signUpForm.value.Role
      ],
      status: "InActive",
      imagePath: this.response.dbPath
    }

    this.userService.addUser(this.registerUser).subscribe(response => {
      console.log("respond: ", response)
      if(response){
        this.registeredSuccessfully = true;  
        setTimeout(() => {
          this.registeredSuccessfully = false;
        }, 5000);
        
    }

    }, err => {      
      var displayErrorAlert = document.getElementById('add-error-alert');      
      if(displayErrorAlert){ displayErrorAlert.style.display = "block"; }
      setTimeout(() => {
        if(displayErrorAlert) { displayErrorAlert.style.display = "none"; }
      }, 5000);
      console.log('See error: ', err); // use logs
    })

  }

  register(signUpForm: NgForm){
    console.log('for data: ', signUpForm.value)
    this.userService.addUser(signUpForm.value);
  }

  public uploadFinished = (event) => {
    this.response = event;
  }
  
  login(loginForm: NgForm) {
    this.userService.login(loginForm.value).subscribe(
      (response: any) => {
        this.invalidLogin = false;
        this.userAuthService.setToken(response.jwtToken);
        this.userAuthService.setRoles(response.roles);
        this.userAuthService.setId(response.id);

        const role = response.roles[0];
        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']);
        }
      },
      (error) => {        
       var displayErrorAlert = document.getElementById('login-error-alert');      
       if(displayErrorAlert){ displayErrorAlert.style.display = "block"; }
       setTimeout(() => {
         if(displayErrorAlert) { displayErrorAlert.style.display = "none"; }
       }, 5000);
  
       this.invalidLogin = true;  
       console.log('See error: ', error)
      }
    );
  }
}
