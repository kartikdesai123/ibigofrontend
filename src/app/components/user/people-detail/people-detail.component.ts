import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'src/app/toastr.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';
import { UserLoginService } from 'src/app/service/user-login.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-people-detail',
  templateUrl: './people-detail.component.html',
  styleUrls: ['./people-detail.component.css','../../../../front-assets/css/bootstrap.min.css',
  '../../../../front-assets/css/style.css',
  '../../../../front-assets/css/responsive.css',
  '../../../../front-assets/css/font-awesome.min.css',
  '../../../../front-assets/css/owl-carousel.css',
  '../../../../front-assets/css/pretty-checkbox.min.css','../font-user.css']
})
export class PeopleDetailComponent implements OnInit {
  logged_in_user;
  user_slug;
  unique_id;
  loading=true;
  people_cover;
  people_details = [];
  people_last_name
  people_first_name;
  people_profile;
  people_interest_details=[];
  people_age;
  friend_relation:any ={};
  people_about;
  action_user_id;
  send_request=false;
  reation_type;
  relation_status;
  imgURL;
  people_id;
  spot_photos_by_user= [];
  spot_videos_by_user= [];
  friends_count;
  users_details=[];
  logged_in_user_unique_id;
  review_count;
  liked_places= [];
  review_places = [];
  friends = [];
  user_type;
  constructor(private titleService:Title,private formBuilder: FormBuilder,private us : UserLoginService,private route: ActivatedRoute,private http:HttpClient,private router:Router,private toastrservice: ToastrService) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
    }; 
  }

  ngOnInit() {
    var bodyelement = document.getElementsByClassName('modal-open');    
    if(bodyelement.length > 0){
      bodyelement[0].classList.add('my-extra-css');
    }
    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
    });
    this.logged_in_user = this.us.isUserLoggedIn();
    this.unique_id = this.route.snapshot.params.id;
    this.user_slug = this.route.snapshot.params.slug;
    var user_t = localStorage.getItem('user_type');
    if(user_t=='"normal"'){
      this.user_type = 'normal';
    }else if(user_t=='"business"'){
      this.user_type = 'business';
    }
    let headers = new HttpHeaders();
    if(this.logged_in_user==true){
      headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
      this.http.get('https://ibigo.shadowis.nl/server-api/api/get-user',{headers:headers}).subscribe((data)=>{
        this.users_details = data['user_details'];
        this.logged_in_user_unique_id = this.users_details['unique_id'];
        if(this.unique_id==this.logged_in_user_unique_id){
          this.router.navigate(['/user/updateprofile']);
        }
      });
    }
    
    this.http.get('https://ibigo.shadowis.nl/server-api/api/people/'+this.unique_id,{headers:headers}).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        this.friend_relation = data['friend_relation'];
        if(this.friend_relation){
          this.action_user_id = parseInt(this.friend_relation.action_user_id);
          this.relation_status = parseInt(this.friend_relation.relation_status);  
        }else{
          this.action_user_id = this.people_id;
          this.relation_status = 4;
        }
        this.spot_photos_by_user = data['spot_photos_by_user'];
        this.spot_videos_by_user = data['spot_videos_by_user'];
        this.friends_count = data['friends_count'];
        this.friends = data['friends'];        
        this.review_count = data['review_count'];
        this.liked_places = data['liked_places'];
        this.review_places = data['review_places'];
        this.people_details = data['people_details'];
        //this.reation_type = data['relation_type'];
        this.people_id  = this.people_details['id'];
        this.people_first_name  = this.people_details['first_name'];
        this.people_last_name  = this.people_details['last_name'];
        this.people_profile  = this.people_details['user_profile'];
        if(this.people_profile==null){
          this.people_profile = '/assets/front-assets/images/pic1.png';
        }else{
          if(this.people_details['user_profile'].indexOf('https://graph.facebook.com') != -1){
            this.people_profile  = this.people_details['user_profile'];
          }else{
            this.people_profile = 'https://ibigo.shadowis.nl/server-api/public/user_profiles/'+this.people_details['user_profile'];
          }
        }
        if(this.people_details['age'] != '0'){
          this.people_age  = this.people_details['age']+' yr. Zwolle';
        }else{
          this.people_age  = '';
        }
        this.people_cover  = this.people_details['user_cover'];
        this.people_interest_details  = data['user_interests'];
        this.people_about  = this.people_details['user_about'];
        if(this.people_cover==null){
          this.imgURL = '';
        //  this.imgURL = '/assets/front-assets/images/group-bg2.png';
        }else{
          this.imgURL = 'https://ibigo.shadowis.nl/server-api/public/user_cover/'+this.people_cover;
        }
      }
      
    });
  }

  sendRequest(people_id){
    if(this.logged_in_user==true){
      this.send_request = true;
      let headers = new HttpHeaders();
      headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
      this.http.get('https://ibigo.shadowis.nl/server-api/api/send-request/'+people_id,{headers:headers}).pipe(
        finalize(() => {
          this.send_request = false;
        })
      ).subscribe((data)=>{
        if(data['message']==0){
          this.action_user_id = data['action_user_id'];
          this.relation_status = parseInt('0');
        }
      });
    }else{
      this.router.navigate(['/user/login']);
    }
  }

  rejectRequest(people_id){
    this.send_request = true;
    let headers = new HttpHeaders();
    headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
    this.http.get('https://ibigo.shadowis.nl/server-api/api/reject-request/'+people_id,{headers:headers}).pipe(
      finalize(() => {
        this.send_request = false;
      })
    ).subscribe((data)=>{
      if(data['message']==2){
        
        this.action_user_id = data['action_user_id'];
        this.relation_status = parseInt('2');
      }else if(data['message']=="No relation"){
        this.toastrservice.Error('You no longer have a friend request from '+this.people_first_name+' '+this.people_last_name);
      }
    });
  }

  confirmRequest(people_id){
    this.send_request = true;
    let headers = new HttpHeaders();
    headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
    this.http.get('https://ibigo.shadowis.nl/server-api/api/accept-request/'+people_id,{headers:headers}).pipe(
      finalize(() => {
        this.send_request = false;
      })
    ).subscribe((data)=>{      
      if(data['message']==1){
        this.action_user_id = data['action_user_id'];
        this.relation_status = parseInt('1');
      }else if(data['message']=="No relation"){
        this.toastrservice.Error('You no longer have a friend request from '+this.people_first_name+' '+this.people_last_name);
      }
    });
  }

  cancelRequest(people_id,type){
    if(type=='unfriend'){
      if(confirm("Are you sure you want to remove "+this.people_first_name+" "+this.people_last_name+" as your friend?")) {
        this.send_request = true;
        let headers = new HttpHeaders();
        headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
        this.http.get('https://ibigo.shadowis.nl/server-api/api/unfriend/'+people_id,{headers:headers}).pipe(
          finalize(() => {
            this.send_request = false;
          })
        ).subscribe((data)=>{
          if(data['message']==4){
            this.action_user_id = data['action_user_id'];
            this.relation_status = parseInt('4');
          }
        });
      }
    }else{
      this.send_request = true;
      let headers = new HttpHeaders();
      headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
      this.http.get('https://ibigo.shadowis.nl/server-api/api/unfriend/'+people_id,{headers:headers}).pipe(
        finalize(() => {
          this.send_request = false;
        })
      ).subscribe((data)=>{
        if(data['message']==4){
          this.action_user_id = data['action_user_id'];
          this.relation_status = parseInt('4');
        }
      });
    }
    
  }
}
