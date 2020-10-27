import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/service/user-login.service';
import { UserRegisterService } from 'src/app/service/user-register.service';
import { ToastrService } from 'src/app/toastr.service';

@Component({
  selector: 'app-business-interests',
  templateUrl: './business-interests.component.html',
  styleUrls: ['./business-interests.component.css','../../../../../front-assets/css/bootstrap.min.css',
  '../../../../../front-assets/css/style.css',
  '../../../../../front-assets/css/responsive.css',
  '../../../../../front-assets/css/font-awesome.min.css',
  '../../../../../front-assets/css/owl-carousel.css',
  '../../../../../front-assets/css/pretty-checkbox.min.css','../../font-user.css']
})
export class BusinessInterestsComponent implements OnInit {

  constructor(private http:HttpClient,private router: Router ,private uls:UserLoginService,private ts :UserRegisterService,private formBuilder: FormBuilder,private toastrservice: ToastrService) { }
  interests = [];
  id:any;
  myarray:any = [];
  myDetails:any = {}
  user_profile:any;
  isloading =false;
  interestForm: FormGroup;
  myBusinessArray :any = {};
  submitted = false;
  ngOnInit() {
    if (this.uls.isUserLoggedIn) {
      const u_type = localStorage.getItem('user_type');
      //alert(u_type);
      if(localStorage.getItem('user_type')=='"normal"'){
        this.router.navigate(['/user/homepage']);
      }else if(localStorage.getItem('user_type')=='"business"'){
        this.router.navigate(['/business/homepage']);
      }
    }

    this.myBusinessArray = JSON.parse(localStorage.getItem('testObject'));
    
    this.myDetails = JSON.parse(localStorage.getItem('business_users_details'))

    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-interests').subscribe((data)=>{
      this.interests = data['interest_details'];
    });
    
    this.interestForm = this.formBuilder.group({});
    this.ts.getpreviewddata().subscribe((file) => {
      this.user_profile = file;
      //console.log(this.user_profile);
    });
    

  }

  selectInterest(id){
  
    if(this.myarray.includes(id)==false){
      this.myarray.push(id);
    }else{  
      const index = this.myarray.indexOf(id);
      if (index > -1) {
        this.myarray.splice(index, 1);
      }
    }
    
  }

  onSubmit() {
    this.submitted = true;
    if (this.interestForm.invalid) {
        return;
    }
    this.isloading = true;
    const formData = new FormData();
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    //headers.set();
    formData.append('file',this.user_profile);
    formData.append('first_name', this.myDetails.first_name);
    formData.append('last_name', this.myDetails.last_name);
    formData.append('birth_date', this.myDetails.birth_date);
    formData.append('mobile', JSON.stringify(this.myDetails.mobile));
    formData.append('email', this.myDetails.email);
    formData.append('gender',this.myDetails.gender);
    formData.append('password', this.myDetails.password);
    formData.append('user_interest',this.myarray);
    var exists = 'categories';
    
    if(exists in this.myBusinessArray){
      formData.append('full_address',this.myBusinessArray.location.formattedAddress.join(', '));
      //formData.append('business_status',this.myBusinessArray.business_status);
      formData.append('latitude',this.myBusinessArray.location.lat);
      formData.append('longitude',this.myBusinessArray.location.lng);
      
      //formData.append('phone_number',this.myBusinessArray.formatted_phone_number);
      formData.append('business_name',this.myBusinessArray.name);
      formData.append('place_id',this.myBusinessArray.id);
      formData.append('rating',this.myBusinessArray.rating);
      formData.append('user_ratings_total',this.myBusinessArray.ratingSignals);
    }else{
      formData.append('phone_number',this.myBusinessArray.formatted_phone_number);
      formData.append('business_name',this.myBusinessArray.name);
      formData.append('full_address',this.myBusinessArray.formatted_address);
      var eventlist = JSON.stringify(localStorage.getItem('business_type'));
      var eventstring = new String();
      eventstring = eventlist.toString().replace(/"/g, "");
      formData.append('business_type',eventstring.replace(/\\/g, ''));
    }
    
    this.http.post('https://ibigo.shadowis.nl/server-api/api/business/register',formData,{headers:headers}).pipe(
      finalize(() => {
        this.isloading = false;
      })).subscribe((data)=>{
      if(data['status']==true){
        this.toastrservice.Success(data['messages']);
        this.router.navigate(['/user/login']);
        this.ts.setpreviewdata('no data');
        localStorage.removeItem('business_users_details');
        localStorage.removeItem('testObject');
        localStorage.removeItem('spot_details');
        localStorage.removeItem('business_type');
      }else{
        this.toastrservice.Error(data['messages']);
      }
    });
  }
  

}
