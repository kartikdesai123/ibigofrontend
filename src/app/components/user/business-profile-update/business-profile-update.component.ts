import { Component, OnInit, Inject, HostListener, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'src/app/toastr.service';
import { Router } from '@angular/router';
import { UserHomeServiceService } from 'src/app/service/user-home-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-business-profile-update',
  templateUrl: './business-profile-update.component.html',
  styleUrls: ['./business-profile-update.component.css','../../../../front-assets/css/bootstrap.min.css',
  '../../../../front-assets/css/style.css',
  '../../../../front-assets/css/responsive.css',
  '../../../../front-assets/css/font-awesome.min.css',
  '../../../../front-assets/css/owl-carousel.css',
  '../../../../front-assets/css/pretty-checkbox.min.css','../font-user.css']
})
export class BusinessProfileUpdateComponent implements OnInit {
  avg_rating;
  users_details = [];
  reviews_count;
  about_submitted = false;
  interest_details = [];
  spot_videos = [];
  spot_photos = [];
  first_name;
  full_address;
  last_name;
  age;
  is_connected_count;
  spot_id;
  mydata =[];
  is_edit : boolean = false;
  user_slug;
  unique_spot_id;
  user_cover;
  profileForm: FormGroup;
  reviewForm: FormGroup;
  spotForm: FormGroup;
  user_about;
  duration;
  user_profile;
  public imagePath;
  imgURL: any;
  loading : boolean = true;
  liked_users = [];
  spot_photos_by_user = [];
  spot_videos_by_user = [];
  rating_users = [];
  user_type;
  max_images;
  dbfiles = [];
  max_videos;
  parking_details;
  video_array_size = [];
  spot_interest_details = [];
  files_spots=[];
  files=[];
  photos_extensions = ['png','jpeg','jpg','tiff','pjp','pjpeg','jfif','tif','gif','svg','bmp','svgz','webp','ico','xbm','dib'];
  video_extensions = ['mp4','ogm','wmv','mpg','webm','ogv','mov','asx','mpeg','m4v','avi'];
  photos_cnt=0;
  videos_cnt=0;
  upload_btn :boolean= false;
  business_details = [];
  venue_id;
  four_square_api_photos = [];
  business_name;
  extra_posts=[];
  post_length;
  call_status : boolean;
  posts =[];
  commentForm : FormGroup;
  commentEditForm : FormGroup;
  logged_in_user;
  user_name;
  constructor(@Inject(DOCUMENT) private document: Document,private cd : ChangeDetectorRef,private http:HttpClient,private router:Router,private ts : UserHomeServiceService,private formBuilder: FormBuilder,private toastrservice: ToastrService) { }

  ngOnInit() {
    window.Echo.channel('all-post').listen('CommentSent', (data) => {      
      //this.likes = data['likes']
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
    var user_t = localStorage.getItem('user_type');
    if(user_t=='"normal"'){
      this.router.navigate(['/user/updateprofile']);
    }else if(user_t=='"business"'){
      this.router.navigate(['/home/business/profile']);
    }
    
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-posts',{headers:headers}).subscribe((data)=>{
      this.posts = data['posts'];
      
      //  this.post_length = data['posts'].length;
      //this.posts = this.extra_posts.splice(0,3);      
    });
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-business-user',{headers:headers}).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((data)=>{
      //https://api.foursquare.com/v2/venues/VENUE_ID/photos
      this.users_details = data['user_details'];
      this.spot_interest_details = data['user_interests'];      
      this.rating_users = data['rating_users'];
      this.avg_rating = data['avg_rating'];
      this.reviews_count = data['reviews_count'];
      this.is_connected_count = data['is_connected_count'];
      this.liked_users = data['liked_users'];      
      this.business_details = data['business_details'];
      this.logged_in_user  = this.users_details['id'];
      this.spot_photos_by_user = data['spot_photos_by_user'];
      this.spot_videos_by_user = data['spot_videos_by_user'];
      this.user_type = this.business_details['business_type'];
      if(this.user_type=='basic'){
        this.max_images = 4;
        this.max_videos = 1;
      }else{
        this.parking_details = this.business_details['parking_details'];
        this.max_images = 25;
        this.max_videos = 5;
      }
      
      this.spot_photos = data['photos'];
       this.dbfiles = this.spot_photos;
      this.spot_videos = data['videos'];
      
      this.photos_cnt = this.spot_photos.length;
      this.videos_cnt = this.spot_videos.length;
      
      this.dbfiles.push.apply(this.dbfiles, this.spot_videos);
      if(this.dbfiles.length > 0){
        this.is_edit = true;
      }
      if(this.photos_cnt <= this.max_images && this.videos_cnt <= this.max_videos && this.video_array_size.length<1){
        if(this.photos_cnt==0 && this.videos_cnt==0){
          this.upload_btn = false;
        }else{
          this.upload_btn = true;
        }
      }else{
        this.upload_btn = false;
      } 
      this.spot_id =data['user_details'].id;
      
      this.unique_spot_id =data['user_details'].unique_id;
      this.user_slug =data['user_details'].user_slug;
      this.business_name  = this.business_details['business_name'];
      this.user_name= this.business_details['business_name'];
      this.venue_id = this.business_details['place_id']
      if(this.venue_id){
        this.http.get('https://api.foursquare.com/v2/venues/'+this.venue_id+'/photos?client_id=IQVXPFHN5YKW1BXON50GW1YVVZ1VPUTGYZD1VCO1OSMF4DON&client_secret=IRTCUWTAWZC5LLFKGNO5VDJZWB451IC5E51TYHITPJS1XOHT&v=20200612').subscribe((data:any)=>{
          this.four_square_api_photos = data.response.photos.items;
        });
      }
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
    //https://api.foursquare.com/v2/venues/VENUE_ID/photos
    
    
    this.profileForm = this.formBuilder.group({
      file: new FormControl(),
      fileSource: new FormControl()
    });
    this.spotForm = this.formBuilder.group({
      review: new FormControl()
    });
    this.reviewForm = this.formBuilder.group({
      review: new FormControl()
    });
    this.commentForm = this.formBuilder.group({
      comment: new FormControl(),
    });

    this.commentEditForm = this.formBuilder.group({
      comment: new FormControl(),
    });
      
  }
  private destroyed = false;

  ngOnDestroy() {
    this.destroyed = true;
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


  post_id;
  modal_spot_id;
  photos_videos = [];
  photo_index;
  openImageVideo(post_id,spot_id,image_video_name){
    this.post_id = post_id;
    var index = this.posts.findIndex(x => x.id ===post_id);
    this.modal_spot_id = spot_id;
    this.photos_videos = this.posts[index].photos_videos;
    this.photo_index = this.photos_videos.indexOf(image_video_name);
    var element = document.getElementsByClassName('post-gallery');
    element[0].classList.add('active');
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
        this.posts.forEach(post => {
          if(post.id==post_id){
            post.comments.forEach(comment => {
              if(comment.id==cid){
                comment.comment = this.commentEditForm.get('comment').value
              }
            });
          }
        });
        this.onCancel(cid);
        
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/home/business/profile']));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
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
    for (var i = 0; i < this.files.length; i++) { 
      formData.append("file[]", this.files[i].file);
    }
    if(this.is_edit==true){
      formData.append('db_files_array',this.dbfiles.join(','));
    }
    
    
    this.http.post('https://ibigo.shadowis.nl/server-api/api/business/update-files',formData,{headers:headers}).pipe(
      finalize(() => {
        review_btn.disabled = false;
        review_icon.classList.remove('fa-spinner');
        var bodyelement = document.getElementsByClassName('modal-open');
        bodyelement[0].classList.add('my-extra-css');
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        this.toastrservice.Success(data['message']);
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/home/business/profile']));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
  }

  preview(files) {
    if (files.length === 0)
      return;
 
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    const file = files[0]; 
    this.profileForm.patchValue({
      fileSource: file,
      file:file
    });
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
    var element = document.getElementById('imageupload');
    element.classList.remove("hidden");
  }

  get pf() { return this.profileForm.controls; }

  onRemoveFileFromDB(fname){
    var deleteobj = this.dbfiles.filter(function( obj ) {
      return obj == fname;
    });    
    this.dbfiles = this.dbfiles.filter(function( obj ) {
      return obj !== fname;
    });   
    if(deleteobj[0].includes('mp4','ogm','wmv','mpg','webm','ogv','mov','asx','mpeg','m4v','avi')){
      this.videos_cnt--;
    }else if(deleteobj[0].includes('png','jpeg','jpg','tiff','pjp','pjpeg','jfif','tif','gif','svg','bmp','svgz','webp','ico','xbm','dib')){
      this.photos_cnt--;
    }
    

  }

  onRemoveFile(id){
    
    var delteobj = this.mydata.filter(function( obj ) {
      return obj.id == id;
    });
    
    if(delteobj[0].type=='img'){
      this.photos_cnt--;
    }else if(delteobj[0].type=='video'){
      this.videos_cnt--;
    }
    this.mydata = this.mydata.filter(function( obj ) {
      return obj.id !== id;
    });
    this.files = this.files.filter(function( obj ) {
      return obj.id !== id;
    }); 
    this.video_array_size = this.video_array_size.filter(function( obj ) {
      return obj.id !== id;
    });
    
    if(this.photos_cnt <= this.max_images && this.videos_cnt <= this.max_videos && this.video_array_size.length<1){
      if(this.photos_cnt==0 && this.videos_cnt==0){
        this.upload_btn = false;
      }else{
        this.upload_btn = true;
      }
    }else{
      this.upload_btn = false;
    }
  }

  onSelectFile(event){
    var file_count;
    var file_i;
    if(Math.max.apply(Math, this.files.map(function(o) { return o.id; }))!='-Infinity'){
      file_i = Math.max.apply(Math, this.files.map(function(o) { return o.id; })) + 1;
      file_count = Math.max.apply(Math, this.files.map(function(o) { return o.id; })) + 1;
    }else{
      file_count = this.files.length + 1;
      file_i = this.files.length + 1;
    }
    for (var i = 0; i < event.target.files.length; i++) { 
      this.files.push({id:file_i,file:event.target.files[i]});
      file_i++;
    }
    
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        if (file.type.indexOf("image") > -1) {
          
          reader.onload = (e: any) => {
            
              this.mydata.push({
                id:file_count,
                name: file.name,
                url:e.target.result,
                type: 'img'
              });
            file_count++;
            
          };
          this.photos_cnt++;
          reader.readAsDataURL(file);    
          if(this.photos_cnt <= this.max_images && this.videos_cnt <= this.max_videos && this.video_array_size.length<1){
            if(this.photos_cnt==0 && this.videos_cnt==0){
              this.upload_btn = false;
            }else{
              this.upload_btn = true;
            }
          }else{
            this.upload_btn = false;
          } 
        }  
        if (file.type.indexOf("video") > -1) {
          var video = document.createElement('video');
          video.src = URL.createObjectURL(file);
          video.onloadedmetadata = () =>{
            this.duration = video.duration
            this.mydata.push({
              id:file_count,
              name: file.name,
              duration : parseInt(this.duration),
              url:video.src,
              type: 'video'
            });
            if(parseInt(this.duration) > 30){
              var myobj = {id:file_count,duration:this.duration};
              this.video_array_size.push(myobj);
              if(this.photos_cnt <= this.max_images && this.videos_cnt <= this.max_videos && this.video_array_size.length<1){
                if(this.photos_cnt==0 && this.videos_cnt==0){
                  this.upload_btn = false;
                }else{
                  this.upload_btn = true;
                }
              }else{
                this.upload_btn = false;
              } 
            }else{
              if(this.photos_cnt <= this.max_images && this.videos_cnt <= this.max_videos && this.video_array_size.length<1){
                if(this.photos_cnt==0 && this.videos_cnt==0){
                  this.upload_btn = false;
                }else{
                  this.upload_btn = true;
                }
              }else{
                this.upload_btn = false;
              } 
            }
            file_count++;
          };
          this.videos_cnt++;
        } 
        
      }

    }
    
    //console.log(this.video_array_size.length);
    
  }

  onProfileSubmit() {
    
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    //headers.set();
    formData.append('file', this.profileForm.get('fileSource').value);
    
    this.http.post('https://ibigo.shadowis.nl/server-api/api/user/update-background',formData,{headers:headers}).subscribe((data)=>{
      if(data['status']==true){
        this.toastrservice.Success(data['messages']);
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/home/business/profile']));
        //this.router.navigate(['/user/home']);
      }else{
        this.toastrservice.Error(data['messages']);
      }
    });
    
  }

  my_spot_data = [];
  onSelectFileForSpot(event){
    var file_count;
    var file_i;
    if(Math.max.apply(Math, this.files_spots.map(function(o) { return o.id; }))!='-Infinity'){
      file_i = Math.max.apply(Math, this.files_spots.map(function(o) { return o.id; })) + 1;
      file_count = Math.max.apply(Math, this.files_spots.map(function(o) { return o.id; })) + 1;
    }else{
      file_count = this.files_spots.length + 1;
      file_i = this.files_spots.length + 1;
    }
    for (var i = 0; i < event.target.files.length; i++) { 
        this.files_spots.push({id:file_i,file:event.target.files[i]});
        file_i++;
    }
    
    const files = event.target.files;
    if (files) {
      var i = this.files_spots.length+1;
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (file.type.indexOf("image") > -1) {
            this.my_spot_data.push({
              id:file_count,
              name: file.name,
              url:e.target.result,
              type: 'img'
            });
          } else if (file.type.indexOf("video") > -1) {
            this.my_spot_data.push({
              id:file_count,
              name: file.name,
              url:e.target.result,
              type: 'video'
            });
          }
          file_count++;
        };
        reader.readAsDataURL(file);
        
      }
    }
    
  }
  audio_files = [];
  myaudiodata = [];
  onAudioFileForSpot(event){
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
  onRemoveAudioFileForSpot(id){
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
  onRemoveFileForSpot(id){
    
    this.my_spot_data = this.my_spot_data.filter(function( obj ) {
      return obj.id !== id;
    });
    this.files_spots = this.files_spots.filter(function( obj ) {
      return obj.id !== id;
    }); 
  }
  tag_frd_id:any = [];
  share_frd_id:any = [];
  afiles = [];
  edit_post_id;
  is_post_edit = false;
  btnloading;

  onSubmit(){
    this.btnloading = true;
    //var spinner_icon = document.getElementById('spinner-icon');
    //var spinner_btn = document.getElementById('spinner-btn-modal') as HTMLButtonElement;
    //spinner_btn.disabled = true;
    //spinner_icon.classList.add('fa-spinner');
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    for (var i = 0; i < this.files_spots.length; i++) { 
      formData.append("file[]", this.files_spots[i].file);
    }
    for (var j = 0; j < this.audio_files.length; j++ )
    {
      formData.append("audio_file[]",this.audio_files[j])
    }
    formData.append('review', this.spotForm.get('review').value);
    formData.append('tag_friends', this.tag_frd_id);
    formData.append('share_friends', this.share_frd_id);
    var add_or_update;
    formData.append('spot_id', null);
    
    if(this.is_post_edit==true){
      
      add_or_update = 'update-checkin';
      formData.append('edit_post_id',this.edit_post_id);
      if(this.spot_dbfiles.length > 0){
        if(this.spot_dbfiles.length > 0)
        {
          this.spot_dbfiles.concat(this.afiles);
        }
        formData.append('db_files_array',this.spot_dbfiles.join(','));
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
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        var new_post = data['post']
        if(this.is_post_edit==false){
          new_post.forEach(new_p => {
            this.posts.unshift(new_p)
            this.post_length++;  
          });
        }else{
          var index = this.posts.findIndex(x => x.id ===parseInt(this.edit_post_id));
          if(index>-1){
            this.posts[index] = new_post[0];
          }
          this.is_post_edit = false;
          this.edit_post_id = null;
          this.spot_dbfiles = [];// error line
          this.afiles = [];
          this.my_spot_data= [];
          this.files_spots = [];
          this.mydata = [];
          this.files = [];
          this.photos_cnt = 0;
          this.videos_cnt = 0;
          this.spotForm.reset();
        }
        this.toastrservice.Success(data['message']);
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/home/business/profile']));
        var checkin_close_btn = document.getElementById('checkin-close-btn');
        checkin_close_btn.click();
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
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
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/home/business/profile']));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
  }
  spot_dbfiles =[];

  deletePost(post_id){
    if(confirm("Are you sure want to delete this post ?")) {
      const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
      this.http.get('https://ibigo.shadowis.nl/server-api/api/delete-checkin/'+post_id,{headers:headers}).subscribe((data)=>{
        if(data['status']==true){
          //this.toastrservice.Success(data['message']);
          this.posts = this.posts.filter(function( obj ) {
            return obj.id !== parseInt(post_id);
          });
        }else{
          this.toastrservice.Error(data['message']);
        }
      });
    }
  }

  clickEvent(post_id){
    var comments = document.getElementById('post-comment'+post_id);
    comments.classList.toggle('active');
  }

  onRemoveFileFromDBForSpot(fname){
    
    this.spot_dbfiles = this.spot_dbfiles.filter(function( obj ) {
      return obj !== fname;
    });    
  }

  onRemoveAudioFileFromDB(list){

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
        // this.posts.forEach(post => {
        //   if(post.id==pid){
        //     post.comments.push(data['comment'])
        //   }
        // });
        
        //this.toastrservice.Success(data['message']);
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/home/business/profile']));
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
          this.posts.forEach(post => {
            if(post.id==pid){
              post.comments = post.comments.filter(function( obj ) {
                return obj.id !== parseInt(cid);
              });
            }
          });
          //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/homepage']));
        }else{
          this.toastrservice.Error(data['message']);
        }
      });
    }
  }

  cancelPost(){
  }

  editPost(post_id){
    this.cancelPost();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    this.http.get('https://ibigo.shadowis.nl/server-api/api/edit-checkin/'+post_id,{headers:headers}).pipe(
      finalize(() => {
        var ele = document.getElementById('mycheckinbtn') as HTMLButtonElement;
        ele.click();
        // var bodyelement = document.getElementsByClassName('modal-open');
        // bodyelement[0].classList.add('my-extra-css');
      })
    ).subscribe((data)=>{
      
      if(data['status']==true){
        
        if(data['posts'].length > 0){
          this.is_post_edit = true;
          this.edit_post_id = data['posts'][0].id;
          this.spot_dbfiles = data['posts'][0].photos_videos;// error line
          this.afiles = data['posts'][0].audios;
          this.spotForm.patchValue({
            review:data['posts'][0].spot_description
          });
        }
        //this.toastrservice.Success(data['message']);
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/homepage']));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });

  }
}
