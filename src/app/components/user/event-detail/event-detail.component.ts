import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { UserLoginService } from 'src/app/service/user-login.service';
import { ToastrService } from 'src/app/toastr.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css', '../../../../front-assets/css/bootstrap.min.css',
    '../../../../front-assets/css/style.css',
    '../../../../front-assets/css/responsive.css',
    '../../../../front-assets/css/font-awesome.min.css',
    '../../../../front-assets/css/owl-carousel.css',
    '../../../../front-assets/css/pretty-checkbox.min.css', '../font-user.css']
})
export class EventDetailComponent implements OnInit {
  groupProfileForm: FormGroup;
  public imagePath;
  imgURL: any;
  user_cover;
  profile_loading: boolean = false;
  unique_id;
  user_slug;
  loading;
  logged_in_user;
  event_details: any = {};
  event_invitations: any;
  event_id;
  users_details = [];
  logged_in_user_unique_id;
  logged_in_user_id;
  another_friends = [];
  user_name;
  user_profile;
  user_type;
  friends = [];
  groups = [];
  connected_users = [];
  connect_friends: any = [];
  constructor(private router: Router, private toastrservice: ToastrService, private formBuilder: FormBuilder, private route: ActivatedRoute, private us: UserLoginService, private http: HttpClient) { }

  ngOnInit() {
    this.loading = true;
    this.unique_id = this.route.snapshot.params.id;
    this.user_slug = this.route.snapshot.params.slug;
    this.logged_in_user = this.us.isUserLoggedIn();
    var user_t = localStorage.getItem('user_type');
    if (user_t == '"normal"') {
      this.user_type = 'normal';
    } else if (user_t == '"business"') {
      this.user_type = 'business';
    }
    let headers = new HttpHeaders();
    if (this.logged_in_user == true) {
      headers = headers.set('Authorization', JSON.parse(localStorage.getItem('client_token')));
      this.http.get('https://ibigo.shadowis.nl/server-api/api/get-user', { headers: headers }).subscribe((data) => {
        this.users_details = data['user_details'];
        this.user_name = this.users_details['first_name'] + ' ' + this.users_details['last_name'];
        this.logged_in_user_id = this.users_details['id'];
        this.user_profile = this.users_details['user_profile'];
        this.user_cover = this.users_details['user_cover'];
        if (this.user_profile == null) {
          this.user_profile = '/assets/front-assets/images/pic1.png';
        } else {
          this.user_profile = 'https://ibigo.shadowis.nl/server-api/public/user_profiles/' + this.users_details['user_profile'];
        }
        // if(this.unique_id==this.logged_in_user_unique_id){
        //   this.router.navigate(['/user/updateprofile']);
        // }
      });
      this.http.get('https://ibigo.shadowis.nl/server-api/api/get-connected-users', { headers: headers }).subscribe((data) => {
        this.connected_users = data['connected_users'];
      });
      this.http.get('https://ibigo.shadowis.nl/server-api/api/getgroups', { headers: headers }).subscribe((data) => {
        this.groups = data['connected_group_list'];
        //this.groups2 = data['connected_group_list'];
        //this.temp_groups = data['connected_group_list'];
      });
    }

    this.http.get('https://ibigo.shadowis.nl/server-api/api/get-event/' + this.unique_id, { headers: headers }).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((data) => {
      if (data['event_details']) {
        this.event_details = data['event_details'];
        this.event_invitations = data['event_invitation'];
        this.event_id = this.event_details.id;
      } else {
        this.router.navigate(['/user/homepage']);
      }
      if (this.event_details.event_cover != null) {
        this.imgURL = 'https://ibigo.shadowis.nl/server-api/public/event_cover/' + this.event_details.event_cover;
      }
    });
    this.http.get('https://ibigo.shadowis.nl/server-api/api/getfriends', { headers: headers }).subscribe((data) => {
      this.another_friends = data['friend_list'];
    });
    this.groupProfileForm = this.formBuilder.group({
      file: new FormControl(),
      fileSource: new FormControl()
    });
  }

  invite() {
    if (this.logged_in_user == true) {
      var invite_btn = document.getElementById('invite_btn');
      invite_btn.click();
    } else {
      this.router.navigate(['/user/login']);
    }
  }

  addToPlanning() {
    if (this.logged_in_user == true) {
      if (confirm('Do you want to this event to planning?')) {
        const formData = new FormData();
        const headers = new HttpHeaders({ 'Authorization': JSON.parse(localStorage.getItem('client_token')) });
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        formData.append('event_id', this.event_id);
        formData.append('spot_id', null);
        this.http.post('https://ibigo.shadowis.nl/server-api/api/add-planning', formData, { headers: headers }).subscribe((data) => {
          if (data['status'] == true) {
            this.toastrservice.Success(data['event_message']);
            //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/todo/planning']));
          } else {
            this.toastrservice.Success('Something wring!');
          }
        });
      }
    } else {
      this.router.navigate(['/user/login']);
    }
  }

  preview(files) {
    if (files.length === 0)
      return;
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    const file = files[0];
    this.groupProfileForm.patchValue({
      fileSource: file,
      file: file
    });
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
    var element = document.getElementById('imageupload');
    element.classList.remove("hidden");
  }


  onProfileSubmit() {
    this.profile_loading = true;
    const formData = new FormData();
    const headers = new HttpHeaders({ 'Authorization': JSON.parse(localStorage.getItem('client_token')) });
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    //headers.set();
    formData.append('file', this.groupProfileForm.get('fileSource').value);

    this.http.post('https://ibigo.shadowis.nl/server-api/api/event/update-background/' + this.event_details.id, formData, { headers: headers }).subscribe((data) => {
      if (data['status'] == true) {
        this.profile_loading = false;
        var element = document.getElementById('imageupload');
        element.classList.add("hidden");
        this.toastrservice.Success(data['messages']);
        //this.router.navigateByUrl('/DummyComponent', {skipLocationChange: true}).then(() => this.router.navigate(['/home/business/profile']));
        //this.router.navigate(['/user/home']);
      } else {
        //this.toastrservice.Error(data['messages']);
      }
    });

  }
  tag_frd_id: any = [];
  share_frd_id: any = [];
  connect_frd_id: any = [];
  share_group_id: any = [];
  share_friends: any = [];
  share_groups = [];
  addSharelist(userid: string) {
    var index = this.another_friends.findIndex(x => x.id === userid);
    this.share_friends.push(this.another_friends[index]);
    this.share_frd_id.push(userid);
    this.another_friends = this.another_friends.filter(function (obj) {
      return obj.id !== userid;
    });
  }

  addlist(userid: string) {
    var index = this.connected_users.findIndex(x => x.id === userid);
    this.connect_friends.push(this.connected_users[index]);
    this.connect_frd_id.push(userid);
    this.connected_users = this.connected_users.filter(function (obj) {
      return obj.id !== userid;
    });
  }

  addShareGrouplist(group_id) {
    var index = this.groups.findIndex(x => x.id === group_id);
    this.share_groups.push(this.groups[index]);
    this.share_group_id.push(group_id);
    this.groups = this.groups.filter(function (obj) {
      return obj.id !== group_id;
    });
  }

  removeFromShareGroupList(group_id) {
    var index = this.share_groups.findIndex(x => x.id === group_id);
    this.groups.push(this.share_groups[index]);
    var tag_index = this.share_group_id.indexOf(group_id);
    if (tag_index > -1) {
      this.share_group_id.splice(tag_index, 1);
    }
    this.share_groups = this.share_groups.filter(function (obj) {
      return obj.id !== group_id;
    });
  }

  removeFromShareList(user_id) {
    var index = this.share_friends.findIndex(x => x.id === user_id);
    this.another_friends.push(this.share_friends[index]);

    var tag_index = this.share_frd_id.indexOf(user_id);
    if (tag_index > -1) {
      this.share_frd_id.splice(tag_index, 1);
    }
    this.share_friends = this.share_friends.filter(function (obj) {
      return obj.id !== user_id;
    });
  }
  removeList(user_id) {
    var index = this.connect_friends.findIndex(x => x.id === user_id);
    this.connected_users.push(this.connect_friends[index]);

    var tag_index = this.connect_frd_id.indexOf(user_id);
    if (tag_index > -1) {
      this.connect_frd_id.splice(tag_index, 1);
    }
    this.connect_friends = this.connect_friends.filter(function (obj) {
      return obj.id !== user_id;
    });
  }

  onSubmit() {
    const formData = new FormData();
    const headers = new HttpHeaders({ 'Authorization': JSON.parse(localStorage.getItem('client_token')) });
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    //headers.set();
    formData.append('share_group_id', this.share_group_id);
    formData.append('event_id', this.event_id);
    formData.append('share_frd_id', this.share_frd_id);
    this.http.post('https://ibigo.shadowis.nl/server-api/api/invite-to-event', formData, { headers: headers }).pipe(
      finalize(() => {
        var bodyelement = document.getElementsByClassName('modal-open');
        bodyelement[0].classList.add('my-extra-css');
      })
    ).subscribe((data) => {
      if (data['status'] == true) {
        //this.profile_loading = false;
        // var element = document.getElementById('imageupload');
        // element.classList.add("hidden");
        // this.toastrservice.Success(data['messages']);
        this.router.navigateByUrl('/DummyComponent', { skipLocationChange: true }).then(() => this.router.navigate(['/event/' + this.unique_id + '/' + this.user_slug]));
        //this.router.navigate(['/user/home']);
      } else {
        //this.toastrservice.Error(data['messages']);
      }
    });
  }

  onConnectSubmit() {
    const formData = new FormData();
    const headers = new HttpHeaders({ 'Authorization': JSON.parse(localStorage.getItem('client_token')) });
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    //headers.set();
    formData.append('share_group_id', this.share_group_id);
    formData.append('event_id', this.event_id);
    formData.append('share_frd_id', this.connect_frd_id);
    this.http.post('https://ibigo.shadowis.nl/server-api/api/invite-to-event', formData, { headers: headers }).subscribe((data) => {
      if (data['status'] == true) {
        //this.profile_loading = false;
        // var element = document.getElementById('imageupload');
        // element.classList.add("hidden");
        // this.toastrservice.Success(data['messages']);
        this.router.navigateByUrl('/DummyComponent', { skipLocationChange: true }).then(() => this.router.navigate(['/event/' + this.unique_id + '/' + this.user_slug]));
        //this.router.navigate(['/user/home']);
      } else {
        //this.toastrservice.Error(data['messages']);
      }
    });
  }
}
