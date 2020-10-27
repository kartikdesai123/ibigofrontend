import { Component, OnInit, HostListener } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'src/app/toastr.service';
import { finalize } from 'rxjs/operators';
import { UserLoginService } from 'src/app/service/user-login.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-spot-review',
  templateUrl: './spot-review.component.html',
  styleUrls: ['./spot-review.component.css','../../../../front-assets/css/bootstrap.min.css',
  '../../../../front-assets/css/style.css',
  '../../../../front-assets/css/responsive.css',
  '../../../../front-assets/css/font-awesome.min.css',
  '../../../../front-assets/css/owl-carousel.css',
  '../../../../front-assets/css/pretty-checkbox.min.css','../font-user.css']
})
export class SpotReviewComponent implements OnInit {
  users_details = [];
  spot_details = [];
  about_submitted = false;
  interest_details = [];
  review_id;
  photos_videos = [];
  spot_videos = [];
  spot_photos = [];
  reviews =[];
  first_name;
  full_address;
  last_name;
  photo_index;
  age;
  spot_id;
  user_cover;
  avg_rating;
  user_about;
  user_profile;
  reviews_count;
  dbfiles = [];
  is_connected_count;
  public imagePath;
  imgURL: any;
  friends = [];
  update_review = [];
  spot_name;
  spot_profile;
  
  mydata = [];
  files = [];
  unique_spot_id;
  spot_slug;
  is_connected;
  is_liked;
  reviewForm: FormGroup;
  commentForm: FormGroup;
  commentEditForm: FormGroup;
  liked_users = [];
  rating_users = [];
  invite_friends = [];
  business_details = [];
  invite_frd_id :any= [];
  logged_in_user_id;
  call_status : boolean;
  can_reply: boolean = false;
  business_name;
  loading : boolean= true;
  logged_in_user:boolean;
  constructor(private titleService:Title,private formBuilder: FormBuilder,private us : UserLoginService,private route: ActivatedRoute,private http:HttpClient,private router:Router,private toastrservice: ToastrService) {
    this.titleService.setTitle('IBIGO | Spot Reviews');
  }

  ngOnInit() {
    
    this.unique_spot_id = this.route.snapshot.params.id;
    this.spot_slug = this.route.snapshot.params.slug;
    this.logged_in_user = this.us.isUserLoggedIn();
    //const nid = this.route.snapshot.params.notification_id;
    var user_t = localStorage.getItem('user_type');
    let headers = new HttpHeaders();
    //this.router.navigate(['/spot-reviews/'+id]);
    if(user_t=='"normal"'){
      headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
      this.router.navigate(['/spot-reviews/'+this.unique_spot_id+'/'+this.spot_slug]);
      this.http.get('https://ibigo.shadowis.nl/server-api/api/get-user',{headers:headers}).subscribe((data)=>{
        
        this.users_details = data['user_details'];
        this.logged_in_user_id = this.users_details['id'];
        this.first_name  = this.users_details['first_name'];
        this.last_name  = this.users_details['last_name'];
        
        this.user_about  = this.users_details['user_about'];
        
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
    }else if(user_t=='"business"'){
      headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
      this.router.navigate(['/spot-reviews/'+this.unique_spot_id+'/'+this.spot_slug]);
      if(this.logged_in_user==true){
        this.http.get('https://ibigo.shadowis.nl/server-api/api/get-business-user',{headers:headers}).subscribe((data)=>{
          this.users_details = data['user_details'];
          this.rating_users = data['rating_users'];
          this.avg_rating = data['avg_rating'];
          this.reviews_count = data['reviews_count'];
          this.is_connected_count = data['is_connected_count'];
          this.liked_users = data['liked_users'];
          this.business_details = data['business_details'];
          if(this.business_details['business_type']=='premium'){
            this.can_reply = true;
          }
          this.spot_photos = data['photos'];
          this.spot_videos = data['videos'];
          this.spot_id =data['user_details'].id;
          this.business_name  = this.business_details['business_name'];
          this.full_address  = this.business_details['full_address'];
          this.user_profile  = this.users_details['user_profile'];
          this.user_cover  = this.users_details['user_cover'];
          if(this.user_profile==null){
            this.user_profile = '/assets/front-assets/images/pic1.png';
          }else{
            this.user_profile = 'https://ibigo.shadowis.nl/server-api/public/user_profiles/'+this.users_details['user_profile'];
          }
          this.user_about  = this.users_details['user_about'];
          if(this.user_cover==null){
            this.imgURL = '/assets/front-assets/images/group-bg2.png';
          }else{
            this.imgURL = 'https://ibigo.shadowis.nl/server-api/public/user_cover/'+this.user_cover;
          }
        });
      }
    }
    

    
    
    if(this.logged_in_user==true){
      this.http.get('https://ibigo.shadowis.nl/server-api/api/getfriends',{headers:headers}).subscribe((data)=>{
        this.friends = data['friend_list'];
        var element = document.getElementById('friend-tag-text');
        var element2 = document.getElementById('tagged');  
        if(this.invite_friends.length > 0){
          element.classList.remove('hidden');
          element2.classList.remove('hidden');
        }else{
          element.classList.add('hidden');
          element2.classList.add('hidden');
        }
      });
    }
    
    
    this.http.get('https://ibigo.shadowis.nl/server-api/api/spot/'+this.unique_spot_id,{headers:headers}).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((data)=>{
      if(data['status']==true){
       
        this.spot_details = data['user_details'];
        this.unique_spot_id  = this.spot_details['unique_id'];
        this.spot_slug  = this.spot_details['user_slug'];
        this.router.navigate(['/spot-reviews/'+this.unique_spot_id+'/'+this.spot_slug]);
        this.spot_photos = data['photos'];
        this.spot_videos = data['videos'];
        this.rating_users = data['rating_users'];
        this.reviews = data['reviews'];
        var logged_in_user_id = this.logged_in_user_id+'';
        if(this.logged_in_user){
          this.update_review = this.reviews.filter(function( obj ) {
            return obj.user_id === logged_in_user_id;
          });
          if(this.update_review.length > 0 ){
            if(this.update_review[0].review_photos_videos){
              this.dbfiles = this.update_review[0].review_photos_videos;
            }
              
            var star_length = (this.update_review[0].rating*2)+1;
            for(var i=1;i<star_length;i++){
              var radio = document.getElementById('rating'+i) as HTMLInputElement;
              //radio.checked;
              var lable = document.getElementById('rating_lable'+i) as HTMLLabelElement;
              //lable.classList.add('mycolor')
            }
            this.reviewForm.patchValue({review:this.update_review[0].review,rating:(this.update_review[0].rating)})
          }
          
        }
        this.liked_users = data['liked_users'];
        this.business_details = data['business_details'];
        this.spot_name  = this.business_details['business_name'];
        this.full_address  = this.business_details['full_address'];
        this.spot_id  = this.spot_details['id'];
        
        this.avg_rating = data['avg_rating'];
        this.reviews_count = data['reviews_count'];
        this.is_connected_count = data['is_connected_count'];
        this.spot_profile  = this.spot_details['user_profile'];
        this.user_cover  = this.spot_details['user_cover'];
        this.is_connected = data['is_connected'];
        this.is_liked = data['is_like'];
        if(this.spot_profile==null){
          this.spot_profile = '/assets/front-assets/images/pic1.png';
        }else{
          this.spot_profile = 'https://ibigo.shadowis.nl/server-api/public/user_profiles/'+this.spot_details['user_profile'];
        }
        this.user_about  = this.spot_details['user_about'];
        if(this.user_cover==null){
          this.imgURL = '/assets/front-assets/images/group-bg2.png';
        }else{
          this.imgURL = 'https://ibigo.shadowis.nl/server-api/public/user_cover/'+this.user_cover;
        }
      }else{      
        if(this.logged_in_user==true){
          var user_t = localStorage.getItem('user_type');
          if(user_t=='"normal"'){
            this.router.navigate(['/user/homepage']);
          }else if(user_t=='"business"'){
            this.router.navigate(['/home/business/profile']);
          }
        }else{
          this.router.navigate(['/user/login']);
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

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    var comment_detail_class = document.querySelectorAll('.comment-detail');
    var comment_menu_icon = document.querySelectorAll('.comment-menu-icon');
    var cancel_btn = document.querySelectorAll('.cancel-btn');
    comment_detail_class.forEach(cd => {
      cd.classList.remove('active');
      cd.classList.remove('comment-active');
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

  openImageVideo(post_id,image_video_name){
    this.review_id = post_id;
    var index = this.reviews.findIndex(x => x.id ===post_id);
    this.photos_videos = this.reviews[index].review_photos_videos;
    this.photo_index = this.photos_videos.indexOf(image_video_name);
    var element = document.getElementsByClassName('post-gallery');
    element[0].classList.add('active');
  }

  clickEvent(post_id){
    var comments = document.getElementById('post-comment'+post_id);
    comments.classList.toggle('active');
  }

  onCommentSubmit(pid){
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json'); 
    formData.append('reply', this.commentForm.get('comment').value);
    formData.append('review_id', pid);
    this.http.post('https://ibigo.shadowis.nl/server-api/api/add-reply',formData,{headers:headers}).subscribe((data)=>{
      if(data['status']==true){
        this.toastrservice.Success(data['message']);
        
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/spot-reviews/'+this.unique_spot_id+'/'+this.spot_slug]));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
  }

  onCommentEditSubmit(cid){
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json'); 
    formData.append('reply', this.commentEditForm.get('comment').value);
    formData.append('review_id', cid);
    this.http.post('https://ibigo.shadowis.nl/server-api/api/update-reply',formData,{headers:headers}).pipe(
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
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/spot-reviews/'+this.unique_spot_id+'/'+this.spot_slug]));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
  }

  deleteComment(cid){
    if(confirm("Are you sure want to delete ?")) {
      const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json'); 
      this.http.post('https://ibigo.shadowis.nl/server-api/api/delete-reply/'+cid,{headers:headers}).pipe(
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
          this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/spot-reviews/'+this.unique_spot_id+'/'+this.spot_slug]));
        }else{
          this.toastrservice.Error(data['message']);
        }
      });
    }
  }

  closeImageVideo(post_id){
    var index = this.reviews.findIndex(x => x.id ===post_id);
    var element_post = document.getElementById('post-gallery'+this.review_id);
    var element_item = document.getElementsByClassName('item');
    element_post.classList.remove('active');
    var index_post = this.reviews.findIndex(x => x.id ===post_id);
    var photos_videos = this.reviews[index_post].review_photos_videos;
    for(var i=0;i<photos_videos.length-1;i++){
      element_item[i].classList.remove('active');
    }
  }

  onRemoveFileFromDB(fname){
    this.dbfiles = this.dbfiles.filter(function( obj ) {
      return obj !== fname;
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

  onCancel(cid){
    var comment_detail_class = document.querySelectorAll('.comment-detail');
    var comment_menu_icon = document.querySelectorAll('.comment-menu-icon');
    var cancel_btn = document.querySelectorAll('.cancel-btn');
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

  onLikeOrConnect(like_or_connect,spot_id){
    //const nid = this.route.snapshot.params.notification_id
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    this.http.get('https://ibigo.shadowis.nl/server-api/api/'+like_or_connect+'/'+spot_id,{headers:headers}).subscribe((data)=>{
      if(data['status']==true){
        this.toastrservice.Success(data['message']);
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/spot/'+this.spot_id+'/'+this.spot_slug]));
        //this.router.navigate(['/user/home']);
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
  }

  addTaglist(userid){
    var index = this.friends.findIndex(x => x.id ===userid);
    this.invite_friends.push(this.friends[index]);
    this.invite_frd_id.push(userid);
    this.friends = this.friends.filter(function( obj ) {
      return obj.id !== userid;
    });
    
    var element = document.getElementById('friend-tag-text');
    var element2 = document.getElementById('tagged');
    if(this.invite_friends.length > 0){
      element.classList.remove('hidden');
      element2.classList.remove('hidden');
    }else{
      element.classList.add('hidden');
      element2.classList.add('hidden');
    }
  }

  removeFromTagList(user_id){
    var index = this.invite_friends.findIndex(x => x.id ===user_id);
    this.friends.push(this.invite_friends[index]);
    this.invite_frd_id.pop(user_id);
    this.invite_friends = this.invite_friends.filter(function( obj ) {
      return obj.id !== user_id;
    });
    var element = document.getElementById('friend-tag-text');
    var element2 = document.getElementById('tagged');
    if(this.invite_friends.length > 0){
      element.classList.remove('hidden');
      element2.classList.remove('hidden');
    }else{
      element.classList.add('hidden');
      element2.classList.add('hidden');
    }
  }

  onSubmit(){
    //const nid = this.route.snapshot.params.notification_id
    var spinner_icon = document.getElementById('spinner-icon');
    var spinner_btn = document.getElementById('spinner-btn') as HTMLButtonElement;
    spinner_btn.disabled =true;
    spinner_icon.classList.add('fa-spinner');
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Accept', 'application/json');
    formData.append('spot_id', this.spot_id);
    formData.append('invite_frd_id', this.invite_frd_id);
    
    this.http.post('https://ibigo.shadowis.nl/server-api/api/invite-friend',formData,{headers:headers}).pipe(
      finalize(() => {
        spinner_btn.disabled = false;
        spinner_icon.classList.remove('fa-spinner');
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        this.toastrservice.Success(data['message']);
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/spot/'+this.spot_id]));
      }else{
        this.toastrservice.Error(data['message']);
      }
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

  onReviewSubmit(){
    var review_icon = document.getElementById('review-icon');
    var review_btn = document.getElementById('review-btn') as HTMLButtonElement;
    review_btn.disabled =true;
    review_icon.classList.add('fa-spinner');
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    formData.append('spot_id', this.spot_id);
    for (var i = 0; i < this.files.length; i++) { 
      formData.append("file[]", this.files[i]);
    }
    if(this.dbfiles.length > 0){
      formData.append('db_files_array',this.dbfiles.join(','));
    }
    formData.append('review', this.reviewForm.get('review').value);
    formData.append('rating', this.reviewForm.get('rating').value);
    this.http.post('https://ibigo.shadowis.nl/server-api/api/update-review',formData,{headers:headers}).pipe(
      finalize(() => {
        review_btn.disabled = false;
        review_icon.classList.remove('fa-spinner');
        var bodyelement = document.getElementsByClassName('modal-open');
        bodyelement[0].classList.add('my-extra-css');
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        this.toastrservice.Success(data['message']);
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/spot/'+this.unique_spot_id+'/'+this.spot_slug]));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
  }

  deleteReview(){
    if(confirm("Are you sure want to delete ?")) {
      const formData = new FormData();
      const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      formData.append('spot_id', this.spot_id);
      this.http.post('https://ibigo.shadowis.nl/server-api/api/delete-review',formData,{headers:headers}).subscribe((data)=>{
        if(data['status']==true){
          this.toastrservice.Success(data['message']);
          this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/spot/'+this.unique_spot_id+'/'+this.spot_slug]));
        }else{
          this.toastrservice.Error(data['message']);
        }
      });
    } 
  }
 
}
