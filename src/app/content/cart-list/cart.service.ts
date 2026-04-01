import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GlobalFunctions } from "../../common/global-function";
import { CONSTANTS } from "../../common/constants";

@Injectable({
  providedIn:'root'
})

export class CartService{

  constructor(
    private _httpClient:HttpClient,
    private _globalFunctions:GlobalFunctions
  ){}

  addCart(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/cart/save',data,this._globalFunctions.getAuthorizationHeader())
  }

  addMultiProductToCart(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/cart/multisave',data,this._globalFunctions.getAuthorizationHeader())
  }

  cartList(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/cart',data,this._globalFunctions.getAuthorizationHeader());
  }

  getVariant(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/product/variant',data,this._globalFunctions.getHeader());
  }

  removeCart(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/cart/remove',data,this._globalFunctions.getAuthorizationHeader());
  }
  
  editCart(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/cart/edit',data,this._globalFunctions.getAuthorizationHeader());
  }
  
  addToSaveForLatter(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/saveforlater/save',data,this._globalFunctions.getAuthorizationHeader());
  }
  
  saveForLatter(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/saveforlater',data,this._globalFunctions.getAuthorizationHeader());
  }

}