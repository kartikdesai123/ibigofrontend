import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css','../../../../../node_modules/admin-lte/bower_components/bootstrap/dist/css/bootstrap.min.css',
  "../../../../../node_modules/admin-lte/bower_components/font-awesome/css/font-awesome.min.css",
  "../../../../../node_modules/admin-lte/bower_components/Ionicons/css/ionicons.min.css",
  "../../../../../node_modules/admin-lte/dist/css/AdminLTE.min.css",
  "../../../../../node_modules/admin-lte/dist/css/skins/_all-skins.min.css"]
})
export class GroupListComponent implements OnInit {
  groups = [];
  constructor(private http:HttpClient) { }

  ngOnInit() {
    this.http.get('https://ibigo.shadowis.nl/server-api/api/group-list').subscribe((data)=>{
      this.groups = data['groups'];
    
      
    });
  }

}
