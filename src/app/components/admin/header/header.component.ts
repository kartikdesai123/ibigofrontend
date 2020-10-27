import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [
  	'../../../../../node_modules/admin-lte/bower_components/bootstrap/dist/css/bootstrap.min.css',
  	"../../../../../node_modules/admin-lte/bower_components/font-awesome/css/font-awesome.min.css",
    "../../../../../node_modules/admin-lte/bower_components/Ionicons/css/ionicons.min.css",
    "../../../../../node_modules/admin-lte/dist/css/AdminLTE.min.css",
    "../../../../../node_modules/admin-lte/dist/css/skins/_all-skins.min.css"
  	]
})
export class HeaderComponent implements OnInit {
  user;
  constructor() { }

  ngOnInit() {
    this.user  = JSON.parse(localStorage.getItem("user"));
  }

}
