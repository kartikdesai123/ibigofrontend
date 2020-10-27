import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/admin/login/login.component';
import { AdminforgotpasswordComponent } from './components/admin/adminforgotpassword/adminforgotpassword.component';
import { AdminResetPasswordComponent } from './components/admin/admin-reset-password/admin-reset-password.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
//import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
//import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import { ToastrService } from './toastr.service';
import { HeaderComponent } from './components/admin/header/header.component';
import { FooterComponent } from './components/admin/footer/footer.component';
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
import { VerifyUserComponent } from './components/user/registration/verify-user/verify-user.component';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/user/reset-password/reset-password.component';
import { HomeComponent } from './components/user/home/home.component';
import { DummyComponent } from './components/dummy/dummy.component';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { ProfileUpdateComponent } from './components/user/profile-update/profile-update.component';
import { BusinessRegisterComponent } from './components/user/business-registration/business-register/business-register.component';
import { GoogleBusinessComponent } from './components/user/business-registration/google-business/google-business.component';
import { BusinessProfileComponent } from './components/user/business-registration/business-profile/business-profile.component';

import { AgmCoreModule } from '@agm/core';
import { BusinessProfileUpdateComponent } from './components/user/business-profile-update/business-profile-update.component';
import { BusinessHomeComponent } from './components/user/business-home/business-home.component';
import { BusinessHomepageComponent } from './components/user/business-homepage/business-homepage.component';
import { BusinessAddComponent } from './components/admin/business-add/business-add.component';
import { BusinessShowComponent } from './components/admin/business-show/business-show.component';
import { BusinessListComponent } from './components/admin/business-list/business-list.component';
import { BusinessUpdateComponent } from './components/admin/business-update/business-update.component';
import { SubscriptionComponent } from './components/user/business-registration/subscription/subscription.component';
import { ConfirmDialogService } from './service/confirm-dialog.service';
import { SanitizerUrlPipe } from './sanitize-url.pipe';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from "angular-6-social-login";
import { MobileLoginComponent } from './components/user/mobile-login/mobile-login.component';
import { SpotFriendsGroupsComponent } from './components/user/spot-friends-groups/spot-friends-groups.component';
import { FilterPipe } from './filter.pipe';
import { MyFilterPipe } from './filteradmin.pipe';
import { SpotDetailComponent } from './components/user/spot-detail/spot-detail.component';
import { SpotReviewComponent } from './components/user/spot-review/spot-review.component';
import { ConfirmDialogComponent } from './components/user/confirm-dialog/confirm-dialog.component';
import { from } from 'rxjs';
import { CheckInPostComponent } from './components/admin/check-in-post/check-in-post.component';
import { PostListComponent } from './components/admin/post-list/post-list.component';
import { AdminSpotReviewComponent } from './components/admin/admin-spot-review/admin-spot-review.component';
import { AdminSpotDetailComponent } from './components/admin/admin-spot-detail/admin-spot-detail.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { UserHeaderComponent } from './components/user/user-header/user-header.component';
import { SpotSearchComponent } from './components/user/spot-search/spot-search.component';
import { PeopleDetailComponent } from './components/user/people-detail/people-detail.component';
import { UserReviewComponent } from './components/user/user-review/user-review.component';
import { AdminPeopleDetailComponent } from './components/admin/admin-people-detail/admin-people-detail.component';
import { AdminPeopleReviewComponent } from './components/admin/admin-people-review/admin-people-review.component';
import { UserChatComponent } from './components/user/user-chat/user-chat.component'; 
import { UserChatService } from './service/user-chat.service'; 
import { PusherService } from './service/pusher.service';
import { BusinessInterestsComponent } from './components/user/business-registration/business-interests/business-interests.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NormalPostListComponent } from './components/admin/normal-post-list/normal-post-list.component';
import { NormalPostDetailComponent } from './components/admin/normal-post-detail/normal-post-detail.component';
import { SpotPostListComponent } from './components/admin/spot-post-list/spot-post-list.component';
import { SpotPostDetailComponent } from './components/admin/spot-post-detail/spot-post-detail.component';
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider("699203540679784")
        }
      ]
  );
  return config;
}
// for pusher
import Echo from 'laravel-echo';
import { GroupDetailComponent } from './components/user/group-detail/group-detail.component';
import { GroupListComponent } from './components/admin/group-list/group-list.component';
import { AdminGroupDetailComponent } from './components/admin/admin-group-detail/admin-group-detail.component';
import { GroupPostListComponent } from './components/admin/group-post-list/group-post-list.component';
import { GroupPostDetailComponent } from './components/admin/group-post-detail/group-post-detail.component';
import { PageNotFoundComponent } from './components/user/page-not-found/page-not-found.component';
import { PlanningAndGoListComponent } from './components/user/planning-and-go-list/planning-and-go-list.component';
import { UserSideWidgetComponent } from './components/user/user-side-widget/user-side-widget.component';
import { EventDetailComponent } from './components/user/event-detail/event-detail.component';
import { SpotEventComponent } from './components/user/spot-event/spot-event.component';

import { NgxFullCalendarModule } from 'ngx-fullcalendar';

var global = global || window;
declare global {
  // interface Window { io: any; }
  interface Window { Echo: any; }
}
declare var require: any;
//declare var Echo: any;
//var Echo = require('laravel-echo');
//window.io = window.io || require('socket.io-client');
window.Echo = window.Echo || {};
window.Echo = new Echo({
  broadcaster: 'pusher',
  key: '816c54c641fbdf1b348b',
  cluster: 'ap2',
  encrypted: true
});
// for pusher end
// FullCalendarModule.registerPlugins([ // register FullCalendar plugins
//   dayGridPlugin,
//   interactionPlugin
// ]);

@NgModule({
  declarations: [ 
    AppComponent,
    AdminComponent,
    LoginComponent,
    AdminforgotpasswordComponent,
    AdminResetPasswordComponent,
    HeaderComponent,
    FooterComponent,
    UserLoginComponent,
    UserHomeComponent,
    AdminChangePasswordComponent,
    InterestAddComponent,
    InterestListComponent,
    InterestUpdateComponent,
    UserAddComponent,
    UserListComponent,
    UserUpdateComponent,
    UserRegisterComponent,
    UserProfileComponent,
    UserGenderComponent,
    UserInterestsComponent,
    VerifyUserComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    HomeComponent,
    DummyComponent,
    ProfileUpdateComponent,
    BusinessRegisterComponent,
    GoogleBusinessComponent,
    BusinessProfileComponent,
    BusinessProfileUpdateComponent,
    BusinessHomeComponent,
    BusinessHomepageComponent,
    BusinessAddComponent,
    BusinessShowComponent,
    BusinessListComponent,
    BusinessUpdateComponent,
    SubscriptionComponent,
    MobileLoginComponent,
    SpotFriendsGroupsComponent,
    FilterPipe,
    MyFilterPipe,
    SpotDetailComponent,
    SpotReviewComponent,
    ConfirmDialogComponent,
    SanitizerUrlPipe,
    CheckInPostComponent,
    PostListComponent,
    AdminSpotReviewComponent,
    AdminSpotDetailComponent,
    UserHeaderComponent,
    SpotSearchComponent,
    PeopleDetailComponent,
    UserReviewComponent,
    AdminPeopleDetailComponent,
    AdminPeopleReviewComponent,
    UserChatComponent,
    BusinessInterestsComponent,
    NormalPostListComponent,
    NormalPostDetailComponent,
    SpotPostListComponent,
    SpotPostDetailComponent,
    GroupDetailComponent,
    GroupListComponent,
    AdminGroupDetailComponent,    
    GroupPostListComponent,
    GroupPostDetailComponent,
    PageNotFoundComponent,
    PlanningAndGoListComponent,
    UserSideWidgetComponent,
    EventDetailComponent,
    SpotEventComponent,
  ], exports: [
    ConfirmDialogComponent
  ],
  imports: [
    CarouselModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    InfiniteScrollModule,
    SocialLoginModule,
    TimepickerModule.forRoot(),    
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(), NgxIntlTelInputModule,
    // FullCalendarModule,
    NgxFullCalendarModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCg9G7bor_Ovcg-5EQHiZLWgAm5Pr4RZ0E',
      libraries: ['places']
    })
  ],
  providers: [
    PusherService,
    UserChatService,
    ConfirmDialogService,
    ToastrService,
    {
      provide : LocationStrategy , 
      useClass: HashLocationStrategy
    },
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
