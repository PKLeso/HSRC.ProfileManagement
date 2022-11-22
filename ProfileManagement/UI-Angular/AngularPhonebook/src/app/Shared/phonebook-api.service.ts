import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class PhonebookApiService {
  readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getEntryList(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + '/entries');
  }
  
  getEntryById(id: number | string) {
    return this.http.get<any>(this.baseUrl + `/entries/${id}`);
  }

  addEntry(entry:any) {
    return this.http.post(this.baseUrl + '/entries', entry);
  }

  updateEntry(id: number | string, entry: any) {
    return this.http.put(this.baseUrl + `/entries/${id}`, entry);
  }

  deleteEntry(id: number | string) {
    return this.http.delete(this.baseUrl + `/entries/${id}`);
  }

  
  
  getPhonebookList(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + '/phonebooks');
  }
  addPhonebook(phonebook:any) {
    return this.http.post(this.baseUrl + '/phonebooks', phonebook);
  }

  login(userCredentials: any) {
    return this.http.post(this.baseUrl + '/auth/login', userCredentials);
  }


}
