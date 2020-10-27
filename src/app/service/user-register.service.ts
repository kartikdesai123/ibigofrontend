import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRegisterService {

  private previewdata = new BehaviorSubject('no data');
  datapreview = this.previewdata.asObservable();
  
  constructor() { }

  setpreviewdata(data){
    return this.previewdata.next(data);
  }

  getpreviewddata(){
    return this.datapreview;
  }
}
