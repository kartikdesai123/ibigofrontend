import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
//import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/angular';

import { FullCalendarOptions, EventObject } from 'ngx-fullcalendar';

@Component({
  selector: 'app-user-side-widget',
  templateUrl: './user-side-widget.component.html',
  styleUrls: ['./user-side-widget.component.css', '../../../../front-assets/css/bootstrap.min.css',
    '../../../../front-assets/css/style.css',
    '../../../../front-assets/css/responsive.css',
    '../../../../front-assets/css/font-awesome.min.css',
    '../../../../front-assets/css/owl-carousel.css',
    '../../../../front-assets/css/pretty-checkbox.min.css', '../font-user.css']
})
export class UserSideWidgetComponent implements OnInit {
  justcheckedin = [];
  recent_groups = [];
  recent_users = [];
  //currentEvents: EventApi[] = [];

  options: FullCalendarOptions;
  events: EventObject[];
  displaynearevents: [];
  constructor(private cd: ChangeDetectorRef, private http: HttpClient) { }
  headers = new HttpHeaders({ 'Authorization': JSON.parse(localStorage.getItem('client_token')) });
  ngOnInit() {

    this.http.get('https://ibigo.shadowis.nl/server-api/api/just-checkedin', { headers: this.headers }).subscribe((data) => {
      this.justcheckedin = data['justcheckedin'];
    });

    this.http.get('https://ibigo.shadowis.nl/server-api/api/recently-users', { headers: this.headers }).subscribe((data) => {
      this.recent_groups = data['recent_groups'];
      this.recent_users = data['recent_users'];
    });
    this.http.get('https://ibigo.shadowis.nl/server-api/api/calendar_events', { headers: this.headers }).subscribe((data) => {
      this.events = data['events'];
    });
    this.http.post('https://ibigo.shadowis.nl/server-api/api/search', { headers: this.headers }).subscribe((data) => {

      this.displaynearevents = data['event_list'];

      console.log(this.displaynearevents)

    });
    this.options = {
      editable: true,
      droppable: false,
      header: {
        left: 'prev',
        center: 'title',
        right: 'next'
      },
    };
    // this.events = [
    //   { id: 'a', title: 'My Birthday', start: '2020-10-18T18:00:00',allDay: true },
    //   { id: 'b', title: 'Friends coming round', start: '2020-10-15T18:00:00', end: '2020-10-15T23:00:00' }
    // ];
  }

  dateClick(e) {
    console.log(e);
  }

  eventMouseEnter(e) {
    console.log(e);
  }

  eventClick(e) {
    console.log(e);

  }

}
