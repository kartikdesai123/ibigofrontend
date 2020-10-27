import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'src/app/toastr.service';
import { AddInterestService } from 'src/app/service/add-interest.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router }  from '@angular/router';
import { MustMatch } from 'src/app/helpers/must-match-validator';
import { DOCUMENT } from '@angular/common';
import { UserLoginService } from 'src/app/service/user-login.service';
import { UserRegisterService } from 'src/app/service/user-register.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.css','../../../../../front-assets/css/bootstrap.min.css',
  '../../../../../front-assets/css/style.css',
  '../../../../../front-assets/css/responsive.css',
  '../../../../../front-assets/css/font-awesome.min.css',
  '../../../../../front-assets/css/owl-carousel.css',
  '../../../../../front-assets/css/pretty-checkbox.min.css','../../font-user.css']
})
export class BusinessProfileComponent implements OnInit {
  myarray:any = [];
  interests = [];
  isloading =false;
  submitted = false;
  public active = 0;
  profileForm: FormGroup;
  myArray = [];
  errors =[];
  myDetails:any = {}
  user_fname : string;
  email : string;
  public imagePath;
  imgURL: any;
  myBusinessArray :any = {};
  public message: string;
  constructor(@Inject(DOCUMENT) private document: Document,private urs:UserRegisterService,private uls:UserLoginService,private router: Router,private http:HttpClient,private ts:AddInterestService, private formBuilder: FormBuilder,private toastrservice: ToastrService) { }

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

    this.myBusinessArray = JSON.parse(localStorage.getItem('testObject'));
    
    this.profileForm = this.formBuilder.group({
      file: new FormControl(),
      fileSource: new FormControl()
    })
    this.myDetails = JSON.parse(localStorage.getItem('business_users_details'))
    
    //this.user_fname = this.myArray['first_name'];
    this.email = this.myDetails['email'];
    this.user_fname = this.myBusinessArray['name'];
    this.urs.getpreviewddata().subscribe((file:any) => {
      if(file!='no data'){
        var reader = new FileReader();
        this.profileForm.patchValue({
          fileSource: file,
          file:file
        });
        reader.readAsDataURL(file);
        this.imgURL = reader.result;
        reader.onload = (_event) => { 
          this.imgURL = reader.result; 
        }
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
    this.urs.setpreviewdata(this.profileForm.get('fileSource').value)
  }

  get f() { return this.profileForm.controls; }

  onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.profileForm.invalid) {
        return;
    }
    this.urs.setpreviewdata(this.profileForm.get('fileSource').value)
    this.router.navigate(['/business/register/interests']);
  }
}
