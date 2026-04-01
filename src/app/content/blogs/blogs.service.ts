import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CONSTANTS } from "../../common/constants";
import { GlobalFunctions } from "../../common/global-function";

@Injectable({
  providedIn:'root'
})

export class BlogsService {
  constructor(
    private _httpClient:HttpClient,
    private _globalFunction:GlobalFunctions
  ){}

  getBlogsList(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/story',data, (typeof window != 'undefined' && localStorage.getItem('accessToken') ? this._globalFunction.getAuthorizationHeader() : this._globalFunction.getHeader()));
  }

  getSingleBlog(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/story/getone',data,localStorage.getItem('accessToken') ? this._globalFunction.getAuthorizationHeader() : this._globalFunction.getHeader());
  }

  addEditlikeStory(data:any):any{
    return this._httpClient.post(CONSTANTS.appUrl + 'user/story/like',data,this._globalFunction.getAuthorizationHeader())
  }
}