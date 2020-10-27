import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-post-list',
  templateUrl: './group-post-list.component.html',
  styleUrls: ['./group-post-list.component.css','../../../../../node_modules/admin-lte/bower_components/bootstrap/dist/css/bootstrap.min.css',
  "../../../../../node_modules/admin-lte/bower_components/font-awesome/css/font-awesome.min.css",
  "../../../../../node_modules/admin-lte/bower_components/Ionicons/css/ionicons.min.css",
  "../../../../../node_modules/admin-lte/dist/css/AdminLTE.min.css",
  "../../../../../node_modules/admin-lte/dist/css/skins/_all-skins.min.css"]
})
export class GroupPostListComponent implements OnInit {

  constructor(private http:HttpClient) { }
  posts = [];
  ngOnInit() {
    this.http.get('https://ibigo.shadowis.nl/server-api/api/admin/group-posts/list').subscribe((data)=>{
      if(data['status']==true){
        this.posts = data['posts'];
      }    
    });
  }

  delete(pid){
    if(confirm('Are you sure want to delete?')){
      this.http.get('https://ibigo.shadowis.nl/server-api/api/admin/remove-post/'+pid).subscribe((data)=>{
        if(data['status']==true){
          this.posts = this.posts.filter(function( obj ) {
            return obj.id !== pid;
          });
        }    
      });
    }
  }

}
