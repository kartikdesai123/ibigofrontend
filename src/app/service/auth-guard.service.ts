import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  constructor(private taskService:TaskService, private router: Router) { }
  canActivate(route: import('@angular/router').ActivatedRouteSnapshot, state: import('@angular/router').RouterStateSnapshot):boolean{ 
    if (route.routeConfig.path === 'admin/logout') {
      this.taskService.logout();
      this.router.navigate(['admin/login']);
    }
    if (this.taskService.isUserLoggedIn()) {
      return true;
    }
    return false;
  }

  

}
