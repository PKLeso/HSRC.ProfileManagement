import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr'
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { User } from './models/user-model';

@Injectable({
  providedIn: 'root'
})

export class SignalrService {

  constructor(public toastr: ToastrService,
    public router: Router) { }

  hubConnection$!: signalR.HubConnection;
  userData$!: User;
  
  signalrSubject = new Subject<any>(); // Always emit an event if there's a change
  signalrSubjObject(): Observable<any> {
    return this.signalrSubject.asObservable();
  }

  
  public isSignalrAuthenticated: boolean = false;

  startConnection = () => {
    this.hubConnection$ = new signalR.HubConnectionBuilder()
      .withUrl(environment.chatUrl, {
        // The belowHelps to avoid CORS issues and improves performance for SignalR
        skipNegotiation: true, 
        transport: signalR.HttpTransportType.WebSockets 
      })
      .withAutomaticReconnect()
      .build();

      this.hubConnection$.start()
      .then(() => {
        this.signalrSubject.next({ type: "HubConnStarted" });
      }).catch(err => console.log('The following error has occured while starting the hub connection: ', err))
  }

  async ChatAuth(userN: string, passW: string) {
    let userInfo: any = { username: userN, password: passW };

    await this.hubConnection$.invoke("ChatAuth", userInfo)
    .finally(() => {
      this.toastr.info("Login in attemp...");
    })
    .catch(err => console.error(err));
  }

  chatAuthListenerSuccess() {
    this.hubConnection$.on("ChatAuthSuccessResponse", (user: User) => {
      
      localStorage.setItem("userId", user.id);
      this.userData$ = {...user};
      this.isSignalrAuthenticated = true;
      this.toastr.success("Login successful!");
      this.router.navigateByUrl("/chat");
    })
  }

  chatAuthFailResponse() {
    this.hubConnection$.on("ChatAuthFailResponse", () => {
      this.toastr.error("Invalid login attempt!");
    })
  }

  async reauthChat(userId: any ) {
    await this.hubConnection$.invoke("ReauthChat", userId)
    .then(() => this.toastr.info("Login in attempt..."))
    .catch(err => console.error(err));
  }
  
  reauthenticateListener() {
    this.hubConnection$.on("ReauthenticateResponse", (user: User) => {
      
      localStorage.setItem("userId", user.id);
      this.userData$ = {...user};
      this.isSignalrAuthenticated = true;
      this.toastr.success("Re-authenticated!");

      if(this.router.url == "/login") {
        this.router.navigateByUrl("/chat");
      }
    })
  };

}
