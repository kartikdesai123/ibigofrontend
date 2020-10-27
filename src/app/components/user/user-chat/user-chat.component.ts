import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { UserChatService } from 'src/app/service/user-chat.service';
import { PusherService } from 'src/app/service/pusher.service';
import { Global } from '../../globals';

//import { Echo } from 'laravel-echo';
//import Echo from 'laravel-echo';
import { UserLoginService } from 'src/app/service/user-login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppComponent } from '../../../app.component';
//import  { Echo } from "../../../../../node_modules/laravel-echo/dist/echo";
//var global = global || window;
// var global = global || window;
// var Buffer = Buffer || [];
// var process = process || {
//   env: { DEBUG: undefined },
//   version: []
// };

// //(window as any).global = window;
// var global = global || window;
// declare global {
//   // interface Window { io: any; }
//   interface Window { Echo: any; }
// }
// declare var require: any;
// //declare var Echo: any;
// //var Echo = require('laravel-echo');
// //window.io = window.io || require('socket.io-client');
// window.Echo = window.Echo || {};
// window.Echo = new Echo({
//   broadcaster: 'pusher',
//   key: '816c54c641fbdf1b348b',
//   cluster: 'ap2',
//   encrypted: true
// });


@Component({
  
  selector: 'app-user-chat',
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.css','../../../../front-assets/css/bootstrap.min.css',
  '../../../../front-assets/css/style.css',
  '../../../../front-assets/css/responsive.css',
  '../../../../front-assets/css/font-awesome.min.css',
  '../../../../front-assets/css/owl-carousel.css',
  '../../../../front-assets/css/pretty-checkbox.min.css','../font-user.css'],
})
export class UserChatComponent implements OnInit {
  @ViewChild('scrollMe',{static: false}) private myScrollContainer: ElementRef;

  constructor(private router:Router,private formBuilder : FormBuilder,private http:HttpClient,private route:ActivatedRoute,private userService: UserLoginService,private cd: ChangeDetectorRef,private pusherService: PusherService, private chatService :UserChatService) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
    };
   }
  message: string;
  sending: boolean;
  likes: number =  10;
  logged_in_user_id;
  messages = [];
  logged_user = {};
  chatForm: FormGroup;
  unique_id;
  slug;
  send_to_id;
  user_status;
  another_user : any= {} ;
  recent_chats = [];
  friend_chats = [];
  fieldnamefriend = 'user_name';
  searchFriend : FormGroup;
  searchRecent : FormGroup;
  searchFriendText;
  searchText;

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 

  scrollToBottom(): void {
      try {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) { }                 
  }

  ngOnInit() {
    //this.logged_user = this.userService.getIdOfLoggedInUser();

    this.unique_id = this.route.snapshot.params.id;
    this.slug = this.route.snapshot.params.slug;    
    let headers = new HttpHeaders({'Authorization':JSON.parse(localStorage.getItem('client_token'))});          
    this.http.get('https://ibigo.shadowis.nl/server-api/api/recent-chats',{headers:headers}).subscribe((data)=>{
      //console.log(data['recent_chats']); 
      this.recent_chats = data['recent_chats'];
    })
    this.http.get('https://ibigo.shadowis.nl/server-api/api/recent-friends',{headers:headers}).subscribe((data)=>{
      //console.log(data); 
      this.friend_chats = data['friend_list'];
    })
    
    if(this.slug){
      
      
    this.http.get('https://ibigo.shadowis.nl/server-api/api/group-or-user/'+this.unique_id,{headers:headers}).subscribe((data)=>{
      this.messages = data['messages'];
      this.another_user = data['another_user'];
      this.send_to_id = this.another_user['id'];
      this.user_status = this.another_user['user_status'];
      window.Echo.channel('user_status'+this.send_to_id)
      .listen('UserOnlineOffline',(data) => {
        //console.log('From laravel echo:',data['user'].id);
        if(data['user'].id==this.send_to_id){
          if(this.user_status==1){
            this.user_status = 0;
          }else{
            this.user_status = 1;
          } 
        }
        if (!this.destroyed) {
          this.cd.detectChanges();
        }
      });
    });
    }
    
    this.userService.getIdOfLoggedInUser().subscribe((all : any)=>{
      //this.logged_user=all.users_details;
      this.logged_in_user_id = all['user_details'].id;
      window.Echo.channel('all-channel'+this.logged_in_user_id)
      .listen('MessageSent', (data) => {
        //console.log('From laravel echo: ', data['message']);
        
        var today = this.formatDate(data['message'].message_date_time);
        if(today in this.messages){        
          this.messages[today].push(data['message']);  
        }else{
          this.messages[today] = [data['message']];  
        }
        if (!this.destroyed) {
          this.cd.detectChanges();
        }
        this.scrollToBottom();
      });
    });
    
    this.chatForm = this.formBuilder.group({
      message: new FormControl()
    });
    this.searchFriend = this.formBuilder.group({
      searchFriend: new FormControl()
    });
    this.searchRecent = this.formBuilder.group({
      searchText: new FormControl()
    });
    this.scrollToBottom();
  }

  private destroyed = false;

  ngOnDestroy() {
    this.destroyed = true;
  }

  friendText(e:any){    
    this.searchFriendText = e.target.value;    
  }

  recentText(e:any){    
    this.searchText = e.target.value;    
  }

  formatDate(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;

      return [year, month, day].join('-');
  }
  onClick(){
    var message = this.chatForm.get('message').value;
    if(message!=null || message!=''){
      var today = this.formatDate(new Date());
      if(today in this.messages){        
        this.messages[today].push({from_user_id: this.logged_in_user_id, to_user_id: this.send_to_id, message:message, message_date_time: new Date(), to_user_name:null,to_user_slug:null,from_user_name:null,from_user_slug: null,to_user_unique_id:null,from_user_unique_id:null});  
      }else{
        this.messages[today] = [{from_user_id: this.logged_in_user_id, to_user_id: this.send_to_id, message:message, message_date_time: new Date(), to_user_name:null,to_user_slug:null,from_user_name:null,from_user_slug: null,to_user_unique_id:null,from_user_unique_id:null}];  
      }
      
      this.chatForm.reset();
      var send_to = this.send_to_id;
      this.pusherService.sendMessage(message,send_to)
        .subscribe(resp => {        
          this.message = undefined;
          this.sending = false;
        }, err => {
          this.sending = false;
      });
    }
  }

  liked() {
    this.likes = this.likes + 1;
    this.pusherService.like(this.likes);
  }
  

}
