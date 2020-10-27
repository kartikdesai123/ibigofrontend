import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'src/app/toastr.service';
import { FormBuilder, FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { UserHomeServiceService } from 'src/app/service/user-home-service.service';
import { finalize } from 'rxjs/operators';
import { element } from 'protractor';
import { SpotSearchService } from 'src/app/service/spot-search.service';
@Component({
  selector: 'app-spot-event',
  templateUrl: './spot-event.component.html',
  styleUrls: ['./spot-event.component.css','../../../../front-assets/css/bootstrap.min.css',
  '../../../../front-assets/css/style.css',
  '../../../../front-assets/css/responsive.css',
  '../../../../front-assets/css/font-awesome.min.css',
  '../../../../front-assets/css/owl-carousel.css',
  '../../../../front-assets/css/pretty-checkbox.min.css','../font-user.css']
})
export class SpotEventComponent implements OnInit {
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
  
  searchText:string;
  eventfieldname = 'event_title';
  spot_id;
  searchFriendText:string;
  searchGroupText:string;
  invite_frd_id :any= [];
  invite_friends = [];
  submitted = false;
  event_submitted = false;
  valid_from = [];
  query;
  valid_form=false;  
  mytime;  
  minDate: Date = new Date();  
  start_date_time;
  end_date_time;
  edit_event;
  events = [];
  connected_users= [];
  is_edit_event:boolean=false;

  constructor(private searchService:SpotSearchService,private cd:ChangeDetectorRef,private route: ActivatedRoute,private http:HttpClient,private router:Router,private ts : UserHomeServiceService,private formBuilder: FormBuilder,private toastrservice: ToastrService) { }

  ngOnInit() {
    const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))}); 
    
   
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-user-events',{headers:headers}).subscribe((data)=>{
      // console.log(data['liked_connected_spots'][0].liked_users[0]);
      this.events = data['events'];      
    });
    
    this.searchSpot = this.formBuilder.group({
      searchText: new FormControl()
    });
    this.eventForm = this.formBuilder.group({
      event_title: new FormControl('', [Validators.required]),
      event_description: new FormControl('', [Validators.required]),
      start_date: new FormControl('', [Validators.required]),
      end_date: new FormControl('', [Validators.required]),
      start_time: new FormControl('', [Validators.required]),
      end_time: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
    });
    //this.eventForm.patchValue({start_time:this.mytime});
  }

  onEventEdit(event_id){    
    if(event_id){
      this.eventForm.reset();
      this.http.get('https://ibigo.shadowis.nl/server-api/api/edit-event/'+event_id).subscribe((data)=>{        
        if(data['status']==true){
          this.is_edit_event = true;
          this.edit_event = data['event'];
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
    
    if(this.is_edit_event == true){
      formData.append('event_id',this.edit_event.id);    
      create_or_update_event = 'update-event';
    }else{
      create_or_update_event = 'create-event';
    }
    formData.append('host_group',null);
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
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/spot/events']));
      }
    });
  }

  get ef() { return this.eventForm.controls; }
  
  onEventDelete(event_id){
    if(confirm('Are you sure want to delete this record ')){
      this.events = this.events.filter(function(obj){
        return obj.id !== event_id;
      });
      this.http.get('https://ibigo.shadowis.nl/server-api/api/delete-event/'+event_id).pipe(
        finalize(()=>{
          var bodyelement = document.getElementsByClassName('modal-open');
          bodyelement[0].classList.add('my-extra-css'); 
        })
      ).subscribe((data)=>{});      
    }
  }

  spotText(e:any){    
    this.searchText = e.target.value;    
  }
}
