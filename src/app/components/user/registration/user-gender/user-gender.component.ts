import { Component, OnInit, Input } from '@angular/core';
import { UserRegisterService } from 'src/app/service/user-register.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/service/user-login.service';

@Component({
  selector: 'app-user-gender',
  templateUrl: './user-gender.component.html',
  styleUrls: ['./user-gender.component.css','../../../../../front-assets/css/bootstrap.min.css',
  '../../../../../front-assets/css/style.css',
  '../../../../../front-assets/css/responsive.css',
  '../../../../../front-assets/css/font-awesome.min.css',
  '../../../../../front-assets/css/owl-carousel.css',
  '../../../../../front-assets/css/pretty-checkbox.min.css','../../font-user.css']
})
export class UserGenderComponent implements OnInit {
  genderForm: FormGroup;
  submitted = false;
  myArray:any = {};
  storage:any = {};
  constructor(private ts: UserRegisterService,private uls:UserLoginService,private router: Router,private formBuilder: FormBuilder) { }
  
  ngOnInit() {
    if (this.uls.isUserLoggedIn) {
      const u_type = localStorage.getItem('user_type');
      if(localStorage.getItem('user_type')=='"normal"'){
        this.router.navigate(['/user/homepage']);
      }else if(localStorage.getItem('user_type')=='"business"'){
        this.router.navigate(['/home/business/profile']);
      }
    }
    this.genderForm = this.formBuilder.group({
      gender: new FormControl('', [Validators.required])
    })
    this.storage = localStorage.getItem('users_details');
    if(this.storage){
      this.genderForm.patchValue(JSON.parse(this.storage));
    }
  }

  get f() { return this.genderForm.controls; }

  onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.genderForm.invalid) {
        return;
    }
    this.myArray = JSON.parse(localStorage.getItem('users_details'));
    this.myArray.gender = this.genderForm.get('gender').value;
    localStorage.removeItem('user_details');
    localStorage.setItem('users_details',JSON.stringify(this.myArray));
    this.router.navigate(['/user/interests']);
  }

}
