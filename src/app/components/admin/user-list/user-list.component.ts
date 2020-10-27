import { Component, OnInit } from '@angular/core';
import { Interests } from '../../../Interests';
import { AddInterestService } from 'src/app/service/add-interest.service';
import { ToastrService } from 'src/app/toastr.service';
import { Router } from '@angular/router';
import { AdminUserService } from 'src/app/service/admin-user.service';
import { Users } from '../../../Users';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css','../../../../../node_modules/admin-lte/bower_components/bootstrap/dist/css/bootstrap.min.css',
  "../../../../../node_modules/admin-lte/bower_components/font-awesome/css/font-awesome.min.css",
  "../../../../../node_modules/admin-lte/bower_components/Ionicons/css/ionicons.min.css",
  "../../../../../node_modules/admin-lte/dist/css/AdminLTE.min.css",
  "../../../../../node_modules/admin-lte/dist/css/skins/_all-skins.min.css",
  '../../../../../node_modules/admin-lte/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css']
})
export class UserListComponent implements OnInit {
  users: Users[];
  constructor(private router :Router,private user_service :AdminUserService,private toastrservice: ToastrService) { }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers(){
    this.user_service.getUsers().subscribe((all : any)=>{
      this.users=all.users_details;
    });
  }

  delete(no){
    this.user_service.deleteUsers(no).subscribe((data : any)=>{
      if(data.status==true){
        this.toastrservice.Success('User is Deleted');
        //this.router.navigate(['/admin/show-interests']);
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/admin/show-users']));
      }else{
        this.toastrservice.Error(data.message);
      }
    });
  }
}
