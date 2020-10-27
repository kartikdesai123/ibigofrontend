import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'src/app/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MustMatch } from 'src/app/helpers/must-match-validator';
import { UserHomeServiceService } from 'src/app/service/user-home-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-business-home',
  templateUrl: './business-home.component.html',
  styleUrls: ['./business-home.component.css','../../../../front-assets/css/bootstrap.min.css',
  '../../../../front-assets/css/style.css',
  '../../../../front-assets/css/responsive.css',
  '../../../../front-assets/css/font-awesome.min.css',
  '../../../../front-assets/css/owl-carousel.css',
  '../../../../front-assets/css/pretty-checkbox.min.css','../font-user.css']
})
export class BusinessHomeComponent implements OnInit {
  users_details = [];
  business_details = [];
  interests =[];
  business_name;
  last_name;
  short_description;
  user_profile;
  user_about;
  phone_number;
  full_address;
  changePasswordForm: FormGroup;
  submitted = false;
  change_submitted = false;
  profileForm: FormGroup;
  myArray = [];
  user_interests = [];
  profileSubmitted = false;
  user_fname : string;
  email : string;
  mobile:string;
  all_notifications = [];
  public imagePath;
  imgURL: any;
  SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Netherlands,CountryISO.India];
  selectedCountry;
  public message: string;
  business_type;
  constructor(private route: ActivatedRoute,private http:HttpClient,private router:Router,private ts : UserHomeServiceService,private formBuilder: FormBuilder,private toastrservice: ToastrService) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
    };
  }

  ngOnInit() {
    const tab_name = this.route.snapshot.params.tab;
    var user_t = localStorage.getItem('user_type');
    if(user_t=='"normal"'){
      this.router.navigate(['/user/home/'+tab_name]);
    }else if(user_t=='"business"'){
      this.router.navigate(['/business/home/'+tab_name]);
    }

    
   
    var element = document.getElementById(tab_name);
    var element_name = document.getElementById('active_tab_name');
    var element_li = document.getElementById('li_'+tab_name);
    element.classList.add("active","fade","in");
    
    var tname;
    if(tab_name=='password')
      tname = 'Wachtwoord';
    else if(tab_name=='profile')
      tname = 'My Profile';
    else if(tab_name=='interest')
      tname = 'Interesses';
    else if(tab_name == 'notify')
      tname = 'Notificaties';
    element_name.innerText = tname;

    element_li.classList.add("active");
    
    this.profileForm = this.formBuilder.group({
      business_name:  new FormControl('', [Validators.required]),
      full_address:  new FormControl('', [Validators.required]),
      short_description:  new FormControl('', [Validators.required,Validators.maxLength(80)]),
      mobile: new FormControl('', [Validators.required]),
      user_about: new FormControl(),
      phone_number: new FormControl('', [Validators.required]),
      parking_details:  new FormControl(),
      file: new FormControl(),
      fileSource: new FormControl()
    })
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-interests').subscribe((data)=>{
      this.interests = data['interest_details'];
    });
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-business-user',{headers:headers}).subscribe((data)=>{
      this.users_details = data['user_details'];
      this.business_details = data['business_details'];
      this.business_name  = this.business_details['business_name'];
      this.full_address  = this.business_details['full_address'];
      this.user_profile  = this.users_details['user_profile'];
      this.user_about  = this.users_details['user_about'];
      this.short_description  = this.business_details['short_description'];
      if(this.user_profile==null){
        this.user_profile = '/assets/front-assets/images/pic1.png';
      }else{
        this.user_profile = 'https://ibigo.shadowis.nl/server-api/public/user_profiles/'+this.users_details['user_profile'];
      }
      if(this.users_details['user_interests']){
        this.user_interests = this.users_details['user_interests'].split(',').map(Number);
      }
      this.mobile  = this.users_details['mobile'];
      this.phone_number = this.business_details['phone_number']; 
      this.business_type = this.business_details['business_type'];
      //alert(this.business_details['business_type']) 
      const business_description = this.profileForm.get('user_about');
      const parking_details = this.profileForm.get('parking_details');
      if(this.business_type==='basic'){
        business_description.setValidators([Validators.required,Validators.maxLength(255)]);
        business_description.updateValueAndValidity();
      }else{
        parking_details.setValidators([Validators.required]);
        business_description.setValidators([Validators.required]);
        business_description.updateValueAndValidity();
      }
      this.profileForm.patchValue({'business_name':this.business_name,'full_address':this.full_address,'phone_number':this.phone_number,'mobile':this.mobile,'user_about':this.user_about,'short_description':this.short_description});
      if(this.business_details['parking_details']){
        this.profileForm.patchValue({'parking_details':this.business_details['parking_details']});
      }
      if(this.users_details['country_short_code']){
        this.selectedCountry = this.users_details['country_short_code'].toLowerCase();  
      }
    });
    this.http.get('https://ibigo.shadowis.nl/server-api/api/notifications',{headers:headers}).subscribe((data)=>{
        this.all_notifications = data['all_notifications'];     
           
      });
    //this.profileForm.patchValue(this.users_details);
    
    this.changePasswordForm = this.formBuilder.group({
      oldpassword: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'password_confirmation')
    })

    
    
    //alert(business_type);
    
    

  }

  checkValue(checkid){
    if(this.user_interests.includes(checkid)){
        const index = this.user_interests.indexOf(checkid);
        if (index > -1) {
          this.user_interests.splice(index, 1);
        }
      }else{
        this.user_interests.push(checkid)
      }
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    this.http.get('https://ibigo.shadowis.nl/server-api/api/change-interest/'+checkid,{headers:headers}).subscribe((data)=>{
      //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/home/interest']));
      
    });
  }
  changeTab(tab_name){
    var element_name = document.getElementById('active_tab_name');
    var tname;
    if(tab_name=='password')
      tname = 'Wachtwoord';
    else if(tab_name=='profile')
      tname = 'My Profile';
    else if(tab_name=='interest')
      tname = 'Interesses';
    else if(tab_name == 'notify')
      tname = 'Notificaties';
    element_name.innerText = tname;
    
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

  get pf() { return this.profileForm.controls; }
  get f() { return this.changePasswordForm.controls; }

  onSubmit() {
    this.change_submitted = true;
    
    // stop here if form is invalid
    if (this.changePasswordForm.invalid) {
        return;
    }
    
    // display form values on success
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.changePasswordForm.value.email, null, 4));
    this.ts.changePassword(this.changePasswordForm.value.oldpassword,this.changePasswordForm.value.password,this.changePasswordForm.value.password_confirmation).subscribe((data)=>{
      if(data.status==true){
        this.toastrservice.Success(data.message);
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/business/home/profile']));
        this.change_submitted = false;
        this.changePasswordForm.reset();
      }else{
        this.toastrservice.Error(data.message);
      }
    });
    
  }


  onProfileSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.profileForm.invalid) {
        return;
    }
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    //headers.set();
    formData.append('file', this.profileForm.get('fileSource').value);
    formData.append('business_name', this.profileForm.get('business_name').value);
    formData.append('phone_number', this.profileForm.get('phone_number').value);
    formData.append('full_address', this.profileForm.get('full_address').value);
    formData.append('mobile', JSON.stringify(this.profileForm.get('mobile').value));
    formData.append('short_description', this.profileForm.get('short_description').value);
    formData.append('user_about', this.profileForm.get('user_about').value);
    if(this.business_type=='premium'){
      formData.append('parking_details', this.profileForm.get('parking_details').value);
    }
    this.http.post('https://ibigo.shadowis.nl/server-api/api/business/update',formData,{headers:headers}).subscribe((data)=>{
      if(data['status']==true){
        this.toastrservice.Success(data['messages']);
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/business/home/profile']));
        //this.router.navigate(['/user/home']);
      }else{
        this.toastrservice.Error(data['messages']);
      }
    });
    
  }

  
}
