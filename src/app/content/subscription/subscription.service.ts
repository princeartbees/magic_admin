import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GlobalFunctions } from "../../common/global-function";
import { CONSTANTS } from "../../common/constants";

@Injectable({
  providedIn:'root'
})

export class SubscriptionService {
  constructor(
    private _httpClient:HttpClient,
    private _globalFunctions:GlobalFunctions
  ){}

  getSubscriptionPlanlist(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/subscriptionplan/list',data,this._globalFunctions.getHeader());
  }
  
  buyPlan(data:any){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/plan/save',data,this._globalFunctions.getAuthorizationHeader());
  }

  createPaymentOrder(data:any){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/order/razorpay/createorder',data,this._globalFunctions.getRazorpayHeaderWithAuth());
  }
}