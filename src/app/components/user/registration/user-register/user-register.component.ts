import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'src/app/toastr.service';
import { AddInterestService } from 'src/app/service/add-interest.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router }  from '@angular/router';
import { MustMatch } from 'src/app/helpers/must-match-validator';
import { DOCUMENT } from '@angular/common';
import { UserLoginService } from 'src/app/service/user-login.service';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css',
  '../../../../../front-assets/css/bootstrap.min.css',
  '../../../../../front-assets/css/style.css',
  '../../../../../front-assets/css/responsive.css',
  '../../../../../front-assets/css/font-awesome.min.css',
  '../../../../../front-assets/css/owl-carousel.css',
  '../../../../../front-assets/css/pretty-checkbox.min.css','../../font-user.css'
  ]
})
export class UserRegisterComponent implements OnInit {
  myarray:any = [];
  interests = [];
  userForm: FormGroup;
  submitted = false;
  public active = 0;
  storage : any ={};
  errors = [];  
  birthdate;
  SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  selectedCountry;
	preferredCountries: CountryISO[] = [CountryISO.Netherlands,CountryISO.India];
	
  constructor(@Inject(DOCUMENT) private document: Document,private uls:UserLoginService,private router: Router,private http:HttpClient,private ts:AddInterestService, private formBuilder: FormBuilder,private toastrservice: ToastrService) { }

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
      fakeusernameremembered: new FormControl(),
      fakepasswordremembered: new FormControl(),
      first_name:  new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl(''),
      birth_date: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      password_confirmation: ['', Validators.required],
      terms_condition: new FormControl('', [Validators.required]),
      receive_email: new FormControl()
    }, {
      validator: MustMatch('password', 'password_confirmation')
    });
    //this.userForm.get('password').
    this.storage = JSON.parse(localStorage.getItem('users_details'));
    if(this.storage){
      var mobile = this.storage.mobile;
      delete this.storage.mobile;
      this.userForm.patchValue(this.storage);
      this.userForm.patchValue({'mobile':mobile['number']});
      let t = new Date(this.storage['birth_date']);
      this.birthdate = `${String(t.getDate()).padStart(2, '0')}-${String(t.getMonth() + 1).padStart(2, '0')}-${t.getFullYear()}`;
      var date = `${String(t.getDate()).padStart(2, '0')}-${String(t.getMonth() + 1).padStart(2, '0')}-${t.getFullYear().toString().substr(-2)}`;
      this.userForm.patchValue({'birth_date':date});
      this.selectedCountry = mobile['countryCode'].toLowerCase();
    }
    
  }

  getFormValidationErrors() {
    Object.keys(this.userForm.controls).forEach(key => {
  
    const controlErrors: ValidationErrors = this.userForm.get(key).errors;
    if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            //console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
    }
    
  get f() { return this.userForm.controls; }
  
  dateCreated(event){   
      // if(event){
      //   if(this.userForm.get('birth_date').errors){
      //     if((event!='Invalid Date' && this.userForm.get('birth_date').errors['required']!=true)){
          let t = new Date(event.toJSON().split('T')[0]);
          //this.birthdate = t.setDate(t.getDate() + 1);
          this.birthdate = new Date(t).toLocaleDateString();
          this.birthdate = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
          
    //     }    
    //   }
    // }
    //console.log(this.userForm.get('birth_date'));
    
  } 
  onSubmit() {
    this.submitted = true;
    //this.getFormValidationErrors();
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
        //this.userForm.patchValue({birthdate:this.birthdate});
        this.userForm.patchValue({birth_date:this.birthdate});
        
        let Form = JSON.stringify(this.userForm.value);
        
        localStorage.setItem('users_details',Form);
        this.router.navigate(['/user/profile']);
      }else{
        
        this.errors.push(data['message']);
      }
    });
  }
}
