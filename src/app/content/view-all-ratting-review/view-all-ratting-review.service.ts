import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalFunctions } from '../../common/global-function';
import { CONSTANTS } from '../../common/constants';

@Injectable({
  providedIn: 'root'
})
export class ViewAllRattingReviewService {

  constructor(private httpClients:HttpClient, private _globalFunctions:GlobalFunctions) { }

  addReview(data:any){
    return this.httpClients.post(CONSTANTS.appUrl + 'user/review/save', data, this._globalFunctions.getFileAuthorizationHeader());
  }
}
