import { Injectable } from '@angular/core';
import { Headers , RequestOptions } from '@angular/http';
import { AdminResetPassword } from '../AdminResetPassword';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserResetPasswordService {

  server:string = 'https://ibigo.shadowis.nl/';
  headers :Headers = new Headers();
  options:any;

  
  constructor(private http:HttpClient) {
    this.headers.append('enctype','multipart/form-data');
    this.headers.append('Content-Type','application/json');
    this.headers.append('X-Requested-With','XMLHttpRequest');

    this.options = new RequestOptions({headers:this.headers});
   }

  resetpassword(token,password,password_confirmation):Observable<AdminResetPassword>
  {
    const t = token;
    const newUserLogin = new AdminResetPassword(token,password,password_confirmation);
    return this.http.post<AdminResetPassword>(this.server+'server-api/api/user/reset/'+t,newUserLogin);
  }
}
