import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'src/app/toastr.service';
import { AddInterestService } from 'src/app/service/add-interest.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router }  from '@angular/router';
import { MustMatch } from 'src/app/helpers/must-match-validator';
import { DOCUMENT } from '@angular/common';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css','../../../../../node_modules/admin-lte/bower_components/bootstrap/dist/css/bootstrap.min.css',
  "../../../../../node_modules/admin-lte/bower_components/font-awesome/css/font-awesome.min.css",
  "../../../../../node_modules/admin-lte/bower_components/Ionicons/css/ionicons.min.css",
  "../../../../../node_modules/admin-lte/dist/css/AdminLTE.min.css",
  "../../../../../node_modules/admin-lte/dist/css/skins/_all-skins.min.css",
  "../../../../../node_modules/admin-lte/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css"]
})
export class UserAddComponent implements OnInit {
  myarray:any = [];
  interests = [];
  userForm: FormGroup;
  submitted = false;
  id:any;
  public active = 0;
  SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Netherlands,CountryISO.India];
  birthdate;
  constructor(@Inject(DOCUMENT) private document: Document,private router: Router,private http:HttpClient,private ts:AddInterestService, private formBuilder: FormBuilder,private toastrservice: ToastrService) { }

  ngOnInit() {
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-interests').subscribe((data)=>{
      this.interests = data['interest_details'];
    });


    this.userForm = this.formBuilder.group({
      first_name:  new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email]),
      mobile: new FormControl(''),
      birth_date: new FormControl(''),
      password: new FormControl('', [Validators.minLength(6)]),
      password_confirmation: [''],
      file: new FormControl(''),
      cover: new FormControl(''),
      coverSource: new FormControl(''),
      gender: new FormControl('', [Validators.required]),
      fileSource: new FormControl('')
    }, {
      validator: MustMatch('password', 'password_confirmation')
    })
  }

  dateCreated(event){   
    if(event){
      if(this.userForm.get('birth_date').errors){
        if((event!='Invalid Date' && this.userForm.get('birth_date').errors['required']!=true)){
          let t = new Date(event.toJSON().split('T')[0]);
          t.setDate(t.getDate() + 1);
          //this.birthdate = new Date(this.birthdate).toLocaleDateString();
          this.birthdate = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
        }    
      }
    }
  } 
  
  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.userForm.patchValue({
        fileSource: file
      });
    }
  }

  onCoverChange(event) {
  
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.userForm.patchValue({
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

  get f() { return this.userForm.controls; }

  onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.userForm.invalid) {
        return;
    }
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('user_token'))});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    //headers.set();
    formData.append('file', this.userForm.get('fileSource').value);
    formData.append('cover', this.userForm.get('coverSource').value);
    formData.append('first_name', this.userForm.get('first_name').value);
    formData.append('last_name', this.userForm.get('last_name').value);
    formData.append('birth_date', this.birthdate);
    formData.append('mobile', JSON.stringify(this.userForm.get('mobile').value));
    formData.append('email', this.userForm.get('email').value);
    formData.append('gender', this.userForm.get('gender').value);
    formData.append('user_interest',this.myarray);
    
    //formData.append('file', );
    // display form values on success
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.userForm.value.email, null, 4));
    
    this.http.post('https://ibigo.shadowis.nl/server-api/api/user/create',formData,{headers:headers}).subscribe((data)=>{
      if(data['status']==true){
        this.toastrservice.Success(data['messages']);
        this.router.navigate(['/admin/show-users']);
      }else{
        this.toastrservice.Error(data['messages']);
      }
    });
  }

}
