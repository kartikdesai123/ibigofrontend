import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-planning-and-go-list',
  templateUrl: './planning-and-go-list.component.html',
  styleUrls: ['./planning-and-go-list.component.css','../../../../front-assets/css/bootstrap.min.css',
  '../../../../front-assets/css/style.css',
  '../../../../front-assets/css/responsive.css',
  '../../../../front-assets/css/font-awesome.min.css',
  '../../../../front-assets/css/owl-carousel.css',
  '../../../../front-assets/css/pretty-checkbox.min.css','../font-user.css']
})
export class PlanningAndGoListComponent implements OnInit {
  planningForm: FormGroup;
  tab_name;
  minDate: Date;
  users_details = [];
  user_profile;
  first_name;
  last_name;
  users_goto_list = [];
  liked_spots = [];
  goto_spot_list = [];
  goto_spot_id = [];
  spot_suggestions = [];
  planning_spots = [];
  selectedSpot = [];
  today_plannings = [];
  temp_liked_spots= [];
  nextweek_plannings = [];
  thismonth_plannings = [];
  other_spots=[];
  selectedQuantity;
  events =[];
  constructor(private formBuilder : FormBuilder,private http:HttpClient,private route:ActivatedRoute,private router:Router) { 
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
  }

  ngOnInit() {
    this.minDate = new Date();    
    this.minDate.setDate(this.minDate.getDate() + 1);
    this.tab_name = this.route.snapshot.params.tab;
    if(this.tab_name!='go-list' || this.tab_name!='planning'){
      var user_t = localStorage.getItem('user_type');
      if(user_t=='"normal"'){
        this.router.navigate(['/user/homepage']);
      }else if(user_t=='"business"'){
        this.router.navigate(['/home/business/profile']);
      }
    }
    var user_t = localStorage.getItem('user_type');
    if(user_t=='"normal"'){
      this.router.navigate(['/todo/'+this.tab_name]);
    }else if(user_t=='"business"'){
      this.router.navigate(['/home/business/profile']);
    }
    var element = document.getElementById(this.tab_name);
    var element_name = document.getElementById('active_tab_name');
    var element_li = document.getElementById('li_'+this.tab_name);
    element.classList.add("active","fade","in");
    var tname;
    if(this.tab_name=='go-list')
      tname = 'Go List';
    else if(this.tab_name=='planning')
      tname = 'Planning';
    element_name.innerText = tname;
    element_li.classList.add("active");

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

    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-planning',{headers:headers}).subscribe((data)=>{
      
      this.today_plannings = data['today_plannings'];
      this.nextweek_plannings = data['nextweek_plannings'];
      this.thismonth_plannings = data['thismonth_plannings'];
    });

    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-user-spots',{headers:headers}).subscribe((data)=>{
      // console.log(data['liked_connected_spots'][0].liked_users[0]);      
      this.liked_spots = data['liked_connected_spots'];
      this.planning_spots = data['liked_connected_spots'];
      this.temp_liked_spots = data['liked_connected_spots'];
        this.http.get('https://ibigo.shadowis.nl/server-api/api/get-goto',{headers:headers}).subscribe((data)=>{      
          this.users_goto_list = data['goto_list'];
          
          if(this.users_goto_list.length > 0){
            this.users_goto_list.forEach(element => {
              var index = this.liked_spots.findIndex(x => x.spot_id ===element.spot_id);
              if(index>-1){
                this.goto_spot_list.push(this.liked_spots[index]);
                this.goto_spot_id.push(element.spot_id);
                this.liked_spots = this.liked_spots.filter(function( obj ) {
                  return obj.spot_id !== element.spot_id;
                });
              }else{
                var o_index = this.other_spots.findIndex(x => x.spot_id ===element.spot_id);
                this.goto_spot_list.push(this.other_spots[o_index]);
                this.goto_spot_id.push(element.spot_id);
                this.other_spots = this.other_spots.filter(function( obj ) {
                  return obj.spot_id !== element.spot_id;
                });
              }
            });
          }  
        });
    });
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-other-spots',{headers:headers}).subscribe((data)=>{
      this.other_spots = data['other_spots'];
    });
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-user-events',{headers:headers}).subscribe((data)=>{
      // console.log(data['liked_connected_spots'][0].liked_users[0]);
      this.events = data['events'];      
      if(this.events.length> 0){
        this.selectedQuantity = this.events[0].id;  
      }
    });
    
    this.planningForm = this.formBuilder.group({
      is_an_event: new FormControl(false),
      planning_description:  new FormControl(),
      planning_date: new FormControl('', [Validators.required]),
      event : new FormControl()
    });
    // if(this.events.length> 0){
    //   this.selectedQuantity = this.groups[0].id;  
    // }
    // this.selectedQuantity = this.groups[0].id;  
    this.formControlValueChanged();

  }
  get f() { return this.planningForm.controls; }
  mode:boolean=false;
  formControlValueChanged() {
    this.planningForm.get('is_an_event').valueChanges.subscribe(
    (mode: boolean) => {
      this.mode = mode;            
      const planning_date = this.planningForm.get('planning_date'); 
      if (mode === true) {
        planning_date.clearValidators();
        planning_date.updateValueAndValidity();
        planning_date.patchValue(null);
      }else{
        planning_date.setValidators([Validators.required]);
        planning_date.updateValueAndValidity();
      }
    })
  }
  changeTab(tab_name){
    var element_name = document.getElementById('active_tab_name');
    var tname;
    if(tab_name=='go-list'){
      this.tab_name = 'go-list';
      tname = 'Go List';
    }else if(tab_name=='planning'){
      tname = 'Planning';
      this.tab_name = 'planning';
    }
    element_name.innerText = tname;
  }


  
  addSpotlist(spot_id){
    var index = this.liked_spots.findIndex(x => x.spot_id ===spot_id);
    if(index>-1){
      this.goto_spot_list.push(this.liked_spots[index]);
      this.goto_spot_id.push(spot_id);
      this.liked_spots = this.liked_spots.filter(function( obj ) {
        return obj.spot_id !== spot_id;
      });
    }else{
      var o_index = this.other_spots.findIndex(x => x.spot_id ===spot_id);
      this.goto_spot_list.push(this.other_spots[o_index]);
      this.goto_spot_id.push(spot_id);
      this.other_spots = this.other_spots.filter(function( obj ) {
        return obj.spot_id !== spot_id;
      });
    }
    
  }

  removeFromSpotList(spot_id){
    var index = this.goto_spot_list.findIndex(x => x.spot_id ===spot_id);
    var temp_index = this.temp_liked_spots.findIndex(x => x.spot_id ===spot_id);
    if(temp_index>-1){
      this.liked_spots.push(this.goto_spot_list[index]);    
      var tag_index = this.goto_spot_id.indexOf(spot_id);
      if (tag_index > -1) {
        this.goto_spot_id.splice(tag_index, 1);
      }
      this.goto_spot_list = this.goto_spot_list.filter(function( obj ) {
        return obj.spot_id !== spot_id;
      });
    }else{
      this.other_spots.push(this.goto_spot_list[index]);    
      var tag_index = this.goto_spot_id.indexOf(spot_id);
      if (tag_index > -1) {
        this.goto_spot_id.splice(tag_index, 1);
      }
      this.goto_spot_list = this.goto_spot_list.filter(function( obj ) {
        return obj.spot_id !== spot_id;
      });
    }

    
  }

  onAddGoto(){
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Accept', 'application/json');
    //formData.append('spot_id', this.spot_id);
    formData.append('spot_id', this.goto_spot_id.join(','));
    this.http.post('https://ibigo.shadowis.nl/server-api/api/add-update-goto',formData,{headers:headers}).pipe(
      finalize(() => {
        //spinner_btn.disabled = false;
        //spinner_icon.classList.remove('fa-spinner');
        var bodyelement = document.getElementsByClassName('modal-open');
        bodyelement[0].classList.add('my-extra-css');
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        //this.toastrservice.Success(data['message']);
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/todo/go-list']));
      }else{
        //this.toastrservice.Error(data['message']);
      }
    });
  }

  onGotoLike(goto_id){
    this.users_goto_list.forEach(element => {
      if(element.id==goto_id){
        if(element.is_liked==0){          
          element.is_liked=1;
        }else{
          element.is_liked=0;          
        }
      }
    });    
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    this.http.get('https://ibigo.shadowis.nl/server-api/api/like-goto/'+goto_id,{headers:headers}).subscribe();  
  }

  addSpotForPlan(spot_id){
    if(this.selectedSpot.length > 0){      
      this.planning_spots.push(this.selectedSpot[0]);
      this.selectedSpot = [];
      var index = this.planning_spots.findIndex(x => x.spot_id ===spot_id);
      this.selectedSpot.push(this.planning_spots[index]);
      this.planning_spots = this.planning_spots.filter(function( obj ) {
        return obj.spot_id !== spot_id;
      });

    }else{
      var index = this.planning_spots.findIndex(x => x.spot_id ===spot_id);
      this.selectedSpot.push(this.planning_spots[index]);
      this.planning_spots = this.planning_spots.filter(function( obj ) {
        return obj.spot_id !== spot_id;
      });
    }
  }

  removeSelectedSpot(spot_id){
    this.planning_spots.push(this.selectedSpot[0]);
    this.selectedSpot = [];
  }
  planning_date;
  submitted = false;

  onAddPlanning(){
    
    this.submitted = true;    
    if (this.planningForm.invalid) {
      return;
    }
    
    
    
    const formData = new FormData();
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    if(this.mode==true){
      formData.append('spot_id',null);
      formData.append('event_id', this.planningForm.get('event').value);
    }else{
      let t = this.planningForm.get('planning_date').value;
      this.planning_date = new Date(t).toLocaleDateString();
      this.planning_date = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
      formData.append('spot_id', this.selectedSpot[0].spot_id);
      formData.append('event_id', null);
    }
    
    formData.append('planning_date', this.planning_date);
    formData.append('planning_description', this.planningForm.get('planning_description').value);
    this.http.post('https://ibigo.shadowis.nl/server-api/api/add-planning',formData,{headers:headers}).pipe(
      finalize(() => {
        //spinner_btn.disabled = false;
        //spinner_icon.classList.remove('fa-spinner');
        var bodyelement = document.getElementsByClassName('modal-open');
        bodyelement[0].classList.add('my-extra-css');
      })
    ).subscribe((data)=>{
      if(data['status']==true){    
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/todo/planning']));
      }else{
      }
    });
  }

}
