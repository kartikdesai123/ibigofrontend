import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'src/app/toastr.service';
import { AddInterestService } from 'src/app/service/add-interest.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router }  from '@angular/router';
import { MustMatch } from 'src/app/helpers/must-match-validator';
import { DOCUMENT } from '@angular/common';
import { UserLoginService } from 'src/app/service/user-login.service';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-business-register',
  templateUrl: './business-register.component.html',
  styleUrls: ['./business-register.component.css','../../../../../front-assets/css/bootstrap.min.css',
  '../../../../../front-assets/css/style.css',
  '../../../../../front-assets/css/responsive.css',
  '../../../../../front-assets/css/font-awesome.min.css',
  '../../../../../front-assets/css/owl-carousel.css',
  '../../../../../front-assets/css/pretty-checkbox.min.css','../../font-user.css']
})
export class BusinessRegisterComponent implements OnInit {
  myarray:any = [];
  interests = [];
  userForm: FormGroup;
  submitted = false;
  public active = 0;
  storage :any ={};
  errors =[];
  SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.Netherlands,CountryISO.India];
  constructor(private router: Router,private http:HttpClient,private uls:UserLoginService,private ts:AddInterestService, private formBuilder: FormBuilder,private toastrservice: ToastrService) { }

  ngOnInit() {
    if (this.uls.isUserLoggedIn) {
      const u_type = localStorage.getItem('user_type');
      //alert(u_type);
      if(localStorage.getItem('user_type')=='"normal"'){
        this.router.navigate(['/user/homepage']);
      }else if(localStorage.getItem('user_type')=='"business"'){
        this.router.navigate(['/home/business/profile']);
      }
    }

    this.userForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl(''),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      password_confirmation: ['', Validators.required],
      terms_condition: new FormControl(false,[Validators.requiredTrue]),
      receive_email: new FormControl()
    }, {
      validator: MustMatch('password', 'password_confirmation')
    })
    this.storage = JSON.parse(localStorage.getItem('business_users_details'));
    if(this.storage){
      var mobile = this.storage.mobile;
      delete this.storage.mobile;
      this.userForm.patchValue(this.storage);
      this.userForm.patchValue({'mobile':mobile['number']});
    }
  }

  get f() { return this.userForm.controls; }

  onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.userForm.invalid) {
        return;
    }
    this.errors = [];
    const formData = new FormData();
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    formData.append('email', this.userForm.get('email').value);
    
    
    this.http.post('https://ibigo.shadowis.nl/server-api/api/user/check-email',formData,{headers:headers}).subscribe((data)=>{
      if(data['status']==true){
        //this.toastrservice.Success(data['messages']);
        let Form = JSON.stringify(this.userForm.value);
        localStorage.setItem('business_users_details',Form);
        this.router.navigate(['/business/register/profile']);
      }else{
        //this.toastrservice.Error(data['message']);
        this.errors.push(data['message']);
      }
    });

    
    
    
    
  }
}
