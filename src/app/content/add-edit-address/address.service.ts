import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GlobalFunctions } from "../../common/global-function";
import { CONSTANTS } from "../../common/constants";

@Injectable({
  providedIn:'root'
})

export class AddressService {

  constructor(
    private _httpClient:HttpClient,
    private _globalFunctions:GlobalFunctions
  ){}

  saveAddress(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/address/save',data,this._globalFunctions.getAuthorizationHeader());
  }

  deleteAddress(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/address/delete',data,this._globalFunctions.getAuthorizationHeader());
  }

  addressList(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/address',data,this._globalFunctions.getAuthorizationHeader());
  }

  getPincodeDetail(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/pincode',data,this._globalFunctions.getHeader());
  }

  selectAddress(data:any){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/address/select', data, this._globalFunctions.getAuthorizationHeader());
  }

}