import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'src/app/toastr.service';
import { finalize } from 'rxjs/operators';
import { UserLoginService } from 'src/app/service/user-login.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import {Title} from "@angular/platform-browser";



@Component({
  selector: 'app-spot-detail',
  templateUrl: './spot-detail.component.html',
  styleUrls: ['./spot-detail.component.css','../../../../front-assets/css/bootstrap.min.css',
  '../../../../front-assets/css/style.css',
  '../../../../front-assets/css/responsive.css',
  '../../../../front-assets/css/font-awesome.min.css',
  '../../../../front-assets/css/owl-carousel.css',
  '../../../../front-assets/css/pretty-checkbox.min.css','../font-user.css']
})
export class SpotDetailComponent implements OnInit {
  users_details = [];
  spot_details = [];
  about_submitted = false;
  interest_details = [];
  spot_videos = [];
  spot_photos = [];
  mydata = [];
  files = [];
  reviews = [];
  reviewForm: FormGroup;
  photovideoForm: FormGroup;
  commentForm : FormGroup;
  commentEditForm: FormGroup;
  first_name;
  full_address;
  last_name;
  age;
  spot_id;unique_spot_id;
  user_cover;
  logged_in_user_id;
  spot_interest_details = [];
  update_review = [];
  avg_rating;
  user_about;
  user_profile;
  reviews_count;
  spot_slug;
  is_connected_count;
  public imagePath;
  imgURL: any;
  friends = [];
  spot_name;
  spot_profile;
  dbfiles =[];
  photovideofiles= [];
  is_connected;
  is_liked;
  parking_details;
  is_edit;
  is_photovideoedit;
  liked_users = [];
  rating_users = [];
  invite_friends = [];
  business_details = [];
  invite_frd_id :any= [];
  photovideomydata = [];
  photovideodbfiles = [];  
  spot_videos_by_user = [];
  spot_photos_by_user = [];
  edit_photos_by_user = [];
  edit_videos_by_user = [];
  user_type;
  business_name;
  call_status : boolean;
  logged_in_user_unique_id;
  posts;
  loading :boolean = true;
  venue_id;
  user_name;
  four_square_api_photos = [];
  photos_extensions = ['png','jpeg','jpg','tiff','pjp','pjpeg','jfif','tif','gif','svg','bmp','svgz','webp','ico','xbm','dib'];
  video_extensions = ['mp4','ogm','wmv','mpg','webm','ogv','mov','asx','mpeg','m4v','avi'];
  logged_in_user : boolean;spot_type;
  constructor(private cd:ChangeDetectorRef,private titleService:Title,private formBuilder: FormBuilder,private us : UserLoginService,private route: ActivatedRoute,private http:HttpClient,private router:Router,private toastrservice: ToastrService) { 
    this.titleService.setTitle('IBIGO | Spot')
  }

  ngOnInit() {
    window.Echo.channel('all-post')
    .listen('CommentSent', (data) => {            
      //this.likes = data['likes']
      if(data['type']=='add'){
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
        this.onCancel(data['comment'].id);
      }else if(data['type']=='delete'){
        this.posts.forEach(post => {
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
      
      if (!this.destroyed) {
        this.cd.detectChanges();
      }
    });
    this.logged_in_user = this.us.isUserLoggedIn();
    this.unique_spot_id = this.route.snapshot.params.id;
    this.spot_slug = this.route.snapshot.params.slug;
    //const nid = this.route.snapshot.params.notification_id;
    var user_t = localStorage.getItem('user_type');
    
    let headers = new HttpHeaders();
    //this.router.navigate(['/spot-reviews/'+id]);
    if(user_t=='"normal"'){
      this.user_type= 'normal'; 
      headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
      this.router.navigate(['/spot/'+this.unique_spot_id+'/'+this.spot_slug]);
      this.http.get('https://ibigo.shadowis.nl/server-api/api/get-user',{headers:headers}).subscribe((data)=>{
        
        this.users_details = data['user_details'];
        this.logged_in_user_id = this.users_details['id'];
        
        this.logged_in_user_unique_id = this.users_details['unique_id'];
        
        this.first_name  = this.users_details['first_name'];
        this.last_name  = this.users_details['last_name'];
        this.user_name = this.first_name+' '+this.last_name;
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
    }else if(user_t=='"business"'){
      this.user_type= 'business'; 
      headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
      this.router.navigate(['/spot/'+this.unique_spot_id+'/'+this.spot_slug]);
      if(this.logged_in_user==true){
        this.http.get('https://ibigo.shadowis.nl/server-api/api/get-business-user',{headers:headers}).subscribe((data)=>{
          this.users_details = data['user_details'];
          this.logged_in_user_id = this.users_details['id'];
          this.logged_in_user_unique_id = this.users_details['unique_id'];
          this.business_details = data['business_details'];
          this.business_name  = this.business_details['business_name'];
          this.user_profile  = this.users_details['user_profile'];
          
          if(this.user_profile==null){
            this.user_profile = '/assets/front-assets/images/pic1.png';
          }else{
            this.user_profile = 'https://ibigo.shadowis.nl/server-api/public/user_profiles/'+this.users_details['user_profile'];
          }
        });
      }
    }
    
    

    this.http.get('https://ibigo.shadowis.nl/server-api/api/spot/'+this.unique_spot_id,{headers:headers}).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        
        this.spot_details = data['user_details'];
        this.spot_interest_details  = data['user_interests'];
        this.unique_spot_id  = this.spot_details['unique_id'];
        this.spot_slug  = this.spot_details['user_slug'];
        if(parseInt(this.unique_spot_id)==parseInt(this.logged_in_user_unique_id)){
          this.router.navigate(['/home/business/profile']);
        }else{
          this.router.navigate(['/spot/'+this.unique_spot_id+'/'+this.spot_slug]);
        }
        
        this.spot_photos = data['photos'];
        
        //edit_videos_by_user
        this.spot_videos = data['videos'];
        this.rating_users = data['rating_users'];
        this.reviews = data['reviews'];
        this.spot_photos_by_user = data['spot_photos_by_user'];        
        this.edit_photos_by_user = data['edit_photos_by_user'];
        this.edit_videos_by_user = data['edit_videos_by_user'];
        this.spot_videos_by_user = data['spot_videos_by_user'];        
        var logged_in_user_id = this.logged_in_user_id+'';
        if(this.logged_in_user){
          this.update_review = this.reviews.filter(function( obj ) {
            return obj.user_id === logged_in_user_id;
          });
          if(this.update_review.length > 0 ){
            this.is_edit =1;
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
          if(this.edit_photos_by_user.length > 0 || this.edit_videos_by_user.length > 0){
            this.is_photovideoedit = 1;
            this.photovideodbfiles = this.edit_photos_by_user;
            this.photovideodbfiles.push.apply(this.photovideodbfiles, this.edit_videos_by_user);
          }
        }
        this.liked_users = data['liked_users'];
        this.business_details = data['business_details'];
        this.parking_details = this.business_details['parking_details'];
        this.spot_name  = this.business_details['business_name'];
        this.spot_type  = this.business_details['business_type'];
        this.full_address  = this.business_details['full_address'];
        this.spot_id  = this.spot_details['id'];
        this.venue_id = this.business_details['place_id']
        if(this.venue_id){
          this.http.get('https://api.foursquare.com/v2/venues/'+this.venue_id+'/photos?client_id=IQVXPFHN5YKW1BXON50GW1YVVZ1VPUTGYZD1VCO1OSMF4DON&client_secret=IRTCUWTAWZC5LLFKGNO5VDJZWB451IC5E51TYHITPJS1XOHT&v=20200612').subscribe((data:any)=>{
            this.four_square_api_photos = data.response.photos.items;
            this.spot_photos.push.apply(this.spot_photos, this.four_square_api_photos);  
          });
          // this.four_square_api_photos = [{id: "52e16a5911d23b60bf6b29f5",prefix: "https://fastly.4sqi.net/img/general/",suffix: "/76918109_OoM0VDSzjbf94e3EmyByEAXAMjioHTDSA00h-MFDMrA.jpg",width: 5184,height: 3456}];
          // this.spot_photos.push.apply(this.spot_photos, this.four_square_api_photos);
          // console.log(this.spot_photos);
        }
        
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
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-spot-post/'+this.unique_spot_id,{headers:headers}).subscribe((data)=>{
        this.posts = data['posts'];        
        //  this.post_length = data['posts'].length;
        //this.posts = this.extra_posts.splice(0,3);      
      });
    this.reviewForm = this.formBuilder.group({
      rating: new FormControl(),
      review: new FormControl()
    });
    this.photovideoForm = this.formBuilder.group({});
    this.commentForm = this.formBuilder.group({
      comment: new FormControl(),
    });

    this.commentEditForm = this.formBuilder.group({
      comment: new FormControl(),
    });
  }

  private destroyed = false;
  spot_video_index;
  spot_photo_index;
  user_video_index;
  user_photo_index;
  ngOnDestroy() {
    this.destroyed = true;
  }
  openSpotPhotos(index){
    this.spot_photo_index = index;
    var element = document.getElementById('photos-gallery');
    element.classList.add('active');
  }
  openSpotVideos(index){
    this.spot_video_index = index;
    var element = document.getElementById('videos-gallery');
    element.classList.add('active');
  }
  openUserPhotos(index){
    this.user_photo_index = index;
    var element = document.getElementById('user-photos-gallery');
    element.classList.add('active');
  }
  
  openUserVideos(index){
    this.user_video_index = index;
    var element = document.getElementById('user-videos-gallery');
    element.classList.add('active');
  }
  closeSpotPhotos(){
    var element = document.getElementById('photos-gallery');
    element.classList.remove('active');
    var element_item = document.getElementsByClassName('item');
    for(var i=0;i<this.spot_photos.length-1;i++){
      element_item[i].classList.remove('active');
    }
  }
  closeUserVideos(){
    var element = document.getElementById('user-videos-gallery');
    element.classList.remove('active');
    var element_item = document.getElementsByClassName('item');
    for(var i=0;i<this.spot_videos_by_user.length-1;i++){
      element_item[i].classList.remove('active');
    }
  }
  closeSpotVideos(){
    var element = document.getElementById('videos-gallery');
    element.classList.remove('active');
    var element_item = document.getElementsByClassName('item');
    for(var i=0;i<this.spot_videos.length-1;i++){
      element_item[i].classList.remove('active');
    }
  }
  closeUserPhotos(){
    var element = document.getElementById('user-photos-gallery');
    element.classList.remove('active');
    var element_item = document.getElementsByClassName('item');
    for(var i=0;i<this.spot_photos_by_user.length-1;i++){
      element_item[i].classList.remove('active');
    }
  }

  openReviewModal(){
    if(this.logged_in_user==true){
      var mybtnforreview = document.getElementById('reviewModal');
      mybtnforreview.click();
    }else{
      this.router.navigate(['/user/login']);
    }
  }

  openPhotoVideoModal(){
    if(this.logged_in_user==true){
      var mybtnforreview = document.getElementById('photovideoModal');
      mybtnforreview.click();
    }else{
      this.router.navigate(['/user/login']);
    }
  }


  openModal(){
    if(this.logged_in_user==true){
      var mybtnformodal = document.getElementById('mybtnformodal');
      mybtnformodal.click();
    }else{
      this.router.navigate(['/user/login']);
    }
  }

  onLikeOrConnect(like_or_connect,spot_id){
    //const nid = this.route.snapshot.params.notification_id
    if(this.logged_in_user==true){
      if (like_or_connect=='like-spot'){
        if (this.is_liked==0){
          this.is_liked = 1;
        } else {
          this.is_liked = 0;
        }
      } else {
        if (this.is_connected==0){
          this.is_connected = 1;
        } else {
          this.is_connected = 0;
        }
      }
      const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
      this.http.get('https://ibigo.shadowis.nl/server-api/api/'+like_or_connect+'/'+spot_id,{headers:headers}).subscribe((data)=>{
        if(data['status']==true){
          //this.toastrservice.Success(data['message']);
          
          //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/spot/'+this.spot_id+'/'+this.spot_slug]));
          //this.router.navigate(['/user/home']);
        }else{
          this.toastrservice.Error(data['message']);
        }
      });
    }else{
      this.router.navigate(['/user/login']);
    }
    
    
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
    const nid = this.route.snapshot.params.notification_id
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
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/spot/'+this.unique_spot_id+'/'+this.spot_slug]));
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
    formData.append('spot_id', this.spot_id);
    for (var i = 0; i < this.files.length; i++) { 
      formData.append("file[]", this.files[i]);
    }
    var add_or_update;
    if(this.is_edit==1){
      add_or_update = 'update-review';
      if(this.dbfiles.length > 0){
        formData.append('db_files_array',this.dbfiles.join(','));
      }
    }else{
      add_or_update = 'add-review';
    }
    formData.append('review', this.reviewForm.get('review').value);
    formData.append('rating', this.reviewForm.get('rating').value);
    this.http.post('https://ibigo.shadowis.nl/server-api/api/'+add_or_update,formData,{headers:headers}).pipe(
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


  onPhotoVideo(){
    var review_icon = document.getElementById('review-icon');
    var review_btn = document.getElementById('review-btn') as HTMLButtonElement;
    review_btn.disabled =true;
    review_icon.classList.add('fa-spinner');
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    formData.append('spot_id', this.spot_id);
    for (var i = 0; i < this.photovideofiles.length; i++) { 
      formData.append("file[]", this.photovideofiles[i]);
    }
    var add_or_update;
    if(this.is_photovideoedit==1){
      add_or_update = 'update-spot-files';
      if(this.dbfiles.length > 0){
        formData.append('db_files_array',this.photovideodbfiles.join(','));
      }
    }else{
      add_or_update = 'add-spot-files';
    }
    this.http.post('https://ibigo.shadowis.nl/server-api/api/'+add_or_update,formData,{headers:headers}).pipe(
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

  onRemoveFileFromDB(fname){
    this.dbfiles = this.dbfiles.filter(function( obj ) {
      return obj !== fname;
    });    
  }

  onPhotosVideosRemoveFileFromDB(fname){
    this.photovideodbfiles = this.photovideodbfiles.filter(function( obj ) {
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
  onPhotoVideoRemoveFile(id){
    var obje;
    this.photovideomydata.filter(function( obj ) {
      obje = obj.name;
    });
    this.photovideomydata = this.photovideomydata.filter(function( obj ) {
      return obj.id !== id;
    });
    this.photovideofiles = this.photovideofiles.filter(function( obj ) {
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

  onPhotoVideoSelectFile(event){
    for (var i = 0; i < event.target.files.length; i++) { 
        this.photovideofiles.push(event.target.files[i]);
    }
    const files = event.target.files;
    if (files) {
      var i = this.photovideofiles.length+1;
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (file.type.indexOf("image") > -1) {
            this.photovideomydata.push({
              id:i,
              name: file.name,
              url:e.target.result,
              type: 'img'
            });
          } else if (file.type.indexOf("video") > -1) {
            this.photovideomydata.push({
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

  clickEvent(post_id){
    var comments = document.getElementById('post-comment'+post_id);
    comments.classList.toggle('active');
  }

  
  onCommentSubmit(pid){
    //var message= 'hi';
    // this.posts.forEach(post => {
    //         if(post.id==pid){
    //           post.comments.push(this.commentForm.get('comment').value)
    //         }
    //       });
    //       this.commentForm.reset();
    // this.pusherService.sendComment(this.commentForm.get('comment').value,pid)
    //   .subscribe(resp => {
    //     console.log(resp);
    //   }, err => {
        
    //  });
    
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

  onLike(post_id){
    if(this.logged_in_user==true){
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
          //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/spot/'+this.unique_spot_id+'/'+this.spot_slug]));
        }else{
          this.toastrservice.Error(data['message']);
        }
      });
    }else{
      this.router.navigate(['/user/login']);
    }
  }
}
