import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { FormGroup, Validators, FormBuilder, FormControl, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'src/app/toastr.service';
import { finalize } from 'rxjs/operators';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/service/user-login.service';
@Component({
  selector: 'app-mobile-login',
  templateUrl: './mobile-login.component.html',
  styleUrls: ['./mobile-login.component.css','../../../../front-assets/css/bootstrap.min.css',
  '../../../../front-assets/css/style.css',
  '../../../../front-assets/css/responsive.css',
  '../../../../front-assets/css/font-awesome.min.css',
  '../../../../front-assets/css/owl-carousel.css',
  '../../../../front-assets/css/pretty-checkbox.min.css','../font-user.css']
})
export class MobileLoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  email:string;
  password:string;
  login_loading :boolean;
  signinForm: FormGroup;
  status:boolean = false;
  loggedIn: boolean;
  buttontext = 'GET OTP';
  SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.Netherlands,CountryISO.India];
	
  constructor(private ts:UserLoginService,private http:HttpClient,private router :Router,private formBuilder: FormBuilder,private toastrservice: ToastrService) { }
  getFormValidationErrors() {
    Object.keys(this.loginForm.controls).forEach(key => {
  
    const controlErrors: ValidationErrors = this.loginForm.get(key).errors;
    if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            //console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
    }
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
      mobile: new FormControl('', [Validators.required]),
      otp: new FormControl('')
    })
    this.loginForm.controls['otp'].disable();
  }

  onSubmit(){
    this.getFormValidationErrors();
    this.submitted = true;
    //this.getFormValidationErrors();
    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
    var formData = new FormData();
    formData.append('mobile',JSON.stringify(this.loginForm.get('mobile').value));
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.login_loading = true;
    if(this.status==false){
      this.sendOTP();
    }else if(this.status==true){
      formData.append('otp',this.loginForm.get('otp').value);
      this.http.post('https://ibigo.shadowis.nl/server-api/api/user/mobile/login',formData,{headers:headers}).pipe(
        finalize(() => {
          this.login_loading = false;
        })).subscribe((data:any)=>{
          if(data['status']==true){
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
            this.toastrservice.Error(data['message']);
          }
      });
    }
  }
  get f() { return this.loginForm.controls; }

  sendOTP(){
    this.getFormValidationErrors();
    this.submitted = true;
    //this.getFormValidationErrors();
    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
    var formData = new FormData();
    formData.append('mobile',JSON.stringify(this.loginForm.get('mobile').value));
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    if(this.buttontext = 'GET OTP'){
      this.login_loading = true;
    }
    this.http.post('https://ibigo.shadowis.nl/server-api/api/user/mobile/login',formData,{headers:headers}).pipe(
        finalize(() => {
            this.login_loading = false;
        })).subscribe((data)=>{
          const otp = this.loginForm.get('otp');
          if(data['status']==true){
            this.status = true;
            //[Validators.required, Validators.maxLength(6),Validators.minLength(6)]]
            this.submitted = false;
            otp.setValidators([Validators.minLength(6),Validators.required,Validators.maxLength(6),Validators.pattern("^[0-9]*$")]);
            
            otp.updateValueAndValidity();
            this.loginForm.controls['otp'].enable();
            this.buttontext = 'Inloggen';
            this.toastrservice.Success(data['message']);
          }else{
            this.toastrservice.Error(data['message']);
          }
      });
  }
}
