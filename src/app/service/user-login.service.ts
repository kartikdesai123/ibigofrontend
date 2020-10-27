import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLogin } from '../UserLogin';
import { AuthService } from 'angular-6-social-login';
import { environment } from '../../environments/environment';
import { LoggedInUser } from '../LoggedInUser';
@Injectable({
  providedIn: 'root'
})
export class UserLoginService {
  server:string = 'https://ibigo.shadowis.nl/';
  private endPoint = environment.endpoint;
  constructor(private socialAuthService: AuthService,private http:HttpClient) { }

  login(email,password):Observable<UserLogin>
  {
      const newUserLogin = new UserLogin(email,password);
      return this.http.post<UserLogin>(this.server+'server-api/api/user/login',newUserLogin);
  }
  getIdOfLoggedInUser(){
    let headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    return this.http.get(this.endPoint+'get-user',{headers:headers});
  }
  isUserLoggedIn(){
    const user = JSON.parse(localStorage.getItem('client_token'));
    return user !== null;
  }

  logout(){
    let headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    localStorage.removeItem('first_name');
    localStorage.removeItem('last_name');
    localStorage.removeItem('client_profile');
    localStorage.removeItem('client_token');
    localStorage.removeItem('user_type');
    try{
      this.socialAuthService.signOut();
      sessionStorage.clear();
    }catch(e){}
    
    
  }

  loginFacebook(){
    //return 
  }
}

