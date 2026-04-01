import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CONSTANTS } from "../../common/constants";
import { GlobalFunctions } from "../../common/global-function";

@Injectable({
  providedIn:'root'
})

export class CheckOutService{
  constructor(
    private _httpClient:HttpClient,
    private _globalFunctions:GlobalFunctions
  ){}

  createOrder(data:any){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/order/save',data,this._globalFunctions.getAuthorizationHeader());
  }
  createOrderWithoutLogin(data:any){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/order/create',data,this._globalFunctions.getHeader());
  }

  getPaymentDetailFormRazorpay(data:any){
    return this._httpClient.get('https://api.razorpay.com/v1/payments/' + data,this._globalFunctions.getRazorpayHeader());
  }

  // getPincode(data:any){
  //   return this._httpClient.post(CONSTANTS.appUrl + 'user/order/codavailable',data,this._globalFunctions.getAuthorizationHeader())
  // }
}