import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONSTANTS } from '../../common/constants';
import { GlobalFunctions } from '../../common/global-function';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(private httpClient:HttpClient, private _globalFunctions:GlobalFunctions) { }

  addContact(data:any){
    return this.httpClient.post(CONSTANTS.appUrl + 'user/contactus', data, this._globalFunctions.getHeader());
  }
}
