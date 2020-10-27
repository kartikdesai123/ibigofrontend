import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'src/app/toastr.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.css']
})
export class VerifyUserComponent implements OnInit {

  constructor(private http:HttpClient,private router : Router,private toastrservice: ToastrService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.http.get('https://ibigo.shadowis.nl/server-api/api/verify/'+this.route.snapshot.params.token,).subscribe((data)=>{
      
      if(data['status']==true){
        this.toastrservice.Success(data['message']);
        this.router.navigate(['/user/login']);
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
  }

}
