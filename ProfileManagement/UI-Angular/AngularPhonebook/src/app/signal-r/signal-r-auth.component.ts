import { Component, OnDestroy, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { SignalrService } from 'src/app/Shared/signalr.service';
import { Message } from "../Shared/models/message-model";
import { User } from '../Shared/models/user-model';

@Component({
  selector: 'app-signal-r-auth',
  templateUrl: './signal-r-auth.component.html',
  styleUrls: ['./signal-r-auth.component.css']
})
export class SignalRAuthComponent implements OnInit, OnDestroy {

  constructor(public signalrService: SignalrService) { }

  users: Array<User> = new Array<User>();

  selectedUser: User = new User;
  message: string = '';

  ngOnInit(): void {
    this.sendMessageListener();
    
    this.signalrService.chatAuthListenerSuccess();
    this.signalrService.chatAuthFailResponse();

    this.userOnListener();
    this.userOfListener();
    this.getOnlineUsersListener();

    if (this.signalrService.hubConnection$?.state === signalR.HubConnectionState.Connected){
      this.getOnlineUsers();
    }
    else {
      this.signalrService.signalrSubject.subscribe((subj: any) => {
        if(subj.type == "HubConnStarted") {
          this.getOnlineUsers();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this,this.signalrService.hubConnection$.off("chatAuthSuccessResponse");
    this,this.signalrService.hubConnection$.off("chatAuthFailResponse");
  }

  
  userOnListener(): void {
    this.signalrService.hubConnection$.on("UserOn", (newUser: User) => {
      console.log(newUser);
      this.users.push(newUser);
    });
  }
  userOfListener(): void {
    this.signalrService.hubConnection$.on("UserOff", (userId: string) => {
      this.users = this.users.filter(f => f.id != userId);
    });
  }

  getOnlineUsers(): void {
    this.signalrService.hubConnection$.invoke("GetOnlineUsers")
    .catch(err => console.error(err));
  }
  getOnlineUsersListener() {
    this.signalrService.hubConnection$.on("GetOnlineUsersResponse", (onlineUsers: Array<User>) => {
      console.log('online users: ', onlineUsers);
      this.users = [...onlineUsers];
    })
  }

  sendMessage(): void {
    console.log('selected user: ', this.selectedUser)
    if(this.message.trim() === "" || this.message == null) return;

    this.signalrService.hubConnection$.invoke("SendMessage", this.selectedUser.connectionId, this.message)
    .catch(err => console.error(err));

    if(this.selectedUser.messages == null){
      this.selectedUser.messages = [];
    }

    this.selectedUser.messages.push(new Message(this.message, true));
    //this.message = "";
  }

  sendMessageListener(): void {
    this.signalrService.hubConnection$.on("SendMesssageResponse", (connId: string, message: string) => {
      let receiver = this.users.find(u => u.connectionId === connId) as User;
      if(receiver?.messages == null){
        // do something
        receiver.messages = <any>[];
      }
      receiver.messages.push(new Message(message, false));
    })
  }

}
