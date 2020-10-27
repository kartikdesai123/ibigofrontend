import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  count:number = 0;
  constructor() { }
  saveNotificationCount(){
    this.count = this.count + 1;
  }
  retrieveNotificationCount(){
      return this.count;
  }
}
