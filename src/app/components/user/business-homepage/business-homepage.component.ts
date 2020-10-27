import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SpotSearchService } from 'src/app/service/spot-search.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-business-homepage',
  templateUrl: './business-homepage.component.html',
  styleUrls: ['./business-homepage.component.css','../../../../front-assets/css/bootstrap.min.css',
  '../../../../front-assets/css/style.css',
  '../../../../front-assets/css/responsive.css',
  '../../../../front-assets/css/font-awesome.min.css',
  '../../../../front-assets/css/owl-carousel.css',
  '../../../../front-assets/css/pretty-checkbox.min.css','../font-user.css']
})
export class BusinessHomepageComponent implements OnInit {
  users_details = [];
  business_details = [];
  business_name;
  searchForm:FormGroup;
  user_profile;
  interests = [];
  selectedInterests;
  constructor(private cd :ChangeDetectorRef,private formBuilder: FormBuilder,private searchService:SpotSearchService,private router:Router,private http:HttpClient) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      search_name: new FormControl(),
    })
    this.onUserType('Select');
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-business-user',{headers:headers}).subscribe((data)=>{
      this.users_details = data['user_details'];
      this.business_details = data['business_details'];
      this.business_name  = this.business_details['business_name'];
      this.user_profile  = this.users_details['user_profile'];
      if(this.user_profile==null){
        this.user_profile = '/assets/front-assets/images/pic1.png';
      }else{
        this.user_profile = 'https://ibigo.shadowis.nl/server-api/public/user_profiles/'+this.users_details['user_profile'];
      }
    });
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-all-interests').subscribe((data)=>{
      this.interests = data['interest_details'];
    });
  }

  selectInterest(id){
    this.selectedInterests = id;
    this.onSearchText();
    // if(this.selectedInterests.includes(id)==false){
    //   this.selectedInterests.push(id);
    // }else{  
    //   const index = this.selectedInterests.indexOf(id);
    //   if (index > -1) {
    //     this.selectedInterests.splice(index, 1);
    //   }
    // }
  }

  myclick(pi){
    
    this.selected_value = this.suggestions[pi].user_name;
    this.searchForm.patchValue({'search_name':this.selected_value});
    this.onSearchText();
  }
  onSearchText(){
    
    // if(this.searchForm.get('search_name').value){ 
    // } 
    if(this.router.url !== '/spot-search'){
      this.searchService.saveSearchObject({search_name:this.searchForm.get('search_name').value,selected_interest:this.selectedInterests,selected_user_type:this.selected_user_type});
      this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/spot-search']));
    }
  }
  // onSearchText(){
  //   if(this.searchForm.get('search_name').value){
  //     this.searchService.setpreviewdata(this.searchForm.get('search_name').value);
      
  //     if(this.router.url !== '/spot-search'){
  //       this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/spot-search']));
  //     }
  //   } 
  // }

  onUserType(type){
    this.selected_user_type = type;
  this.cd.detectChanges();    
  }

  arrowkeyLocation = 0;
  selected_user_type;
  formData = new FormData();
  selected_value;
  suggestions= [];

  keyDown(event: any) {
    if(event.target.value=='' || event.target.value==' '){
      this.suggestions = [];
    }
    if(event.target.value){
      switch (event.keyCode) {
          case 38: // this is the ascii of arrow up
                  if(this.arrowkeyLocation >= 1 )
                    this.arrowkeyLocation--;
                    break;
          case 40: // this is the ascii of arrow down
                  if(this.arrowkeyLocation < this.suggestions.length - 1 )
                    this.arrowkeyLocation++;
                    break;
      }
      if((event.keyCode!=38 && event.keyCode!=40)){
        this.searchForm.patchValue({'search_name':event.target.value});
        //this.suggestions.push(event.target.value);
        this.formData.append('searchText', this.searchForm.get('search_name').value);
        this.formData.append('selected_user_type', this.selected_user_type);
        const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
        this.http.post('https://ibigo.shadowis.nl/server-api/api/get-all-suggestions',this.formData,{headers:headers}).subscribe((data)=>{
          this.suggestions = [];
          this.arrowkeyLocation = 0;
          if(data['all_suggestions'].length > 0){
            this.suggestions = data['all_suggestions'];
          }
          
        });
      }else{
        this.selected_value = this.suggestions[this.arrowkeyLocation].user_name;
        this.searchForm.patchValue({'search_name':this.selected_value});
      }
    }else{
      this.suggestions = [];
    }
      
  }
}
