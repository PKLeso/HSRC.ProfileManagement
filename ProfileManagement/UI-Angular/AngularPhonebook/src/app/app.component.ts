import { Component, OnDestroy, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './Auth/auth.service';
import { SignalrAuthService } from './signal-r/signalr-auth.service';
import { SignalrService } from './Shared/signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit, OnDestroy{
  title = 'Phonebook App';


  constructor(private authService: AuthService,
    private jwtHelper: JwtHelperService,
    public signalrService: SignalrService,
    public signalrAuthService: SignalrAuthService){}

  ngOnInit(): void {
    this.signalrService.startConnection();

    this.logoutListener();
  }

  ngOnDestroy(): void {
    this.signalrService.hubConnection$.off("ChatAuthSuccessResponse");
  }

  public isAuthenticated(): boolean {
    const token = this.authService.getToken();
    if(token && !this.jwtHelper.isTokenExpired(token)){
      return true;
    }
    else {
      return false;
    }
  }

  logOut() {
    this.authService.removeToken();
    console.log("conn Id: ", this.signalrService.userData$.connectionId);
    // signal r
    this.signalrService.hubConnection$.invoke("Logout", this.signalrService.userData$.connectionId)
    .catch(err => console.error(err));
    // this.isAuthenticated();
  }

  // logout listener
  logoutListener(): void {
    this.signalrService.hubConnection$.on("LogoutResponse", () => {
      localStorage.removeItem("userId");
      this.userOfListener();
      location.reload();
    })
  }

  userOfListener(): void {
    this.signalrService.hubConnection$.on("UserOff", (userId: string) => {
      console.log('remove: ', userId);
      //this.users = this.users.filter(f => f.id != userId);
    });
  }


}
