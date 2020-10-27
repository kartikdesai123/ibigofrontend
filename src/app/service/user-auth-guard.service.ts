import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserLoginService } from './user-login.service';
@Injectable({
  providedIn: 'root'
})
export class UserAuthGuardService implements CanActivate{
  endPoint = environment.endpoint;
  constructor(private loginService:UserLoginService,private router: Router,private http:HttpClient) { }
  canActivate(route: import('@angular/router').ActivatedRouteSnapshot, state: import('@angular/router').RouterStateSnapshot):boolean{ 
    if (route.routeConfig.path === 'user/logout') {
      let headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
      this.http.get(this.endPoint+'logout',{headers:headers}).subscribe((data)=>{});
      this.loginService.logout();
      this.router.navigate(['user/login']);
    }
    if (this.loginService.isUserLoggedIn()) {
      return true;
    }
    return false;
  }
}
