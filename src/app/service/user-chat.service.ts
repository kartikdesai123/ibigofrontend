import { Injectable } from '@angular/core';
import { PusherService } from './pusher.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserChatService {
  private channel: any;
  likes: number; 
  private endPoint = environment.endpoint;
  constructor(private pusherService : PusherService, private http: HttpClient) { 
    
    
  }

  

  getChannel() {
    return this.channel;
  }

  getData(){
    this.channel = this.pusherService.getPusher().subscribe('private-chat');
    this.channel.bind('App\\Events\\MessageSent', function(data) {
        // this is called when the event notification is received...
        console.log('data:'+data);
    });
    //console.log(this.channel);
  }
  
}
