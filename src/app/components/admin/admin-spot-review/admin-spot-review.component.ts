import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'src/app/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-admin-spot-review',
  templateUrl: './admin-spot-review.component.html',
  styleUrls: ['./admin-spot-review.component.css','../../../../../node_modules/admin-lte/bower_components/bootstrap/dist/css/bootstrap.min.css',
  "../../../../../node_modules/admin-lte/bower_components/font-awesome/css/font-awesome.min.css",
  "../../../../../node_modules/admin-lte/bower_components/Ionicons/css/ionicons.min.css",
  "../../../../../node_modules/admin-lte/dist/css/AdminLTE.min.css",
  "../../../../../node_modules/admin-lte/dist/css/skins/_all-skins.min.css",
  '../../../../../node_modules/admin-lte/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css']
})
export class AdminSpotReviewComponent implements OnInit {
  spot_details = [];
  spot_videos = [];
  spot_photos = [];
  mydata = [];
  reviews = [];
  full_address;
  spot_id;unique_spot_id;
  user_cover;
  avg_rating;
  user_about;
  reviews_count;
  spot_slug;
  is_connected_count;
  imgURL: any;
  spot_profile;
  liked_users = [];
  rating_users = [];
  business_details = [];
  business_name;
  
  constructor(private toastrservice: ToastrService,private http:HttpClient,private route:ActivatedRoute,private router:Router) { }

  ngOnInit() {
    this.unique_spot_id = this.route.snapshot.params.id;
   this.spot_slug = this.route.snapshot.params.slug;
    this.http.get('https://ibigo.shadowis.nl/server-api/api/spot/'+this.unique_spot_id).subscribe((data)=>{
      if(data['status']==true){
        this.spot_details = data['user_details'];
        this.unique_spot_id  = this.spot_details['unique_id'];
        this.spot_slug  = this.spot_details['user_slug'];
        //this.router.navigate(['/spot/'+this.unique_spot_id+'/'+this.spot_slug]);
        this.spot_photos = data['photos'];
        this.spot_videos = data['videos'];
        this.rating_users = data['rating_users'];
        this.liked_users = data['liked_users'];
        this.business_details = data['business_details'];
        this.business_name  = this.business_details['business_name'];
        this.full_address  = this.business_details['full_address'];
        this.spot_id  = this.spot_details['id'];
        this.reviews = data['reviews'];
        this.avg_rating = data['avg_rating'];
        this.reviews_count = data['reviews_count'];
        this.is_connected_count = data['is_connected_count'];
        this.spot_profile  = this.spot_details['user_profile'];
        this.user_cover  = this.spot_details['user_cover'];
        if(this.spot_profile==null){
          this.spot_profile = '/assets/front-assets/images/pic1.png';
        }else{
          this.spot_profile = 'https://ibigo.shadowis.nl/server-api/public/user_profiles/'+this.spot_details['user_profile'];
        }
        this.user_about  = this.spot_details['user_about'];
        if(this.user_cover==null){
          this.imgURL = '/assets/front-assets/images/group-bg2.png';
        }else{
          this.imgURL = 'https://ibigo.shadowis.nl/server-api/public/user_cover/'+this.user_cover;
        }
      }
      
      
    });
  }

  delete(cid){
    if(confirm("Are you sure want to delete ?")) {
      const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json'); 
      this.http.post('https://ibigo.shadowis.nl/server-api/api/admin/remove-review/'+cid,{headers:headers}).subscribe((data)=>{
        if(data['status']==true){
          this.reviews = this.reviews.filter(function( obj ) {
            return obj.id !== cid;
          });
          this.toastrservice.Success(data['message']);
          this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/admin/admin-spot-review/'+this.unique_spot_id+'/'+this.spot_slug]));
        }else{
          this.toastrservice.Error(data['message']);
        }
      });
    }
  }

}
