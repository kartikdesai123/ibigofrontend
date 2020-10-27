import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ToastrService } from 'src/app/toastr.service';

@Component({
  selector: 'app-admin-spot-detail',
  templateUrl: './admin-spot-detail.component.html',
  styleUrls: ['./admin-spot-detail.component.css','../../../../../node_modules/admin-lte/bower_components/bootstrap/dist/css/bootstrap.min.css',
  "../../../../../node_modules/admin-lte/bower_components/font-awesome/css/font-awesome.min.css",
  "../../../../../node_modules/admin-lte/bower_components/Ionicons/css/ionicons.min.css",
  "../../../../../node_modules/admin-lte/dist/css/AdminLTE.min.css",
  "../../../../../node_modules/admin-lte/dist/css/skins/_all-skins.min.css",
  '../../../../../node_modules/admin-lte/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css']
})
export class AdminSpotDetailComponent implements OnInit {
  users_details = [];
  spot_details = [];
  about_submitted = false;
  interest_details = [];
  spot_videos = [];
  spot_photos = [];
  mydata = [];
  files = [];
  reviews = [];
  reviewForm: FormGroup;
  first_name;
  full_address;
  last_name;
  age;
  spot_id;unique_spot_id;
  user_cover;
  logged_in_user_id;
  update_review = [];
  avg_rating;
  user_about;
  user_profile;
  reviews_count;
  spot_slug;
  is_connected_count;
  public imagePath;
  imgURL: any;
  friends = [];
  spot_name;
  spot_profile;
  dbfiles = [];
  is_connected;
  is_liked;
  is_edit;
  liked_users = [];
  rating_users = [];
  business_details = [];
  spot_photos_by_user = [];
  spot_videos_by_user = [];
  business_name;
  loading :boolean = true;
  max_images;
  user_type;
  venue_id;
  max_videos;
  duration;
  four_square_api_photos=[];
  photos_cnt;
  videos_cnt;
  upload_btn :boolean= false;
  video_array_size = [];
  photos_extensions = ['png','jpeg','jpg','tiff','pjp','pjpeg','jfif','tif','gif','svg','bmp','svgz','webp','ico','xbm','dib'];
  video_extensions = ['mp4','ogm','wmv','mpg','webm','ogv','mov','asx','mpeg','m4v','avi'];
  logged_in_user : boolean;
  constructor(private toastrservice:ToastrService,private formBuilder: FormBuilder,private route: ActivatedRoute,private http:HttpClient,private router:Router) { }

  ngOnInit() {
    this.unique_spot_id = this.route.snapshot.params.id;
    this.spot_slug = this.route.snapshot.params.slug;
    this.http.get('https://ibigo.shadowis.nl/server-api/api/spot/'+this.unique_spot_id).subscribe((data)=>{
      if(data['status']==true){
        this.spot_details = data['user_details'];
        this.unique_spot_id  = this.spot_details['unique_id'];
        this.spot_slug  = this.spot_details['user_slug'];
        //this.router.navigate(['/spot/'+this.unique_spot_id+'/'+this.spot_slug]);
        
       
        this.rating_users = data['rating_users'];
        this.liked_users = data['liked_users'];
        this.business_details = data['business_details'];
        this.business_name  = this.business_details['business_name'];
        this.full_address  = this.business_details['full_address'];
        this.venue_id = this.business_details['place_id']
        if(this.venue_id){
          this.http.get('https://api.foursquare.com/v2/venues/'+this.venue_id+'/photos?client_id=IQVXPFHN5YKW1BXON50GW1YVVZ1VPUTGYZD1VCO1OSMF4DON&client_secret=IRTCUWTAWZC5LLFKGNO5VDJZWB451IC5E51TYHITPJS1XOHT&v=20200612').subscribe((data:any)=>{
            this.four_square_api_photos = data.response.photos.items;
          });
        }
        this.spot_id  = this.spot_details['id'];
        this.reviews = data['reviews'];
        this.spot_photos_by_user = data['spot_photos_by_user'];
        this.spot_videos_by_user = data['spot_videos_by_user'];
        this.avg_rating = data['avg_rating'];
        this.reviews_count = data['reviews_count'];
        this.is_connected_count = data['is_connected_count'];
        this.spot_profile  = this.spot_details['user_profile'];
        this.user_cover  = this.spot_details['user_cover'];
        this.user_type = this.business_details['business_type'];
        if(this.user_type=='basic'){
          this.max_images = 4;
          this.max_videos = 1;
        }else{
          this.max_images = 25;
          this.max_videos = 5;
        }
        this.spot_photos = data['photos'];
        this.dbfiles = this.spot_photos;
        this.spot_videos = data['videos'];
        
        this.photos_cnt = this.spot_photos.length;
        this.videos_cnt = this.spot_videos.length;
        
        this.dbfiles.push.apply(this.dbfiles, this.spot_videos);
        if(this.dbfiles.length > 0){
          this.is_edit = true;
        }
        if(this.photos_cnt <= this.max_images && this.videos_cnt <= this.max_videos && this.video_array_size.length<1){
          if(this.photos_cnt==0 && this.videos_cnt==0){
            this.upload_btn = false;
          }else{
            this.upload_btn = true;
          }
        }else{
          this.upload_btn = false;
        } 
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
    this.reviewForm = this.formBuilder.group({
      review: new FormControl()
    });
  }

  onRemoveFileFromDB(fname){
    var deleteobj = this.dbfiles.filter(function( obj ) {
      return obj == fname;
    });    
    this.dbfiles = this.dbfiles.filter(function( obj ) {
      return obj !== fname;
    });   
    if(deleteobj[0].includes('mp4','ogm','wmv','mpg','webm','ogv','mov','asx','mpeg','m4v','avi')){
      this.videos_cnt--;
    }else if(deleteobj[0].includes('png','jpeg','jpg','tiff','pjp','pjpeg','jfif','tif','gif','svg','bmp','svgz','webp','ico','xbm','dib')){
      this.photos_cnt--;
    }
    

  }

  onRemoveFile(id){
    
    var delteobj = this.mydata.filter(function( obj ) {
      return obj.id == id;
    });
    
    if(delteobj[0].type=='img'){
      this.photos_cnt--;
    }else if(delteobj[0].type=='video'){
      this.videos_cnt--;
    }
    this.mydata = this.mydata.filter(function( obj ) {
      return obj.id !== id;
    });
    this.files = this.files.filter(function( obj ) {
      return obj.id !== id;
    }); 
    this.video_array_size = this.video_array_size.filter(function( obj ) {
      return obj.id !== id;
    });
    
    if(this.photos_cnt <= this.max_images && this.videos_cnt <= this.max_videos && this.video_array_size.length<1){
      if(this.photos_cnt==0 && this.videos_cnt==0){
        this.upload_btn = false;
      }else{
        this.upload_btn = true;
      }
    }else{
      this.upload_btn = false;
    }
  }

  onSelectFile(event){
    var file_count;
    var file_i;
    if(Math.max.apply(Math, this.files.map(function(o) { return o.id; }))!='-Infinity'){
      file_i = Math.max.apply(Math, this.files.map(function(o) { return o.id; })) + 1;
      file_count = Math.max.apply(Math, this.files.map(function(o) { return o.id; })) + 1;
    }else{
      file_count = this.files.length + 1;
      file_i = this.files.length + 1;
    }
    for (var i = 0; i < event.target.files.length; i++) { 
      this.files.push({id:file_i,file:event.target.files[i]});
      file_i++;
    }
    
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        if (file.type.indexOf("image") > -1) {
          
          reader.onload = (e: any) => {
            
              this.mydata.push({
                id:file_count,
                name: file.name,
                url:e.target.result,
                type: 'img'
              });
            file_count++;
            
          };
          this.photos_cnt++;
          reader.readAsDataURL(file);    
          if(this.photos_cnt <= this.max_images && this.videos_cnt <= this.max_videos && this.video_array_size.length<1){
            if(this.photos_cnt==0 && this.videos_cnt==0){
              this.upload_btn = false;
            }else{
              this.upload_btn = true;
            }
          }else{
            this.upload_btn = false;
          } 
        }  
        if (file.type.indexOf("video") > -1) {
          var video = document.createElement('video');
          video.src = URL.createObjectURL(file);
          video.onloadedmetadata = () =>{
            this.duration = video.duration
            this.mydata.push({
              id:file_count,
              name: file.name,
              duration : parseInt(this.duration),
              url:video.src,
              type: 'video'
            });
            if(parseInt(this.duration) > 30){
              var myobj = {id:file_count,duration:this.duration};
              this.video_array_size.push(myobj);
              if(this.photos_cnt <= this.max_images && this.videos_cnt <= this.max_videos && this.video_array_size.length<1){
                if(this.photos_cnt==0 && this.videos_cnt==0){
                  this.upload_btn = false;
                }else{
                  this.upload_btn = true;
                }
              }else{
                this.upload_btn = false;
              } 
            }else{
              if(this.photos_cnt <= this.max_images && this.videos_cnt <= this.max_videos && this.video_array_size.length<1){
                if(this.photos_cnt==0 && this.videos_cnt==0){
                  this.upload_btn = false;
                }else{
                  this.upload_btn = true;
                }
              }else{
                this.upload_btn = false;
              } 
            }
            file_count++;
          };
          this.videos_cnt++;
        } 
        
      }

    }
    
    //console.log(this.video_array_size.length);
    
  }

  onReviewSubmit(){
    var review_icon = document.getElementById('review-icon');
    var review_btn = document.getElementById('review-btn') as HTMLButtonElement;
    review_btn.disabled =true;
    review_icon.classList.add('fa-spinner');
    const formData = new FormData();
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    for (var i = 0; i < this.files.length; i++) { 
      formData.append("file[]", this.files[i].file);
    }
    if(this.is_edit==true){
      formData.append('db_files_array',this.dbfiles.join(','));
    }
    //admin/admin-spot-detail/71130191018560920315678/h&m
    this.http.post('https://ibigo.shadowis.nl/server-api/api/admin/business/update-files/'+this.spot_id,formData,{headers:headers}).pipe(
      finalize(() => {
        var bodyelement = document.getElementsByClassName('modal-open');
        bodyelement[0].classList.add('my-extra-css');
      })
    ).subscribe((data)=>{
      if(data['status']==true){
        this.toastrservice.Success(data['message']);
        this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/admin/admin-spot-detail/'+this.unique_spot_id+'/'+this.spot_slug]));
      }else{
        this.toastrservice.Error(data['message']);
      }
    });
  }


}
