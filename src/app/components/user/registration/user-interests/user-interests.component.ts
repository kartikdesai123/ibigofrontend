import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserRegisterService } from 'src/app/service/user-register.service';
import { ToastrService } from 'src/app/toastr.service';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/service/user-login.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user-interests',
  templateUrl: './user-interests.component.html',
  styleUrls: ['./user-interests.component.css','../../../../../front-assets/css/bootstrap.min.css',
  '../../../../../front-assets/css/style.css',
  '../../../../../front-assets/css/responsive.css',
  '../../../../../front-assets/css/font-awesome.min.css',
  '../../../../../front-assets/css/owl-carousel.css',
  '../../../../../front-assets/css/pretty-checkbox.min.css','../../font-user.css']
})
export class UserInterestsComponent implements OnInit {

  constructor(private http:HttpClient,private router: Router ,private uls:UserLoginService,private ts :UserRegisterService,private formBuilder: FormBuilder,private toastrservice: ToastrService) { }
  interests = [];
  id:any;
  myarray:any = [];
  myDetails:any = {}
  user_profile:any;
  isloading =false;
  interestForm: FormGroup;
  submitted = false;
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

    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-interests').subscribe((data)=>{
      this.interests = data['interest_details'];
    });
    this.myDetails = JSON.parse(localStorage.getItem('users_details'));
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
    
    // stop here if form is invalid
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
    formData.append('password', this.myDetails.password);
    formData.append('email', this.myDetails.email);
    formData.append('gender',this.myDetails.gender);
    formData.append('user_interest',this.myarray);
    
    //formData.append('file', );
    // display form values on success
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.userForm.value.email, null, 4));
    this.http.post('https://ibigo.shadowis.nl/server-api/api/user/register',formData,{headers:headers}).pipe(
      finalize(() => {
        this.isloading = false;
      })).subscribe((data)=>{
      if(data['status']==true){
        this.toastrservice.Success(data['messages']);
        this.router.navigate(['/user/login']);
        localStorage.removeItem('users_details');
      }else{
        this.toastrservice.Error(data['messages']);
      }
    });
  }

}
