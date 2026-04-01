import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GlobalFunctions } from "../../common/global-function";
import { CONSTANTS } from "../../common/constants";

@Injectable({
  providedIn:'root'
})

export class WishListService{
  constructor(
    private _httpClient:HttpClient,
    private _globalFunction:GlobalFunctions
  ){}

  allWishList(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/wishlist/list',data,this._globalFunction.getAuthorizationHeader());
  }

  addEditWishList(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/wishlist/save',data,this._globalFunction.getAuthorizationHeader());
  }
}