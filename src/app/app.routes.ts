import { RouterModule, Routes } from '@angular/router';
import { BenefitsComponent } from './content/benefits/benefits.component';
import { AboutUsComponent } from './content/about-us/about-us.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { OtpVeryficationComponent } from './auth/otp-veryfication/otp-veryfication.component';
import { ContentComponent } from './content/content.component';
import { BlogsComponent } from './content/blogs/blogs.component';
import { BlogDetailsComponent } from './content/blogs/blog-details/blog-details.component';
import { ShopComponent } from './content/shop/shop.component';
import { ProductDetailsComponent } from './content/shop/product-details/product-details.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './content/profile/profile.component';
import { CartListComponent } from './content/cart-list/cart-list.component';
import { CheckOutComponent } from './content/check-out/check-out.component';
import { GalleryComponent } from './content/gallery/gallery.component';
import { ContactUsComponent } from './content/contact-us/contact-us.component';
import { WishListComponent } from './content/wish-list/wish-list.component';
import { MyAccountComponent } from './content/profile/my-account/my-account.component';
import { MyOrdersComponent } from './content/profile/my-orders/my-orders.component';
import { MySubscriptionComponent } from './content/profile/my-subscription/my-subscription.component';
import { LandingPageComponent } from './content/landing-page/landing-page.component';
import { SubscriptionComponent } from './content/subscription/subscription.component';
import { TermsConditionComponent } from './content/terms-condition/terms-condition.component';
import { SupportComponent } from './content/support/support.component';
import { PrivacyPolicyComponent } from './content/privacy-policy/privacy-policy.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgetPinComponent } from './auth/forget-pin/forget-pin.component';
import { CreateResetPinComponent } from './auth/create-reset-pin/create-reset-pin.component';
import { NoAuthGuard } from './auth/auth-guard/no-auth.guard';
import { AuthGuard } from './auth/auth-guard/auth.guard';
import { AllRattingReviewComponent } from './content/view-all-ratting-review/all-ratting-review.component';
import { ConfrimMessageComponent } from './content/confrim-message/confrim-message.component';

export const routes: Routes = [
  {
    path:'',
    canActivate:[NoAuthGuard],
    component:ContentComponent,
    children:[
      {
        path:'',
        pathMatch:'full',
        redirectTo:'home'
      },
      {
        path:'',
        component:LandingPageComponent, 
        data: { title: 'Home' }
      },
      {
        path:'benefits',
        component:BenefitsComponent,
        data: { title: 'Benefit' }
      },
      {
        path:'aboutus',
        component:AboutUsComponent,
        data: { title: 'About Us' }
      },
      {
        path:'about-us',
        component:AboutUsComponent,
        data: { title: 'About Us' }
      },
      {
        path:'stories',
        children:[
          {
            path:'',
            component:BlogsComponent,
            data: { title: 'Stories' }
          },
          {
            path:'storydetail/:storytag',
            component:BlogDetailsComponent,
            data: { title: 'Stories' }
          },
        ]
      },
      {
        path:'shop',
        children:[
          {
            path:'',
            component:ShopComponent,
            data: { title: 'Shop' }
          },
          {
            path:'productdetail/:producttag',
            component:ProductDetailsComponent,
            data: { title: 'Shop' }
          },
        ]
      },
      {
        path:'review/productreview',
        component:AllRattingReviewComponent,
        data: { title: 'Shop' }
      },
      {
        path:'gallery',
        component:GalleryComponent,
        data: { title: 'Gallery' }
      },
      {
        path:'contactus',
        component:ContactUsComponent,
        data: { title: 'Contact Us' }
      },
      {
        path:'contact-us',
        component:ContactUsComponent,
        data: { title: 'Contact Us' }
      },
      {
        path:'wishlist',
        component:WishListComponent,
        data: { title: 'Wish List' }
      },
      {
        path:'wish-list',
        component:WishListComponent,
        data: { title: 'Wish List' }
      },
      {
        path:'cartlist',
        component:CartListComponent,
        data: { title: 'Cart List' }
      },      
      {
        path:'cart-list',
        component:CartListComponent,
        data: { title: 'Cart List' }
      },      
      {
        path:'checkout',
        component:CheckOutComponent,
        data: { title: 'Check Out' }
      },
      {
        path:'subscription',
        component:SubscriptionComponent,
        data: { title: 'Plan' }
      },
      {
        path:'renew/renewplan',
        component:SubscriptionComponent,
        data: { title: 'Plan' }
      },
      {
        path:'renew/renew-plan',
        component:SubscriptionComponent,
        data: { title: 'Plan' }
      },
      {
        path:'profile',
        component:ProfileComponent,
        children:[
          {
            path:'',
            pathMatch:'full',
            redirectTo:'account',
            data: { title: 'Profile' }
          },
          {
            path:'account',
            component:MyAccountComponent,
            data: { title: 'Profile' }
          },
          {
            path:'order',
            component:MyOrdersComponent,
            data: { title: 'Profile' }
          },
          {
            path:'subscription',
            component:MySubscriptionComponent,
            data: { title: 'Profile' }
          },
        ]
      },
      {
        path:'termsandcondition',
        component:TermsConditionComponent,
        data: { title: 'Terms and Condition' }
      },
      {
        path:'terms-and-condition',
        component:TermsConditionComponent,
        data: { title: 'Terms and Condition' }
      },
      {
        path:'support',
        component:SupportComponent,
        data: { title: 'Support' }
      },
      {
        path:'privacypolicy',
        component:PrivacyPolicyComponent,
        data: { title: 'Privacy Policy' }
      },
      {
        path:'privacy-policy',
        component:PrivacyPolicyComponent,
        data: { title: 'Privacy Policy' }
      },
      {
        path:'orderdetail',
        component:ConfrimMessageComponent,
        data: { title: 'Privacy Policy' }
      },
      {
        path:'plandetail',
        component:ConfrimMessageComponent,
        data: { title: 'Privacy Policy' }
      },
      {
        path:'plan-detail',
        component:ConfrimMessageComponent,
        data: { title: 'Privacy Policy' }
      },
    ]
  },
  // {
  //   path:'',
  //   component:AuthComponent,
  //   children:[
  //     {
  //       path:'',
  //       pathMatch:'full',
  //       redirectTo:'login'
  //     },
  //     {
  //       path:'login',
  //       component:LoginComponent
  //     },
  //     {
  //       path:'register',
  //       component:RegisterComponent
  //     },
  //     {
  //       path:'forget-pin',
  //       component:ForgetPinComponent
  //     },
  //     {
  //       path:'create-pin',
  //       component:CreateResetPinComponent
  //     },
  //     {
  //       path:'reset-pin',
  //       component:CreateResetPinComponent
  //     },
  //     {
  //       path:'otp',
  //       component:OtpVeryficationComponent
  //     },
  //   ]
  // },
  // {
  //   path:'',
  //   canActivate:[AuthGuard],
  //   component:ContentComponent,
  //   children:[
  //     {
  //       path:'checkout',
  //       component:CheckOutComponent
  //     }
  //   ]
  // },
  {path:"**",pathMatch:"full",redirectTo:""}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutes {}
