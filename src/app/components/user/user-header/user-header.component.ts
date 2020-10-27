import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'src/app/toastr.service';
import { UserHomeServiceService } from 'src/app/service/user-home-service.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SpotSearchService } from 'src/app/service/spot-search.service';
import { UserLoginService } from 'src/app/service/user-login.service';
import { SearchValidator } from './search.validator';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css','../../../../front-assets/css/bootstrap.min.css',
  '../../../../front-assets/css/style.css',
  '../../../../front-assets/css/responsive.css',
  '../../../../front-assets/css/font-awesome.min.css',
  '../../../../front-assets/css/owl-carousel.css',
  '../../../../front-assets/css/pretty-checkbox.min.css','../font-user.css']
})
export class UserHeaderComponent implements OnInit {
  users_details = [];
  interests =[];
  first_name;
  last_name;
  user_profile;
  business_details=[];
  logged_in_user_id;
  user_about;
  searchForm: FormGroup;
  searchText;
  logged_in_user
  selectedInterests;
  business_name;
  suggestions = [];
  all_friend_requests = [];
  selected_user_type;user_t;
  notification_cnt = 0;
  selected_value;
  all_notifications = [];
  hide_section = true;
  count;
  // @HostListener("keyup", ["$event.target"])
  // onKeyup(target) {
  //   if(this.router.url === '/spot-search'){
  //     if(this.searchForm.get('search_name').value!=''){
  //       this.searchService.setpreviewdata(this.searchForm.get('search_name').value);
  //     }else if(this.searchForm.get('search_name').value==''){
  //       this.searchService.setpreviewdata(this.searchForm.get('search_name').value);  
  //     }
  //   }
  // }  
  
  constructor(private notificationService:NotificationService,private cd :ChangeDetectorRef,private us :UserLoginService,private searchService :SpotSearchService ,private route: ActivatedRoute,private http:HttpClient,private router:Router,private ts : UserHomeServiceService,private formBuilder: FormBuilder,private toastrservice: ToastrService) {
    // this.router.routeReuseStrategy.shouldReuseRoute = function() {
    //     return false;
    // };
  }
  headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
  ngOnInit() {
    

    this.count = this.notificationService.retrieveNotificationCount();    
    this.logged_in_user = this.us.isUserLoggedIn();
    //const nid = this.route.snapshot.params.notification_id;
    //console.log(this.router.url);
    if(this.route.snapshot.url[0].path=='event'){
      this.onUserType('event');
    }else if(this.route.snapshot.url[0].path=='spot'){
      this.onUserType('spot');
    }else if(this.route.snapshot.url[0].path=='people'){
      this.onUserType('people');
    }else if(this.route.snapshot.url[0].path=='group'){
      this.onUserType('group');
    }else if(this.route.snapshot.url[0].path=='user' && this.route.snapshot.url[1].path=='updateprofile'){
      this.onUserType('people');
    }else if(this.route.snapshot.url[2]){
      if(this.route.snapshot.url[2].path=='groups' || this.route.snapshot.url[2].path=='friends'){
        this.onUserType('people_group');
      }else if(this.route.snapshot.url[2].path=='spots'){
        this.onUserType('spot_event');
      }      
    }else if(this.route.snapshot.url[0].path=='todo'){
      this.onUserType('spot_event');
    }else {
      this.onUserType('Select');
    }
    if(this.route.snapshot.url[0].path=='user' && this.route.snapshot.url[1].path=='home'){
      this.hide_section = true;
    }else{
      this.hide_section = false; 
    }
    var user_t = localStorage.getItem('user_type');
    let headers = new HttpHeaders();    
    //this.router.navigate(['/spot-reviews/'+id]);
    if(user_t=='"normal"'){
      headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
      this.http.get('https://ibigo.shadowis.nl/server-api/api/get-user',{headers:headers}).subscribe((data)=>{
        this.users_details = data['user_details'];
        this.logged_in_user_id = this.users_details['id'];
        window.Echo.channel('notification-channel'+this.logged_in_user_id)
        .listen('UserNotification', (data) => {          
          if(this.router.url!='/user/homepage'){
            this.notification_cnt++;
            this.all_notifications.unshift(data['notification']);
            if (!this.destroyed) {
              this.cd.detectChanges();
            }
          }
          // if(this.router.url=='/user/homepage'){
          //   this.cd.detectChanges();
          // }
        });
        this.first_name = this.users_details['first_name'];
        this.last_name = this.users_details['last_name'];
        this.user_about = this.users_details['user_about'];
        this.user_profile = this.users_details['user_profile'];
        if(this.user_profile==null){
          this.user_profile = '/assets/front-assets/images/pic1.png';
        }else{
          if(this.users_details['user_profile'].indexOf('https://graph.facebook.com') != -1){
            this.user_profile  = this.users_details['user_profile'];
          }else{
            this.user_profile = 'https://ibigo.shadowis.nl/server-api/public/user_profiles/'+this.users_details['user_profile'];
          }
        }
        this.http.get('https://ibigo.shadowis.nl/server-api/api/notifications',{headers:this.headers}).subscribe((data)=>{
          this.all_notifications = data['all_notifications'];          
          
        });
        this.http.get('https://ibigo.shadowis.nl/server-api/api/friend_requests',{headers:headers}).subscribe((data)=>{
          this.all_friend_requests = data['all_friend_requests'];        
          length = this.all_notifications.filter(function(item){
            return parseInt(item.notification_read)==0;
          }).length;
          this.notification_cnt = length;          
          
        });
      });
    }else if(user_t=='"business"'){
      headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
      if(this.logged_in_user==true){
        this.http.get('https://ibigo.shadowis.nl/server-api/api/get-business-user',{headers:headers}).subscribe((data)=>{
          this.users_details = data['user_details'];
          this.logged_in_user_id = this.users_details['id'];
        window.Echo.channel('notification-channel'+this.logged_in_user_id)
        .listen('UserNotification', (data) => {           
          if(this.router.url!='/user/homepage'){
            this.notification_cnt++;
            this.all_notifications.unshift(data['notification']);
            if (!this.destroyed) {
              this.cd.detectChanges();
            }
          }
          // if(this.router.url=='/user/homepage'){
          //   this.cd.detectChanges();
          // }
        });
          this.business_details = data['business_details'];
          
          this.business_name  = this.business_details['business_name'];
          
          this.user_profile  = this.users_details['user_profile'];
          
          if(this.user_profile==null){
            this.user_profile = '/assets/front-assets/images/pic1.png';
          }else{
            this.user_profile = 'https://ibigo.shadowis.nl/server-api/public/user_profiles/'+this.users_details['user_profile'];
          }
          
        });
        this.http.get('https://ibigo.shadowis.nl/server-api/api/notifications',{headers:this.headers}).subscribe((data)=>{
          this.all_notifications = data['all_notifications'];             
               
          length = this.all_notifications.filter(function(item){
            return parseInt(item.notification_read)==0;
          }).length;
          this.notification_cnt = length;
        });
      }
    }
    
    this.searchForm = this.formBuilder.group({
      search_name: new FormControl(),
      user_type: new FormControl()
     })
     
    
      var data = this.searchService.retrieveSearchObject()
      
      if(Object.keys(data).length>0){
        if(this.router.url=='/spot-search'){
          this.searchText = data['search_name'];
          this.selectedInterests = data['selected_interest'];
          this.selected_user_type = data['selected_user_type'];
          this.searchForm.patchValue({
            search_name:this.searchText,
            user_type:this.selected_user_type
          });
        }
      }  
  }
  private destroyed = false;

  ngOnDestroy() {
    this.destroyed = true;
  }
  confirmRequest(people_id){
    let headers = new HttpHeaders();
    headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
    this.http.get('https://ibigo.shadowis.nl/server-api/api/accept-request/'+people_id,{headers:headers}).subscribe((data)=>{      
      if(data['message']==1){
        this.all_friend_requests = this.all_friend_requests.filter(function( obj ) {
          return obj.request_send_by_user_id !== people_id;
        });
      }
    });
  }

  cancelRequest(people_id){
      let headers = new HttpHeaders();
      headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
      this.http.get('https://ibigo.shadowis.nl/server-api/api/unfriend/'+people_id,{headers:headers}).subscribe((data)=>{
        if(data['message']==4){
          this.all_friend_requests = this.all_friend_requests.filter(function( obj ) {
            return obj.request_send_by_user_id !== people_id;
          });
        }
      });    
  }
  
  myclick(pi){
    this.selected_value = this.suggestions[pi].user_name;
    this.searchForm.patchValue({'search_name':this.selected_value});
    this.onText();
  }
 
  onText(){
    //this.searchForm.patchValue()
    if(this.searchForm.get('search_name').value){
      this.searchService.saveSearchObject({search_name:this.searchForm.get('search_name').value,selected_interest:this.selectedInterests,selected_user_type:this.selected_user_type});
      this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/spot-search']));
    }
  }

  onUserType(type){
    this.selected_user_type = type;
    this.cd.detectChanges();
  }
  arrowkeyLocation = 0;
  formData = new FormData();
  keyDown(event: any) {
    if(event.target.value=='' || event.target.value==' '){
      this.suggestions = [];
    }
    if(event.target.value.length>3 && event.target.value.replace(/\s/g, '').length){
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
      if(event.keyCode==38 || event.keyCode==40){
        this.selected_value = this.suggestions[this.arrowkeyLocation].user_name;
        this.searchForm.patchValue({'search_name':this.selected_value});
      }else{
        
        this.searchForm.patchValue({'search_name':event.target.value});
        //this.suggestions.push(event.target.value);
        this.formData.append('searchText', this.searchForm.get('search_name').value);
        this.formData.append('selected_user_type', this.selected_user_type);
        this.http.post('https://ibigo.shadowis.nl/server-api/api/get-all-suggestions',this.formData).subscribe((data)=>{
          this.suggestions = [];
          this.arrowkeyLocation = 0;
          if(data['all_suggestions'].length > 0){
            this.suggestions = data['all_suggestions'];
          }
          
        });        
      }
    }else{
      this.suggestions = [];
    }
      
  }
  
  notificationOpen = false;
  notificationDropDown(){
    if(this.notificationOpen==true){
      this.notificationOpen = false;  
    }else{
      if(this.notification_cnt > 0){
        this.notification_cnt = 0;
        this.http.get('https://ibigo.shadowis.nl/server-api/api/change-notification-status',{headers:this.headers}).subscribe((data)=>{});
      }      
      this.notificationOpen = true;
    }
      
  }
  
}
