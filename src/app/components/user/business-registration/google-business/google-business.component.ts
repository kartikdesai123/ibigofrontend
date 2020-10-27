import { Component, OnInit, ViewChild, ElementRef, NgZone, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ToastrService } from 'src/app/toastr.service';
import { AddInterestService } from 'src/app/service/add-interest.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router }  from '@angular/router';
import { MustMatch } from 'src/app/helpers/must-match-validator';
import { DOCUMENT } from '@angular/common';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { UserLoginService } from 'src/app/service/user-login.service';

@Component({
  selector: 'app-google-business',
  templateUrl: './google-business.component.html',
  styleUrls: ['./google-business.component.css','../../../../../front-assets/css/bootstrap.min.css',
  '../../../../../front-assets/css/style.css',
  '../../../../../front-assets/css/responsive.css',
  '../../../../../front-assets/css/font-awesome.min.css',
  '../../../../../front-assets/css/owl-carousel.css',
  '../../../../../front-assets/css/pretty-checkbox.min.css','../../font-user.css']
})
export class GoogleBusinessComponent implements OnInit {
  businessForm: FormGroup;
  submitted = false;
  
  latitude: number;
  longitude: number;
  zoom: number;
  errors = {}
  myArray :any = {};
  business_object :any = {};
  place_suggestions = [];
  ph :any = {};
  spot_id;
  address: string;
  myBusinessArray;
  business_type:string;
  result:any={};
  spot_name;
  add_later : boolean = false;
  storage:any={};
  spot_address;
  spot_img
  private geoCoder;
  
  constructor(@Inject(DOCUMENT) private document: Document,private uls:UserLoginService,private mapsAPILoader: MapsAPILoader,private ngZone: NgZone, private router: Router,private http:HttpClient,private ts:AddInterestService, private formBuilder: FormBuilder,private toastrservice: ToastrService) { }

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
    
    var eventlist = JSON.stringify(localStorage.getItem('business_type'));//Jsonresult
    var eventstring = new String();
    eventstring = eventlist.toString().replace(/"/g, "");
    this.business_type = eventstring.replace(/\\/g, '');
    this.businessForm = this.formBuilder.group({
      is_business: new FormControl('',[Validators.required]),
      business_name: new FormControl(),
      business_place: new FormControl('', [Validators.required]),
      manual_business: new FormControl(),
      full_address: new FormControl(),
      phone_number: new FormControl(),
      add_later: new FormControl(false),
      
    });
    this.businessForm.controls['business_name'].disable();
    this.storage = JSON.parse(localStorage.getItem('spot_details'));
    if(this.storage){
    
      const business_place = this.businessForm.get('business_place');    
      const manual_business = this.businessForm.get('manual_business');
      const full_address = this.businessForm.get('full_address');
      const phone_number = this.businessForm.get('phone_number');
      if(this.storage.add_later==true){
        this.businessForm.patchValue({'manual_business':this.storage.spot_name,'add_later':this.storage.add_later,'full_address':this.storage.spot_address,'phone_number':this.storage.spot_mobile});
        manual_business.setValidators([Validators.required]);
        manual_business.updateValueAndValidity();
        phone_number.setValidators([Validators.required]);
        phone_number.updateValueAndValidity();
        full_address.setValidators([Validators.required]);
        full_address.updateValueAndValidity();
        
        // google_business.clearValidators();
        // google_business.patchValue(null);
        // google_business.updateValueAndValidity();
        
        business_place.clearValidators();
        business_place.updateValueAndValidity();
        business_place.patchValue(null);
        this.add_later = true;
        
      }else{
        this.add_later = false;
        this.spot_name = this.storage.spot_name;
        this.spot_id = this.storage.spot_id;
        this.spot_address = this.storage.spot_address;
        this.spot_img = this.storage.spot_img;
        this.businessForm.patchValue({'business_name':this.storage.spot_name,'add_later':this.storage.add_later,'is_business':this.spot_id});
        if(this.spot_name){
          business_place.clearValidators();
          business_place.updateValueAndValidity();
          business_place.patchValue(null);
        }else{
          business_place.setValidators([Validators.required]);
          business_place.updateValueAndValidity();
        }
        manual_business.clearValidators();
        manual_business.updateValueAndValidity();
        manual_business.patchValue(null);
        phone_number.clearValidators();
        phone_number.updateValueAndValidity();
        phone_number.patchValue(null);
        full_address.clearValidators();
        full_address.updateValueAndValidity();
        full_address.patchValue(null);
        
      
      }
      
    }
    this.formControlValueChanged();
  }
  
  get f() { return this.businessForm.controls; }

  onSubmit(){
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.businessForm.invalid) {
        return;
    }
    //localStorage.removeItem('testObject');
    this.myBusinessArray = JSON.parse(localStorage.getItem('testObject'));
    this.business_object = { 
      name:this.businessForm.get('manual_business').value, 
      formatted_address:this.businessForm.get('full_address').value,
      formatted_phone_number:this.businessForm.get('phone_number').value
    };
    
    if(this.businessForm.get('add_later').value == true){
      //this.myBusinessArray = JSON.parse(localStorage.getItem('testObject'));
      localStorage.setItem('spot_details', JSON.stringify({'spot_name':this.businessForm.get('manual_business').value,'spot_address':this.businessForm.get('full_address').value,'spot_mobile':this.businessForm.get('phone_number').value,'add_later':this.businessForm.get('add_later').value}));
      //localStorage.setItem('spot_details', JSON.stringify({'spot_name':this.spot_name,'spot_address':this.spot_address,'spot_img':this.spot_img,'add_later':this.businessForm.get('add_later').value}));
      localStorage.setItem('testObject', JSON.stringify(this.business_object));
      
    }else{
      localStorage.setItem('spot_details', JSON.stringify({'spot_name':this.spot_name,'spot_address':this.spot_address,'spot_img':this.spot_img,'spot_id':this.spot_id,'add_later':this.businessForm.get('add_later').value}));
    }
    localStorage.getItem('spot_details');
    this.router.navigate(['/business/register/basic-info']);
  }

  near = '';
  query = '';
  onLocation(event: any) { // without type info
    //const headers = new HttpHeaders({'Accept':'application/json'});
    this.near = event.target.value;
    
    if(this.near==''){
      this.businessForm.controls['business_name'].disable();
    }else{
      this.businessForm.controls['business_name'].enable();
    }
    
  }

  formControlValueChanged() {
    
    //const google_business = this.businessForm.get('business_name');
    const business_place = this.businessForm.get('business_place'); 
    const manual_business = this.businessForm.get('manual_business');
    const full_address = this.businessForm.get('full_address');
    const phone_number = this.businessForm.get('phone_number');
    
    this.businessForm.get('add_later').valueChanges.subscribe(
        (mode: boolean) => {
            //console.log(mode);
            if (mode === true) {
              manual_business.setValidators([Validators.required]);
              manual_business.updateValueAndValidity();
              phone_number.setValidators([Validators.required]);
              phone_number.updateValueAndValidity();
              full_address.setValidators([Validators.required]);
              full_address.updateValueAndValidity();
              
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

              manual_business.clearValidators();
              manual_business.updateValueAndValidity();
              manual_business.patchValue(null);
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

  onKey(event: any) { // without type info
    //const headers = new HttpHeaders({'Accept':'application/json'});
    this.query = event.target.value;
    this.http.get('https://api.foursquare.com/v2/venues/search?client_id=IQVXPFHN5YKW1BXON50GW1YVVZ1VPUTGYZD1VCO1OSMF4DON&client_secret=IRTCUWTAWZC5LLFKGNO5VDJZWB451IC5E51TYHITPJS1XOHT&v=20200612&near='+this.near+'&query='+this.query+',&categoryId=4d4b7105d754a06377d81259,4d4b7104d754a06370d81259,4d4b7105d754a06373d81259,4d4b7105d754a06378d81259,4d4b7105d754a06376d81259').subscribe((data:any)=>{
      
      this.place_suggestions = data.response.venues;
      
      if(this.place_suggestions.length > 0 || this.near==''){
      
        const is_business = this.businessForm.get('is_business');
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
      this.spot_address = data.response.venue.location.formattedAddress.join(', ');      
      
      localStorage.setItem('testObject', JSON.stringify(data.response.venue));
      
      if(data.response.venue.categories.length > 0){
        this.spot_img =  data.response.venue.categories[0].icon.prefix+'64'+data.response.venue.categories[0].icon.suffix;
      }else{
        this.spot_img =  'https://ss3.4sqi.net/img/categories_v2/travel/highway_64.png';
      }
      localStorage.setItem('spot_details', JSON.stringify({'spot_name':this.spot_name,'spot_address':this.spot_address,'spot_img':this.spot_img,'add_later':this.businessForm.get('add_later').value}));
      
     
      //var location_div = document.getElementById('search-dropdown-list');
      //var spot_div = document.getElementById('spot_div');
      if(data.response.venue){
        this.businessForm.patchValue({business_name:this.spot_name,is_business:this.spot_id});
        this.place_suggestions = [];
        //location_div.classList.add('hidden');
        //spot_div.classList.remove('hidden');
      }
      
    },
    error => {
      this.errors = error;
    });
  }
}