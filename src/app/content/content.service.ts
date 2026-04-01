import { Injectable } from '@angular/core';
import { CONSTANTS } from '../common/constants';
import { GlobalFunctions } from '../common/global-function';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private httpClient:HttpClient, private _globalFunctions:GlobalFunctions) { }

  getAd(){
    return this.httpClient.get(CONSTANTS.appUrl + 'user/advertisings', this._globalFunctions.getHeader());
  }

  getGlobalLanguage(){
    return this.httpClient.get(CONSTANTS.appUrl + 'user/getlanguage', this._globalFunctions.getHeader());
  }

  getAllRoute(data:any){
    return this.httpClient.post(CONSTANTS.appUrl + 'user/sitemap',data, this._globalFunctions.getHeader());
  }
}
