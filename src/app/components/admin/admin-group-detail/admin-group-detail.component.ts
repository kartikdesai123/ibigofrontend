import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-group-detail',
  templateUrl: './admin-group-detail.component.html',
  styleUrls: ['./admin-group-detail.component.css','../../../../../node_modules/admin-lte/bower_components/bootstrap/dist/css/bootstrap.min.css',
  "../../../../../node_modules/admin-lte/bower_components/font-awesome/css/font-awesome.min.css",
  "../../../../../node_modules/admin-lte/bower_components/Ionicons/css/ionicons.min.css",
  "../../../../../node_modules/admin-lte/dist/css/AdminLTE.min.css",
  "../../../../../node_modules/admin-lte/dist/css/skins/_all-skins.min.css",
  '../../../../../node_modules/admin-lte/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css']
})
export class AdminGroupDetailComponent implements OnInit {

  constructor(private http:HttpClient,private route:ActivatedRoute) { }
  unique_group_id;
  group_slug;
  group;
  group_members;
  users_requests;
  ngOnInit() {
    this.unique_group_id = this.route.snapshot.params.id;
    this.group_slug = this.route.snapshot.params.slug;
    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-group/'+this.unique_group_id).subscribe(data=>{      
      this.group = data['group_details'];
      this.group_members = data['group_members'];
      this.users_requests = data['users_requests'];
      
    })
  }

}
