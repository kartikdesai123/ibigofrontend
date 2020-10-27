import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../../../helpers/must-match-validator';
import { AdminResetPasswordService } from 'src/app/service/admin-reset-password.service';
import { ToastrService } from 'src/app/toastr.service';
import { UserResetPasswordService } from 'src/app/service/user-reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css','../../../../front-assets/css/bootstrap.min.css',
  '../../../../front-assets/css/style.css',
  '../../../../front-assets/css/responsive.css',
  '../../../../front-assets/css/font-awesome.min.css',
  '../../../../front-assets/css/owl-carousel.css',
  '../../../../front-assets/css/pretty-checkbox.min.css','../font-user.css']
})
export class ResetPasswordComponent implements OnInit {
  resetpasswordForm: FormGroup;
  token: string;
  submitted = false;
  constructor(private router : Router,private toastrservice: ToastrService,private route: ActivatedRoute, private formBuilder: FormBuilder, private ts: UserResetPasswordService) { }

  ngOnInit() {
    
    this.resetpasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'password_confirmation')
    })
  }

  get f() { return this.resetpasswordForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.resetpasswordForm.invalid) {
            return;
        }

        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.resetpasswordForm.value.confrimPassword, null, 4));
        this.ts.resetpassword(this.route.snapshot.params.token,this.resetpasswordForm.value.password,this.resetpasswordForm.value.password_confirmation).subscribe((data)=>{
          
          if(data.status==true){
            //window.location.href = '/';
            //alert(data.message);
            this.toastrservice.Success(data.message);
            //localStorage.setItem('user',JSON.stringify(data.email));
            this.router.navigate(['/user/login']);
          }else{
            //alert(data.message);
            this.toastrservice.Error(data.message);
          }
        });
    }

}
