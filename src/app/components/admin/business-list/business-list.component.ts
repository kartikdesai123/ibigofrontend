import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminUserService } from 'src/app/service/admin-user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'src/app/toastr.service';

@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css','../../../../../node_modules/admin-lte/bower_components/bootstrap/dist/css/bootstrap.min.css',
  "../../../../../node_modules/admin-lte/bower_components/font-awesome/css/font-awesome.min.css",
  "../../../../../node_modules/admin-lte/bower_components/Ionicons/css/ionicons.min.css",
  "../../../../../node_modules/admin-lte/dist/css/AdminLTE.min.css",
  "../../../../../node_modules/admin-lte/dist/css/skins/_all-skins.min.css",
  '../../../../../node_modules/admin-lte/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css']
})
export class BusinessListComponent implements OnInit {
  users = [];
  constructor(private toastrservice: ToastrService,private router :Router,private user_service :AdminUserService,private http:HttpClient) { }

  ngOnInit() {
    this.http.get('https://ibigo.shadowis.nl/server-api/api/business').subscribe((data)=>{
      this.users = data['users_details'];
    });
  }

  delete(no){
    this.user_service.deleteUsers(no).subscribe((data : any)=>{
      if(data.status==true){
        this.toastrservice.Success('User is Deleted')
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/admin/show-business-users']));
      }else{
        this.toastrservice.Error(data.message);
      }
    });
  }

}
