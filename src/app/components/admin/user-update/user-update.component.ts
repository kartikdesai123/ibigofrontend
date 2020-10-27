import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'src/app/toastr.service';
import { AddInterestService } from 'src/app/service/add-interest.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterLink, ActivatedRoute }  from '@angular/router';
import { MustMatch } from 'src/app/helpers/must-match-validator';
import { DOCUMENT } from '@angular/common';
import { Users } from 'src/app/Users';
import { AdminUserService } from 'src/app/service/admin-user.service';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css','../../../../../node_modules/admin-lte/bower_components/bootstrap/dist/css/bootstrap.min.css',
  "../../../../../node_modules/admin-lte/bower_components/font-awesome/css/font-awesome.min.css",
  "../../../../../node_modules/admin-lte/bower_components/Ionicons/css/ionicons.min.css",
  "../../../../../node_modules/admin-lte/dist/css/AdminLTE.min.css",
  "../../../../../node_modules/admin-lte/dist/css/skins/_all-skins.min.css",
  "../../../../../node_modules/admin-lte/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css"]
})
export class UserUpdateComponent implements OnInit {
  user :any= [];
  myarray:any = [];
  myNewarray: any =[];
  interests = [];
  userUpdateForm: FormGroup;
  submitted = false;
  ui :string; 
  SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  birthdate;
  preferredCountries: CountryISO[] = [CountryISO.Netherlands,CountryISO.India];
  selectedCountry;
  id:any;
  public active = 0;
  constructor(private route : Router,private aroute : ActivatedRoute,@Inject(DOCUMENT) private document: Document,private router: Router,private http:HttpClient,private ts:AdminUserService, private formBuilder: FormBuilder,private toastrservice: ToastrService) { }

  ngOnInit() {
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-interests').subscribe((data)=>{
      this.interests = data['interest_details'];
    });

    this.aroute.params.subscribe((data)=>{
      this.ts.getOne(data.id).subscribe((data)=>{
        
        this.user = data['user'];
        console.log(this.user);
        
        if(this.user['country_short_code']){
          this.selectedCountry = this.user['country_short_code'].toLowerCase(); 
        }
        this.ui = data['user'].user_interests;
        this.userUpdateForm.patchValue(this.user);
        let t = new Date(this.user['birth_date']);
        var date = `${String(t.getDate()).padStart(2, '0')}-${String(t.getMonth() + 1).padStart(2, '0')}-${t.getFullYear().toString().substr(-2)}`;
        this.birthdate = `${String(t.getDate()).padStart(2, '0')}-${String(t.getMonth() + 1).padStart(2, '0')}-${t.getFullYear()}`;
        this.userUpdateForm.patchValue({'birth_date':date});
        this.myNewarray = this.ui.split(',');
        for(var i=0;i<this.myNewarray.length;i++){
          this.myarray.push(parseInt(this.myNewarray[i]));
        }
      });
    });
    
    


    this.userUpdateForm = this.formBuilder.group({
      first_name:  new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl('', [Validators.required]),
      birth_date: new FormControl('', [Validators.required]),
      password: new FormControl(''),
      password_confirmation: [''],
      file: new FormControl(),
      cover: new FormControl(),
      gender: new FormControl('', [Validators.required]),
      fileSource: new FormControl(),
      coverSource: new FormControl(),
    }, {
      validator: MustMatch('password', 'password_confirmation')
    })
  }

  dateCreated(event){   
    
    if(event){
      let t = new Date(event.toJSON().split('T')[0]);
      t.setDate(t.getDate() + 1);
      this.birthdate = new Date(this.birthdate).toLocaleDateString();
      this.birthdate = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
          
    }
  } 

  onFileChange(event) {
  
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.userUpdateForm.patchValue({
        fileSource: file
      });
    }
  }

  onCoverChange(event) {
  
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.userUpdateForm.patchValue({
        coverSource: file
      });
    }
  }

  onAddInterest(id) {
  
    if(this.myarray.includes(id)){
      const index = this.myarray.indexOf(id);
      if (index > -1) {
        this.myarray.splice(index, 1);
      }
    }else{
      this.myarray.push(id)
    }
   
  }

  get f() { return this.userUpdateForm.controls; }

  onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.userUpdateForm.invalid) {
        return;
    }
    let id = this.aroute.snapshot.params.id
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('user_token'))});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    //headers.set();
    formData.append('file', this.userUpdateForm.get('fileSource').value);
    formData.append('first_name', this.userUpdateForm.get('first_name').value);
    formData.append('last_name', this.userUpdateForm.get('last_name').value);
    formData.append('birth_date',this.birthdate);
    formData.append('mobile', JSON.stringify(this.userUpdateForm.get('mobile').value));
    formData.append('password', this.userUpdateForm.get('password').value);
    formData.append('email', this.userUpdateForm.get('email').value);
    formData.append('gender', this.userUpdateForm.get('gender').value);
    formData.append('user_interest',this.myarray);
    formData.append('cover', this.userUpdateForm.get('coverSource').value);
    
    this.http.post('https://ibigo.shadowis.nl/server-api/api/user/update/'+id,formData,{headers:headers}).subscribe((data)=>{
      if(data['status']==true){
        this.toastrservice.Success(data['messages']);
        this.router.navigate(['/admin/show-users']);
      }else{
        this.toastrservice.Error(data['messages']);
      }
    });
  }

}
