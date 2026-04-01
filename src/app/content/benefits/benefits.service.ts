import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GlobalFunctions } from "../../common/global-function";
import { CONSTANTS } from "../../common/constants";
import { map } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class BenefitService {
  constructor(
    private _httpClient: HttpClient,
    private _globalFunctions: GlobalFunctions
  ) { }

  getProductBenefitList(data: any): any {
    return this._httpClient.post(CONSTANTS.appUrl + 'user/productbenefits', data, this._globalFunctions.getHeader());
  }

  getProductBenefitListWithoutPagination(data: any): any {
    return this._httpClient.post(CONSTANTS.appUrl + 'user/productbenefits/list',data, this._globalFunctions.getHeader());
  }
  
  getBenefits(data: any){
    return this._httpClient.post(CONSTANTS.appUrl + 'user/productbenefits/landing',data ,this._globalFunctions.getHeader());
  }
}