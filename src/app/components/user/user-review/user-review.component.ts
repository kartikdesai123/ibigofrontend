import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UserLoginService } from 'src/app/service/user-login.service';
import { ToastrService } from 'src/app/toastr.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user-review',
  templateUrl: './user-review.component.html',
  styleUrls: ['./user-review.component.css','../../../../front-assets/css/bootstrap.min.css',
  '../../../../front-assets/css/style.css',
  '../../../../front-assets/css/responsive.css',
  '../../../../front-assets/css/font-awesome.min.css',
  '../../../../front-assets/css/owl-carousel.css',
  '../../../../front-assets/css/pretty-checkbox.min.css','../font-user.css']
})
export class UserReviewComponent implements OnInit {

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

  reviewForm: FormGroup;
  commentForm: FormGroup;
  commentEditForm: FormGroup;
  reviews =[];
  user_type;
  constructor(private titleService:Title,private formBuilder: FormBuilder,private us : UserLoginService,private route: ActivatedRoute,private http:HttpClient,private router:Router,private toastrservice: ToastrService) { 

  }

  ngOnInit() {
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
      });
    }
    
    this.http.get('https://ibigo.shadowis.nl/server-api/api/people/'+this.unique_id,{headers:headers}).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((data)=>{      
      if(data['status']==true){
        this.reviews = data['reviews']
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
          this.imgURL = '/assets/front-assets/images/group-bg2.png';
        }else{
          this.imgURL = 'https://ibigo.shadowis.nl/server-api/public/user_cover/'+this.people_cover;
        }
      }
      
    });
    this.reviewForm = this.formBuilder.group({
      rating: new FormControl(),
      review: new FormControl()
    });
    this.commentForm = this.formBuilder.group({
      comment: new FormControl(),
    });
    this.commentEditForm = this.formBuilder.group({
      comment: new FormControl(),
    });
  }

  clickEvent(post_id){
    var comments = document.getElementById('post-comment'+post_id);
    comments.classList.toggle('active');
  }
}
