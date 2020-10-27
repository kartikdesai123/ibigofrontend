import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminForgotPasswordService } from 'src/app/service/admin-forgot-password.service';
import { ToastrService } from 'src/app/toastr.service';

@Component({
  selector: 'app-adminforgotpassword',
  templateUrl: './adminforgotpassword.component.html',
  styleUrls: ['../../../../../node_modules/admin-lte/bower_components/bootstrap/dist/css/bootstrap.min.css',
  "../../../../../node_modules/admin-lte/bower_components/font-awesome/css/font-awesome.min.css",
  "../../../../../node_modules/admin-lte/bower_components/Ionicons/css/ionicons.min.css",
  "../../../../../node_modules/admin-lte/dist/css/AdminLTE.min.css",
  "../../../../../node_modules/admin-lte/dist/css/skins/_all-skins.min.css",'./adminforgotpassword.component.css']
})
export class AdminforgotpasswordComponent implements OnInit {
  forgotpasswordForm: FormGroup;
  submitted = false;

  constructor(private ts : AdminForgotPasswordService,private formBuilder: FormBuilder,private toastrservice: ToastrService) { }

  ngOnInit() {
    this.forgotpasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  get f() { return this.forgotpasswordForm.controls; }

  onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.forgotpasswordForm.invalid) {
        return;
    }
    
    // display form values on success
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.forgotpasswordForm.value.email, null, 4));
    this.ts.forgotpassword(this.forgotpasswordForm.value.email).subscribe((data)=>{
      //console.log(data);
      if(data.status==true){
        //window.location.href = '/';
        //alert(data.message);
        this.toastrservice.Success(data.message);
        //localStorage.setItem('user',JSON.stringify(data.email));
      }else{
        //alert(data.message);
        this.toastrservice.Error(data.message);
      }
    });
  }

}
