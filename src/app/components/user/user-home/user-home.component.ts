import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'src/app/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MustMatch } from 'src/app/helpers/must-match-validator';
import { UserHomeServiceService } from 'src/app/service/user-home-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css','../../../../front-assets/css/bootstrap.min.css',
  '../../../../front-assets/css/style.css',
  '../../../../front-assets/css/responsive.css',
  '../../../../front-assets/css/font-awesome.min.css',
  '../../../../front-assets/css/owl-carousel.css',
  '../../../../front-assets/css/pretty-checkbox.min.css','../font-user.css']
})
export class UserHomeComponent implements OnInit {
  users_details = [];
  interests =[];
  first_name;
  last_name;
  user_profile;
  user_about;
  changePasswordForm: FormGroup;
  submitted = false;
  change_submitted = false;
  profileForm: FormGroup;
  myArray = [];
  tname;
  user_interests = [];
  all_notifications = [];
  profileSubmitted = false;
  user_fname : string;
  
  email : string;
  unread_notifications;
  public imagePath;
  imgURL: any;
  public message: string;
  dataRefresher: any;
  logged_in_user_id;
  SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Netherlands,CountryISO.India];
  selectedCountry;
  constructor(private route: ActivatedRoute,private http:HttpClient,private router:Router,private ts : UserHomeServiceService,private formBuilder: FormBuilder,private toastrservice: ToastrService) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
    };
  }
  headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
  ngOnInit() {
    const tab_name = this.route.snapshot.params.tab;   
    var user_t = localStorage.getItem('user_type');
    if(user_t=='"normal"'){
      this.router.navigate(['/user/home/'+tab_name]);
    }else if(user_t=='"business"'){
      this.router.navigate(['/business/home/'+tab_name]);
    }

    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-interests').subscribe((data)=>{
      this.interests = data['interest_details'];
    });
    
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-user',{headers:this.headers}).subscribe((data)=>{
      this.users_details = data['user_details'];
      this.first_name  = this.users_details['first_name'];
      this.last_name  = this.users_details['last_name'];
      this.user_about  = this.users_details['user_about'];
      this.logged_in_user_id  = this.users_details['id'];
      
      this.user_profile  = this.users_details['user_profile'];
      if(this.user_profile==null){
        this.user_profile = '/assets/front-assets/images/pic1.png';
      }else{
        if(this.users_details['user_profile'].indexOf('https://graph.facebook.com') != -1){
          this.user_profile  = this.users_details['user_profile'];
        }else{
          this.user_profile = 'https://ibigo.shadowis.nl/server-api/public/user_profiles/'+this.users_details['user_profile'];
        }
      }
      if(this.users_details['user_interests']){
        this.user_interests = this.users_details['user_interests'].split(',').map(Number);
        //console.log(this.user_interests);
      //   setTimeout (() => {
      //     for (let i = 0; i < this.user_interests.length; i++) {
      //       const check_id = this.user_interests[i];
      //       const  ele = document.getElementById(check_id) as HTMLInputElement;
      //       ele.checked = true;
      //       const  ele2 = document.getElementById('active'+check_id);
      //       ele2.classList.add('active');
      //     }
      //  }, 1000); 
        
      }
      
      this.profileForm.patchValue(this.users_details);
        if(this.users_details['country_short_code']){
          this.selectedCountry = this.users_details['country_short_code'].toLowerCase();  
        }
      });
      this.http.get('https://ibigo.shadowis.nl/server-api/api/notifications',{headers:this.headers}).subscribe((data)=>{
        this.all_notifications = data['all_notifications'];     
           
      });
    this.getData(true);
    
    
    var element = document.getElementById(tab_name);
    var element_name = document.getElementById('active_tab_name');
    var element_li = document.getElementById('li_'+tab_name);
    element.classList.add("active","fade","in");
    this.tname;
    if(tab_name=='password')
      this.tname = 'Wachtwoord';
    else if(tab_name=='profile')
      this.tname = 'My Profile';
    else if(tab_name=='interest')
      this.tname = 'Interesses';
    else if(tab_name == 'notify')
      this.tname = 'Notificaties';
      this.updateNotifications();
    element_name.innerText = this.tname;
    element_li.classList.add("active");

    this.changePasswordForm = this.formBuilder.group({
      oldpassword: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'password_confirmation')
    })

    this.profileForm = this.formBuilder.group({
      first_name:  new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),
      user_about: new FormControl('', [Validators.required]),
      file: new FormControl(),
      fileSource: new FormControl()
    })
  }

  

  getData(setPageFlag){
    
  }

  changeTab(tab_name){
    var element_name = document.getElementById('active_tab_name');
    
    if(tab_name=='password')
      this.tname = 'Wachtwoord';
    else if(tab_name=='profile')
      this.tname = 'My Profile';
    else if(tab_name=='interest')
      this.tname = 'Interesses';
    else if(tab_name == 'notify')
      this.tname = 'Notificaties';
    element_name.innerText = this.tname;
    
  }

  updateNotifications(){
    var badge_element = document.getElementById('notification-tab-badge');
    badge_element.classList.add('hidden');
    //   this.http.get('https://ibigo.shadowis.nl/server-api/api/ ',{headers:this.headers}).subscribe((data)=>{
    // });
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
        this.change_submitted = false;
        this.changePasswordForm.reset();
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/home/password']));
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
    
    this.headers.append('Content-Type', 'multipart/form-data');
    this.headers.append('Accept', 'application/json');
    //headers.set();
    formData.append('file', this.profileForm.get('fileSource').value);
    formData.append('first_name', this.profileForm.get('first_name').value);
    formData.append('last_name', this.profileForm.get('last_name').value);
    formData.append('mobile', JSON.stringify(this.profileForm.get('mobile').value));
    formData.append('user_about', this.profileForm.get('user_about').value);
    
    this.http.post('https://ibigo.shadowis.nl/server-api/api/user/update',formData,{headers:this.headers}).subscribe((data)=>{
      if(data['status']==true){
        this.toastrservice.Success(data['messages']);
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/home/profile']));
        //this.router.navigate(['/user/home']);
      }else{
        this.toastrservice.Error(data['messages']);
      }
    });
    
  }

  checkValue(checkid){
    this.http.get('https://ibigo.shadowis.nl/server-api/api/change-interest/'+checkid,{headers:this.headers}).subscribe((data)=>{
      //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/home/interest']));
      if(this.user_interests.includes(checkid)){
        const index = this.user_interests.indexOf(checkid);
        if (index > -1) {
          this.user_interests.splice(index, 1);
        }
      }else{
        this.user_interests.push(checkid)
      }
    });
  }

}
