import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PhonebookApiService } from 'src/app/Shared/phonebook-api.service';
import { SignalrService } from 'src/app/Shared/signalr.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnDestroy{
  invalidLogin: boolean = false;

  constructor(private router: Router, 
    private apiService: PhonebookApiService,
    private authService: AuthService,
    public signalRService: SignalrService) { }

  login(form: NgForm) {
    const userCredentials = {
      'name': 'KG',
      'username': form.value.username,
      'password': form.value.password
    }
    
    this.apiService.login(userCredentials).subscribe(response => {
      this.authService.setToken((<any> response).token);
      this.invalidLogin = false;
      this.router.navigate(['/phonebook']);

      
      //  this.signalRService.startConnection();
      //  setTimeout(() => {
        this.signalRService.ChatAuth(userCredentials.username, userCredentials.password);
      // }, 1000);

    }, err => {  
      var displayErrorAlert = document.getElementById('login-error-alert');      
      if(displayErrorAlert){ displayErrorAlert.style.display = "block"; }
      setTimeout(() => {
        if(displayErrorAlert) { displayErrorAlert.style.display = "none"; }
      }, 5000);
      
      this.invalidLogin = true;  
      console.log('See error: ', err); // use logs  
    })
  }

  ngOnDestroy(): void {
    this.signalRService.hubConnection$.off("askServerResponse");
  }

}
