import { Injectable } from '@angular/core';
import { Headers , RequestOptions } from '@angular/http';
import { AdminChangePassword } from '../AdminChangePassword';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserHomeServiceService {

  server:string = 'https://ibigo.shadowis.nl/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': JSON.parse(localStorage.getItem('client_token'))
    })
  };

  constructor(private http:HttpClient) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', JSON.parse(localStorage.getItem('client_token')));
  }

   
  changePassword(oldpassword,password,password_confirmation):Observable<AdminChangePassword>
  {
    
    const newUserLogin = new AdminChangePassword(oldpassword,password,password_confirmation);
    return this.http.post<AdminChangePassword>(this.server+'server-api/api/user/change_password',newUserLogin,this.httpOptions);
  }
}
