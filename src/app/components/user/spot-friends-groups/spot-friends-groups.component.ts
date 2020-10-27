import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'src/app/toastr.service';
import { FormBuilder, FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { UserHomeServiceService } from 'src/app/service/user-home-service.service';
import { finalize } from 'rxjs/operators';
import { element } from 'protractor';
import { SpotSearchService } from 'src/app/service/spot-search.service';

@Component({
  selector: 'app-spot-friends-groups',
  templateUrl: './spot-friends-groups.component.html',
  styleUrls: ['./spot-friends-groups.component.css','../../../../front-assets/css/bootstrap.min.css',
  '../../../../front-assets/css/style.css',
  '../../../../front-assets/css/responsive.css',
  '../../../../front-assets/css/font-awesome.min.css',
  '../../../../front-assets/css/owl-carousel.css',
  '../../../../front-assets/css/pretty-checkbox.min.css','../font-user.css']
})
export class SpotFriendsGroupsComponent implements OnInit {
  first_name;
  last_name;
  btnloading= false;
  searchSpot: FormGroup;
  searchFriend:FormGroup;
  searchGroup:FormGroup;
  groupForm: FormGroup;
  eventForm: FormGroup;
  user_profile;
  users_details = [];
  liked_spots = [];
  spot_name;
  friends = [];
  another_friends= [];
  searchText:string;
  eventfieldname = 'event_title';
  fieldname = 'business_name';
  fieldname_group = 'group_name';
  fieldnamefriend = 'user_name';
  fieldnamefriend_req = 'request_send_by_user_name';
  spot_id;
  searchFriendText:string;
  searchGroupText:string;
  invite_frd_id :any= [];
  invite_friends = [];
  submitted = false;
  event_submitted = false;
  group_invite_frd_id :any= [];
  group_invite_friends = [];
  connected_group_list = [];
  your_groups = [];
  valid_from = [];
  query;
  groups = [];
  friend_requests = [];
  friend_list = [];
  status :boolean=false;
  tab_name;
  status_decline :boolean=false;
  invitation_group_list = [];
  valid_form=false;  
  mytime;  
  minDate: Date = new Date();  
  start_date_time;
  end_date_time;
  events = [];
  selectedQuantity;
  is_edit_event:boolean=false;
  constructor(private searchService:SpotSearchService,private cd:ChangeDetectorRef,private route: ActivatedRoute,private http:HttpClient,private router:Router,private ts : UserHomeServiceService,private formBuilder: FormBuilder,private toastrservice: ToastrService) { 
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };  
  }

  ngOnInit() {
    this.tab_name = this.route.snapshot.params.tab;
   
    var user_t = localStorage.getItem('user_type');
    if(user_t=='"normal"'){
      this.router.navigate(['/user/info/'+this.tab_name]);
    }else if(user_t=='"business"'){
      this.router.navigate(['/home/business/profile']);
    }
    
    
    this.searchService.getAllGroups().subscribe((data)=>{
      this.groups = data['group_details'];      
      if(this.groups.length> 0){
        this.selectedQuantity = this.groups[0].id;  
      }
      this.connected_group_list = data['connected_group_list'];      
      function getInvitations(x) {
        return x.invited == 1;
      }
      function getYourGroups(x) {
        return x.invited == 0;
      }
      this.invitation_group_list = this.connected_group_list.filter(getInvitations);
      this.your_groups = this.connected_group_list.filter(getYourGroups);
    })
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-user',{headers:headers}).subscribe((data)=>{
      this.users_details = data['user_details'];
      this.first_name  = this.users_details['first_name'];
      this.last_name  = this.users_details['last_name'];
      
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
    });
    
    this.http.get('https://ibigo.shadowis.nl/server-api/api/friend_requests',{headers:headers}).subscribe((data)=>{      
      this.friend_requests = data['all_friend_requests'];
    });
    this.http.get('https://ibigo.shadowis.nl/server-api/api/getfriends',{headers:headers}).subscribe((data)=>{
      this.friend_list = data['friend_list'];
      this.friends = data['friend_list'];
      this.another_friends = data['friend_list'];
      var element = document.getElementById('friend-tag-text');
      var element3 = document.getElementById('group-friend-tag-text');
      var element2 = document.getElementById('tagged');
      
      if(this.invite_friends.length > 0){
        element.classList.remove('hidden');
        element2.classList.remove('hidden');
      }else{
        element.classList.add('hidden');
        element2.classList.add('hidden');
      }

      if(this.group_invite_friends.length > 0){
        element3.classList.remove('hidden');
      }else{
        element3.classList.add('hidden');
      }
    });
    
    // this.http.get('https://ibigo.shadowis.nl/server-api/api/list-group',{headers:headers}).subscribe((data)=>{      
    //   this.groups = data['group_details'];      
    //   this.connected_group_list = data['connected_group_list'];      
    //   function getInvitations(x) {
    //     return x.invited == 1;
    //   }
    //   function getYourGroups(x) {
    //     return x.invited == 0;
    //   }
    //   this.invitation_group_list = this.connected_group_list.filter(getInvitations);
    //   this.your_groups = this.connected_group_list.filter(getYourGroups);
    // });
    
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-user-spots',{headers:headers}).subscribe((data)=>{
      // console.log(data['liked_connected_spots'][0].liked_users[0]);
      this.liked_spots = data['liked_connected_spots'];
    });
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-user-events',{headers:headers}).subscribe((data)=>{
      // console.log(data['liked_connected_spots'][0].liked_users[0]);
      this.events = data['events'];      
      console.log(this.events);
      
    });
    var element = document.getElementById(this.tab_name);
    var element_name = document.getElementById('active_tab_name');
    var element_li = document.getElementById('li_'+this.tab_name);
    element.classList.add("active","fade","in");
    var tname;
    if(this.tab_name=='friends')
      tname = 'Friends';
    else if(this.tab_name=='groups')
      tname = 'Groups';
    else if(this.tab_name=='spots')
      tname = 'Spots & Events';
    element_name.innerText = tname;
    element_li.classList.add("active");
    this.searchSpot = this.formBuilder.group({
      searchText: new FormControl()
    });
    this.searchFriend = this.formBuilder.group({
      searchFriendText: new FormControl()
    });
    this.searchGroup = this.formBuilder.group({
      searchGroupText: new FormControl()
    });
    this.groupForm = this.formBuilder.group({
      group_name: new FormControl('', [Validators.required]),
    });
    this.eventForm = this.formBuilder.group({
      event_title: new FormControl('', [Validators.required]),
      event_description: new FormControl(),
      start_date: new FormControl('', [Validators.required]),
      end_date: new FormControl(),
      start_time: new FormControl('', [Validators.required]),
      end_time: new FormControl(),
      location: new FormControl('', [Validators.required]),
      group : new FormControl(''),
      is_host_by_group: new FormControl()
    });
    this.eventForm.patchValue({start_time:this.mytime});
    this.formControlValueChanged();
  }
  mode:boolean=false;
  formControlValueChanged() {
    this.eventForm.get('is_host_by_group').valueChanges.subscribe(
    (mode: boolean) => {
      this.mode = mode;      
    })
  }
  error_status=false;
  onEventSubmit(){
    
    this.event_submitted = true;    
    if (this.eventForm.invalid) {
        return;
    }
    this.btnloading = true;
    var d = this.eventForm.get('start_date').value;
    var d2 = this.eventForm.get('end_date').value;    
    var t = new Date(this.eventForm.get('start_time').value);
    var t2 = new Date(this.eventForm.get('end_time').value);  
    
    this.start_date_time = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.getHours(), t.getMinutes());
    this.end_date_time = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate(), t2.getHours(), t2.getMinutes());
    if(this.start_date_time < this.end_date_time){
      this.error_status = false;
    }else{
      this.error_status = true;    
      return;
    }
    var create_or_update_event;
    var formData = new FormData();
    if(this.mode==true) {
      formData.append('host_group',this.eventForm.get('group').value);
    }else{
      formData.append('host_group',null);
    }
    if(this.is_edit_event == true){
      formData.append('event_id',this.edit_event.id);    
      create_or_update_event = 'update-event';
    }else{
      create_or_update_event = 'create-event';
    }
    formData.append('event_title',this.eventForm.get('event_title').value);
    formData.append('start_date_time',this.start_date_time.toLocaleString());
    formData.append('end_date_time',this.end_date_time.toLocaleString());
    formData.append('location',this.eventForm.get('location').value);
    formData.append('event_description',this.eventForm.get('event_description').value);
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    this.http.post('https://ibigo.shadowis.nl/server-api/api/'+create_or_update_event,formData,{headers:headers}).pipe(
    finalize(() => {      
      this.btnloading = false;
      var bodyelement = document.getElementsByClassName('modal-open');
      bodyelement[0].classList.add('my-extra-css');
    })
  ).subscribe((data)=>{
      if(data['status']==true){
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/info/spots']));
      }
    });
  }

  get ef() { return this.eventForm.controls; }

  get f() { return this.groupForm.controls; }
  friendText(e:any){    
    this.searchFriendText = e.target.value;    
  }
  edit_event;
  onEventDelete(event_id){
    console.log(event_id);
    
    if(confirm('Are you sure want to delete this record ')){
      this.events = this.events.filter(function(obj){
        return obj.id !== event_id;
      });
      let headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
      this.http.get('https://ibigo.shadowis.nl/server-api/api/delete-event/'+event_id,{headers:headers}).subscribe((data)=>{});      
    }
  }
  onEventEdit(event_id){    
    if(event_id){
      this.eventForm.reset();
      this.http.get('https://ibigo.shadowis.nl/server-api/api/edit-event/'+event_id).subscribe((data)=>{        
        if(data['status']==true){
          this.is_edit_event = true;
          this.edit_event = data['event'];
          if(this.edit_event.host_group){
            this.selectedQuantity = this.edit_event.host_group;
          }
          this.eventForm.patchValue({event_title:this.edit_event.event_title,event_description:this.edit_event.event_description,location:this.edit_event.location,end_time:new Date(this.edit_event.end_date_time),start_time:new Date(this.edit_event.start_date_time),start_date:new Date(this.edit_event.start_date_time),end_date:new Date(this.edit_event.end_date_time),is_host_by_group:(this.edit_event.host_group? true : false)});
          var element = document.getElementById('event-button');
          element.click();
        }
      });
    }else{
      this.is_edit_event = false;
      this.eventForm.reset();
      var element = document.getElementById('event-button');    
      element.click();
    }
  }

  spotText(e:any){    
    this.searchText = e.target.value;    
  }

  groupText(e:any){
    this.searchGroupText = e.target.value;  
  }

  changeTab(tab_name){
    var element_name = document.getElementById('active_tab_name');
    var tname;
    if(tab_name=='friends'){
      this.router.navigate(['/user/info/friends']);
      tname = 'Friends';
      this.tab_name ='friends';
    }else if(tab_name=='groups'){
      this.router.navigate(['/user/info/groups']);
      tname = 'Groups';
      this.tab_name ='groups';
    }else if(tab_name=='spots'){
      this.router.navigate(['/user/info/spots']);
      tname = 'Spots & Events';
      this.tab_name ='spots';
    }
      
    element_name.innerText = tname;
    
  }

  confirmFriendRequest(people_id){
    var accept = document.getElementById('accept'+people_id);
    accept.classList.add('fa-spinner');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
    this.http.get('https://ibigo.shadowis.nl/server-api/api/accept-request/'+people_id,{headers:headers}).subscribe((data)=>{      
      if(data['message']==1){
        var friend_obj;
        friend_obj = this.friend_requests.filter(function( obj ) {
          return obj.request_send_by_user_id === people_id;
        });
        this.friend_list.push({'first_name':null,'last_name':null,'unique_id':friend_obj[0].request_send_by_user_unique_id,'user_name':friend_obj[0].request_send_by_user_name,'user_profile':friend_obj[0].request_send_by_user_profile,'user_slug':friend_obj[0].request_send_by_user_slug});
        this.friend_requests = this.friend_requests.filter(function( obj ) {
          return obj.request_send_by_user_id !== people_id;
        });
      }
    });
  }

  cancelFriendRequest(people_id){
    var cancel = document.getElementById('cancel'+people_id);
    cancel.classList.add('fa-spinner');
      let headers = new HttpHeaders();
      headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
      this.http.get('https://ibigo.shadowis.nl/server-api/api/unfriend/'+people_id,{headers:headers}).subscribe((data)=>{
        if(data['message']==4){
          this.friend_requests = this.friend_requests.filter(function( obj ) {
            return obj.request_send_by_user_id !== people_id;
          });
        }
      });    
  }

  rejectRequest(group_id){    
    this.status_decline = true;
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Accept', 'application/json');
    this.http.get('https://ibigo.shadowis.nl/server-api/api/reject-group-invitation/'+group_id,{headers:headers}).pipe(
      finalize(() => {
        this.status_decline = false;
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        //this.toastrservice.Success(data['message']);
        this.connected_group_list.forEach(element => {
          if(element.id==group_id){
            element.invited = null;
            element.requested = 0;
          }
        })
        function getInvitations(x) {
          return x.invited == 1;
        }
        function getYourGroups(x) {
          return x.invited == 0;
        }
        this.invitation_group_list = this.connected_group_list.filter(getInvitations);
        this.your_groups = this.connected_group_list.filter(getYourGroups);
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/group/'+this.unique_id+'/'+this.user_slug]));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });

  }
  confirmRequest(group_id){
    this.status = true;
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Accept', 'application/json');
    this.http.get('https://ibigo.shadowis.nl/server-api/api/confirm-group-invitation/'+group_id,{headers:headers}).pipe(
      finalize(() => {
        this.status = false;
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        ///this.toastrservice.Success(data['message']);
        this.connected_group_list.forEach(element => {
          if(element.id==group_id){
            element.invited = 0;
          }
        })
        function getInvitations(x) {
          return x.invited == 1;
        }
        function getYourGroups(x) {
          return x.invited == 0;
        }
        this.invitation_group_list = this.connected_group_list.filter(getInvitations);
        this.your_groups = this.connected_group_list.filter(getYourGroups);
        //this.group_status.invited = "0";
        //this.group_status.requested = null;
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/group/'+this.unique_id+'/'+this.user_slug]));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
  }

  selectSpot(spotid){
    this.spot_id = spotid;
    var index = this.liked_spots.findIndex(x => x.spot_id ===spotid);
    this.spot_name = this.liked_spots[index].business_name;
  }

  addTaglist(userid){
    var index = this.friends.findIndex(x => x.id ===userid);
    this.invite_friends.push(this.friends[index]);
    this.invite_frd_id.push(userid);
    this.friends = this.friends.filter(function( obj ) {
      return obj.id !== userid;
    });
    
    var element = document.getElementById('friend-tag-text');
    var element2 = document.getElementById('tagged');
    if(this.invite_friends.length > 0){
      element.classList.remove('hidden');
      element2.classList.remove('hidden');
    }else{
      element.classList.add('hidden');
      element2.classList.add('hidden');
    }
  }

  addGroupTaglist(userid){
    var index = this.another_friends.findIndex(x => x.id ===userid);
    this.group_invite_friends.push(this.another_friends[index]);
    this.group_invite_frd_id.push(userid);
    this.another_friends = this.another_friends.filter(function( obj ) {
      return obj.id !== userid;
    });
    
    var element = document.getElementById('group-friend-tag-text');
    var element2 = document.getElementById('group-tagged');
    if(this.group_invite_friends.length > 0){
      element.classList.remove('hidden');
      element2.classList.remove('hidden');
    }else{
      element.classList.add('hidden');
      element2.classList.add('hidden');
    }
  }

  removeGroupFromTagList(user_id){
    var index = this.group_invite_friends.findIndex(x => x.id ===user_id);
    this.another_friends.push(this.group_invite_friends[index]);    
    var tag_index = this.group_invite_frd_id.indexOf(user_id);
    if (tag_index > -1) {
      this.group_invite_frd_id.splice(tag_index, 1);
    }
    this.group_invite_friends = this.group_invite_friends.filter(function( obj ) {
      return obj.id !== user_id;
    });
    var element = document.getElementById('group-friend-tag-text');
    var element2 = document.getElementById('group-tagged');
    if(this.group_invite_friends.length > 0){
      element.classList.remove('hidden');
      element2.classList.remove('hidden');
    }else{
      element.classList.add('hidden');
      element2.classList.add('hidden');
    }
  }

  removeFromTagList(user_id){
    var index = this.invite_friends.findIndex(x => x.id ===user_id);
    this.friends.push(this.invite_friends[index]);    
    var tag_index = this.invite_frd_id.indexOf(user_id);
    if (tag_index > -1) {
      this.invite_frd_id.splice(tag_index, 1);
    }
    this.invite_friends = this.invite_friends.filter(function( obj ) {
      return obj.id !== user_id;
    });
    var element = document.getElementById('friend-tag-text');
    var element2 = document.getElementById('tagged');
    if(this.invite_friends.length > 0){
      element.classList.remove('hidden');
      element2.classList.remove('hidden');
    }else{
      element.classList.add('hidden');
      element2.classList.add('hidden');
    }
  }

  onSubmit(){
    var spinner_icon = document.getElementById('spinner-icon');
    var spinner_btn = document.getElementById('spinner-btn') as HTMLButtonElement;
    spinner_btn.disabled =true;
    spinner_icon.classList.add('fa-spinner');
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Accept', 'application/json');
    formData.append('spot_id', this.spot_id);
    formData.append('invite_frd_id', this.invite_frd_id);
    this.http.post('https://ibigo.shadowis.nl/server-api/api/invite-friend',formData,{headers:headers}).pipe(
      finalize(() => {
        spinner_btn.disabled = false;
        spinner_icon.classList.remove('fa-spinner');
        var bodyelement = document.getElementsByClassName('modal-open');
        bodyelement[0].classList.add('my-extra-css');
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        this.toastrservice.Success(data['message']);
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/info/spots']));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
  }
  
  onText(event: any) { // without type info
    this.query = event.target.value;
    String.prototype.trim = function () {
        return this.replace(/^\s*/, "").replace(/\s*$/, "");
    }
    if(this.query.trim().length){
      this.valid_form = true;
      this.groupForm.patchValue({group_name:this.query});
    }else{
      this.valid_form = false;
    }
  }

  loading;
  onGroupSubmit(){
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.groupForm.invalid) {
        return;
    }    
    this.loading = true;
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Accept', 'application/json');
    formData.append('group_name', this.groupForm.get('group_name').value);
    formData.append('invite_frd_id', this.group_invite_frd_id);
    this.http.post('https://ibigo.shadowis.nl/server-api/api/create-group',formData,{headers:headers}).pipe(
      finalize(() => {
        this.loading = false;
        var bodyelement = document.getElementsByClassName('modal-open');
        bodyelement[0].classList.add('my-extra-css');
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        this.toastrservice.Success(data['message']);
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/info/groups']));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
    
  }

  
}
