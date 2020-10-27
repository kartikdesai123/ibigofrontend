import { Injectable } from '@angular/core';
import { Headers , RequestOptions } from '@angular/http';
import { AdminForgotPassword } from '../AdminForgotPassword';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminForgotPasswordService {

  server:string = 'https://ibigo.shadowis.nl/';

  headers :Headers = new Headers();
  options:any;

  
  constructor(private http:HttpClient) {
    this.headers.append('enctype','multipart/form-data');
    this.headers.append('Content-Type','application/json');
    this.headers.append('X-Requested-With','XMLHttpRequest');

    this.options = new RequestOptions({headers:this.headers});
   }

  forgotpassword(email):Observable<AdminForgotPassword>
  {
    const newUserLogin = new AdminForgotPassword(email);
    return this.http.post<AdminForgotPassword>(this.server+'server-api/api/forget_password',newUserLogin);
  }
}
