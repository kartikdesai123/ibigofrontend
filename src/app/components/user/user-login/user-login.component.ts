import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserLoginService } from 'src/app/service/user-login.service';
import { ToastrService } from 'src/app/toastr.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import {
  AuthService,
  FacebookLoginProvider,
} from 'angular-6-social-login';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css',
  '../../../../front-assets/css/bootstrap.min.css',
  '../../../../front-assets/css/style.css',
  '../../../../front-assets/css/responsive.css',
  '../../../../front-assets/css/font-awesome.min.css',
  '../../../../front-assets/css/owl-carousel.css',
  '../../../../front-assets/css/pretty-checkbox.min.css','../font-user.css'
  ]
})

export class UserLoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  email:string;
  password:string;
  login_loading :boolean;
  signinForm: FormGroup;
  loggedIn: boolean;
  constructor(private socialAuthService: AuthService,private router :Router,private http:HttpClient,private ts:UserLoginService,private formBuilder: FormBuilder,private toastrservice: ToastrService) { }
  
  ngOnInit() {
    if (this.ts.isUserLoggedIn) {
      const u_type = localStorage.getItem('user_type');
      if(localStorage.getItem('user_type')=='"normal"'){
        this.router.navigate(['/user/homepage']);
      }else if(localStorage.getItem('user_type')=='"business"'){
        this.router.navigate(['/home/business/profile']);
      }
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  get f() { return this.loginForm.controls; }

  public socialSignIn(socialPlatform : string) {
    let socialPlatformProvider;
    if(socialPlatform == "facebook"){
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    }
    
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        //console.log(socialPlatform+" sign in data : " , userData);
        // Now sign-in with userData
        const formData = new FormData();
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        //headers.set();
        formData.append('email',userData.email);
        formData.append('id',userData.id);
        formData.append('name',userData.name);
        formData.append('image',userData.image);
        this.http.post('https://ibigo.shadowis.nl/server-api/api/facebook/login',formData,{headers:headers}).subscribe((facebookdata:any)=>{
        
        if(facebookdata['status']==true){
          //this.toastrservice.Success(facebookdata['message']);
          
          if(facebookdata.user_type == 'normal'){
            localStorage.setItem('first_name',JSON.stringify(facebookdata.first_name));
            localStorage.setItem('last_name',JSON.stringify(facebookdata.last_name));
            localStorage.setItem('user_type',JSON.stringify(facebookdata.user_type));
            localStorage.setItem('client_profile',JSON.stringify(facebookdata.user_profile));
            localStorage.setItem('client_token',JSON.stringify(facebookdata.token));
            this.router.navigate(['/user/homepage']);
          }
        }else{
          this.toastrservice.Error(facebookdata['message']);
        }
      });
        // ...
            
      }
    );
  }

  onSubmit() {
  	this.submitted = true;
  	if (this.loginForm.invalid) {
        return;
    }
    this.login_loading = true;
    this.ts.login(this.loginForm.value.email,this.loginForm.value.password).pipe(
      finalize(() => {
        this.login_loading = false;
      })).subscribe((data)=>{
      if(data.status==true){
        
        if(data.user_type == 'normal'){
          localStorage.setItem('first_name',JSON.stringify(data.first_name));
          localStorage.setItem('last_name',JSON.stringify(data.last_name));
          localStorage.setItem('user_type',JSON.stringify(data.user_type));
          localStorage.setItem('client_profile',JSON.stringify(data.user_profile));
          localStorage.setItem('client_token',JSON.stringify(data.token));
          this.router.navigate(['/user/homepage']);
        }else{
          localStorage.setItem('first_name',JSON.stringify(data.first_name));
          localStorage.setItem('last_name',JSON.stringify(data.last_name));
          localStorage.setItem('user_type',JSON.stringify(data.user_type));
          localStorage.setItem('client_profile',JSON.stringify(data.user_profile));
          localStorage.setItem('client_token',JSON.stringify(data.token));
          this.router.navigate(['/home/business/profile']);
        }
      }else{
        this.toastrservice.Error(data.message);
      }
    });
  }

}
