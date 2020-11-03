import { Component, OnInit, Inject, HostListener, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'src/app/toastr.service';
import { finalize } from 'rxjs/operators';
import { ScrollService } from '../../../service/scroll.service';
import { SpotSearchService } from 'src/app/service/spot-search.service';
import { LocationService } from 'src/app/service/location.service';

import { OwlOptions } from 'ngx-owl-carousel-o';
import { NotificationService } from 'src/app/service/notification.service';
import { element } from 'protractor';
import { parse } from 'path';
import { UserLoginService } from 'src/app/service/user-login.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css','../../../../front-assets/css/bootstrap.min.css',
  '../../../../front-assets/css/style.css',
  '../../../../front-assets/css/responsive.css',
  '../../../../front-assets/css/font-awesome.min.css',
  '../../../../front-assets/css/pretty-checkbox.min.css','../font-user.css']
})

export class HomeComponent implements OnInit {
  
  
  friendsOptions:OwlOptions = {
    loop: true,
    autoplay:true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<i class="fa fa-angle-left left-arrow"></i>', '<i class="fa fa-angle-right right-arrow"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 6
      },
      940: {
        items: 6
      }
    },
    nav: true
  }
  customOptions: OwlOptions = {
    loop: true,
    autoplay:true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<i class="fa fa-angle-left left-arrow"></i>', '<i class="fa fa-angle-right right-arrow"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }
  is_edit : boolean =false;
  users_details = [];
  first_name;
  last_name;
  friends = [];
  posts = [];
  first_5_posts = [];
  another_friends = [];
  temp_friends = [];
  edit_post_id;
  tabname: string = 'normal';
  isLoading: boolean;
  call_status : boolean;
  tag_friends = [];
  photos_videos = [];
  share_friends = [];
  user_profile;
  spots = [];
  tag_frd_id:any = [];
  share_frd_id:any = [];
  short_description;
  selectedSpot = {};
  edit_tagged_users = [];
  edit_share_users = [];
  spot_profile;
  like_by = [];
  logged_in_user;
  post_id;
  photo_name;
  interests:any=[];
  photo_index;
  btnloading : boolean = false;
  business_name;
  spot_id;
  modal_spot_id;
  spot_rating;
  myPhotos:string [] = [];
  files = [];
  audio_files = [];
  afiles = [];
  dbfiles = [];
  temp_tagged_users_from_db = [];
  temp_share_users_from_db = [];
  selectedInterests;
  myVideos:string [] = [];
  spotForm: FormGroup;
  demoFormPost: FormGroup;
  searchForm:FormGroup;
  commentForm : FormGroup;
  demoForm: FormGroup;
  commentEditForm : FormGroup;
  lat;long
  friend_suggestions = [];
  extra_posts = [];
  spot_suggestions :any = [];
  post_length;
  post_type;
  load_more_post: boolean = false;
  loaded_posts_ids = [];
  loaded_posts = [];
  all_notifications = [];
  user_name;
  tagged_users_from_db= [];
  share_users_from_db= [];
  groups = [];
  temp_groups = [];
  notification_cnt=0;
  is_user_logged_in;
  share_group_id :any= [];
  all_friend_requests = [];
  share_groups_from_db=[];
  temp_share_groups_from_db= [];
  edit_share_groups = [];
  photos_extensions = ['png','jpeg','jpg','tiff','pjp','pjpeg','jfif','tif','gif','svg','bmp','svgz','webp','ico','xbm','dib'];
  video_extensions = ['mp4','ogm','wmv','mpg','webm','ogv','mov','asx','mpeg','m4v','avi'];
  constructor(private loginService :UserLoginService,private elRef: ElementRef,private notificationService :NotificationService,private cd :ChangeDetectorRef,private locationService:LocationService,private searchService:SpotSearchService,private scrollService: ScrollService,@Inject(DOCUMENT) private document: Document,private formBuilder: FormBuilder,private router:Router,private http:HttpClient,private toastrservice: ToastrService) { }
  
  ngOnInit() {
    //this.elRef.nativeElement = document.getElementById('demomyid');
    //console.log(this.elRef.nativeElement.parentElement);
    this.is_user_logged_in = this.loginService.isUserLoggedIn()
    if(this.is_user_logged_in==true){
      window.Echo.channel('all-post')
      .listen('CommentSent', (data) => {     
        if(data['type']=='add'){
          this.extra_posts.forEach(post => {
            if(post.id==data['post']){
              post.comments.push(data['comment'])          
            }
          });
          this.posts.forEach(post => {
            if(post.id==data['post']){
              post.comments.push(data['comment'])
            }
          });
        }else if(data['type']=='update'){
          this.posts.forEach(post => {
            if(post.id==parseInt(data['post'])){            
              post.comments.forEach(comment => {
                if(comment.id==data['comment'].id){
                  comment.comment = data['comment'].comment
                }
              });
            }
          });
          this.extra_posts.forEach(post => {          
            if(post.id==parseInt(data['post'])){
              post.comments.forEach(comment => {
                if(comment.id==data['comment'].id){
                  comment.comment = data['comment'].comment
                }
              });
            }
          });
          this.onCancel(data['comment'].id);
        }else if(data['type']=='delete'){
          this.posts.forEach(post => {
            if(post.id==parseInt(data['post'])){
              post.comments = post.comments.filter(function( obj ) {
                return obj.id !== parseInt(data['comment'].id);
              });
            }
          });
          this.extra_posts.forEach(post => {
            if(post.id==parseInt(data['post'])){
              post.comments = post.comments.filter(function( obj ) {
                return obj.id !== parseInt(data['comment'].id);
              });
            }
          });
        }
        if (!this.destroyed) {
          this.cd.detectChanges();
        }
      });
      
      window.Echo.channel('all-like')
      .listen('LikeEvent', (data) => {       
        this.posts.forEach(post => {
          if(post.id==data['post']){
            var index = data['like'].liked_users_names.indexOf(this.user_name)
            if ( ~index ) data['like'].liked_users_names.splice(index, 1);          
            post.liked_users_names = data['like'].liked_users_names;          
          }
        });
        this.extra_posts.forEach(post => {
          if(post.id==data['post']){
            var index = data['like'].liked_users_names.indexOf(this.user_name)
            if ( ~index ) data['like'].liked_users_names.splice(index, 1);          
            post.liked_users_names = data['like'].liked_users_names;
          }
        });
        if (!this.destroyed) {
          this.cd.detectChanges();
        }
      });
    }
    this.locationService.getPosition().then(pos=>
    {
        this.long = pos.lng
        this.lat = pos.lat;
        this.searchService.getAllSpotSuggestions(this.lat,this.long).subscribe((data) => {
          this.spot_suggestions = data['all_spots'];                    
        })
    });
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-all-interests').subscribe((data)=>{
        this.interests = data['interest_details'];
      });  
    if(this.is_user_logged_in==true){
      const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});

    
      var user_t = localStorage.getItem('user_type');
      if(user_t=='"normal"'){
        this.router.navigate(['/user/homepage']);
      }else if(user_t=='"business"'){
        this.router.navigate(['/home/business/profile']);
      }
      this.http.get('https://ibigo.shadowis.nl/server-api/api/getgroups',{headers:headers}).subscribe((data)=>{
        this.groups = data['connected_group_list'];
        this.groups2 = data['connected_group_list'];
        this.temp_groups = data['connected_group_list'];
      });
      this.http.get('https://ibigo.shadowis.nl/server-api/api/getfriends',{headers:headers}).subscribe((data)=>{
        this.friends = data['friend_list'];
        this.another_friends = data['friend_list'];
        this.another_friends2 = data['friend_list'];
        this.temp_friends = data['friend_list'];
        var element = document.getElementById('friend-tag-text');
        var element2 = document.getElementById('tagged');
        //var element_friend = document.getElementById('friend-share-text');
        var element_shared = document.getElementById('shared');
        var spinner_btn = document.getElementById('spinner-btn') as HTMLButtonElement;
        var spinner_btn_check_in = document.getElementById('spinner-btn-check-in') as HTMLButtonElement;
        //spinner_btn.disabled =true;
        spinner_btn_check_in.disabled = true;
        if(this.tag_friends.length > 0){
          element.classList.remove('hidden');
          element2.classList.remove('hidden');
        }else{
          element.classList.add('hidden');
          element2.classList.add('hidden');
        }
        if(this.share_friends.length > 0){
          //element_friend.classList.remove('hidden');
          element_shared.classList.remove('hidden');
        }else{
          //element_friend.classList.add('hidden');
          element_shared.classList.add('hidden');
        }
      });
        
      this.http.get('https://ibigo.shadowis.nl/server-api/api/get-posts',{headers:headers}).subscribe((data)=>{
        this.extra_posts = data['posts'];
        this.loaded_posts_ids = data['loaded_posts_ids'];      
        //this.post_length = data['posts'].length;
        this.first_5_posts = this.extra_posts.splice(0,5);
        this.post_length = this.extra_posts.length;
        this.posts = this.extra_posts.splice(0,3);     
      });
    //this.getData(true);
      this.refreshData();  
      
      
      this.http.get('https://ibigo.shadowis.nl/server-api/api/get-user',{headers:headers}).subscribe((data)=>{
        this.users_details = data['user_details'];
        this.logged_in_user  = this.users_details['id'];      
        window.Echo.channel('notification-channel'+this.logged_in_user)
        .listen('UserNotification', (data) => {       
          if(this.router.url=='/user/homepage'){
            this.notification_cnt++;
            this.all_notifications.unshift(data['notification']);
          }
        });
        this.first_name  = this.users_details['first_name'];
        this.last_name  = this.users_details['last_name'];
        this.user_name = this.first_name+' '+this.last_name;
        this.user_profile  = this.users_details['user_profile'];
        if(this.user_profile==null){
          this.user_profile = '/assets/front-assets/images/pic1.png';
        }else{
          if(this.users_details['user_profile'].indexOf('https://graph.facebook.com') != -1){
            this.user_profile  = this.users_details['user_profile'];
          }else{
            this.user_profile = 'https://ibigo.shadowis.nl/server-api/public/user_profiles/'+this.users_details['user_profile'];
          }
        } 
      });
      
      this.http.get('https://ibigo.shadowis.nl/server-api/api/friend-suggestions',{headers:headers}).subscribe((data)=>{
        this.friend_suggestions = data['all_friend_suggestions'];
      });
      
      this.http.get('https://ibigo.shadowis.nl/server-api/api/notifications',{headers:headers}).subscribe((data)=>{
        this.all_notifications = data['all_notifications'];
        length = this.all_notifications.filter(function(item){
          return parseInt(item.notification_read)==0;
        }).length;
        this.notification_cnt = length;
      });
      this.http.get('https://ibigo.shadowis.nl/server-api/api/friend_requests',{headers:headers}).subscribe((data)=>{
        this.all_friend_requests = data['all_friend_requests'];        
      });
      this.spotForm = this.formBuilder.group({
        file: new FormControl(),
        video: new FormControl(),
        review: new FormControl('', [Validators.required]),
      });
      this.demoForm = this.formBuilder.group({
        desc: new FormControl(),
      });
      this.demoFormPost = this.formBuilder.group({
        descPost: new FormControl(),
      });

      this.commentForm = this.formBuilder.group({
        comment: new FormControl(),
      });

      this.commentEditForm = this.formBuilder.group({
        comment: new FormControl(),
      });
    }
    this.searchForm = this.formBuilder.group({
      search_name: new FormControl(),
    })
    this.onUserType('Select');
  }

  private destroyed = false;

  ngOnDestroy() {
    this.destroyed = true;
  }
  
  clearNotifications(){
    this.notification_cnt = 0;
  }

  getData(setPageFlag){
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    var formData = new FormData();
    formData.append('post_ids',this.loaded_posts_ids.toString())
    this.http.post('https://ibigo.shadowis.nl/server-api/api/load-posts',formData,{headers:headers}).subscribe((data)=>{      
      if(data['posts'].length > 0){
        this.load_more_post = true;
        this.loaded_posts_ids = this.loaded_posts_ids.concat(data['loaded_posts_ids']);
        this.loaded_posts = data['posts']
      } 
    });
  }
  share_friends2 = []
  edit_share_users2 = [];
  share_users_from_db2 = [];
  another_friends2 = [];
  share_frd_id2 :any= [];
  temp_share_users_from_db2 = [];
  share_post_id;

  onShareOpen(post_id){
    this.share_friends2 = []
    this.edit_share_users2 = [];
    this.share_users_from_db2 = [];
    this.another_friends2 = this.temp_friends;
    this.share_frd_id2 = [];
    this.temp_share_users_from_db2 = [];
    this.edit_share_groups2 = []
    this.share_groups_from_db2 = [];
    this.temp_share_groups_from_db2 = [];
    this.share_groups2 = [];
    this.groups2 = this.temp_groups;
    this.share_group_id2 = [];
    this.share_post_id = null;
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-share-data/'+post_id,{headers:headers}).subscribe((data)=>{
      // console.log(data['posts'][0]);
      
      if(data['posts'][0].share_with_friends){
        this.edit_share_users2 = data['posts'][0].share_with_friends.split(',');
        this.share_users_from_db2 = data['posts'][0].share_users_names;
        this.edit_share_users2.forEach(el => {
          var index = this.another_friends2.findIndex(x => x.id ===parseInt(el));
          if(index>-1){
            this.share_friends2.push(this.another_friends2[index]);
            this.share_frd_id2.push(parseInt(el));
            this.another_friends2 = this.another_friends2.filter(function(obj) {
              return obj.id !== parseInt(el);
            });
          }else{
            var another_index = this.share_users_from_db2.findIndex(x => x.id === parseInt(el));
            this.share_friends2.push(this.share_users_from_db2[another_index]);
            this.temp_share_users_from_db2.push(this.share_users_from_db2[another_index]);
          }
        });
      }

      if(data['posts'][0].share_with_groups){
        this.edit_share_groups2 = data['posts'][0].share_with_groups.split(',');
        this.share_groups_from_db2 = data['posts'][0].share_group_names;
        this.edit_share_groups2.forEach(el => {
          var index = this.groups2.findIndex(x => x.id ===parseInt(el));
          if(index>-1){
            this.share_groups2.push(this.groups2[index]);
            this.share_group_id2.push(parseInt(el));
            
            this.groups2 = this.groups2.filter(function(obj) {
              return obj.id !== parseInt(el);
            });
          }else{
            var another_index = this.share_groups_from_db2.findIndex(x => x.id === parseInt(el));
            this.share_groups2.push(this.share_groups_from_db2[another_index]);
            this.temp_share_groups_from_db2.push(this.share_groups_from_db2[another_index]);
          }
        });
      }
      this.share_post_id = data['posts'][0].id;
      var button_element = document.getElementById('mysharemodalbutton');
      button_element.click();
    });
    
  }

  

  edit_share_groups2 = []
  share_groups_from_db2 = [];
  temp_share_groups_from_db2 = [];
  share_groups2 = [];
  groups2 = [];
  share_group_id2:any = [];

  onShareSubmit(){
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    var formData = new FormData();
    formData.append('post_id',this.share_post_id);
    formData.append('share_friends', this.share_frd_id2);
    formData.append('share_groups', this.share_group_id2);
    this.http.post('https://ibigo.shadowis.nl/server-api/api/update-share-data',formData,{headers:headers}).subscribe((data)=>{
      if(data['status']==true){
        //this.router.navigate(['/user/homepage']);
        var new_post = data['post'];
        var index = this.first_5_posts.findIndex(x => x.id ===parseInt(this.edit_post_id));
        var extra_post_index = this.extra_posts.findIndex(x => x.id ===parseInt(this.edit_post_id));
        var post_index = this.posts.findIndex(x => x.id ===parseInt(this.edit_post_id));
        if(index>-1){
          this.first_5_posts[index] = new_post[0];
        }else if(extra_post_index>-1){
          this.extra_posts[extra_post_index] = new_post[0];
        }else{
          this.posts[post_index] = new_post[0];
        }
        var share_close_btn = document.getElementById('share-close-btn');
        share_close_btn.click();
        
        
        //var bodyelement = document.getElementsByClassName('modal-open');
        //bodyelement[0].classList.add('my-extra-css');
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/homepage']));
      }
    });
  }

  loadMorePost(){
    this.loaded_posts.forEach(loaded_post => {
      this.first_5_posts.unshift(loaded_post)
      this.post_length++;  
    });
    this.loaded_posts = [];
    
    this.load_more_post = false;
  }
  dataRefresher: any;
  refreshData(){
    this.dataRefresher =
      setInterval(() => {
        this.getData(false);
        //Passing the false flag would prevent page reset to 1 and hinder user interaction
      }, 600000);  
  }

  onScroll() {
    setTimeout(() => {
      var arr = this.extra_posts.splice(0,3);
      this.posts = this.posts.concat(arr);
    }, 1000)
  }
  sendRequest(people_id){    
      var myelement  = document.getElementById('friend'+people_id)      
      myelement.classList.toggle('fa-spinner');
      let headers = new HttpHeaders();
      headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
      this.http.get('https://ibigo.shadowis.nl/server-api/api/send-request/'+people_id,{headers:headers}).pipe(
        finalize(() => {
          myelement.classList.toggle('fa-spinner');
        })).subscribe((data)=>{
        if(data['message']==0){
          //this.friend_suggestions = this.friend_suggestions.filter
          
          this.friend_suggestions = this.friend_suggestions.filter(function( obj ) {
            return obj.id !== people_id;
          });
        }
      });
  }

  confirmRequest(people_id){
    let headers = new HttpHeaders();
    headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
    this.http.get('https://ibigo.shadowis.nl/server-api/api/accept-request/'+people_id,{headers:headers}).subscribe((data)=>{      
      if(data['message']==1){
        this.all_friend_requests = this.all_friend_requests.filter(function( obj ) {
          return obj.request_send_by_user_id !== people_id;
        });
      }
    });
  }

  cancelRequest(people_id){
      let headers = new HttpHeaders();
      headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
      this.http.get('https://ibigo.shadowis.nl/server-api/api/unfriend/'+people_id,{headers:headers}).subscribe((data)=>{
        if(data['message']==4){
          this.all_friend_requests = this.all_friend_requests.filter(function( obj ) {
            return obj.request_send_by_user_id !== people_id;
          });
        }
      });    
  }
  myclick(pi){
    this.selected_value = this.suggestions[pi].user_name;
    this.searchForm.patchValue({'search_name':this.selected_value});
    this.onSearchText();
  }

  selectInterest(id){
    this.selectedInterests = id;
    this.onSearchText();
    // if(this.selectedInterests.includes(id)==false){
    //   this.selectedInterests.push(id);
    // }else{  
    //   const index = this.selectedInterests.indexOf(id);
    //   if (index > -1) {
    //     this.selectedInterests.splice(index, 1);
    //   }
    // }
  }
  status: boolean = false;
  clickEvent(post_id){
    var comments = document.getElementById('post-comment'+post_id);
    comments.classList.toggle('active');
  }
  values = '';
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    var comment_detail_class = document.querySelectorAll('.comment-detail');
    var comment_menu_icon = document.querySelectorAll('.comment-menu-icon');
    var cancel_btn = document.querySelectorAll('.cancel-btn');
    comment_detail_class.forEach(fakeImage => {
      fakeImage.classList.remove('active');
      fakeImage.classList.remove('comment-active');
    });

    comment_menu_icon.forEach(cm => {
      cm.classList.remove('hidden');
    });

    cancel_btn.forEach(cb => {
      cb.classList.add('hidden');
    });
  }
  @HostListener('click', ['$event.target'])
  onClick(btn) {
    if(this.call_status==true){
      var comment_detail_class = document.querySelectorAll('.comment-detail');
      var comment_menu_icon = document.querySelectorAll('.comment-menu-icon');
      var cancel_btn = document.querySelectorAll('.cancel-btn');
      comment_detail_class.forEach(cd => {
        cd.classList.remove('active');
      });

    }else{
      this.call_status = true;
    }  
  }
  query;

  onSearchText(){
    
    // if(this.searchForm.get('search_name').value){ 
    // } 
    if(this.router.url !== '/spot-search'){
      this.searchService.saveSearchObject({search_name:this.searchForm.get('search_name').value,selected_interest:this.selectedInterests,selected_user_type:this.selected_user_type});
      this.router.navigate(['/spot-search']);
    }
  }
  
  onText(event: any) { // without type info
    //const headers = new HttpHeaders({'Accept':'application/json'});
    var spinner_btn = document.getElementById('spinner-btn') as HTMLButtonElement;
    this.query = event.target.value;
    if(this.tabname=='normal' && this.query!=''){
      spinner_btn.disabled = false;
    }else{
      spinner_btn.disabled = true;
    }
    this.spotForm.patchValue({'review':this.query})
  }

  cancelPost(){
    this.mydata = [];
    this.dbfiles = [];
    this.afiles = [];
    this.audio_files = [];
    this.friends = this.temp_friends;
    this.groups = this.temp_groups;
    this.another_friends = this.temp_friends;
    this.spot_id = '';
    this.tag_frd_id =[];
    this.share_friends = [];
    this.share_groups = [];
    this.tag_friends = [];
    this.share_frd_id = [];
    this.share_group_id = [];
    this.is_edit = false;
    this.files = [];
    this.temp_tagged_users_from_db = [];
    this.temp_share_groups_from_db = [];
    this.temp_share_users_from_db = [];
    this.tagged_users_from_db = [];
    
    this.share_groups_from_db = [];
    this.share_users_from_db = [];
    this.afiles=[];
    this.short_description = '';
    this.business_name = '';
    this.spot_profile = '';
    this.like_by = [];
    this.spot_rating = '';
    var element_name = document.getElementById('tab-menu2');
    var element2 = document.getElementById('boeken-check-wrap');
    element2.classList.add('hidden');
    element_name.innerText = 'Check In';
    var spinner_btn = document.getElementById('spinner-btn') as HTMLButtonElement;
    var spinner_btn_check_in = document.getElementById('spinner-btn-check-in') as HTMLButtonElement;
    var spinner_btn_modal = document.getElementById('spinner-btn-modal') as HTMLButtonElement;
    //spinner_btn.disabled = true;
    spinner_btn_check_in.disabled = true;
    spinner_btn.innerText = 'Delen';
    spinner_btn_modal.innerText = 'Delen'; 
    this.demoForm.reset();
    this.spotForm.reset();
    this.demoFormPost.reset();
  }
  closeImageVideo(post_id){
    var index = this.posts.findIndex(x => x.id ===post_id);
    var element_post = document.getElementById('post-gallery'+this.post_id);
    var element_item = document.getElementsByClassName('item');
    element_post.classList.remove('active');
    var index_post = this.posts.findIndex(x => x.id ===post_id);
    var photos_videos = this.posts[index_post].photos_videos;
    for(var i=0;i<photos_videos.length-1;i++){
      element_item[i].classList.remove('active');
    }
  }
  
  onLike(post_id){
    this.posts.forEach(post => {
      if(post.id==post_id){
        if(post.liked_by_logged_in_user==1){
          post.liked_by_logged_in_user = 0;
        }else{
          post.liked_by_logged_in_user = 1;
        }
      }
    });
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    this.http.get('https://ibigo.shadowis.nl/server-api/api/like-post/'+post_id,{headers:headers}).subscribe((data)=>{
      if(data['status']==true){
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/homepage']));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
  }

  
  openImageVideo(post_id,spot_id,image_video_name){
    this.post_id = post_id;
    var index = this.posts.findIndex(x => x.id ===post_id);
    this.modal_spot_id = spot_id;
    this.photos_videos = this.posts[index].photos_videos;
    this.photo_index = this.photos_videos.indexOf(image_video_name);
    var element = document.getElementsByClassName('post-gallery');
    element[0].classList.add('active');
  }

  onKey(event: any) { // without type info
    //const headers = new HttpHeaders({'Accept':'application/json'});
    this.values = event.target.value;
    var element = document.getElementById('search-dropdown-list');
    if(this.values == ''){
      element.classList.add("hidden");
    }else{
      const formData = new FormData();
      formData.append('spot_name', this.values);
      this.http.post('https://ibigo.shadowis.nl/server-api/api/get-spots',formData).subscribe((data)=>{
        if(data['spot_detail'].length > 0 ){
          this.spots = data['spot_detail'];
          element.classList.remove("hidden");
        }else{
          element.classList.add("hidden");
        }
      });
    }
    
  }
  
  selectSpot(id){
    if(this.is_edit==false){
      this.tag_frd_id = [];
      this.tag_friends = [];
      this.friends = this.temp_friends;
    }    

    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-spot/'+id).subscribe((data)=>{
        var element = document.getElementById('search-dropdown-list');
        var element2 = document.getElementById('boeken-check-wrap');
        var spinner_btn_check_in = document.getElementById('spinner-btn-check-in') as HTMLButtonElement;
        
        if(data['spot_detail'].length > 0){
          this.short_description = data['spot_detail'][0].short_description;
          this.business_name = data['spot_detail'][0].business_name;
          this.spot_profile = data['spot_detail'][0].user_profile;
          this.like_by = data['like_by'];
          this.spot_rating = data['spot_rating'];
          this.spot_id = data['spot_detail'][0].id;
          if(this.spot_profile==null){
            this.spot_profile = '/assets/front-assets/images/pic1.png';
          }else{
            this.spot_profile = 'https://ibigo.shadowis.nl/server-api/public/user_profiles/'+data['spot_detail'][0].user_profile;
          }
          this.spot_error = false;
          element.classList.add('hidden');
          spinner_btn_check_in.disabled =false;
          element2.classList.remove('hidden');
        }
    });
  }
  spot_error = false;
  openMyModal(){
    var spinner_btn_check_in = document.getElementById('spinner-btn-check-in') as HTMLButtonElement;
    var spinner_btn = document.getElementById('spinner-btn') as HTMLButtonElement;
    if(this.tabname=='normal'){
      spinner_btn.click();
    }else{
      if(this.spot_id){        
        spinner_btn_check_in.click();
      }else{
        this.spot_error = true;
      }
    }
    
  }

  addTaglist(userid){
    var index = this.friends.findIndex(x => x.id ===userid);
    this.tag_friends.push(this.friends[index]);
    this.tag_frd_id.push(userid);
    this.friends = this.friends.filter(function( obj ) {
      return obj.id !== userid;
    });
    
    var element = document.getElementById('friend-tag-text');
    var element2 = document.getElementById('tagged');
    if(this.tag_friends.length > 0){
      element.classList.remove('hidden');
      element2.classList.remove('hidden');
    }else{
      element.classList.add('hidden');
      element2.classList.add('hidden');
    }
  }
  share_groups = [];
  addSharelist(userid:string){
    var index = this.another_friends.findIndex(x => x.id ===userid);
    this.share_friends.push(this.another_friends[index]);
    this.share_frd_id.push(userid);
    this.another_friends = this.another_friends.filter(function( obj ) {
      return obj.id !== userid;
    });
    //var element = document.getElementById('friend-share-text');
    var element2 = document.getElementById('shared');
    if(this.share_friends.length > 0){
      //element.classList.remove('hidden');
      element2.classList.remove('hidden');
    }else{
      //element.classList.add('hidden');
      element2.classList.add('hidden');
    }
  }

  addSharelist2(userid:string){
    var index = this.another_friends2.findIndex(x => x.id ===userid);
    this.share_friends2.push(this.another_friends2[index]);
    this.share_frd_id2.push(userid);
    this.another_friends2 = this.another_friends2.filter(function( obj ) {
      return obj.id !== userid;
    });
  }
  addShareGrouplist(group_id){    
    var index = this.groups.findIndex(x => x.id ===group_id);
    this.share_groups.push(this.groups[index]);
    this.share_group_id.push(group_id);
    this.groups = this.groups.filter(function( obj ) {
      return obj.id !== group_id;
    });    
  }

  addShareGrouplist2(group_id){    
    var index = this.groups2.findIndex(x => x.id ===group_id);
    this.share_groups2.push(this.groups2[index]);
    this.share_group_id2.push(group_id);
    this.groups2 = this.groups2.filter(function( obj ) {
      return obj.id !== group_id;
    });    
  }

  removeFromShareGroupList(group_id){    
    var index = this.share_groups.findIndex(x => x.id ===group_id);
    var temp_index = this.temp_share_groups_from_db.findIndex(x => x.id ===group_id);
    if(temp_index < 0){
      this.groups.push(this.share_groups[index]);    
    }
    var tag_index = this.share_group_id.indexOf(group_id);
    if (tag_index > -1) {
      this.share_group_id.splice(tag_index, 1);
    }
    this.share_groups = this.share_groups.filter(function( obj ) {
      return obj.id !== group_id;
    });
    
  }

  removeFromShareGroupList2(group_id){    
    var index = this.share_groups2.findIndex(x => x.id ===group_id);
    var temp_index = this.temp_share_groups_from_db2.findIndex(x => x.id ===group_id);
    if(temp_index < 0){
      this.groups2.push(this.share_groups2[index]);    
    }
    var tag_index = this.share_group_id2.indexOf(group_id);
    if (tag_index > -1) {
      this.share_group_id2.splice(tag_index, 1);
    }
    this.share_groups2 = this.share_groups2.filter(function( obj ) {
      return obj.id !== group_id;
    });
    
  }

  removeFromTagList(user_id){
    var index = this.tag_friends.findIndex(x => x.id ===user_id);
    var temp_index = this.temp_tagged_users_from_db.findIndex(x => x.id ===user_id);
    if(temp_index < 0){
      this.friends.push(this.tag_friends[index]);    
    }

    var tag_index = this.tag_frd_id.indexOf(user_id);
    if (tag_index > -1) {
      this.tag_frd_id.splice(tag_index, 1);
    }
    
    this.tag_friends = this.tag_friends.filter(function( obj ) {
      return obj.id !== user_id;
    });
    var element = document.getElementById('friend-tag-text');
    var element2 = document.getElementById('tagged');
    if(this.tag_friends.length > 0){
      element.classList.remove('hidden');
      element2.classList.remove('hidden');
    }else{
      element.classList.add('hidden');
      element2.classList.add('hidden');
    }
  }

  removeFromShareList(user_id){
    var index = this.share_friends.findIndex(x => x.id ===user_id);
    var temp_index = this.temp_share_users_from_db.findIndex(x => x.id ===user_id);
    if(temp_index < 0){
      this.another_friends.push(this.share_friends[index]);    
    }
    var tag_index = this.share_frd_id.indexOf(user_id);
    if (tag_index > -1) {
      this.share_frd_id.splice(tag_index, 1);
    }
    this.share_friends = this.share_friends.filter(function( obj ) {
      return obj.id !== user_id;
    });    
  }

  removeFromShareList2(user_id){
    var index = this.share_friends2.findIndex(x => x.id ===user_id);
    var temp_index = this.temp_share_users_from_db2.findIndex(x => x.id ===user_id);
    if(temp_index < 0){
      this.another_friends2.push(this.share_friends2[index]);    
    }
    var tag_index = this.share_frd_id2.indexOf(user_id);
    if (tag_index > -1) {
      this.share_frd_id2.splice(tag_index, 1);
    }
    this.share_friends2 = this.share_friends2.filter(function( obj ) {
      return obj.id !== user_id;
    });    
  }

  get f(){
    return this.spotForm.controls;
  }
  
  editPost(post_id){
    this.cancelPost();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    this.http.get('https://ibigo.shadowis.nl/server-api/api/edit-checkin/'+post_id,{headers:headers}).pipe(
      finalize(() => {
        var desc = document.getElementById('desc');
        //desc.focus()
        this.scrollService.scrollToElementById('divToScroll');
        
        var menu_checkin = document.getElementById('menu_checkin');
        var menu_post = document.getElementById('menu_post');
        var menu1 = document.getElementById('menu1');
        var menu2 = document.getElementById('menu2');
        var tab_menu2 = document.getElementById('tab-menu2');
        var tab_menu1 = document.getElementById('tab-menu1');
        if(this.post_type=='normal'){
          menu_post.classList.add('active');
          menu_checkin.classList.remove('active');
          tab_menu1.innerText = 'Edit Post';
          this.tabname = 'normal';
          menu1.classList.add('in','active');
          menu2.classList.remove('active','in');
        }else{
          menu_post.classList.remove('active');
          menu_checkin.classList.add('active');
          tab_menu2.innerText = 'Edit Check In';
          this.tabname = 'checkin';
          menu1.classList.remove('in','active');
          menu2.classList.add('active','in');
        }


        var spinner_btn = document.getElementById('spinner-btn') as HTMLButtonElement;
        var spinner_btn_modal = document.getElementById('spinner-btn-modal') as HTMLButtonElement;
        spinner_btn.innerText = 'Update';
        spinner_btn_modal.innerText = 'Update';
        spinner_btn_modal.disabled = false;
        // spinner_btn.click();
        
        // this.isLoading = false;
        // var spinner_icon = document.getElementById('spinner-icon');
        // var spinner_btn = document.getElementById('spinner-btn-modal') as HTMLButtonElement;
        // spinner_btn.disabled = false;
        // spinner_icon.classList.remove('fa-spinner');
        // var bodyelement = document.getElementsByClassName('modal-open');
        // bodyelement[0].classList.add('my-extra-css');
      })
    ).subscribe((data)=>{
      
      if(data['status']==true){
        this.edit_post_id = data['posts'][0].id;
        this.tag_friends = [];
        this.share_friends = [];
        this.tag_frd_id = [];
        this.share_frd_id = [];
        this.friends = this.temp_friends;
        this.another_friends = this.temp_friends;
        var element = document.getElementById('search-dropdown-list');
        var element2 = document.getElementById('boeken-check-wrap');
        var spinner_btn = document.getElementById('spinner-btn') as HTMLButtonElement;
        var spinner_btn_check_in = document.getElementById('spinner-btn-check-in') as HTMLButtonElement;
        this.dbfiles = data['posts'][0].photos_videos;// error line
        this.afiles = data['posts'][0].audios;
        if(data['posts'].length > 0){
          this.is_edit = true;          
          if(data['posts'][0].tagged_users){
            this.edit_tagged_users = data['posts'][0].tagged_users.split(',');
            this.tagged_users_from_db = data['posts'][0].tagged_users_names;
            this.edit_tagged_users.forEach(el => {
              var index = this.friends.findIndex(x => x.id ===parseInt(el));
              if(index>-1){
                this.tag_friends.push(this.friends[index]);
                this.tag_frd_id.push(parseInt(el));
                
                this.friends = this.friends.filter(function(obj) {
                  return obj.id !== parseInt(el);
                });
              }else{
                var another_index = this.tagged_users_from_db.findIndex(x => x.id === parseInt(el));
                this.tag_friends.push(this.tagged_users_from_db[another_index]);
                this.temp_tagged_users_from_db.push(this.tagged_users_from_db[another_index]);
              }
              
            });
            var friend_tag_text = document.getElementById('friend-tag-text');
            var tagged = document.getElementById('tagged');
            if(this.tag_friends.length > 0){
              friend_tag_text.classList.remove('hidden');
              tagged.classList.remove('hidden');
            }else{
              friend_tag_text.classList.add('hidden');
              tagged.classList.add('hidden');
            }
          }          
            
          if(data['posts'][0].share_with_friends){
            this.edit_share_users = data['posts'][0].share_with_friends.split(',');
            this.share_users_from_db = data['posts'][0].share_users_names;
            this.edit_share_users.forEach(el => {
              var index = this.another_friends.findIndex(x => x.id ===parseInt(el));
              if(index>-1){
                this.share_friends.push(this.another_friends[index]);
                this.share_frd_id.push(parseInt(el));
                
                this.another_friends = this.another_friends.filter(function(obj) {
                  return obj.id !== parseInt(el);
                });
              }else{
                var another_index = this.share_users_from_db.findIndex(x => x.id === parseInt(el));
                this.share_friends.push(this.share_users_from_db[another_index]);
                this.temp_share_users_from_db.push(this.share_users_from_db[another_index]);
              }
              
            });
          }
          if(data['posts'][0].share_with_groups){
            this.edit_share_groups = data['posts'][0].share_with_groups.split(',');
            this.share_groups_from_db = data['posts'][0].share_group_names;
            this.edit_share_groups.forEach(el => {
              var index = this.groups.findIndex(x => x.id ===parseInt(el));
              if(index>-1){
                this.share_groups.push(this.groups[index]);
                this.share_group_id.push(parseInt(el));
                
                this.groups = this.groups.filter(function(obj) {
                  return obj.id !== parseInt(el);
                });
              }else{
                var another_index = this.share_groups_from_db.findIndex(x => x.id === parseInt(el));
                this.share_groups.push(this.share_groups_from_db[another_index]);
                this.temp_share_groups_from_db.push(this.share_groups_from_db[another_index]);
              }
            });
          }
            
          if( data['spot_detail'].length > 0){
            this.short_description = data['spot_detail'][0].short_description;
            this.business_name = data['spot_detail'][0].business_name;
            this.spot_profile = data['spot_detail'][0].user_profile;
            
            this.like_by = data['like_by'];
            this.spot_rating = data['spot_rating'];
            if(this.spot_profile==null){
              this.spot_profile = '/assets/front-assets/images/pic1.png';
            }else{
              this.spot_profile = 'https://ibigo.shadowis.nl/server-api/public/user_profiles/'+data['spot_detail'][0].user_profile;
            }
          }
          
          this.spot_id = data['posts'][0].spot_id;
          if(this.spot_id){
            this.demoForm.patchValue({
              desc:data['posts'][0].spot_description
            });
            
            this.spotForm.patchValue({
              review:data['posts'][0].spot_description
            });
            this.post_type = 'checkin';            
            element.classList.add('hidden');
            spinner_btn_check_in.disabled = false;
            element2.classList.remove('hidden');
          }else{
            this.post_type = 'normal';
            this.demoFormPost.patchValue({
              descPost:data['posts'][0].spot_description
            })
            this.spotForm.patchValue({
              review:data['posts'][0].spot_description
            });
            spinner_btn.disabled =false;
          }
        }
        //this.toastrservice.Success(data['message']);
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/homepage']));
      }else{
        this.toastrservice.Error(data['message']);
      }
    }); 

  }
  goto_spot_id = [];
  addToGoList(spot_id){
    if(confirm('Do you want to add this spot in go to list ?')){
      const formData = new FormData();
      const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
      headers.append('Accept', 'application/json');
      formData.append('spot_id', spot_id);
      this.http.post('https://ibigo.shadowis.nl/server-api/api/add-to-goto',formData,{headers:headers}).subscribe((data)=>{
        if(data['status']==true){
          this.router.navigate(['/todo/go-list'])
        }
      });
    }
  }
  addToPlanning(event_id){
    
    if(this.logged_in_user!= ""){
      if(confirm('Do you want to this event to planning?')){
        const formData = new FormData();
        const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        formData.append('event_id', event_id);
        formData.append('spot_id', null);        
        this.http.post('https://ibigo.shadowis.nl/server-api/api/add-planning',formData,{headers:headers}).subscribe((data)=>{
          if(data['status']==true){    
            this.toastrservice.Success(data['event_message']);
            //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/todo/planning']));
          }else{
            this.toastrservice.Success('Something wring!');
          }
        });
      }
    }else{
      this.router.navigate(['/user/login']);
    }
  }
  deletePost(post_id){
    if(confirm("Are you sure want to delete this post ?")) {
      const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
      this.http.get('https://ibigo.shadowis.nl/server-api/api/delete-checkin/'+post_id,{headers:headers}).subscribe((data)=>{
        if(data['status']==true){
          this.toastrservice.Success('Post deleted');
          var index = this.posts.findIndex(x => x.id ===parseInt(post_id));
          if(index>-1){
            this.posts = this.posts.filter(function(obj) {
              return obj.id !== parseInt(post_id);
            });
          }else{
            var e_index = this.extra_posts.findIndex(x => x.id ===parseInt(post_id));
            var loaded_index = this.loaded_posts.findIndex(x => x.id ===parseInt(post_id));
            if(e_index>-1){
              this.extra_posts = this.extra_posts.filter(function(obj) {
                return obj.id !== parseInt(post_id);
              });
            }else if(loaded_index>-1){
              this.loaded_posts = this.loaded_posts.filter(function(obj) {
                return obj.id !== parseInt(post_id);
              });
            }else{
              this.first_5_posts = this.first_5_posts.filter(function(obj) {
                return obj.id !== parseInt(post_id);
              });
            }
          }
          //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/homepage']));
        }else{
          this.toastrservice.Error(data['message']);
        }
      });
    }
  }

  onPhotoChange(event) {  
    for (var i = 0; i < event.target.files.length; i++) { 
      this.myPhotos.push(event.target.files[i]);
    }
  }
  mydata = [];
  onSelectFile(event){
    for (var i = 0; i < event.target.files.length; i++) { 
        this.files.push(event.target.files[i]);
    }
    
    const files = event.target.files;
    if (files) {
      var i = this.files.length+1;
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (file.type.indexOf("image") > -1) {
            this.mydata.push({
              id:i,
              name: file.name,
              url:e.target.result,
              type: 'img'
            });
          } else if (file.type.indexOf("video") > -1) {
            this.mydata.push({
              id:i,
              name: file.name,
              url:e.target.result,
              type: 'video'
            });
          }
          i++;
        };
        reader.readAsDataURL(file);
        
      }
    }
    
  }
  
  myaudiodata = [];
  onAudioFile(event){
    for (var i = 0; i < event.target.files.length; i++) { 
      this.audio_files.push(event.target.files[i]);
    }
    const audiofiles = event.target.files;
    if (audiofiles) {
      var i = this.audio_files.length+1;
      for (const file of audiofiles) {
       this.myaudiodata.push({id:i,url:URL.createObjectURL(file)});
       i++;
      }
    }
  }
  onRemoveFileFromDB(fname){
    this.dbfiles = this.dbfiles.filter(function( obj ) {
      return obj !== fname;
    });    
  }

  onRemoveAudioFileFromDB(fname){
    this.afiles = this.afiles.filter(function( obj ) {
      return obj !== fname;
    }); 
  }
  onRemoveFile(id){
    var obje;
    this.mydata.filter(function( obj ) {
      obje = obj.name;
    });
    this.mydata = this.mydata.filter(function( obj ) {
      return obj.id !== id;
    });
    this.files = this.files.filter(function( obj ) {
      return obj.name !== obje;
    }); 
  }
  onRemoveAudioFile(id){
    var obje;
    this.myaudiodata.filter(function( obj ) {
      obje = obj.name;
    });
    this.myaudiodata = this.myaudiodata.filter(function( obj ) {
      return obj.id !== id;
    });
    this.audio_files = this.audio_files.filter(function( obj ) {
      return obj.name !== obje;
    }); 
  }
  onVideoChange(event) {  
    for (var i = 0; i < event.target.files.length; i++) { 
        this.myVideos.push(event.target.files[i]);
    }
  }

  onSubmit(){
    this.btnloading = true;
    //var spinner_icon = document.getElementById('spinner-icon');
    var spinner_btn = document.getElementById('spinner-btn-modal') as HTMLButtonElement;
    spinner_btn.disabled = true;
    //spinner_icon.classList.add('fa-spinner');
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    for (var i = 0; i < this.files.length; i++) { 
      formData.append("file[]", this.files[i]);
    }
    for (var j = 0; j < this.audio_files.length; j++ )
    {
      formData.append("file[]",this.audio_files[j])
    }

   
    formData.append('review', this.spotForm.get('review').value);
    
    

    formData.append('tag_friends', this.tag_frd_id);
    formData.append('share_friends', this.share_frd_id);
    formData.append('share_groups', this.share_group_id);
    var add_or_update;
    if(this.tabname=='normal'){
      formData.append('spot_id', null);
    }else{
      formData.append('spot_id', this.spot_id);
    }
    if(this.is_edit==true){
      
      add_or_update = 'update-checkin';
      formData.append('edit_post_id',this.edit_post_id);
      if(this.dbfiles.length > 0){
        if(this.afiles.length > 0)
        {
          this.dbfiles.concat(this.afiles);
        }
        formData.append('db_files_array',this.dbfiles.join(','));
      }
      else
      {
         if(this.afiles.length > 0){
          formData.append('db_files_array',this.afiles.join(','));
         }
      }
    }else{
      add_or_update = 'add-spot';
    }
    this.http.post('https://ibigo.shadowis.nl/server-api/api/'+add_or_update,formData,{headers:headers}).pipe(
      finalize(() => {
        this.btnloading = false;
        //var spinner_icon = document.getElementById('spinner-icon');
        var spinner_btn = document.getElementById('spinner-btn-modal') as HTMLButtonElement;
        spinner_btn.disabled = false;
        //spinner_icon.classList.remove('fa-spinner');
        //var bodyelement = document.getElementsByClassName('modal-open');
        //bodyelement[0].classList.add('my-extra-css');
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        var closebtn = document.getElementById('close-btn');
        closebtn.click();
        console.log(data);
        
        var new_post = data['post']
        if(this.is_edit==false){
          new_post.forEach(new_p => {
            this.first_5_posts.unshift(new_p)
            this.post_length++;  
          });
        }else{
          var index = this.first_5_posts.findIndex(x => x.id ===parseInt(this.edit_post_id));
          var extra_post_index = this.extra_posts.findIndex(x => x.id ===parseInt(this.edit_post_id));
          var post_index = this.posts.findIndex(x => x.id ===parseInt(this.edit_post_id));
          if(index>-1){
            this.first_5_posts[index] = new_post[0];
          }else if(extra_post_index>-1){
            this.extra_posts[extra_post_index] = new_post[0];
          }else{
            this.posts[post_index] = new_post[0];
          }
          this.cancelPost();
        }
        //this.toastrservice.Success(data['message']);
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/homepage']));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
  }

  onOpenModal(comment_id){    
    this.call_status = false;
    var comment_detail = document.getElementById('comment-detail'+comment_id);
    if(comment_detail.classList.contains('active')){
      comment_detail.classList.toggle('active');
    }else{
      var comment_box_option_class = document.querySelectorAll('.comment-detail');
      comment_box_option_class.forEach(cb => {
        cb.classList.remove('active');
      });
      comment_detail.classList.toggle('active');
    }
  }

  editComment(cid,comment){
    var comment_detail_class = document.querySelectorAll('.comment-detail');
    // const elArr = document.querySelectorAll('.'comment-detail'); // all
    
    comment_detail_class.forEach(fakeImage => {
      fakeImage.classList.remove('active');
      fakeImage.classList.remove('comment-active');
    });
    var comment_detail = document.getElementById('comment-detail'+cid);
    var comment_input = document.getElementById('comment-input'+cid);
    var comment_menu_icon = document.getElementById('comment-menu-icon'+cid);
    var cancel_btn = document.getElementById('cancel-btn'+cid);
    var comment_menu_iconp_class = document.querySelectorAll('.comment-menu-icon');
    var cancel_btn_class = document.querySelectorAll('.cancel-btn');

    comment_menu_iconp_class.forEach(fakeImage => {
      fakeImage.classList.remove('hidden');
    });

    cancel_btn_class.forEach(fakeImage => {
      fakeImage.classList.add('hidden');
    });
    //comment_detail.classList.toggle('active');
    comment_detail.classList.toggle('comment-active');
    comment_menu_icon.classList.add('hidden');
    cancel_btn.classList.remove('hidden');
    this.commentEditForm.patchValue({comment:comment});
    comment_input.focus();
  }
  onCommentSubmit(pid){
    
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json'); 
    formData.append('comment', this.commentForm.get('comment').value);
    formData.append('post_hidden', pid);
    this.commentForm.reset();
    this.http.post('https://ibigo.shadowis.nl/server-api/api/add-comment',formData,{headers:headers}).pipe(
      finalize(() => {
        // this.isLoading = false;
        // var spinner_icon = document.getElementById('spinner-icon');
        // var spinner_btn = document.getElementById('spinner-btn') as HTMLButtonElement;
        // spinner_btn.disabled = false;
        // spinner_icon.classList.remove('fa-spinner');
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        //this.toastrservice.Success(data['message']);
        // this.posts.forEach(post => {
        //   if(post.id==pid){
        //     post.comments.push(data['comment'])
        //   }
        // });
        
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/homepage']));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
  }

  onCommentEditSubmit(cid,post_id){
    var spinner = document.getElementById('spinner'+cid);
    spinner.classList.remove('hidden');
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json'); 
    formData.append('comment', this.commentEditForm.get('comment').value);
    formData.append('post_hidden', cid);
    this.http.post('https://ibigo.shadowis.nl/server-api/api/update-comment',formData,{headers:headers}).pipe(
      finalize(() => {
        // this.isLoading = false;
        // var spinner_icon = document.getElementById('spinner-icon');
        // var spinner_btn = document.getElementById('spinner-btn') as HTMLButtonElement;
        // spinner_btn.disabled = false;
        // spinner_icon.classList.remove('fa-spinner');
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        //this.toastrservice.Success(data['message']);
        
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/homepage']));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
  }

  deleteComment(cid,pid){
    if(confirm("Are you sure want to delete ?")) {
      const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json'); 
      this.http.post('https://ibigo.shadowis.nl/server-api/api/delete-comment/'+cid,{headers:headers}).pipe(
        finalize(() => {
          // this.isLoading = false;
          // var spinner_icon = document.getElementById('spinner-icon');
          // var spinner_btn = document.getElementById('spinner-btn') as HTMLButtonElement;
          // spinner_btn.disabled = false;
          // spinner_icon.classList.remove('fa-spinner');
        })
      ).subscribe((data)=>{
        if(data['status']==true){
          //this.toastrservice.Success(data['message']);
          
          //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/homepage']));
        }else{
          this.toastrservice.Error(data['message']);
        }
      });
    }
  }

  onCancel(cid){
    var comment_detail_class = document.querySelectorAll('.comment-detail');
    var comment_menu_icon = document.querySelectorAll('.comment-menu-icon');
    var cancel_btn = document.querySelectorAll('.cancel-btn');
    var spinner = document.getElementById('spinner'+cid);
    spinner.classList.add('hidden')
    comment_detail_class.forEach(fakeImage => {
      fakeImage.classList.remove('active');
      fakeImage.classList.remove('comment-active');
    });

    comment_menu_icon.forEach(fakeImage => {
      fakeImage.classList.remove('hidden');
    });

    cancel_btn.forEach(fakeImage => {
      fakeImage.classList.add('hidden');
    });
  }
  
  changeTab(tabname){
   this.tabname = tabname;
  //  if(this.tabname=='normal'){
  //   this.spot_id
  //  }else{

  //  }
  }

  onUserType(type){
    this.selected_user_type = type;
    this.cd.detectChanges();    
  }

  arrowkeyLocation = 0;
  selected_user_type;
  formData = new FormData();
  selected_value;
  suggestions= [];

  keyDown(event: any) {
    if(event.target.value=='' || event.target.value==' '){
      this.suggestions = [];
    }
    if(event.target.value.length>3 && event.target.value.replace(/\s/g, '').length){
      switch (event.keyCode) {
          case 38: // this is the ascii of arrow up
                  if(this.arrowkeyLocation >= 1 )
                    this.arrowkeyLocation--;
                    break;
          case 40: // this is the ascii of arrow down
                  if(this.arrowkeyLocation < this.suggestions.length - 1 )
                    this.arrowkeyLocation++;
                    break;
      }
      if((event.keyCode!=38 && event.keyCode!=40)){
        this.searchForm.patchValue({'search_name':event.target.value});
        //this.suggestions.push(event.target.value);
        this.formData.append('searchText', this.searchForm.get('search_name').value);
        this.formData.append('selected_user_type', this.selected_user_type);
        let headers = new HttpHeaders();
        if(this.is_user_logged_in==true){
          headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
        }
        //const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
        this.http.post('https://ibigo.shadowis.nl/server-api/api/get-all-suggestions',this.formData,{headers:headers}).subscribe((data)=>{
          this.suggestions = [];
          this.arrowkeyLocation = 0;
          if(data['all_suggestions'].length > 0){
            this.suggestions = data['all_suggestions'];
          }
          
        });
      }else{
        this.selected_value = this.suggestions[this.arrowkeyLocation].user_name;
        this.searchForm.patchValue({'search_name':this.selected_value});
      }
    }else{
      this.suggestions = [];
    }
      
  }
  
  notificationOpen = false;
  notificationDropDown(){
    if(this.notificationOpen==true){
      this.notificationOpen = false;  
    }else{
      if(this.notification_cnt > 0){
        this.notification_cnt = 0;
        const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
        this.http.get('https://ibigo.shadowis.nl/server-api/api/change-notification-status',{headers:headers}).subscribe((data)=>{});
      }      
      this.notificationOpen = true;
    }
      
  }
  
}
