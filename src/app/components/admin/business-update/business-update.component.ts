import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'src/app/toastr.service';
import { AddInterestService } from 'src/app/service/add-interest.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router }  from '@angular/router';
import { MustMatch } from 'src/app/helpers/must-match-validator';
import { DOCUMENT } from '@angular/common';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-business-update',
  templateUrl: './business-update.component.html',
  styleUrls: ['./business-update.component.css','../../../../../node_modules/admin-lte/bower_components/bootstrap/dist/css/bootstrap.min.css',
  "../../../../../node_modules/admin-lte/bower_components/font-awesome/css/font-awesome.min.css",
  "../../../../../node_modules/admin-lte/bower_components/Ionicons/css/ionicons.min.css",
  "../../../../../node_modules/admin-lte/dist/css/AdminLTE.min.css",
  "../../../../../node_modules/admin-lte/dist/css/skins/_all-skins.min.css",
  '../../../../../node_modules/admin-lte/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css']
})
export class BusinessUpdateComponent implements OnInit {
  user : any = {};
  userUpdateForm:FormGroup;
  submitted = false;
  id:any;
  ui :string; 
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  myarray:any = [];
  myNewarray: any =[];
  interests = [];
	CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Netherlands,CountryISO.India];
  selectedCountry;
  is_parking:boolean=false;
  constructor(private router: Router,private aroute : ActivatedRoute,private http:HttpClient,private formBuilder: FormBuilder,private toastrservice: ToastrService) { }

  ngOnInit() {
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-interests').subscribe((data)=>{
      this.interests = data['interest_details'];
    });
    let id = this.aroute.snapshot.params.id;
    this.http.get('https://ibigo.shadowis.nl/server-api/api/business/edit/'+id).subscribe((data)=>{
      this.user = data['user_details'];
      this.userUpdateForm.patchValue(this.user);
      this.ui = data['user_details'].user_interests;
      if(this.user['business_type']=='premium'){
        this.is_parking = true;
      }else{
        this.is_parking = false;
      }
      if(this.user['country_short_code']){
        this.selectedCountry = this.user['country_short_code'].toLowerCase();
      }
      this.myNewarray = this.ui.split(',');
        for(var i=0;i<this.myNewarray.length;i++){
          this.myarray.push(parseInt(this.myNewarray[i]));
        }
    });

    this.userUpdateForm = this.formBuilder.group({
      full_address: new FormControl('', [Validators.required]),
      business_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl('', [Validators.required]),
      business_type: new FormControl('', [Validators.required]),
      parking_details: new FormControl(''),
      user_about: new FormControl(),
      cover: new FormControl(''),
      short_description: new FormControl('', [Validators.required]),
      coverSource: new FormControl(''),
      phone_number: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.minLength(6)]),
      password_confirmation: [''],
      file: new FormControl(),
      fileSource: new FormControl()
    }, {
      validator: MustMatch('password', 'password_confirmation')
    })

    this.formControlValueChanged();
  }

  formControlValueChanged() {
    const business_description = this.userUpdateForm.get('user_about');
    const parking_details = this.userUpdateForm.get('parking_details');
    this.userUpdateForm.get('business_type').valueChanges.subscribe(
        (mode: string) => {
            if (mode === 'basic') {
              parking_details.clearValidators();
              this.is_parking=false;
              business_description.updateValueAndValidity();
              business_description.setValidators([Validators.required,Validators.maxLength(255)]);
              business_description.updateValueAndValidity();
            }
            else if (mode === 'premium') {
              this.is_parking=true;
              business_description.setValidators([Validators.required]);
              business_description.updateValueAndValidity();
              parking_details.setValidators([Validators.required]);
              business_description.updateValueAndValidity();
            }
        });
  }

  get f() { return this.userUpdateForm.controls; }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.userUpdateForm.patchValue({
        fileSource: file
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

  onCoverChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.userUpdateForm.patchValue({
        coverSource: file
      });
    }
  }

  onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.userUpdateForm.invalid) {
        return;
    }
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('user_token'))});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    //headers.set();
    formData.append('file', this.userUpdateForm.get('fileSource').value);
    formData.append('business_name', this.userUpdateForm.get('business_name').value);
    formData.append('short_description', this.userUpdateForm.get('short_description').value);
    formData.append('phone_number', this.userUpdateForm.get('phone_number').value);
    formData.append('cover', this.userUpdateForm.get('coverSource').value);
    formData.append('user_about', this.userUpdateForm.get('user_about').value);
    formData.append('business_type', this.userUpdateForm.get('business_type').value);
    formData.append('full_address', this.userUpdateForm.get('full_address').value);
    formData.append('mobile', JSON.stringify(this.userUpdateForm.get('mobile').value));
    formData.append('password', this.userUpdateForm.get('password').value);
    formData.append('email', this.userUpdateForm.get('email').value);
    formData.append('user_interest',this.myarray);
    let id = this.aroute.snapshot.params.id;
    if(this.is_parking==true){
      formData.append('parking_details', this.userUpdateForm.get('parking_details').value);
    }
    this.http.post('https://ibigo.shadowis.nl/server-api/api/business/update/'+id,formData,{headers:headers}).subscribe((data)=>{
      if(data['status']==true){
        this.toastrservice.Success(data['messages']);
        this.router.navigate(['/admin/show-business-users']);
      }else{
        this.toastrservice.Error(data['messages']);
      }
    });
  }

}
