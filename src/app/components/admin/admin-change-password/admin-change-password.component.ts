import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'src/app/toastr.service';
import { MustMatch } from '../../../helpers/must-match-validator';
import { AdminChangePasswordService } from 'src/app/service/admin-change-password.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-change-password',
  templateUrl: './admin-change-password.component.html',
  styleUrls: [	'../../../../../node_modules/admin-lte/bower_components/bootstrap/dist/css/bootstrap.min.css',
  "../../../../../node_modules/admin-lte/bower_components/font-awesome/css/font-awesome.min.css",
  "../../../../../node_modules/admin-lte/bower_components/Ionicons/css/ionicons.min.css",
  "../../../../../node_modules/admin-lte/dist/css/AdminLTE.min.css",
  "../../../../../node_modules/admin-lte/dist/css/skins/_all-skins.min.css"]
})
export class AdminChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  submitted = false;

  constructor(private router:Router,private ts : AdminChangePasswordService,private formBuilder: FormBuilder,private toastrservice: ToastrService) { }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      oldpassword: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'password_confirmation')
    })
  }

  get f() { return this.changePasswordForm.controls; }

  onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.changePasswordForm.invalid) {
        return;
    }
    
    // display form values on success
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.changePasswordForm.value.email, null, 4));
    this.ts.changePassword(this.changePasswordForm.value.oldpassword,this.changePasswordForm.value.password,this.changePasswordForm.value.password_confirmation).subscribe((data)=>{
      //console.log(data);
      if(data.status==true){
        //window.location.href = '/';
        //alert(data.message);
        this.toastrservice.Success(data.message);
        this.router.navigate(['/admin']);
        //localStorage.setItem('user',JSON.stringify(data.email));
      }else{
        //alert(data.message);
        this.toastrservice.Error(data.message);
      }
    });
  }
}
