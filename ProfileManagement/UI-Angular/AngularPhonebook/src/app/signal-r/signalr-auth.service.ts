import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { SignalrService } from 'src/app/Shared/signalr.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrAuthService {

  constructor(public signalrService: SignalrService,
    public router: Router) {
      
      let tempUserId = localStorage.getItem("userId");
      
      if (tempUserId) {
        if (this.signalrService.hubConnection$?.state === signalR.HubConnectionState.Connected) {
          this.signalrService.reauthenticateListener();
          this.signalrService.reauthChat(tempUserId);
        }
      else {
        this.signalrService.signalrSubjObject().subscribe((subj: any) => {
          if(subj.type == "HubConnStarted") {
            this.signalrService.reauthenticateListener();
            this.signalrService.reauthChat(tempUserId);
          }
        });
      }
            
     }

    }
  }
