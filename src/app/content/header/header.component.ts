import { CommonModule, DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, DoCheck, ElementRef, HostListener, Inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { GlobalFunctions } from '../../common/global-function';
import { CartService } from '../cart-list/cart.service';
import { rejects } from 'assert';
import { AddressService } from '../add-edit-address/address.service';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { LoginComponent } from '../../auth/login/login.component';
import { RegisterComponent } from '../../auth/register/register.component';
import { OtpVeryficationComponent } from '../../auth/otp-veryfication/otp-veryfication.component';
import { CreateResetPinComponent } from '../../auth/create-reset-pin/create-reset-pin.component';
import { ForgetPinComponent } from '../../auth/forget-pin/forget-pin.component';
import { RegisterPopupComponent } from "../../auth/register-popup/register-popup.component";
import {MatTooltipModule} from '@angular/material/tooltip';
import { LanguageComponent } from '../language/language.component';
import { CONSTANTS } from '../../common/constants';
import { TranslateModule } from '@ngx-translate/core';
import { ForgotPinOtpVerifyComponent } from '../../auth/forgot-pin-otp-verify/forgot-pin-otp-verify.component';
import { ForgotResetPinComponent } from '../../auth/forgot-reset-pin/forgot-reset-pin.component';
declare const $: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LoginComponent,
    RegisterComponent,
    OtpVeryficationComponent,
    CreateResetPinComponent,
    ForgetPinComponent,
    RegisterPopupComponent,
    MatTooltipModule,
    LanguageComponent,
    TranslateModule,
    ForgotPinOtpVerifyComponent,ForgotResetPinComponent
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, DoCheck {
  isShowSearchBar: boolean = false;
  isShowHeader: boolean = false;
  cartListCount: any;
  isLogin: boolean = false;
  isOpenPopup: boolean = false;
  productList: any;
  searchProduct: any = '';
  pageRoute: any;

  isOpenLoginForm: boolean = false;
  isOpenRegisterForm: boolean = false;
  isOpenOtpVeryFicationForm: boolean = false;
  isOpenCreatePinForm: boolean = false;
  isOpenForgetPinForm: boolean = false;
  isChangeMail:boolean = false;
  isOpenForgotPinOtpVerifyForm: boolean = false;
  isOpenResetPinForm: boolean = false;

  selectedLanguage: any;
  isLanguageSelect:boolean = false;
  constants:any = CONSTANTS;

  // @HostListener('document:click', ['$event'])
  // handleOutsideClick(event: MouseEvent) {
  //   if (!this.elementRef.nativeElement.contains(event.target)) {
  //     this.isOpenPopup = false;
  //   }
  // }

  constructor(
    private elementRef: ElementRef,
    @Inject(DOCUMENT) public document: Document,
    private _globalService: GlobalService,
    private _globalFunction: GlobalFunctions,
    private _cartService: CartService,
    private _addressService: AddressService,
    private _cookieService: CookieService,
    private _router: Router
  ) {

    this._globalService.logoutPage$.subscribe((result: any) => {
      // this.getUserCartListPagination();
      if (typeof window !== 'undefined' && localStorage.getItem('accessToken') != null) {
        this.isLogin = true;
        // $("#btnSignIn").hide();
        this.getUserAddressListPagination();
      } else {
        this.isLogin = false;
        // $("#btnSignIn").show();
      } 
    })
  }

  ngDoCheck(): void {
    if (typeof document !== 'undefined' && document?.getElementById('btnSignIn') != null) {
      const element: any = document?.getElementById('btnSignIn');
      const signInElement: any = document?.getElementById('SignIn');
      if (this.isLogin) {
        element.style.display = 'none';
        signInElement.style.display = 'none';
      } else {
        element.style.display = 'block';
        signInElement.style.display = 'block';
      };
    };
    if (typeof window !== 'undefined' && localStorage.getItem('accessToken') != null) {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    };
  };

  ngOnInit(): void {
    this.selectedLanguage = localStorage.getItem('lang');
    if (!this.selectedLanguage || this.selectedLanguage == '') {
      this.selectedLanguage = this.constants.languageJSON[0].value;
    }
    this._globalService.totalCartListCount$.subscribe((result) => {
      this.cartListCount = result;
    });
    if (typeof window != 'undefined' && localStorage.getItem('accessToken')) {
      this.getUserCartList();
    } else {
      this.getUserCartListFromCookie();
    }
  };

  selectLanguage(){
    this.isLanguageSelect = true
  }

  closeDialog(){
    this.isLanguageSelect = false
  }

  // getUserCartListPagination() {
  //   let data: any;
  //   this._globalService.cartListDataPagination$.subscribe((result: any) => {
  //     if (result != null) {
  //       data = result;
  //       if (typeof window != 'undefined' && localStorage.getItem('accessToken')) {
  //         this.getUserCartList(data);
  //       } else {
  //         this.getUserCartListFromCookie(data);
  //       }
  //     } else {
  //       data = {
  //         page: 1,
  //         limit: 10
  //       };
  //       if (typeof window != 'undefined' && localStorage.getItem('accessToken')) {
  //         this.getUserCartList(data);
  //       } else {
  //         this.getUserCartListFromCookie(data);
  //       }
  //     }
  //   })
  // };

  getUserCartList() {
    let data:any = {
      page:1,
      limit:10,
      language: localStorage.getItem("lang") || "english"
    }
    this._cartService.cartList(data).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        result.Data.cartDetails.map((i:any)=>{
          if (localStorage.getItem("lang") == "hindi") {
            i.productId.product_name = i.productId.hi_product_name; 
          }
          else if (localStorage.getItem("lang") == "marathi") {
            i.productId.product_name = i.productId.mr_product_name; 
          }
          else if (localStorage.getItem("lang") == "gujarati") {
            i.productId.product_name = i.productId.gu_product_name; 
          }else{
            i.productId.product_name = i.productId.en_product_name; 
          }
        });

        this._globalService.totalCartListCount$.next(result.Data.totalDocs)
        this._globalService.cartListData$.next(result);
      } else {
        this._globalFunction.successErrorHandling(result.Message, this, true);
      }
    }, (error: any) => {
      this._globalFunction.errorHanding(error, this, true);
    })
  };

  getUserCartListFromCookie() {
    let data:any = {
      page:1,
      limit:10,
      language: localStorage.getItem("lang") || "english"
    }
    if (this._cookieService.get('cartList')) {
      data.variants = JSON.parse(this._cookieService.get('cartList')!)
    }
    if (this._cookieService.get('cartList') && JSON.parse(this._cookieService.get('cartList')!).length > 0) {
      this._cartService.getVariant(data).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          let tempData: any = JSON.parse(this._cookieService.get('cartList')!)
          result?.Data?.docs.map((item: any) => {
            if (localStorage.getItem("lang") == "hindi") {
              item.productId.product_name = item.productId.hi_product_name; 
            }
            else if (localStorage.getItem("lang") == "marathi") {
              item.productId.product_name = item.productId.mr_product_name; 
            }
            else if (localStorage.getItem("lang") == "gujarati") {
              item.productId.product_name = item.productId.gu_product_name; 
            }else{
              item.productId.product_name = item.productId.en_product_name; 
            }

            item.sizeDetails.map((size: any) => {
              tempData.map((product: any) => {
                if (size?.sizeId?._id == product?.sizeid) {
                  item.sizeId = size?.sizeId;
                };
              });
            });
          });
          this._globalService.totalCartListCount$.next(result.Data.totalDocs)
          this._globalService.cartListData$.next(result);
        } else {
          this._globalFunction.successErrorHandling(result.Message, this, true);
        }
      }, (error: any) => {
        this._globalFunction.errorHanding(error, this, true);
      });
    } else {
      this._globalService.cartListData$.next(null);
      this._globalService.totalCartListCount$.next(0)
    }
    // this._globalService.cartListDataFromCookies$.subscribe((result: any) => {
    //   if (result != null && result?.length > 0) {
    //     data.variants = result;
    //   } else {
    //     if (this._cookieService.get('cartList')) {
    //       data.variants = JSON.parse(this._cookieService.get('cartList')!)
    //     }
    //   };
    //   if (this._cookieService.get('cartList') && JSON.parse(this._cookieService.get('cartList')!).length > 0) {
    //     this._cartService.getVariant(data).subscribe((result: any) => {
    //       if (result && result.IsSuccess) {
    //         let tempData: any = JSON.parse(this._cookieService.get('cartList')!)
    //         result?.Data?.docs.map((item: any) => {
    //           item.sizeDetails.map((size: any) => {
    //             tempData.map((product: any) => {
    //               if (size?.sizeId?._id == product?.sizeid) {
    //                 item.sizeId = size?.sizeId;
    //               };
    //             });
    //           });
    //         });
    //         this._globalService.totalCartListCount$.next(result.Data.totalDocs)
    //         this._globalService.cartListData$.next(result);
    //       } else {
    //         this._globalFunction.successErrorHandling(result.Message, this, true);
    //       }
    //     }, (error: any) => {
    //       this._globalFunction.errorHanding(error, this, true);
    //     });
    //   } else {
    //     this._globalService.cartListData$.next(null);
    //     this._globalService.totalCartListCount$.next(0)
    //   }
    // });
  };

  getUserAddressListPagination() {
    let data: any;
    this._globalService.addressListDataPagination$.subscribe((result) => {
      if (result != null) {
        data = result;
        this.getUserAddressList(data);
      } else {
        data = {
          page: 1,
          limit: 10
        };
        this.getUserAddressList(data);
      }
    })
  };

  getUserAddressList(data: any) {
    this._addressService.addressList(data).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this._globalService.addressListData$.next(result);
      } else {
        this._globalFunction.successErrorHandling(result.Message, this, true);
      }
    }, (error: any) => {
      this._globalFunction.errorHanding(error, this, true);
    })
  };

  rediractToShop() {
    this.isShowHeader = false
    localStorage.setItem('SP', window.btoa(this.searchProduct));
    this._globalService.searchProductList$.next(true);
    this._router.navigate(['/shop']);
    // if(this.searchProduct){
    // }
  };

  redirectToSpecificPage(page:any){
    window.location.href = window.location.origin + "/" + page
  }

  logOut() {
    if (typeof window != 'undefined' && localStorage.getItem('accessToken')) {
      localStorage.clear();
      this._cookieService.deleteAll();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Logout Successfully..!",
        showConfirmButton: false,
        timer: 2000,
        width: '400px'
      });
      this._router.navigate(['/home']);
      this._globalService.logoutPage$.next(null);
    }
  };

  closeSearch() {
    this.searchProduct = '';
  };

  unknowUserlogIn(result: any) {
    if(result && result.IsSuccess){
      this.isOpenLoginForm = false;
      if(result?.Data && !result?.Data.isotpsend){
        this.isOpenOtpVeryFicationForm = true;
      } else {
        this.isOpenOtpVeryFicationForm = true;
      }
    } else {      
      this.isOpenLoginForm = false;
    }
    // this.isOpenLoginForm = false;
    // this.isOpenForgetPinForm = false;
    // this.isOpenRegisterForm = false;
    // if(event == false){
    //   return;
    // };
    if (this.pageRoute) {
      this.redirectToPage(this.pageRoute ? this.pageRoute : "");
    }
  };

  isOpenRegisterFormPopup(event:any){
    if(event){
      this.isOpenRegisterForm = true;
      this.isOpenLoginForm = false;
    }
  }
  unKnowUserRegister(result: any) {
    if(result && result.IsSuccess){
      this.isOpenRegisterForm = false;
      if(result?.Data){      // && !result?.Data.isotpsend
        this.isOpenOtpVeryFicationForm = true;
      } else {
        this.isOpenOtpVeryFicationForm = true;
      }
    } else {      
      this.isOpenRegisterForm = false;
    }
  };

  isOpenLogInFormPopup(event:any){
    if(event){
      this.isOpenLoginForm = true;
      this.isOpenRegisterForm = false;
      this.isOpenForgetPinForm = false;
    }
  }

  unKnowUserVeryFiedOtp(event:any){
    if(event){
      this.isOpenOtpVeryFicationForm = false;
      // this.isOpenCreatePinForm = true;
    };
  };

  isOpenForGetPinFormPopup(event:any){
    if(event.isSuccess){
      this.isOpenOtpVeryFicationForm = false;
      this.isOpenLoginForm = false;
      this.isOpenForgetPinForm = true;
      if(event.isChangeMail){
        this.isChangeMail = true
      };
    };
  };

  unKnowUserCreatePin(event:any){
    if(event){
      this.isOpenCreatePinForm = false;
      // this.isOpenLoginForm = true;
    }
  }

  unKnowUserForgetPin(event:any){
    if(event.isSuccess){
      this.isOpenForgetPinForm = false;
      this.isOpenForgotPinOtpVerifyForm = true;
    };
  }

  unKnowUserForgotPinVeryFiedOtp(event:any){
    this.isOpenForgotPinOtpVerifyForm = false;
    if(event){
      this.isOpenResetPinForm = true;
    };
  };

  isOpenForGetPinViaOtpFormPopup(event:any){
    if(event.isSuccess){
      this.isOpenForgotPinOtpVerifyForm = false;
      this.isOpenOtpVeryFicationForm = false;
      this.isOpenLoginForm = false;
      this.isOpenForgetPinForm = true;
      if(event.isChangeMail){
        this.isChangeMail = true
      };
    };
  };

  unKnowUseResetPin(event:any){
    if(event){
      this.isOpenResetPinForm = false;
      // this.isOpenLoginForm = true;
    }
  }

  redirectToPage(page: any) {
    this.pageRoute = page;
    if (typeof window != 'undefined' && localStorage.getItem('accessToken')) {
      //this._router.navigate([page]);
      window.location.href = window.location.origin + page
    } else {
      this.isOpenLoginForm = true;
    };
  };

}
