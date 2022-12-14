import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  PATH_OF_API = 'https://localhost:7078/';

  requestHeader = new HttpHeaders({ 'No-Auth': 'True' });
  constructor(
    private httpclient: HttpClient,
    private userAuthService: UserAuthService
  ) {}

  public login(loginData) {
    return this.httpclient.post(this.PATH_OF_API + 'api/Account/login', loginData, {
      headers: this.requestHeader,
    });
  }

  public forUser() {
    return this.httpclient.get(this.PATH_OF_API + 'api/forUser', {
      responseType: 'text',
    });
  }
  
  public forAdmin() {
    return this.httpclient.get(this.PATH_OF_API + 'api/forAdmin', {
      responseType: 'text',
    });
  }

  public getUsers() {
    return this.httpclient.get<any>(this.PATH_OF_API + 'api/Account');
  }

  public getUserById(id: number | string) {
    return this.httpclient.get<any>(this.PATH_OF_API + `api/Account/${id}`);
  }

  addUser(entry: any) {
    return this.httpclient.post(this.PATH_OF_API + 'api/Account/register', entry, {
      headers: this.requestHeader,
    });
  }
  
  updateUser(id: number | string, entry: any) {
    return this.httpclient.put(this.PATH_OF_API + `api/Account/${id}`, entry);
  }

  deleteUser(id: number | string) {
    return this.httpclient.delete(this.PATH_OF_API + `api/Account/${id}`);
  }

  //https://localhost:7078/api/Account/exportToExcel
  public exportToExcel() {
    return this.httpclient.get<any>(this.PATH_OF_API + 'api/Account/exportToExcel');
  }



  public roleMatch(allowedRoles): boolean {
    let isMatch = false;
    const userRoles: any = this.userAuthService.getRoles();

    if (userRoles != null && userRoles) {
      for (let i = 0; i < userRoles.length; i++) {
        for (let j = 0; j < allowedRoles.length; j++) {
          if (userRoles[i] === allowedRoles[j]) {
            isMatch = true;
            return isMatch;
          } else {
            return isMatch;
          }
        }
      }
    }
  }
}
