import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'src/app/toastr.service';
import { AddInterestService } from 'src/app/service/add-interest.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserRegisterService } from '../../../../service/user-register.service';
import { UserLoginService } from 'src/app/service/user-login.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css','../../../../../front-assets/css/bootstrap.min.css',
  '../../../../../front-assets/css/style.css',
  '../../../../../front-assets/css/responsive.css',
  '../../../../../front-assets/css/font-awesome.min.css',
  '../../../../../front-assets/css/owl-carousel.css',
  '../../../../../front-assets/css/pretty-checkbox.min.css','../../font-user.css']
})
export class UserProfileComponent implements OnInit {
  
  profileForm: FormGroup;
  myArray = [];
  submitted = false;
  user_fname : string;
  email : string;
  public imagePath;
  imgURL: any;
  public message: string;

  constructor(private router: Router,private http:HttpClient,private uls:UserLoginService,private ts:UserRegisterService, private formBuilder: FormBuilder,private toastrservice: ToastrService) { }

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

    this.profileForm = this.formBuilder.group({
      file: new FormControl(),
      fileSource: new FormControl()
    })
    this.myArray = JSON.parse(localStorage.getItem('users_details'))
    
    this.user_fname = this.myArray['first_name'];
    this.email = this.myArray['email'];
    this.ts.getpreviewddata().subscribe((file:any) => {
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
  }

  get f() { return this.profileForm.controls; }

  onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.profileForm.invalid) {
        return;
    }
    
    this.ts.setpreviewdata(this.profileForm.get('fileSource').value)
    this.router.navigate(['/user/gender']);
  }

}
