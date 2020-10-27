import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

declare const Pusher: any;

@Injectable({
  providedIn: 'root'
})

export class PusherService {

  pusher: any;private endPoint = environment.endpoint;
  channel: any;
  constructor(private http: HttpClient) { 
    this.pusher = new Pusher(environment.pusher.key);
    //this.pusher = new Pusher(environment.pusher.key);
    this.channel = this.pusher.subscribe('private-chat');
    
  }
  getPusher() {
    return this.pusher;
  }
  
  sendMessage(message: string,send_to): Observable<any> {
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    const param = {
      message,
      type: 'human',
      // ...this.user
    };
    return this.http.post(this.endPoint+'send-message/'+send_to, param,{headers:headers});
  }
  
  like( num_likes ) {
    this.http.post(this.endPoint+'like', {'likes': num_likes})
    .subscribe(data => {
    });
  }


  sendComment(comment:string,pid):Observable<any>{
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json'); 
    formData.append('comment', comment);
    formData.append('post_hidden', pid);
    return this.http.post(this.endPoint+'add-comment',formData,{headers:headers});
  }
}
