import { Component, OnInit } from '@angular/core';
import { UserForgotPasswordService } from 'src/app/service/user-forgot-password.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'src/app/toastr.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css','../../../../front-assets/css/bootstrap.min.css',
  '../../../../front-assets/css/style.css',
  '../../../../front-assets/css/responsive.css',
  '../../../../front-assets/css/font-awesome.min.css',
  '../../../../front-assets/css/owl-carousel.css',
  '../../../../front-assets/css/pretty-checkbox.min.css','../font-user.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotpasswordForm: FormGroup;
  submitted = false;

  constructor(private ts : UserForgotPasswordService,private formBuilder: FormBuilder,private toastrservice: ToastrService) { }

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
