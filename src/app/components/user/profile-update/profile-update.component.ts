import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'src/app/toastr.service';
import { Router } from '@angular/router';
import { UserHomeServiceService } from 'src/app/service/user-home-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css','../../../../front-assets/css/bootstrap.min.css',
  '../../../../front-assets/css/style.css',
  '../../../../front-assets/css/responsive.css',
  '../../../../front-assets/css/font-awesome.min.css',
  '../../../../front-assets/css/owl-carousel.css',
  '../../../../front-assets/css/pretty-checkbox.min.css','../font-user.css']
})
export class ProfileUpdateComponent implements OnInit {
  users_details = [];
  about_submitted = false;
  interest_details = [];
  liked_places = [];
  review_places=[];
  first_name;
  last_name;
  age;
  user_cover;
  profileForm: FormGroup;
  loading:boolean = true;
  user_about;
  user_profile;
  spot_photos_by_user=[];
  spot_videos_by_user=[];
  friends_count;
  review_count;
  public imagePath;
  unique_id;
  user_slug;
  imgURL: any;
  constructor(@Inject(DOCUMENT) private document: Document,private http:HttpClient,private router:Router,private ts : UserHomeServiceService,private formBuilder: FormBuilder,private toastrservice: ToastrService) { }

  ngOnInit() {
    var user_t = localStorage.getItem('user_type');
    if(user_t=='"normal"'){
      this.router.navigate(['/user/updateprofile']);
    }else if(user_t=='"business"'){
      this.router.navigate(['/home/business/profile']);
    }
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-update-user',{headers:headers}).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((data)=>{
      this.spot_photos_by_user = data['spot_photos_by_user'];
      this.spot_videos_by_user = data['spot_videos_by_user'];
      this.users_details = data['user_details'];
      this.unique_id = this.users_details['unique_id'];
      this.user_slug = this.users_details['user_slug'];
      
      this.friends_count = data['friends_count'];
      this.review_count = data['review_count'];
      this.liked_places = data['liked_places'];
      this.review_places = data['review_places'];
      this.first_name  = this.users_details['first_name'];
      this.last_name  = this.users_details['last_name'];
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
      if(this.users_details['age'] != '0'){
        this.age  = this.users_details['age']+' yr. Zwolle';
      }else{
        this.age  = '';
      }
      this.user_cover  = this.users_details['user_cover'];
      this.interest_details  = data['user_interests'];
      this.user_about  = this.users_details['user_about'];
      if(this.user_cover==null){
        this.imgURL = '/assets/front-assets/images/group-bg2.png';
      }else{
        this.imgURL = 'https://ibigo.shadowis.nl/server-api/public/user_cover/'+this.user_cover;
      }
      
    });

    this.profileForm = this.formBuilder.group({
      file: new FormControl(),
      fileSource: new FormControl()
    })  
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
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/updateprofile']));
        //this.router.navigate(['/user/home']);
      }else{
        this.toastrservice.Error(data['messages']);
      }
    });
    
  }

}
