import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GlobalFunctions } from "../../common/global-function";
import { CONSTANTS } from "../../common/constants";

@Injectable({
  providedIn:'root'
})

export class ShopService{

  constructor(
    private _httpClient:HttpClient,
    private _globalFunction:GlobalFunctions
  ){}

  
  getProductList(data:any,isLogin:boolean) :any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/product',data,isLogin ? this._globalFunction.getAuthorizationHeader() : this._globalFunction.getHeader());
  }

  getSingleProduct(data:any,isLogin:boolean) :any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/product/singlevariant',data,isLogin ? this._globalFunction.getAuthorizationHeader() : this._globalFunction.getHeader());
  }

  getBestSellerList(data:any,isLogin:boolean) :any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/product/bestseller',data,isLogin ? this._globalFunction.getAuthorizationHeader() : this._globalFunction.getHeader());
  }

  getComboProductList(data:any,isLogin:boolean):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/product/combo',data,isLogin ? this._globalFunction.getAuthorizationHeader() : this._globalFunction.getHeader());
  }

  getPriceRange():any{
    return this._httpClient.get(CONSTANTS.appUrl + 'user/product/pricerange',this._globalFunction.getHeader());
  }
  
  getProductDetailsOne(data: any,isLogin:boolean){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/product/getone',data ,isLogin ? this._globalFunction.getAuthorizationHeader() : this._globalFunction.getHeader());
  }
  
  getProductDetailsOneWithToken(data: any){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/product/getone',data ,this._globalFunction.getAuthorizationHeader());
  }

  getRelatedProduct(data:any,isLogin:boolean) {
    return this._httpClient.post(CONSTANTS.appUrl + 'user/product/related',data ,isLogin ? this._globalFunction.getAuthorizationHeader() : this._globalFunction.getHeader());
  }

  getCoupon(data:any){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/coupon/list', data, this._globalFunction.getHeader());
  }

  applyCoupon(data:any){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/coupon/apply',data,this._globalFunction.getAuthorizationHeader());
  }

  getProductCoupon(data:any){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/productcoupon/getone',data,this._globalFunction.getHeader());
  }
  
  applyProductCoupon(data:any){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/productcoupon/apply',data,this._globalFunction.getAuthorizationHeader());
  }
  
  getReview(data:any){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/review',data ,this._globalFunction.getHeader());
  }

  getCustomersReview(){
    return this._httpClient.get(CONSTANTS.appUrl + 'user/customerreview' ,this._globalFunction.getHeader());
  }
}