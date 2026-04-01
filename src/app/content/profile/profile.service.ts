import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalFunctions } from '../../common/global-function';
import { CONSTANTS } from '../../common/constants';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private _httpClient:HttpClient, private _globalFunctions:GlobalFunctions) { }

  editProfile(data:any){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/profile/edit', data, this._globalFunctions.getAuthorizationHeader());
  }

  getProfileData(){
    return this._httpClient.get(CONSTANTS.appUrl + 'user/profile', this._globalFunctions.getAuthorizationHeader());
  }

  getProfile(data:any){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/profile/uploadprofile', data, this._globalFunctions.getFileAuthorizationHeader());
  }

  getUserSubscriptionList(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/plan',data,this._globalFunctions.getAuthorizationHeader());
  }

  cancelPlan(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/plan/cancel',data,this._globalFunctions.getAuthorizationHeader());
  }

  getOrderList(data:any){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/order', data, this._globalFunctions.getAuthorizationHeader()); 
  }

  getOrderDetailsList(data:any){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/order/getone', data, this._globalFunctions.getAuthorizationHeader()); 
  }

  getReplaceOrder(data:any) {
    return this._httpClient.post(CONSTANTS.appUrl + 'user/order/replace', data, this._globalFunctions.getFileAuthorizationHeader());
  }

  cancelOrder(data:any){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/order/cancel',data,this._globalFunctions.getAuthorizationHeader());
  }

  oderTrackingViaDTDC(data:any){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/order/ordertracking',data,this._globalFunctions.getFileAuthorizationHeader());
  }
}
