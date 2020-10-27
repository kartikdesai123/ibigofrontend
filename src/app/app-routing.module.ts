import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/admin/login/login.component';
import { AdminforgotpasswordComponent } from './components/admin/adminforgotpassword/adminforgotpassword.component';
import { AdminResetPasswordComponent } from './components/admin/admin-reset-password/admin-reset-password.component';
import { AuthGuard } from './service/auth-guard.service';
import { AppComponent } from './app.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserLoginComponent } from './components/user/user-login/user-login.component';
import { UserHomeComponent } from './components/user/user-home/user-home.component';
import { AdminChangePasswordComponent } from './components/admin/admin-change-password/admin-change-password.component';
import { InterestAddComponent } from './components/admin/interest-add/interest-add.component';
import { InterestListComponent } from './components/admin/interest-list/interest-list.component';
import { InterestUpdateComponent } from './components/admin/interest-update/interest-update.component';
import { UserAddComponent } from './components/admin/user-add/user-add.component';
import { UserListComponent } from './components/admin/user-list/user-list.component';
import { UserUpdateComponent } from './components/admin/user-update/user-update.component';
import { UserRegisterComponent } from './components/user/registration/user-register/user-register.component';
import { UserProfileComponent } from './components/user/registration/user-profile/user-profile.component';
import { UserGenderComponent } from './components/user/registration/user-gender/user-gender.component';
import { UserInterestsComponent } from './components/user/registration/user-interests/user-interests.component';
import { UserAuthGuardService } from './service/user-auth-guard.service';
import { VerifyUserComponent } from './components/user/registration/verify-user/verify-user.component';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/user/reset-password/reset-password.component';
import { HomeComponent } from './components/user/home/home.component';
import { DummyComponent } from './components/dummy/dummy.component';
import { ProfileUpdateComponent } from './components/user/profile-update/profile-update.component';
import { GoogleBusinessComponent } from './components/user/business-registration/google-business/google-business.component';
import { BusinessRegisterComponent } from './components/user/business-registration/business-register/business-register.component';
import { BusinessProfileComponent } from './components/user/business-registration/business-profile/business-profile.component';
import { BusinessProfileUpdateComponent } from './components/user/business-profile-update/business-profile-update.component';
import { BusinessHomeComponent } from './components/user/business-home/business-home.component';
import { BusinessHomepageComponent } from './components/user/business-homepage/business-homepage.component';
import { BusinessShowComponent } from './components/admin/business-show/business-show.component';
import { BusinessAddComponent } from './components/admin/business-add/business-add.component';
import { BusinessListComponent } from './components/admin/business-list/business-list.component';
import { SubscriptionComponent } from './components/user/business-registration/subscription/subscription.component';
import { BusinessUpdateComponent } from './components/admin/business-update/business-update.component';
import { MobileLoginComponent } from './components/user/mobile-login/mobile-login.component';
import { SpotFriendsGroupsComponent } from './components/user/spot-friends-groups/spot-friends-groups.component';
import { SpotDetailComponent } from './components/user/spot-detail/spot-detail.component';
import { SpotReviewComponent } from './components/user/spot-review/spot-review.component';
import { CheckInPostComponent } from './components/admin/check-in-post/check-in-post.component';
import { PostListComponent } from './components/admin/post-list/post-list.component';
import { AdminSpotReviewComponent } from './components/admin/admin-spot-review/admin-spot-review.component';
import { AdminSpotDetailComponent } from './components/admin/admin-spot-detail/admin-spot-detail.component';
import { SpotSearchComponent } from './components/user/spot-search/spot-search.component';
import { PeopleDetailComponent } from './components/user/people-detail/people-detail.component';
import { UserReviewComponent } from './components/user/user-review/user-review.component';
import { AdminPeopleDetailComponent } from './components/admin/admin-people-detail/admin-people-detail.component';
import { UserChatComponent } from './components/user/user-chat/user-chat.component';
import { BusinessInterestsComponent } from './components/user/business-registration/business-interests/business-interests.component';
import { NormalPostListComponent } from './components/admin/normal-post-list/normal-post-list.component';
import { NormalPostDetailComponent } from './components/admin/normal-post-detail/normal-post-detail.component';
import { SpotPostDetailComponent } from './components/admin/spot-post-detail/spot-post-detail.component';
import { SpotPostListComponent } from './components/admin/spot-post-list/spot-post-list.component';
import { GroupDetailComponent } from './components/user/group-detail/group-detail.component';
import { AdminGroupDetailComponent } from './components/admin/admin-group-detail/admin-group-detail.component';
import { GroupListComponent } from './components/admin/group-list/group-list.component';
import { GroupPostListComponent } from './components/admin/group-post-list/group-post-list.component';
import { PageNotFoundComponent } from './components/user/page-not-found/page-not-found.component';
import { PlanningAndGoListComponent } from './components/user/planning-and-go-list/planning-and-go-list.component';
import { EventDetailComponent } from './components/user/event-detail/event-detail.component';
import { SpotEventComponent } from './components/user/spot-event/spot-event.component';

const routes: Routes = [
  {path:'',redirectTo:'/user/homepage',pathMatch:'full'},
  {path:'user/login',component:UserLoginComponent},
  {path:'user/login/mobile',component:MobileLoginComponent},
  {path:'user/home/:tab',component:UserHomeComponent,canActivate:[UserAuthGuardService]},
  {path:'user/homepage',component:HomeComponent},
  {path:'user/info/:tab',component:SpotFriendsGroupsComponent,canActivate:[UserAuthGuardService]},
  {path:'user/register',component:UserRegisterComponent},
  {path:'user/profile',component:UserProfileComponent},
  {path:'business/register/plans',component:SubscriptionComponent},
  {path:'business/register/business-info',component:GoogleBusinessComponent},
  {path:'business/register/basic-info',component:BusinessRegisterComponent},
  {path:'business/register/profile',component:BusinessProfileComponent},
  {path:'business/register/interests',component:BusinessInterestsComponent},
  {path:'home/business/profile',component:BusinessProfileUpdateComponent,canActivate:[UserAuthGuardService]},
  // {path:'business/homepage',component:BusinessHomepageComponent,canActivate:[UserAuthGuardService]},
  {path:'business/home/:tab',component:BusinessHomeComponent,canActivate:[UserAuthGuardService]},
  {path:'user/gender',component:UserGenderComponent},
  {path:'user/interests',component:UserInterestsComponent},
  {path:'spot-reviews/:id/:slug',component:SpotReviewComponent},
  {path:'user-reviews/:id/:slug',component:UserReviewComponent},
  {path:'spot-search',component:SpotSearchComponent},
  // {path: '**', component: PageNotFoundComponent},
  {path:'message',component:UserChatComponent},
  {path:'message/:id/:slug',component:UserChatComponent},
  {path:'spot/:id/:slug',component:SpotDetailComponent},
  {path:'people/:id/:slug',component:PeopleDetailComponent},
  {path:'group/:id/:slug',component:GroupDetailComponent},
  {path:'event/:id/:slug',component:EventDetailComponent},
  {path:'spot/events',component:SpotEventComponent},
  {path:'todo/:tab',component:PlanningAndGoListComponent,canActivate:[UserAuthGuardService]},

  {path:'user/verify/:token',component:VerifyUserComponent},
  {path:'user/logout',component:UserLoginComponent,canActivate:[UserAuthGuardService]},
  {path:'user/forgot-password',component:ForgotPasswordComponent},
  {path:'user/reset/:token',component:ResetPasswordComponent},
  {path:'user/updateprofile',component:ProfileUpdateComponent,canActivate:[UserAuthGuardService]},
  {path:'DummyComponent',component:DummyComponent},

  {path:'admin/login',component:LoginComponent},
  {path:'admin',component:AdminComponent,canActivate:[AuthGuard]},
  {path:'admin/forgot-password',component:AdminforgotpasswordComponent},
  {path:'admin/reset-password/:token',component:AdminResetPasswordComponent},
  {path:'admin/logout',component:LoginComponent,canActivate:[AuthGuard]},
  {path:'admin/admin-spot-detail/:id/:slug',component:AdminSpotDetailComponent,canActivate:[AuthGuard]},
  {path:'admin/admin-people-detail/:id/:slug',component:AdminPeopleDetailComponent,canActivate:[AuthGuard]},
  {path:'admin/admin-spot-review/:id/:slug',component:AdminSpotReviewComponent,canActivate:[AuthGuard]},
  {path:'admin/change-password',component:AdminChangePasswordComponent,canActivate:[AuthGuard]},
  {path:'admin/add-interests',component:InterestAddComponent,canActivate:[AuthGuard]},
  {path:'admin/show-interests',component:InterestListComponent,canActivate:[AuthGuard]},
  {path:'admin/edit-interest/:id',component:InterestUpdateComponent,canActivate:[AuthGuard]},
  {path:'admin/add-user',component:UserAddComponent,canActivate:[AuthGuard]},
  {path:'admin/show-users',component:UserListComponent,canActivate:[AuthGuard]},
  {path:'admin/edit-user/:id',component:UserUpdateComponent,canActivate:[AuthGuard]},
  {path:'admin/show-business-users',component:BusinessListComponent,canActivate:[AuthGuard]},
  {path:'admin/add-business-user',component:BusinessAddComponent,canActivate:[AuthGuard]},
  {path:'admin/edit-business-user/:id',component:BusinessUpdateComponent,canActivate:[AuthGuard]},
  {path:'admin/show-posts',component:PostListComponent,canActivate:[AuthGuard]},
  {path:'admin/show-normal-posts',component:NormalPostListComponent,canActivate:[AuthGuard]},
  {path:'admin/view-post/:id',component:CheckInPostComponent,canActivate:[AuthGuard]},
  {path:'admin/view-normal-post/:id',component:NormalPostDetailComponent,canActivate:[AuthGuard]},
  {path:'admin/spot-list',component:SpotPostListComponent,canActivate:[AuthGuard]},
  {path:'admin/group-list',component:GroupListComponent,canActivate:[AuthGuard]},
  {path:'admin/group-post-list',component:GroupPostListComponent,canActivate:[AuthGuard]},
  {path:'admin/admin-group-detail/:id/:slug',component:AdminGroupDetailComponent,canActivate:[AuthGuard]},
  {path:'admin/view-spot-post/:id',component:SpotPostDetailComponent,canActivate:[AuthGuard]},
  {path:'admin/admin-spot-reviews',component:AdminSpotReviewComponent,canActivate:[AuthGuard]},
  
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
