import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/service/user-login.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css','../../../../../front-assets/css/bootstrap.min.css',
  '../../../../../front-assets/css/style.css',
  '../../../../../front-assets/css/responsive.css',
  '../../../../../front-assets/css/font-awesome.min.css',
  '../../../../../front-assets/css/owl-carousel.css',
  '../../../../../front-assets/css/pretty-checkbox.min.css','../../font-user.css']
})
export class SubscriptionComponent implements OnInit {

  constructor(private router: Router,private uls:UserLoginService) { }

  ngOnInit() {
    if (this.uls.isUserLoggedIn) {
      const u_type = localStorage.getItem('user_type');
      //alert(u_type);
      if(localStorage.getItem('user_type')=='"normal"'){
        this.router.navigate(['/user/homepage']);
      }else if(localStorage.getItem('user_type')=='"business"'){
        this.router.navigate(['/home/business/profile']);
      }
    }
  }
  onSignup(accounttype){
    
    localStorage.setItem('business_type',JSON.stringify(accounttype));
    this.router.navigate(['/business/register/business-info']);
  }
}
