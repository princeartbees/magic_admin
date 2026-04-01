import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalFunctions } from '../../common/global-function';
import { CONSTANTS } from '../../common/constants';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  constructor(private httpClient:HttpClient, private _globalFunctions:GlobalFunctions) { }

  addSupport(data:any) {
    return this.httpClient.post(CONSTANTS.appUrl + 'user/support', data, this._globalFunctions.getFileAuthorizationHeader());
  }
}
