import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { LoginComponent } from "../login/login.component";
import { RegisterComponent } from "../register/register.component";
import { OtpVeryficationComponent } from "../otp-veryfication/otp-veryfication.component";
import { CreateResetPinComponent } from "../create-reset-pin/create-reset-pin.component";
import { ForgetPinComponent } from "../forget-pin/forget-pin.component";
import { Router } from "@angular/router";
import { ForgotPinOtpVerifyComponent } from "../forgot-pin-otp-verify/forgot-pin-otp-verify.component";
import { ForgotResetPinComponent } from "../forgot-reset-pin/forgot-reset-pin.component";

@Component({
  selector:'app-register-popup',
  standalone:true,
  imports:[
    CommonModule,
    LoginComponent,
    RegisterComponent,
    OtpVeryficationComponent,
    CreateResetPinComponent,
    ForgetPinComponent,
    ForgotPinOtpVerifyComponent,
    ForgotResetPinComponent
  ],
  templateUrl:'./register-popup.component.html'
})
export class RegisterPopupComponent implements OnInit{

  pageRoute: any;

  isOpenLoginForm: boolean = false;
  isOpenRegisterForm: boolean = false;
  isOpenOtpVeryFicationForm: boolean = false;
  isOpenCreatePinForm: boolean = false;
  isOpenForgetPinForm: boolean = false;
  isChangeMail:boolean = false;
  isOpenForgotPinOtpVerifyForm: boolean = false;
  isOpenResetPinForm: boolean = false;

  constructor(
    private _router:Router
  ){};

  ngOnInit(): void {
    
  };

  unknowUserlogIn(event: any) {
    this.isOpenLoginForm = false;
    if(event == false){
      return;
    };
    this.redirectToPage(this.pageRoute);
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
        this.isOpenCreatePinForm = true;
      } else {
        this.isOpenOtpVeryFicationForm = true;
      }
    } else {      
      this.isOpenRegisterForm = false;
    }
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

  redirectToPage(page: any) {
    this.pageRoute = page;
    if (typeof window != 'undefined' && localStorage.getItem('accessToken')) {
      this._router.navigate([page]);
    } else {
      this.isOpenLoginForm = true;
    };
  };
}