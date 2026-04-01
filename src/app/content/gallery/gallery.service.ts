import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CONSTANTS } from "../../common/constants";
import { GlobalFunctions } from "../../common/global-function";

@Injectable({
  providedIn:'root'
})

export class GalleyService {
  constructor(
    private _httpClient:HttpClient,
    private _globalFunctions:GlobalFunctions
  ){}

  getGalleryList(data:any){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/gallary',data,this._globalFunctions.getHeader());
  }
}