import { Component, OnInit } from "@angular/core";
import { GlobalService } from "../../services/global.service";
import { GlobalFunctions } from "../../common/global-function";
import { CartService } from "../cart-list/cart.service";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { RegisterComponent } from "../../auth/register/register.component";
import { OtpVeryficationComponent } from "../../auth/otp-veryfication/otp-veryfication.component";
import { CreateResetPinComponent } from "../../auth/create-reset-pin/create-reset-pin.component";
import { ForgetPinComponent } from "../../auth/forget-pin/forget-pin.component";
import { RegisterPopupComponent } from "../../auth/register-popup/register-popup.component";
import { LoginComponent } from "../../auth/login/login.component";
import { ShopService } from "../shop/shop.service";
import Swal from "sweetalert2";
import { ForgotPinOtpVerifyComponent } from "../../auth/forgot-pin-otp-verify/forgot-pin-otp-verify.component";
import { ForgotResetPinComponent } from "../../auth/forgot-reset-pin/forgot-reset-pin.component";

@Component({
  selector:'app-sticky-header',
  standalone:true,
  imports:[
    CommonModule,
    RouterModule,
    LoginComponent,
    RegisterComponent,
    OtpVeryficationComponent,
    CreateResetPinComponent,
    ForgetPinComponent,
    RegisterPopupComponent, 
    ForgotPinOtpVerifyComponent,
    ForgotResetPinComponent
  ],
  templateUrl:'./sticky-header.component.html'
})

export class StickyHeaderComponent implements OnInit{

  cartListCount:any;

  isOpenLoginForm: boolean = false;
  isOpenRegisterForm: boolean = false;
  isOpenOtpVeryFicationForm: boolean = false;
  isOpenCreatePinForm: boolean = false;
  isOpenForgetPinForm: boolean = false;
  isChangeMail:boolean = false;
  isOpenForgotPinOtpVerifyForm: boolean = false;
  isOpenResetPinForm: boolean = false;

  constructor(
    private _globalService: GlobalService,
    private _globalFunction: GlobalFunctions,
    private _shopService:ShopService,
    private _router:Router
  ){}

  ngOnInit(): void {
    this._globalService.totalCartListCount$.subscribe((result) => {
      this.cartListCount = result;
    });
  };

  getSingleVariant(){
    if(typeof window != 'undefined' && localStorage.getItem('PDID')){
      localStorage.removeItem('PDID');
    };

    let obj ={
      language: localStorage.getItem("lang") || "english"
    }
    let isLogin: any;
    if (typeof window != 'undefined') {
      isLogin = localStorage.getItem('accessToken') ? true : false;
    }
    this._shopService.getSingleProduct(obj,isLogin).subscribe((result:any)=>{
      if(result && result?.Data?._id){
        localStorage.setItem('PDID', window.btoa(result?.Data?._id));
        this._router.navigate(['/shop/productdetail',result?.Data?.search_tag]);
        //window.location.href = window.location.origin + "/shop/productdetail";
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result.Message
        });
      }
    },(error:any)=>{
      this._globalFunction.errorHanding(error,this,true);
    })
  }

  getProfileOrder(){
    if(typeof window != undefined && localStorage.getItem('accessToken')){
      this._router.navigate(['/profile/order'])
    } else {
      this.isOpenLoginForm = true;
    }
  }

  getProfile(){
    if(typeof window != undefined && localStorage.getItem('accessToken')){
      this._router.navigate(['/profile'])
    } else {
      this.isOpenLoginForm = true;
    }
  }

  unknowUserlogIn(result: any) {
    // this.isOpenLoginForm = false;
    if(result && result.IsSuccess){
      this.isOpenLoginForm = false;
      if(result?.Data){      // && !result?.Data.isotpsend
        this.isOpenOtpVeryFicationForm = true;
      } else {
        this.isOpenOtpVeryFicationForm = true;
      }
    } else {      
      this.isOpenLoginForm = false;
    }
    if(result == false){
      return;
    };
  };

  isOpenRegisterFormPopup(event:any){
    if(event){
      this.isOpenRegisterForm = true;
      this.isOpenLoginForm = false;
    }
  }
  unKnowUserRegister(result: any) {
    if(result && result.IsSuccess){
      this.isOpenRegisterForm = false;
      if(result?.Data && !result?.Data.isotpsend){
        this.isOpenOtpVeryFicationForm = true;
      } else {
        this.isOpenOtpVeryFicationForm = true;
      }
    } else {      
      this.isOpenRegisterForm = false;
    };
  };

  isOpenLogInFormPopup(event:any){
    if(event){
      this.isOpenLoginForm = true;
      this.isOpenRegisterForm = false;
      this.isOpenForgetPinForm = false;
    }
  }

  unKnowUserVeryFiedOtp(event:any){
    this.isOpenOtpVeryFicationForm = false;
    if(event){
      this.isOpenCreatePinForm = true;
    };
  };

  isOpenForGetPinFormPopup(event:any){
    if(event.isSuccess){
      this.isOpenOtpVeryFicationForm = false;
      this.isOpenLoginForm = false;
      this.isOpenForgetPinForm = true;
      if(event.isChangeMail){
        this.isChangeMail = true
      };
    };
  };

  unKnowUserCreatePin(event:any){
    if(event){
      this.isOpenCreatePinForm = false;
      // this.isOpenLoginForm = true;
    }
  }

  unKnowUserForgetPin(event:any){
    if(event.isSuccess){
      this.isOpenForgetPinForm = false;
      this.isOpenForgotPinOtpVerifyForm = true;
    };
  }

  unKnowUserForgotPinVeryFiedOtp(event:any){
    this.isOpenForgotPinOtpVerifyForm = false;
    if(event){
      this.isOpenResetPinForm = true;
    };
  };

  isOpenForGetPinViaOtpFormPopup(event:any){
    if(event.isSuccess){
      this.isOpenForgotPinOtpVerifyForm = false;
      this.isOpenOtpVeryFicationForm = false;
      this.isOpenLoginForm = false;
      this.isOpenForgetPinForm = true;
      if(event.isChangeMail){
        this.isChangeMail = true
      };
    };
  };

  unKnowUseResetPin(event:any){
    if(event){
      this.isOpenResetPinForm = false;
      // this.isOpenLoginForm = true;
    }
  }

}