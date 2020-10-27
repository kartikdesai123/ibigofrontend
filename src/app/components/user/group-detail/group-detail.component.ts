import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserLoginService } from 'src/app/service/user-login.service';
import { ToastrService } from 'src/app/toastr.service';
import { group } from 'console';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css','../../../../front-assets/css/bootstrap.min.css',
  '../../../../front-assets/css/style.css',
  '../../../../front-assets/css/responsive.css',
  '../../../../front-assets/css/font-awesome.min.css',
  '../../../../front-assets/css/owl-carousel.css',
  '../../../../front-assets/css/pretty-checkbox.min.css','../font-user.css']
})
export class GroupDetailComponent implements OnInit {
  groupProfileForm : FormGroup;
  public imagePath;
  imgURL: any;
  user_cover;
  profile_loading:boolean=false;
  unique_id;
  user_slug;
  loading;
  logged_in_user;
  group_details :any= {};
  group_status:any= {};
  users_details = [];
  logged_in_user_unique_id;
  logged_in_user_id;
  another_friends= [];
  commentForm : FormGroup;
  commentEditForm : FormGroup;
  users_requests= [];
  group_members = [];
  photos_extensions = ['png','jpeg','jpg','tiff','pjp','pjpeg','jfif','tif','gif','svg','bmp','svgz','webp','ico','xbm','dib'];
  video_extensions = ['mp4','ogm','wmv','mpg','webm','ogv','mov','asx','mpeg','m4v','avi'];
  group_invite_friends = [];
  group_id;
  extra_posts=[];
  posts = [];
  call_status:boolean;
  user_name;
  user_profile;
  post_length;
  user_type
  group_invite_frd_id : any= [];
  constructor(private cd:ChangeDetectorRef,private toastrservice:ToastrService,private us:UserLoginService,private router:Router,private http:HttpClient,private formBuilder:FormBuilder,private route :ActivatedRoute) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
    });
    this.loading = true;
    this.unique_id = this.route.snapshot.params.id;
    this.user_slug = this.route.snapshot.params.slug;
    this.logged_in_user = this.us.isUserLoggedIn();
    
    var user_t = localStorage.getItem('user_type');
    if(user_t=='"normal"'){
      this.user_type = 'normal';
    }else if(user_t=='"business"'){
      this.user_type = 'business';
    }
    //this.logged_in_user_unique_id = this.us.getIdOfLoggedInUser().subscribe();
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
    
    let headers = new HttpHeaders();
    if(this.logged_in_user==true){
      headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
      this.http.get('https://ibigo.shadowis.nl/server-api/api/get-user',{headers:headers}).subscribe((data)=>{
        this.users_details = data['user_details'];
        this.user_name = this.users_details['first_name']+' '+this.users_details['last_name'];
        this.logged_in_user_id = this.users_details['id'];
        this.user_profile  = this.users_details['user_profile'];
        this.user_cover  = this.users_details['user_cover'];
        if(this.user_profile==null){
          this.user_profile = '/assets/front-assets/images/pic1.png';
        }else{
          this.user_profile = 'https://ibigo.shadowis.nl/server-api/public/user_profiles/'+this.users_details['user_profile'];
        }
        // if(this.unique_id==this.logged_in_user_unique_id){
        //   this.router.navigate(['/user/updateprofile']);
        // }
      });
      this.http.get('https://ibigo.shadowis.nl/server-api/api/invite-list-friend-for-group/'+this.unique_id,{headers:headers}).subscribe((data)=>{      
        this.another_friends = data['friend_list'];
      });
    }
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-group/'+this.unique_id,{headers:headers}).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((data)=>{
      this.group_members = data['group_members'];
      this.users_requests = data['users_requests'];
      this.group_status = data['group_status'];
      this.group_details = data['group_details'];      
      this.group_id = this.group_details.id;
      this.http.get('https://ibigo.shadowis.nl/server-api/api/get-group-posts/'+this.group_id,{headers:headers}).subscribe((data)=>{    
        this.posts = data['posts'];
      })
      if(this.group_details.group_profile!=null){
        this.imgURL = 'https://ibigo.shadowis.nl/server-api/public/user_profiles/'+this.group_details.group_profile;
      }
    });
    
    this.groupProfileForm = this.formBuilder.group({
      file: new FormControl(),
      fileSource: new FormControl()
    });
    
    this.spotForm = this.formBuilder.group({
      review: new FormControl()
    });
    this.commentForm = this.formBuilder.group({
      comment: new FormControl(),
    });

    this.commentEditForm = this.formBuilder.group({
      comment: new FormControl(),
    });
    var element = document.getElementById('group-friend-tag-text');
    var element2 = document.getElementById('group-tagged');
    if(this.group_invite_friends.length > 0){
      element.classList.remove('hidden');
      element2.classList.remove('hidden');
    }else{
      element.classList.add('hidden');
      element2.classList.add('hidden');
    }
  }

  private destroyed = false;

  ngOnDestroy() {
    this.destroyed = true;
  }

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
  onLike(post_id){
    if(this.logged_in_user==false){
      this.router.navigate(['/user/login']);
    }else{
      if(this.user_type=='normal'){
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
  

  preview(files) {
    if (files.length === 0)
      return;
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    const file = files[0]; 
    this.groupProfileForm.patchValue({
      fileSource: file,
      file:file
    });
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
    var element = document.getElementById('imageupload');
    element.classList.remove("hidden");
  }


  onProfileSubmit() {
    this.profile_loading = true;
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    //headers.set();
    formData.append('file', this.groupProfileForm.get('fileSource').value);
    
    this.http.post('https://ibigo.shadowis.nl/server-api/api/group/update-background/'+this.group_details.id,formData,{headers:headers}).subscribe((data)=>{
      if(data['status']==true){        
        this.profile_loading = false;
        var element = document.getElementById('imageupload');
        element.classList.add("hidden");
        this.toastrservice.Success(data['messages']);
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/home/business/profile']));
        //this.router.navigate(['/user/home']);
      }else{
        //this.toastrservice.Error(data['messages']);
      }
    });
    
  }

  addGroupTaglist(userid){
    var index = this.another_friends.findIndex(x => x.id ===userid);
    this.group_invite_friends.push(this.another_friends[index]);
    this.group_invite_frd_id.push(userid);
    this.another_friends = this.another_friends.filter(function( obj ) {
      return obj.id !== userid;
    });
    
    var element = document.getElementById('group-friend-tag-text');
    var element2 = document.getElementById('group-tagged');
    if(this.group_invite_friends.length > 0){
      element.classList.remove('hidden');
      element2.classList.remove('hidden');
    }else{
      element.classList.add('hidden');
      element2.classList.add('hidden');
    }
  }
  
  removeGroupFromTagList(user_id){
    var index = this.group_invite_friends.findIndex(x => x.id ===user_id);
    this.another_friends.push(this.group_invite_friends[index]);    
    var tag_index = this.group_invite_frd_id.indexOf(user_id);
    if (tag_index > -1) {
      this.group_invite_frd_id.splice(tag_index, 1);
    }
    this.group_invite_friends = this.group_invite_friends.filter(function( obj ) {
      return obj.id !== user_id;
    });
    var element = document.getElementById('group-friend-tag-text');
    var element2 = document.getElementById('group-tagged');
    if(this.group_invite_friends.length > 0){
      element.classList.remove('hidden');
      element2.classList.remove('hidden');
    }else{
      element.classList.add('hidden');
      element2.classList.add('hidden');
    }
  }

  onSubmit(){
    this.profile_loading = true;
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Accept', 'application/json');
    formData.append('group_id', this.group_details.id);
    formData.append('invite_frd_id', this.group_invite_frd_id);
    this.http.post('https://ibigo.shadowis.nl/server-api/api/invite-to-group',formData,{headers:headers}).pipe(
      finalize(() => {
        this.profile_loading = false;
        var bodyelement = document.getElementsByClassName('modal-open');
        bodyelement[0].classList.add('my-extra-css');
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        this.toastrservice.Success(data['message']);
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/group/'+this.unique_id+'/'+this.user_slug]));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
  }
  status:boolean=false;
  rejectRequest(){    
    this.status = true;
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Accept', 'application/json');
    this.http.get('https://ibigo.shadowis.nl/server-api/api/reject-group-invitation/'+this.group_id,{headers:headers}).pipe(
      finalize(() => {
        this.status = false;
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        //this.toastrservice.Success(data['message']);
        this.group_status.invited = null;
        this.group_status.requested = "0";
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/group/'+this.unique_id+'/'+this.user_slug]));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });

  }

  confirmRequest(){
    this.status = true;
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Accept', 'application/json');
    this.http.get('https://ibigo.shadowis.nl/server-api/api/confirm-group-invitation/'+this.group_id,{headers:headers}).pipe(
      finalize(() => {
        this.status = false;
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        ///this.toastrservice.Success(data['message']);
        this.group_status.invited = "0";
        this.group_status.requested = null;
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/group/'+this.unique_id+'/'+this.user_slug]));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
  }
  
  leaveGroup(){
    this.status = true;
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Accept', 'application/json');
    this.http.get('https://ibigo.shadowis.nl/server-api/api/leave-group/'+this.group_id,{headers:headers}).pipe(
      finalize(() => {
        this.status = false;
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        //this.toastrservice.Success(data['message']);
        this.group_status.invited = null;
        this.group_status.requested = "0";
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/group/'+this.unique_id+'/'+this.user_slug]));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
  }
  
  cancelRequest(){
    this.status = true;
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Accept', 'application/json');
    this.http.get('https://ibigo.shadowis.nl/server-api/api/cancel-group-request/'+this.group_id,{headers:headers}).pipe(
      finalize(() => {
        this.status = false;
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        this.group_status.invited = null;
        this.group_status.requested = "0";
        //this.toastrservice.Success(data['message']);
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/group/'+this.unique_id+'/'+this.user_slug]));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
  }

  joinGroup(){
    this.status = true;
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Accept', 'application/json');
    this.http.get('https://ibigo.shadowis.nl/server-api/api/join-group/'+this.group_id,{headers:headers}).subscribe((data)=>{
      if(data['status']==true){
        this.status = false;
        if(this.group_status){
          this.group_status.invited = null;
          this.group_status.requested = "1";
        }else{
          this.group_status = {invited:null,requested:"1"};          
        }
        //this.toastrservice.Success(data['message']);
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/group/'+this.unique_id+'/'+this.user_slug]));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
  }
  tag_frd_id:any = [];
  share_frd_id:any = [];
  afiles = [];
  edit_post_id;
  is_post_edit = false;
  btnloading;
  spotForm: FormGroup;
  files_spots=[];
  spot_dbfiles =[];
  audio_files = [];

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
  myaudiodata = [];
  my_spot_data = [];
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
  onPostSubmit(){
    this.btnloading = true;
    //var spinner_icon = document.getElementById('spinner-icon');
    var spinner_btn = document.getElementById('spinner-btn-modal') as HTMLButtonElement;
    spinner_btn.disabled = true;
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
    formData.append('group_id', this.group_id);
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
        //var spinner_icon = document.getElementById('spinner-icon');
        var spinner_btn = document.getElementById('spinner-btn-modal') as HTMLButtonElement;
        spinner_btn.disabled = false;
        //spinner_icon.classList.remove('fa-spinner');
        var bodyelement = document.getElementsByClassName('modal-open');
        bodyelement[0].classList.add('my-extra-css');
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        //this.toastrservice.Success(data['message']);
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/group/'+this.unique_id+'/'+this.user_slug]));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
  }

  editPost(post_id){
    
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
}
