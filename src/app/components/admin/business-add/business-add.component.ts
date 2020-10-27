import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'src/app/toastr.service';
import { AddInterestService } from 'src/app/service/add-interest.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router }  from '@angular/router';
import { MustMatch } from 'src/app/helpers/must-match-validator';
import { DOCUMENT } from '@angular/common';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-business-add',
  templateUrl: './business-add.component.html',
  styleUrls: ['./business-add.component.css','../../../../../node_modules/admin-lte/bower_components/bootstrap/dist/css/bootstrap.min.css',
  "../../../../../node_modules/admin-lte/bower_components/font-awesome/css/font-awesome.min.css",
  "../../../../../node_modules/admin-lte/bower_components/Ionicons/css/ionicons.min.css",
  "../../../../../node_modules/admin-lte/dist/css/AdminLTE.min.css",
  "../../../../../node_modules/admin-lte/dist/css/skins/_all-skins.min.css",
  '../../../../../node_modules/admin-lte/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css']
})
export class BusinessAddComponent implements OnInit {

  myarray:any = [];
  interests = [];
  userForm: FormGroup;
  submitted = false;
  id:any;
  public active = 0;
  is_parking :boolean=false;
  place_suggestions =[];
  SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Netherlands,CountryISO.India];
  spot_name;
  spot_id;
  spot_address;
  myBusinessArray;
  spot_img;
  four_square_api_photos = [];
  add_later : boolean = false;
  constructor(@Inject(DOCUMENT) private document: Document,private router: Router,private http:HttpClient,private ts:AddInterestService, private formBuilder: FormBuilder,private toastrservice: ToastrService) { }
  getFormValidationErrors() {
    Object.keys(this.userForm.controls).forEach(key => {
  
    const controlErrors: ValidationErrors = this.userForm.get(key).errors;
    if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
    }
  ngOnInit() {
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-interests').subscribe((data)=>{
      this.interests = data['interest_details'];
    });


    this.userForm = this.formBuilder.group({
      business_place: new FormControl(),
      full_address: new FormControl('', [Validators.required]),
      business_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email]),
      mobile: new FormControl(''),
      user_about: new FormControl(''),
      short_description: new FormControl('', [Validators.required]),
      business_type: new FormControl('', [Validators.required]),
      parking_details: new FormControl(''),
      add_later: new FormControl(false),
      manual_business: new FormControl(),
      phone_number: new FormControl(''),
      password: new FormControl('', [Validators.minLength(6)]),
      password_confirmation: [''],
      file: new FormControl(''),
      fileSource: new FormControl(''),
      cover: new FormControl(''),
      is_business:new FormControl(''),
      coverSource: new FormControl('')
    }, {
      validator: MustMatch('password', 'password_confirmation')
    })
    this.userForm.controls['business_name'].disable();
    this.formControlValueChanged();
    this.formControlValueChangedCheckbox();
  }

  near = '';
  query = '';
  onLocation(event: any) { // without type info
    //const headers = new HttpHeaders({'Accept':'application/json'});
    this.near = event.target.value;
    
    if(this.near==''){
      this.userForm.controls['business_name'].disable();
      this.place_suggestions = [];
    }else{
      this.userForm.controls['business_name'].enable();
    }
    
  }

  onKey(event: any) { // without type info
    //const headers = new HttpHeaders({'Accept':'application/json'});
    this.query = event.target.value;
    this.http.get('https://api.foursquare.com/v2/venues/search?client_id=IQVXPFHN5YKW1BXON50GW1YVVZ1VPUTGYZD1VCO1OSMF4DON&client_secret=IRTCUWTAWZC5LLFKGNO5VDJZWB451IC5E51TYHITPJS1XOHT&v=20200612&near='+this.near+'&query='+this.query).subscribe((data:any)=>{
      this.place_suggestions = data.response.venues;
      if(this.place_suggestions.length > 0 || this.near==''){
        const is_business = this.userForm.get('is_business');
        is_business.setValidators([Validators.required]);
        is_business.updateValueAndValidity();
      }

    });
    //https://api.foursquare.com/v2/venues/542bc9bc498e523b0a0a21e1/photos
  }

  selectPlace(id){
    //console.log(id);//https://api.foursquare.com/v2/venues/VENUE_ID
    this.http.get('https://api.foursquare.com/v2/venues/'+id+'?client_id=IQVXPFHN5YKW1BXON50GW1YVVZ1VPUTGYZD1VCO1OSMF4DON&client_secret=IRTCUWTAWZC5LLFKGNO5VDJZWB451IC5E51TYHITPJS1XOHT&v=20200612').subscribe((data:any)=>{
      this.spot_name = data.response.venue.name;
      this.spot_id = data.response.venue.id;
        if(this.spot_id){
          this.http.get('https://api.foursquare.com/v2/venues/'+this.spot_id+'/photos?client_id=IQVXPFHN5YKW1BXON50GW1YVVZ1VPUTGYZD1VCO1OSMF4DON&client_secret=IRTCUWTAWZC5LLFKGNO5VDJZWB451IC5E51TYHITPJS1XOHT&v=20200612').subscribe((data:any)=>{
            this.four_square_api_photos = data.response.photos.items;
          });
        }
      this.spot_address = data.response.venue.location.formattedAddress.join(', ');
      this.myBusinessArray = data.response.venue;
      if(data.response.venue.categories.length > 0){
        this.spot_img =  data.response.venue.categories[0].icon.prefix+'64'+data.response.venue.categories[0].icon.suffix;
      }else{
        this.spot_img =  'https://ss3.4sqi.net/img/categories_v2/travel/highway_64.png';
      }
      localStorage.setItem('spot_details', JSON.stringify({'spot_name':this.spot_name,'spot_address':this.spot_address,'spot_img':this.spot_img,'add_later':this.userForm.get('add_later').value}));
      //var location_div = document.getElementById('search-dropdown-list');
      //var spot_div = document.getElementById('spot_div');
      if(data.response.venue){
        //console.log(data.response.venue.formatted_phone_number);
        
        this.userForm.patchValue({business_name:this.spot_name,is_business:this.spot_id,full_address:this.spot_address,user_about:data.response.venue.description,phone_number:data.response.venue.formatted_phone_number});
        this.place_suggestions =[];
        //location_div.classList.add('hidden');
        //spot_div.classList.remove('hidden');
      }
      
    });
  }
  
  formControlValueChangedCheckbox() {
    
    //const google_business = this.businessForm.get('business_name');
    const business_place = this.userForm.get('business_place');
    
    const manual_business = this.userForm.get('manual_business');
    const full_address = this.userForm.get('full_address');
    const user_about = this.userForm.get('user_about');
    const phone_number = this.userForm.get('phone_number');
    
    this.userForm.get('add_later').valueChanges.subscribe(
        (mode: boolean) => {
            //console.log(mode);
            if (mode === true) {
              manual_business.setValidators([Validators.required]);
              manual_business.updateValueAndValidity();
              phone_number.setValidators([Validators.required]);
              phone_number.updateValueAndValidity();
              full_address.setValidators([Validators.required]);
              full_address.updateValueAndValidity();
              user_about.setValidators([Validators.required]);
              user_about.updateValueAndValidity();
              // google_business.clearValidators();
              // google_business.patchValue(null);
              // google_business.updateValueAndValidity();
              
              business_place.clearValidators();
              business_place.updateValueAndValidity();
              business_place.patchValue(null);
              this.add_later = true;
            
            }
            else if (mode === false) {
              
              // google_business.setValidators([Validators.required]);
              // google_business.updateValueAndValidity();
              
              if(this.spot_name){
                business_place.clearValidators();
                business_place.updateValueAndValidity();
                business_place.patchValue(null);
              }else{
                business_place.setValidators([Validators.required]);
                business_place.updateValueAndValidity();
              }
              user_about.clearValidators();
              user_about.updateValueAndValidity();
              user_about.patchValue(null);
              phone_number.clearValidators();
              phone_number.updateValueAndValidity();
              phone_number.patchValue(null);
              full_address.clearValidators();
              full_address.updateValueAndValidity();
              full_address.patchValue(null);
              
              this.add_later = false;
            }
        });
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

  
  formControlValueChanged() {
    const business_description = this.userForm.get('user_about');
    const parking_details = this.userForm.get('parking_details');
    const manual_business = this.userForm.get('manual_business');
    this.userForm.get('business_type').valueChanges.subscribe(
        (mode: string) => {
            if (mode === 'basic') {
              business_description.setValidators([Validators.required,Validators.maxLength(255)]);
              business_description.updateValueAndValidity();
              // manual_business.setValidators([Validators.required]);
              // manual_business.updateValueAndValidity();
              
              this.is_parking = false;
              //parking_details.clearValidators();
              //parking_details.updateValueAndValidity();
            }
            else if (mode === 'premium') {
              this.is_parking = true;
              business_description.setValidators([Validators.required]);
              business_description.updateValueAndValidity();
              //parking_details.setValidators([Validators.required]);
              //parking_details.updateValueAndValidity();
              
              // manual_business.clearValidators();
              // manual_business.updateValueAndValidity();
              // manual_business.patchValue(null);
            }
        });
  }

  get f() { return this.userForm.controls; }

  onSubmit() {
    this.getFormValidationErrors();
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
    if(this.userForm.get('add_later').value == false){
      formData.append('full_address', this.userForm.get('full_address').value);
      formData.append('phone_number', this.userForm.get('phone_number').value);
      formData.append('user_about', this.userForm.get('user_about').value);
      formData.append('business_status',this.myBusinessArray.business_status);
      formData.append('latitude',this.myBusinessArray.location.lat);
      formData.append('longitude',this.myBusinessArray.location.lng);
      
      formData.append('business_name',this.myBusinessArray.name);
      formData.append('place_id',this.myBusinessArray.id);
      formData.append('rating',this.myBusinessArray.rating);
      formData.append('user_ratings_total',this.myBusinessArray.ratingSignals);
    }else if(this.userForm.get('add_later').value == true){
      formData.append('business_name', this.userForm.get('manual_business').value);
      formData.append('full_address', this.userForm.get('full_address').value);
      formData.append('phone_number', this.userForm.get('phone_number').value);
      formData.append('user_about', this.userForm.get('user_about').value);
    }
    formData.append('file', this.userForm.get('fileSource').value);
    
    formData.append('short_description', this.userForm.get('short_description').value);
    
    formData.append('business_type', this.userForm.get('business_type').value);
    formData.append('mobile', JSON.stringify(this.userForm.get('mobile').value));
    formData.append('password', this.userForm.get('password').value);
    formData.append('email', this.userForm.get('email').value);
    formData.append('cover', this.userForm.get('coverSource').value);
    formData.append('user_interest',this.myarray);
    if(this.is_parking==true){
      formData.append('parking_details', this.userForm.get('parking_details').value);
    }
  
    
    this.http.post('https://ibigo.shadowis.nl/server-api/api/business/create',formData,{headers:headers}).subscribe((data)=>{
      if(data['status']==true){
        this.toastrservice.Success(data['messages']);
        this.router.navigate(['/admin/show-business-users']);
      }else{
        this.toastrservice.Error(data['messages']);
      }
    });
  }

}
