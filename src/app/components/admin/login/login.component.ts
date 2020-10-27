import { Component, OnInit } from '@angular/core';
// import { AdminComponent } from '../admin.component';
import { TaskService } from '../../../service/task.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'src/app/toastr.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../../../node_modules/admin-lte/bower_components/bootstrap/dist/css/bootstrap.min.css',
  "../../../../../node_modules/admin-lte/bower_components/font-awesome/css/font-awesome.min.css",
  "../../../../../node_modules/admin-lte/bower_components/Ionicons/css/ionicons.min.css",
  "../../../../../node_modules/admin-lte/dist/css/AdminLTE.min.css",
  "../../../../../node_modules/admin-lte/dist/css/skins/_all-skins.min.css",'./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  user:string;
  password:string;
  constructor(private router :Router,private ts:TaskService, private formBuilder: FormBuilder,private toastrservice: ToastrService) { }
  
  
  ngOnInit() {
    if (this.ts.isUserLoggedIn) {
      this.router.navigate(['/admin']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    
    })
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
    
    // display form values on success
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.loginForm.value.email, null, 4));
    this.ts.login(this.loginForm.value.email,this.loginForm.value.password).subscribe((data)=>{
      if(data.status==true){
        
        //alert(data.message);
        this.toastrservice.Success(data.message);
        localStorage.setItem('user',JSON.stringify(data.user));
        localStorage.setItem('user_token',JSON.stringify(data.token));
        this.router.navigate(['/admin']);
      }else{
        //alert(data.message);
        this.toastrservice.Error(data.message);
      }
    });
  }
 
}
