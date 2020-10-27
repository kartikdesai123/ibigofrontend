import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'src/app/toastr.service';

@Component({
  selector: 'app-check-in-post',
  templateUrl: './check-in-post.component.html',
  styleUrls: ['./check-in-post.component.css','../../../../../node_modules/admin-lte/bower_components/bootstrap/dist/css/bootstrap.min.css',
  "../../../../../node_modules/admin-lte/bower_components/font-awesome/css/font-awesome.min.css",
  "../../../../../node_modules/admin-lte/bower_components/Ionicons/css/ionicons.min.css",
  "../../../../../node_modules/admin-lte/dist/css/AdminLTE.min.css",
  "../../../../../node_modules/admin-lte/dist/css/skins/_all-skins.min.css",
  '../../../../../node_modules/admin-lte/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css']
})
export class CheckInPostComponent implements OnInit {
  post : any= {};
  likes_users;
  photos_extensions = ['png','jpeg','jpg','tiff','pjp','pjpeg','jfif','tif','gif','svg','bmp','svgz','webp','ico','xbm','dib'];
  video_extensions = ['mp4','ogm','wmv','mpg','webm','ogv','mov','asx','mpeg','m4v','avi'];
  constructor(private http:HttpClient,private route : ActivatedRoute,private toastrservice: ToastrService,private router:Router) { }

  ngOnInit() {
    let id = this.route.snapshot.params.id;
    this.http.get('https://ibigo.shadowis.nl/server-api/api/admin/post/'+id).subscribe((data)=>{
      if(data['status']==true){
        this.post = data['post'][0];

      }
    });
  }

  deleteComment(cid){
    if(confirm("Are you sure want to delete ?")) {
      const headers = new HttpHeaders({'Authorization': JSON.parse(localStorage.getItem('client_token'))});
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json'); 
      this.http.post('https://ibigo.shadowis.nl/server-api/api/delete-comment/'+cid,{headers:headers}).subscribe((data)=>{
        if(data['status']==true){
          this.post.comments = this.post.comments.filter(function( obj ) {
            return obj.id !== cid;
          });
          this.toastrservice.Success(data['message']);
          //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/user/homepage']));
        }else{
          this.toastrservice.Error(data['message']);
        }
      });
    }
  }
}
