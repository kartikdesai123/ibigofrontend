import { Component, OnInit, HostListener, TemplateRef } from '@angular/core';
import { SpotSearchService } from 'src/app/service/spot-search.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getSyntheticPropertyName } from '@angular/compiler/src/render3/util';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'src/app/toastr.service';
import { finalize } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
// import { google } from "googlemaps";
//import {} from '../../../../../node_modules/@types/googlemaps';
//declare module 'googlemaps';
//declare var google: any;
//import {} from "googlemaps"
//declare var google: any;
@Component({
  selector: 'app-spot-search',
  templateUrl: './spot-search.component.html',
  styleUrls: ['./spot-search.component.css', '../../../../front-assets/css/bootstrap.min.css',
    '../../../../front-assets/css/style.css',
    '../../../../front-assets/css/responsive.css',
    '../../../../front-assets/css/font-awesome.min.css',
    '../../../../front-assets/css/owl-carousel.css',
    '../../../../front-assets/css/pretty-checkbox.min.css', '../font-user.css']
})

export class SpotSearchComponent implements OnInit {
  searchText;
  fieldname = 'business_name';
  fieldFriend = 'user_name';
  fieldPeople = 'user_name';
  spots = [];
  peoples = [];
  friends = [];
  cnt;
  selected_interest;
  interests = [];
  groups = [];
  events = [];
  logged_in_user = false;
  selected_user_type;
  today: number = Date.now();
  searchAddress;
  now = new Date();
  next_month;
  searchForm: FormGroup;
  counts = [];
  selected_duration = null;
  user_type;
  start_date_ranges = '';
  end_date_ranges = '';
  logged_in_user_type;
  constructor(private toastrservice: ToastrService, private formBuilder: FormBuilder, private mapsAPILoader: MapsAPILoader, private searchService: SpotSearchService, private http: HttpClient, private router: Router, private modalService: BsModalService) { }
  //headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
  formData = new FormData();
  onText(e) {
    this.searchAddress = e.target.value
    this.search();
  }
  ngOnInit() {
    var now = new Date();
    if (now.getMonth() == 11) {
      this.next_month = new Date(now.getFullYear() + 1, 0, 1);
    } else {
      this.next_month = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    var user_t = localStorage.getItem('user_type');

    let headers = new HttpHeaders();
    //this.router.navigate(['/spot-reviews/'+id]);
    if (user_t == '"normal"') {
      this.logged_in_user_type = 'normal';
    } else if (user_t == '"normal"') {
      this.logged_in_user_type = 'business';
    }
    if (user_t == '"normal"' || user_t == '"business"') {
      this.user_type = 'normal';

      this.logged_in_user = true;
      headers = headers.set('Authorization', JSON.parse(localStorage.getItem('client_token')));
    }

    var data = this.searchService.retrieveSearchObject();
    if (Object.keys(data).length > 0) {
      this.searchText = data['search_name'];
      this.selected_interest = data['selected_interest'];
      this.selected_user_type = data['selected_user_type'];
      this.spots = [];
      this.peoples = [];
      this.friends = [];
      this.groups = [];
      this.events = [];
    }
    console.log(this.selected_user_type);

    if (this.searchText || this.selected_interest) {
      this.search();
    } else {
      this.router.navigate(['/user/login']);
    }
    this.searchForm = this.formBuilder.group({
      search_address: ('')
    });
    if (window.screen.width >= 575) {
      this.hide_filter = false;
    } else {
      this.hide_filter = true;
    }
    //var distance = require('google-distance-matrix'); 
    //distance.key('AIzaSyCxzzYS6vBl3XB70NL470ovc_3cMcAkKCI');
    // var origins = ['San Francisco CA'];
    // var destinations = ['New York NY', '41.8337329,-87.7321554'];
    // distance.matrix(origins, destinations, function (err, distances) {
    //     if (!err)
    //       console.log(distances);
    // })
    //this.calculateDistance();
    // var origin1 = new google.maps.LatLng(21.2004545,72.8037208);
    // var destinationB = new google.maps.LatLng(20.594,72.934);
    // //this.searchService.getDistancia(origin1,destinationB);
    // var origin1 = new google.maps.LatLng(55.930385, -3.118425);
    // var origin2 = 'Greenwich, England';
    // var destinationA = 'Stockholm, Sweden';
    // var destinationB = new google.maps.LatLng(50.087692, 14.421150);

    // var service = new google.maps.DistanceMatrixService();
    // service.getDistanceMatrix(
    //   {
    //     origins: [origin1, origin2],
    //     destinations: [destinationA, destinationB],
    //     travelMode: google.maps.TravelMode.DRIVING,
    //   }, callback);

    // function callback(response, status) {
    //   console.log(response);
    //   console.log(status);

    // }
  }
  hide_filter: boolean;
  hideFilter() {
    if (this.hide_filter == false) {
      this.hide_filter = true;
    } else {
      this.hide_filter = false;
    }
  }
  date_ranges = [];
  onStartValueChange(e) {

    this.selected_duration = 'date_range';
    this.start_date_ranges = e;

    //this.date_ranges.push(e);
    this.search();
  }
  onEndValueChange(e) {
    this.selected_duration = 'date_range';
    this.end_date_ranges = e;
    //this.date_ranges.push(e);
    this.search();
  }
  onSelectDuration(duration) {
    this.selected_duration = duration;
    this.search();
  }
  // calculateDistance() {
  //   var mexicoCity = new google.maps.LatLng(21.2004545,72.8037208);
  //   var jacksonville = new google.maps.LatLng(20.594,72.934);
  //   const distance = google.maps.geometry.spherical.computeDistanceBetween(mexicoCity, jacksonville);
  //   console.log(distance)

  // }
  // addToGoList(spot_id) {
  //   if (confirm('Do you want to add this spot in go to list ?')) {
  //     const formData = new FormData();
  //     const headers = new HttpHeaders({ 'Authorization': JSON.parse(localStorage.getItem('client_token')) });
  //     headers.append('Accept', 'application/json');
  //     formData.append('spot_id', spot_id);
  //     this.http.post('https://ibigo.shadowis.nl/server-api/api/add-to-goto', formData, { headers: headers }).subscribe((data) => {
  //       if (data['status'] == true) {
  //         this.router.navigate(['/todo/go-list'])
  //       }
  //     });
  //   }
  // }

  // -------------------------------------------------------------------------------------------------------------
  // Add to go modal popup
  // -------------------------------------------------------------------------------------------------------------
  addToGoModal: BsModalRef;
  addToGoList(addToList: TemplateRef<any>) {
    this.addToGoModal = this.modalService.show(addToList);
  }

  public confirmAddToGoList(spotId): void {
    const formData = new FormData();
    const headers = new HttpHeaders({ 'Authorization': JSON.parse(localStorage.getItem('client_token')) });
    headers.append('Accept', 'application/json');
    formData.append('spot_id', spotId);
    this.http.post('https://ibigo.shadowis.nl/server-api/api/add-to-goto', formData, { headers: headers }).subscribe((data) => {
      if (data['status'] == true) {
        this.router.navigate(['/todo/go-list'])
      }
    });
    this.addToGoModal.hide();
  }

  public declineAddToGoList(): void {
    this.addToGoModal.hide();
  }

  // -------------------------------------------------------------------------------------------------------------
  // Add to planning modal popup
  // -------------------------------------------------------------------------------------------------------------
  addTPlanningModal: BsModalRef;
  addToPlanning(addPlanning: TemplateRef<any>) {
    if (this.logged_in_user == true) {
      this.addTPlanningModal = this.modalService.show(addPlanning);
    } else {
      this.router.navigate(['/user/login']);
    }
  }

  public confirmAddtoPlanningList(eventId): void {
    const formData = new FormData();
    const headers = new HttpHeaders({ 'Authorization': JSON.parse(localStorage.getItem('client_token')) });
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    formData.append('event_id', eventId);
    formData.append('spot_id', null);
    this.http.post('https://ibigo.shadowis.nl/server-api/api/add-planning', formData, { headers: headers }).subscribe((data) => {
      if (data['status'] == true) {
        this.toastrservice.Success(data['event_message']);
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/todo/planning']));
      } else {
        this.toastrservice.Success('Something wring!');
      }
    });
    this.addTPlanningModal.hide();
  }

  public declineAddtoPlanningList(): void {
    this.addTPlanningModal.hide();
  }

  // -------------------------------------------------------------------------------------------------------------
  // Share event modal popup
  // -------------------------------------------------------------------------------------------------------------
  shareEventModalRef: BsModalRef;
  shareEvent(shareEventTemplate: TemplateRef<any>) {
    if (this.logged_in_user == true) {
      this.shareEventModalRef = this.modalService.show(shareEventTemplate);
    } else {
      this.router.navigate(['/user/login']);
    }
  }

  public confirmshareEvent(eventId): void {
    const formData = new FormData();
    const headers = new HttpHeaders({ 'Authorization': JSON.parse(localStorage.getItem('client_token')) });
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    formData.append('event_id', eventId);
    this.http.post('https://ibigo.shadowis.nl/server-api/api/add-spot', formData, { headers: headers }).pipe(
      finalize(() => {
      })
    ).subscribe((data) => {
      if (data['status'] == true) {
        this.toastrservice.Success(data['message']);
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/homepage']));
      } else {
        this.toastrservice.Error(data['message']);
      }
    });
    this.shareEventModalRef.hide();
  }

  public declineshareEvent(): void {
    this.shareEventModalRef.hide();
  }

  search() {
    var user_t = localStorage.getItem('user_type');
    let headers = new HttpHeaders();
    //this.router.navigate(['/spot-reviews/'+id]);
    if (user_t == '"normal"' || user_t == '"business"') {
      this.user_type = 'normal';
      headers = headers.set('Authorization', JSON.parse(localStorage.getItem('client_token')));
    }
    // alert(this.start_date_ranges);
    // if(this.date_ranges.length > 0){
    //this.date_ranges[0] = this.date_ranges[0].toLocaleDateString();
    //this.date_ranges[1] = this.date_ranges[1].toLocaleDateString();  

    // this.formData.append('start_date',this.date_ranges[0].toLocaleDateString());

    if (this.start_date_ranges != "" && this.start_date_ranges != "undefined") {
      var sdate = new Date(this.start_date_ranges);
      this.formData.append('start_date', sdate.toLocaleDateString());
    }
    if (this.end_date_ranges != "" && this.end_date_ranges != "undefined") {
      var edate = new Date(this.end_date_ranges);
      this.formData.append('end_date', edate.toLocaleDateString());
    }

    //  }
    this.formData.append('selected_duration', this.selected_duration);
    this.formData.append('searchAddress', this.searchAddress);
    this.formData.append('latitude', localStorage.getItem('lat'));
    this.formData.append('longitude', localStorage.getItem('long'));

    this.formData.append('searchText', this.searchText);
    this.formData.append('selected_user_type', this.selected_user_type);
    this.formData.append('search_interest', this.selected_interest);
    this.http.post('https://ibigo.shadowis.nl/server-api/api/search', this.formData, { headers: headers }).subscribe((data) => {
      this.counts = data['counts'];
      this.groups = data['group_list'];
      this.events = data['event_list'];
      this.peoples = data['people_list'];
      this.interests = data['all_interests'];
      this.spots = data['spots'];

      if (this.spots.length == 0 && this.peoples.length == 0 && this.groups.length == 0 && this.events.length == 0) {
        this.cnt = 0;
      } else {
        this.cnt = 1;
      }
    });
  }

  // shareEvent(event_id) {
  //   if (this.logged_in_user == true) {
  //     if (confirm('Do you want to share this event?')) {
  //       const formData = new FormData();
  //       const headers = new HttpHeaders({ 'Authorization': JSON.parse(localStorage.getItem('client_token')) });
  //       headers.append('Content-Type', 'multipart/form-data');
  //       headers.append('Accept', 'application/json');
  //       formData.append('event_id', event_id);
  //       this.http.post('https://ibigo.shadowis.nl/server-api/api/add-spot', formData, { headers: headers }).pipe(
  //         finalize(() => {
  //         })
  //       ).subscribe((data) => {
  //         if (data['status'] == true) {
  //           this.toastrservice.Success(data['message']);
  //           //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/homepage']));
  //         } else {
  //           this.toastrservice.Error(data['message']);
  //         }
  //       });
  //     }
  //   } else {
  //     this.router.navigate(['/user/login']);
  //   }
  // }

  // addToPlanning(event_id) {
  //   if (this.logged_in_user == true) {
  //     if (confirm('Do you want to this event to planning?')) {
  //       const formData = new FormData();
  //       const headers = new HttpHeaders({ 'Authorization': JSON.parse(localStorage.getItem('client_token')) });
  //       headers.append('Content-Type', 'multipart/form-data');
  //       headers.append('Accept', 'application/json');
  //       formData.append('event_id', event_id);
  //       formData.append('spot_id', null);
  //       this.http.post('https://ibigo.shadowis.nl/server-api/api/add-planning', formData, { headers: headers }).subscribe((data) => {
  //         if (data['status'] == true) {
  //           this.toastrservice.Success(data['event_message']);
  //           //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/todo/planning']));
  //         } else {
  //           this.toastrservice.Success('Something wring!');
  //         }
  //       });
  //     }
  //   } else {
  //     this.router.navigate(['/user/login']);
  //   }
  // }

  onChangeInterest(id) {
    if (id) {
      this.selected_interest = id;
    } else {
      this.selected_interest = null;
    }
    //this.searchService.saveSearchObject({search_name:this.searchText,selected_interest:this.selected_interest,selected_user_type:this.selected_user_type});
    this.search();
  }

  onSelectUserType(user_type) {
    if (user_type) {
      this.selected_user_type = user_type;
    } else {
      this.selected_user_type = null;
    }
    this.search();
  }
}
