import { Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';
import { CONSTANTS } from '../../common/constants';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { GlobalFunctions } from '../../common/global-function';
import { LoginComponent } from '../../auth/login/login.component';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { TranslateModule } from '@ngx-translate/core';
declare var $: any;

@Component({
  selector: 'app-cart-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatOptionModule, MatSelectModule, RouterModule, LoginComponent, TranslateModule],
  templateUrl: './cart-list.component.html',
  styleUrl: './cart-list.component.scss'
})
export class CartListComponent implements OnInit {
  cartList: any = [];
  cartDataFromCookie: any = [];
  saveForLatterList: any = [];
  constants: any = CONSTANTS
  priceDetailsObj: any = {};
  selectedSize: any;
  isCartListLoading: any;
  isSaveforLatterLoading: any;
  isGeneratBillLoading: any;
  isOpenLoginForm: boolean = false;
  isLogin: boolean = false;
  isFreeShipping: boolean = false;

  constructor(
    private _cartService: CartService,
    private _globalService: GlobalService,
    private _router: Router,
    private _toastr: ToastrService,
    private _globalFunctions: GlobalFunctions,
    private _cookieService: CookieService
  ) {
    $('.page-loader').fadeIn('fast');
    setTimeout(() => {
      $('.page-loader').fadeOut('slow');
    }, 1500);
  }

  ngOnInit(): void {
    if (this._cookieService.get('cartList')) {
      this.cartDataFromCookie = JSON.parse(this._cookieService.get('cartList')!);
    }
    if (typeof window != 'undefined' && localStorage.getItem('accessToken')) {
      this.isLogin = true;
    }
    this._globalService.cartListData$.subscribe((result: any) => {
      if (result?.Data?.cartDetails?.length > 0) {
        this.isCartListLoading = false;
        this.isGeneratBillLoading = false;
        this.cartList = result?.Data?.cartDetails;
        this.generateBillDetails();
      } else if (result?.Data?.docs?.length > 0) {
        this.isCartListLoading = false;
        this.isGeneratBillLoading = false;
        result?.Data?.docs.map((item: any) => {
          this.cartDataFromCookie.map((tempItem: any) => {
            if (tempItem?._id == item?._id) {
              item.quantity = tempItem.quantity;
            }
          })
        });
        this.cartList = result?.Data?.docs;
        this.isCartListLoading = false;
        this.isGeneratBillLoading = false;
        this.generateBillDetails();
      } else {
        this.cartList = [];
        this.isCartListLoading = false;
        this.isGeneratBillLoading = false;
      }
    });
    if (typeof window != undefined && localStorage.getItem('accessToken')) {
      this.getSaveForlatterList();
    }

    this.setCanonicalUrl();
    this._globalService.setMetaTags(this.constants.cartListPageMetaTag);
    this._globalService.setOpenGraphTags(this.constants.cartListPageMetaOgTag);
    this._globalService.setTwitterCardTags(
      this.constants.cartListPageMetaTwitterTag
    );
    this._globalService.setJsonLdData(this.constants.cartListBreadcrum, 'bc');
    // this._globalService.setJsonLdData(
    //   this.constants.cartListWebsiteSchema,
    //   'websch'
    // );
    this._globalService.setJsonLdData(this.constants.cartListLBSchema, 'lbSchema');
    this._globalService.setJsonLdData(this.constants.cartListOrgSchema, 'orgSchema');
  }

  setCanonicalUrl() {
    this._globalService.removeCanonicalUrl();
    let urlData = {
      url: `https://magicshaircare.com/cartlist/`,
      title: 'Your Hair Care Essentials Are Just a Click Away!',
    };
    this._globalService.setCanonicalUrl(urlData);
  }

  isAllLoading(loading: boolean) {
    this.isCartListLoading = loading;
    this.isSaveforLatterLoading = loading;
    this.isGeneratBillLoading = loading;
  }

  increaseProductQuantity(sizeId: any, variant: any) {

    variant.quantity += 1;
    this.changeSize(sizeId, variant)
  }

  decreaseProductQuantity(sizeId: any, variant: any) {
    if (variant.quantity >= 1) {
      variant.quantity -= 1;
      if (variant.quantity == 0) {
        variant.quantity = 1;
        return;
      }
      this.changeSize(sizeId, variant)
    }
  }

  changeSize(event: any, variant: any) {
    if (typeof window != 'undefined' && !localStorage.getItem('accessToken') && this._cookieService.get('cartList')) {
      let variantId: any;
      this.cartDataFromCookie.map((item: any) => {
        if (item?.productId == variant?.productId?._id) {
          variant.sizeDetails.map((size: any) => {
            if (size?.sizeId?._id == event) {
              variantId = size?._id;
              item._id = size?._id;
            };
          });
        }
      })
      let tempObj: any = {
        sizeid: event,
        _id: variantId,
        quantity: variant?.quantity,
        productId: variant?.productId?._id
      };
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      this._cookieService.set('cartList', JSON.stringify(this.cartDataFromCookie), expiryDate, '/');
      this.editCartProduct(tempObj, variant);
    } else {
      let tempObj: any = {
        sizeid: event,
        _id: variant?._id,
        quantity: variant?.quantity,
        productId: variant?.productId?._id
      };
      this.editCartProduct(tempObj, variant);
    }
  }

  editCartProduct(data: any, variant: any) {
    this.isCartListLoading = true;
    this.isGeneratBillLoading = true;
    if (typeof window != 'undefined' && !localStorage.getItem('accessToken') && this._cookieService.get('cartList')) {
      // let tempProductIndex:any = this.cartDataFromCookie.findIndex((temp:any) => temp?.productId == data?.productId);
      let tempProductIndex: any = this.cartDataFromCookie.findIndex((temp: any) => temp?._id == data?._id);
      if (tempProductIndex >= 0) {
        this.cartDataFromCookie[tempProductIndex] = { productId: variant?.productId?._id, _id: data?._id, quantity: data?.quantity || 1, sizeid: data?.sizeid || '' };
        // this._globalService.cartListDataFromCookies$.next(this.cartDataFromCookie);
        this.getUserCartListFromCookie(this.cartDataFromCookie);
      };
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      this._cookieService.set('cartList', JSON.stringify(this.cartDataFromCookie), expiryDate, '/') //,this.cookieCommonData.path,this.cookieCommonData.domain,this.cookieCommonData.secure,'None';
    } else {
      let payload = {
        _id: data?._id || '',
        sizeid: data?.sizeid || '',
        quantity: data?.quantity || '',
      };
      this._cartService.editCart(payload).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.isCartListLoading = false;
          this.isGeneratBillLoading = false;
          // this._toastr.clear();
          // this._globalService.cartListDataFromCookies$.next(this.cartList)
          // this._globalService.cartListDataPagination$.next(null);console.log('api call');
          this.getUserCartList();
        } else {
          this.isCartListLoading = false;
          this.isGeneratBillLoading = false;
          // this._globalService.cartListDataPagination$.next(null);console.log('api call');
          this.getUserCartList();
          this._globalFunctions.successErrorHandling(result.Message, this, true);
        }
      }, (error: any) => {
        this.isCartListLoading = false;
        this.isGeneratBillLoading = false;
        // this._globalService.cartListDataPagination$.next(null);console.log('api call');
        this.getUserCartList();
        this._globalFunctions.errorHanding(error, this, true);
      })
    }
  }

  removeProductFromCartList(variant: any) {
    if (typeof window != 'undefined' && !localStorage.getItem('accessToken') && this._cookieService.get('cartList')) {
      // this.isCartListLoading = true;
      this.isGeneratBillLoading = true;
      this.cartDataFromCookie.splice(this.cartDataFromCookie.findIndex((temp: any) => temp?._id == variant?._id), 1);
      this.cartList.map((item: any, index: number) => {
        if (item?._id == variant?._id) {
          this.cartList.splice(index, 1);
        };
      });
      this._globalService.totalCartListCount$.next(this.cartList.length);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      this._cookieService.set('cartList', JSON.stringify(this.cartDataFromCookie), expiryDate, '/');
      this.generateBillDetails();

      // this._globalService.cartListDataFromCookies$.next(this.cartDataFromCookie?.length > 0 ? this.cartDataFromCookie : null);      
      // this.getUserCartListFromCookie(this.cartDataFromCookie);
      // this._globalService.cartListDataPagination$.next(null);console.log('api call');
      Swal.fire({
        position: "center",
        icon: "success",
        title: 'Product remove to cartList',
        showConfirmButton: false,
        timer: 2000,
        width: '400px'
      });
      // this._cookieService.set('cartList',JSON.stringify(this.cartList)) //,this.cookieCommonData.path,this.cookieCommonData.domain,this.cookieCommonData.secure,'None';
    } else {
      this.isAllLoading(true);
      this._cartService.removeCart({ variantid: variant?._id }).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.isAllLoading(false)
          // this._globalService.cartListDataPagination$.next(null);console.log('api call');
          this.getUserCartList();
          // this._toastr.clear();
          // this._toastr.success('Product remove to cartList','Success');
          Swal.fire({
            position: "center",
            icon: "success",
            title: result.Message,
            showConfirmButton: false,
            timer: 2000,
            width: '400px'
          });
        } else {
          this.isAllLoading(false)
          // this._globalService.cartListDataPagination$.next(null);console.log('api call');
          // this._toastr.clear();
          this._globalFunctions.successErrorHandling(result.Message, this, true);
        }
      }, (error: any) => {
        this.isAllLoading(false)
        // this._globalService.cartListDataPagination$.next(null);console.log('api call');
        // this._toastr.clear();
        this._globalFunctions.errorHanding(error, this, true);
      })
    }
  }

  addEditSaveForLatter(variant: any) {
    this.isSaveforLatterLoading = true;
    this._cartService.addToSaveForLatter({ variantid: variant?._id, quantity: variant.quantity }).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.isSaveforLatterLoading = false;
        this.getSaveForlatterList();
        // this._globalService.cartListDataPagination$.next(null);console.log('api call');
        this.getUserCartList();
        Swal.fire({
          position: "center",
          icon: "success",
          title: result.Message,
          showConfirmButton: false,
          timer: 2000,
          width: '400px'
        });
      } else {
        this.isSaveforLatterLoading = false;
        this._globalFunctions.successErrorHandling(result.Message, this, true);
      }
    }, (error: any) => {
      this.isSaveforLatterLoading = false;
      this._globalFunctions.errorHanding(error, this, true);
    })
  }

  saveForLatterToAddCart(variant: any) {
    this.isAllLoading(true);
    this._cartService.addCart({ variantid: variant?._id, quantity: variant?.quantity }).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.isAllLoading(false)
        // this._globalService.cartListDataPagination$.next(null);console.log('api call');
        this.getUserCartList();
        this.getSaveForlatterList();
        Swal.fire({
          position: "center",
          icon: "success",
          title: result.Message,
          showConfirmButton: false,
          timer: 2000,
          width: '400px'
        });
      } else {
        this.isAllLoading(false)
        // this._toastr.clear();
        this._globalFunctions.successErrorHandling(result.Message, this, true);
      }
    }, (error: any) => {
      this.isAllLoading(false)
      // this._toastr.clear();
      this._globalFunctions.errorHanding(error, this, true);
    })
  }

  getSaveForlatterList() {
    this.isSaveforLatterLoading = true;
    let payload = {
      page: 1,
      limit: 10,
      language: localStorage.getItem("lang") || "english"
    };
    this._cartService.saveForLatter(payload).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.isSaveforLatterLoading = false;
        result.Data.savelaterDetails.map((i: any) => {
          if (localStorage.getItem("lang") == "hindi") {
            i.productId.product_name = i.productId.hi_product_name;
          }
          else if (localStorage.getItem("lang") == "marathi") {
            i.productId.product_name = i.productId.mr_product_name;
          }
          else if (localStorage.getItem("lang") == "gujarati") {
            i.productId.product_name = i.productId.gu_product_name;
          } else {
            i.productId.product_name = i.productId.en_product_name;
          }
        });

        this.saveForLatterList = result?.Data?.savelaterDetails;
      } else {
        this.isSaveforLatterLoading = false;
        this._globalFunctions.successErrorHandling(result.Message, this, true);
      }
    }, (error: any) => {
      this.isSaveforLatterLoading = false;
      this._globalFunctions.errorHanding(error, this, true);
    })
  }

  generateBillDetails() {
    if (this.cartList.length > 0) {
      this.priceDetailsObj.currency = this.cartList[0]?.inr_price ? 'inr' : 'usd';
      this.priceDetailsObj.noOfItem = this.cartList.length || 0;
      this.priceDetailsObj.noOfSubItem = 0;
      this.priceDetailsObj.inrDeliveryCharges = 0;
      this.priceDetailsObj.usdDeliveryCharges = 0;
      this.priceDetailsObj.subTotal = 0;
      this.cartList.map((item: any) => {
        this.priceDetailsObj.noOfSubItem += item.quantity;
      });
      this.cartList.map((item: any) => {
        this.priceDetailsObj.subTotal += ((item?.inr_gross_amount ? item?.inr_gross_amount : item?.usd_gross_amount) * item.quantity);
      });
      // let hasPaidShipping:boolean = false;
      // this.cartList.forEach((i: any) => {
      //   if (i?.productId?.is_free === false) {
      //     hasPaidShipping = true;
      //   }
      // });
      // this.isFreeShipping = !hasPaidShipping;
      // this.priceDetailsObj.shppingCharge = hasPaidShipping ? this.constants.isShippingCharge : 0;
      // this.priceDetailsObj.subTotal = parseFloat(this.priceDetailsObj.subTotal + this.priceDetailsObj.shppingCharge).toFixed(2);

      this.priceDetailsObj.subTotal = parseFloat(this.priceDetailsObj.subTotal).toFixed(2);
      this.priceDetailsObj.totalAmount = this.priceDetailsObj.subTotal + (this.priceDetailsObj.currency == 'inr' ? this.priceDetailsObj.inrDeliveryCharges : this.priceDetailsObj.usdDeliveryCharges);
      this.priceDetailsObj.totalAmount = parseFloat(this.priceDetailsObj.totalAmount).toFixed(2);
    } else {
      this.priceDetailsObj.currency = 'inr';
      this.priceDetailsObj.noOfItem = 0;
      this.priceDetailsObj.noOfSubItem = 0;
      this.priceDetailsObj.inrDeliveryCharges = 0;
      this.priceDetailsObj.subTotal = 0;
      this.priceDetailsObj.totalAmount = 0;
      this.priceDetailsObj.shippingCharge = 0;
    }
  };

  unknowUserlogIn(event: any) {
    this.isOpenLoginForm = false;
    // if(typeof window != undefined && localStorage.getItem('accessToken')){
    //   let tempCartList = JSON.parse(this._cookieService.get('cartList') !);
    //   let payload = {
    //     cartproducts:tempCartList,
    //   };
    //   this._cartService.addMultiProductToCart(payload).subscribe((result:any)=>{
    //     if(result && result.IsSuccess){
    this._router.navigate(['/checkout']);
    //       // this._globalService.cartListDataPagination$.next(null);console.log('api call');
    //       this.getUserCartList();
    //     } else {
    //       this._globalFunctions.successErrorHandling(result?.message,this,true);
    //     }
    //   },(error:any)=>{
    //     this._globalFunctions.errorHanding(error,this,true);
    //   })
    // }
  }

  placeOrder() {
    // if(typeof window != undefined && localStorage.getItem('accessToken')){
    this._router.navigate(['/checkout']);
    // } else {
    //   this.isOpenLoginForm = true;
    // }
  };

  getUserCartList() {
    let data = {
      page: 1,
      limit: 10,
      language: localStorage.getItem("lang") || "english"
    };
    this._cartService.cartList(data).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        result.Data.cartDetails.map((i: any) => {
          if (localStorage.getItem("lang") == "hindi") {
            i.productId.product_name = i.productId.hi_product_name;
          }
          else if (localStorage.getItem("lang") == "marathi") {
            i.productId.product_name = i.productId.mr_product_name;
          }
          else if (localStorage.getItem("lang") == "gujarati") {
            i.productId.product_name = i.productId.gu_product_name;
          } else {
            i.productId.product_name = i.productId.en_product_name;
          }
        });

        this._globalService.totalCartListCount$.next(result.Data.totalDocs);
        this._globalService.cartListData$.next(result);
      } else {
        this._globalFunctions.successErrorHandling(result.Message, this, true);
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
    })
  }

  getUserCartListFromCookie(data: any) {
    let obj: any = {
      page: 1,
      limit: 10,
      language: localStorage.getItem("lang") || "english"
    };
    if (this._cookieService.get('cartList')) {
      obj.variants = JSON.parse(this._cookieService.get('cartList')!)
    }
    if (this._cookieService.get('cartList') && JSON.parse(this._cookieService.get('cartList')!).length > 0) {
      this._cartService.getVariant(obj).subscribe((result: any) => {
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
            } else {
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
          this._globalService.totalCartListCount$.next(result.Data.totalDocs);
          this._globalService.cartListData$.next(result);
        } else {
          this._globalFunctions.successErrorHandling(result.Message, this, true);
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
      });
    } else {
      this._globalService.cartListData$.next(null);
      this._globalService.totalCartListCount$.next(0);
    }
    // this._globalService.cartListDataFromCookies$.subscribe((result:any)=>{
    //   if(result != null && result?.length > 0){
    //     obj.variants = result;
    //   } else {
    //     if(this._cookieService.get('cartList')){
    //       obj.variants = JSON.parse(this._cookieService.get('cartList') !)
    //     }
    //   };
    //   if(this._cookieService.get('cartList') && JSON.parse(this._cookieService.get('cartList') !).length > 0){
    //     this._cartService.getVariant(obj).subscribe((result:any)=>{
    //       if(result && result.IsSuccess){
    //         let tempData:any = JSON.parse(this._cookieService.get('cartList') !)            
    //         result?.Data?.docs.map((item:any)=>{
    //           item.sizeDetails.map((size:any)=>{
    //             tempData.map((product:any)=>{
    //               if(size?.sizeId?._id == product?.sizeid){
    //                 item.sizeId = size?.sizeId;
    //               };
    //             });
    //           });
    //         });
    //         this._globalService.totalCartListCount$.next(result.Data.totalDocs);
    //         this._globalService.cartListData$.next(result);
    //       } else {
    //         this._globalFunctions.successErrorHandling(result.Message,this,true);
    //       }
    //     },(error:any)=>{
    //       this._globalFunctions.errorHanding(error,this,true);
    //     });
    //   } else {
    //     this._globalService.cartListData$.next(null);
    //   }
    // });
  };
}
