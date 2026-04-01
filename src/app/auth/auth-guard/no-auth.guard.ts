import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { GlobalFunctions } from '../../common/global-function';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { GlobalService } from '../../services/global.service';
import { ShopService } from '../../content/shop/shop.service';
import { ToastrService } from 'ngx-toastr';
import { resolve } from 'path';
import { BenefitService } from '../../content/benefits/benefits.service';
import { BlogsService } from '../../content/blogs/blogs.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _globalService:GlobalService,
    private _shopService:ShopService,
    private _benefitService:BenefitService,
    private _blogsService:BlogsService,
    private _toastr:ToastrService
  ) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  | Promise<boolean> | boolean{
    return new Promise((resolve, reject) => {
      Promise.all([
        // this._check(state),
        this.productBenefitPagination(),
        this.storiesPagination(),
      ]).then(() => {
        resolve(true);
      }, reject);
    });
  }

  // private _check(state: any): boolean {
  //   // Check the authentication status
  //   // localStorage.getItem('accessToken')
  //   if(typeof window === "undefined") {
  //     if (localStorage?.getItem("accessToken")) {
  //       return false;
  //     }
  //   }
  //   let accessToken = localStorage?.getItem("accessToken");
  //   if (accessToken) {
  //     this._router.navigate(['/home']);
  //     return false;
  //   } else {
  //     if (!state.url || state.url == '/') {
  //       this._router.navigate(['login']);
  //     }
  //     return true;
  //   };
  // }

  // private _check(state: any): boolean {
  //   // Check the authentication status
  //   let accessToken:any = null;
  //   if(typeof window != 'undefined'){
  //     accessToken = localStorage.getItem('accessToken');
  //   }
  //   if (accessToken) {
  //     this._router.navigate(['/home']);
  //     return false;
  //   } else {
  //     if (!state.url || state.url == '/') {
  //       this._router.navigate(['login']);
  //     }
  //     return true;
  //   };
  // }
  
  private productBenefitPagination(){
    let data:any = {};
    this._globalService.benefitListPagination$.subscribe((result:any)=>{
      if(result != null){
        data = result;
        // this.productBenefit(data).then();
      } else {
        data = {
          page:1,
          limit:10
        }
        // this.productBenefit(data).then();
      }
    })
  }

  private productBenefit(data:any = {}):Promise<any>{
    return new Promise((resolve,reject)=>{
      resolve(true);
      // this._benefitService.getProductBenefitList(data).subscribe((result:any)=>{ // With pagination
      let benifitObj = {
        language: localStorage.getItem("lang") || "english"
      }
      this._benefitService.getProductBenefitListWithoutPagination(benifitObj).subscribe((result:any)=>{ // without pagination
        if(result && result.IsSuccess){
          result?.Data.map((item: any) => {
            if (localStorage.getItem("lang") == "hindi") {
              item.title = item.hi_title; 
            }
            else if (localStorage.getItem("lang") == "marathi") {
              item.title = item.mr_title; 
            }
            else if (localStorage.getItem("lang") == "gujarati") {
              item.title = item.gu_title; 
            }else{
              item.title = item.en_title; 
            }
          });
          this._globalService.benefitList$.next(result);
          resolve(true);
        } else {
          this._globalFunctions.successErrorHandling(result.Message,this,true);
          reject();
        }
      },(error:any)=>{
        this._globalFunctions.errorHanding(error,this,true);
        reject();
      })
    })
  };

  private storiesPagination(){
    let data:any = {};
    this._globalService.storiesPagination$.subscribe((result:any)=>{
      if(result != null){
        data = result;
        this.stories(data).then();
      } else {
        data = {
          page:1,
          limit:10,
          language: localStorage.getItem("lang") || "english"
        }
        this.stories(data).then();
      }
    })
  }

  private stories(data:any = {}):Promise<any>{
    return new Promise((resolve,reject)=>{
      resolve(true);
      this._blogsService.getBlogsList(data).subscribe((result:any)=>{
        if(result && result.IsSuccess){
          this._globalService.stories$.next(result);
          resolve(true);
        } else {
          this._globalFunctions.successErrorHandling(result.Message,this,true);
          reject();
        }
      },(error:any)=>{
        this._globalFunctions.errorHanding(error,this,true);
        reject();
      })
    })
  };

  
}
