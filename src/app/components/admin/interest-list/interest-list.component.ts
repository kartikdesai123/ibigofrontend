import { Component, OnInit } from '@angular/core';
import { Interests } from '../../../Interests';
import { AddInterestService } from 'src/app/service/add-interest.service';
import { ToastrService } from 'src/app/toastr.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-interest-list',
  templateUrl: './interest-list.component.html',
  styleUrls: ['../../../../../node_modules/admin-lte/bower_components/bootstrap/dist/css/bootstrap.min.css',
  "../../../../../node_modules/admin-lte/bower_components/font-awesome/css/font-awesome.min.css",
  "../../../../../node_modules/admin-lte/bower_components/Ionicons/css/ionicons.min.css",
  "../../../../../node_modules/admin-lte/dist/css/AdminLTE.min.css",
  "../../../../../node_modules/admin-lte/dist/css/skins/_all-skins.min.css",
  '../../../../../node_modules/admin-lte/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css']
})
export class InterestListComponent implements OnInit {
  interests: Interests[];
  
  constructor(private router :Router,private interests_service : AddInterestService,private toastrservice: ToastrService) { }

  ngOnInit() {
    this.getAllInterests();
  }

  getAllInterests(){
    this.interests_service.getInterest().subscribe((all : any)=>{
      this.interests=all.interest_details;
    });
  }
  delete(no){
    this.interests_service.deleteInterest(no).subscribe((data : any)=>{
      if(data.status==true){
        this.toastrservice.Success('Interest is Deleted');
        //this.router.navigate(['/admin/show-interests']);
        //window.location.reload();
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/admin/show-interests']));
        //window.location.href = '/admin/show-interests';
      }else{
        this.toastrservice.Error(data.message);
      }
    });
  }
}
