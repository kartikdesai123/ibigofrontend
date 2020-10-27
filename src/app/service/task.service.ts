import { Injectable } from '@angular/core';
import { Headers , RequestOptions } from '@angular/http';
import { UserLogin } from '../UserLogin';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  server:string = 'https://ibigo.shadowis.nl/';

  headers :Headers = new Headers();
  options:any;

  
  constructor(private http:HttpClient) {
    this.headers.append('enctype','multipart/form-data');
    this.headers.append('Content-Type','application/json');
    this.headers.append('X-Requested-With','XMLHttpRequest');

    this.options = new RequestOptions({headers:this.headers});
   }

   login(email,password):Observable<UserLogin>
   {
      const newUserLogin = new UserLogin(email,password);
      return this.http.post<UserLogin>(this.server+'server-api/api/login',newUserLogin);
   }

   isUserLoggedIn(){
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

  logout(){
    localStorage.removeItem('user');
    localStorage.removeItem('user_token');
  }
}
