import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CONSTANTS } from "../common/constants";
import { GlobalFunctions } from "../common/global-function";

@Injectable({
  providedIn:'root'
})

export class AuthService{

  constructor(
    private _httpClient:HttpClient,
    private _globalFunctions: GlobalFunctions,
  ){}

  getLogIn(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/login',data,this._globalFunctions.getHeader());
  }

  getProfile(data: any){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/register/profile', data, this._globalFunctions.getFileAuthorizationHeader());
  }

  register(data:any) :any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/register',data,this._globalFunctions.getHeader())
  }
  
  resendOtp(data:any) :any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/register/resendotp',data,this._globalFunctions.getHeader())
  }

  verifyRegisterOtp(data:any) :any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/register/verification',data,this._globalFunctions.getHeader())
  }

  createNewPin(data:any) :any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/register/setpin',data,this._globalFunctions.getHeader())
  }

  forgetPin(data:any) :any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/pin/forgot',data,this._globalFunctions.getHeader())
  }

  forgetPinOtpVerify(data:any) :any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/pin/verification',data,this._globalFunctions.getHeader())
  }

  resetForgetPin(data:any) :any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/pin/reset',data,this._globalFunctions.getHeader())
  }

  makeExternalLogin(data:any) :any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/register/socialmedia',data,this._globalFunctions.getHeader())
  }
}