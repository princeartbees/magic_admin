import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, DoCheck, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ShopService } from './shop.service';
import { GlobalFunctions } from '../../common/global-function';
import { PaginatorModule } from 'primeng/paginator';
import { CONSTANTS } from '../../common/constants';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { CookieService } from 'ngx-cookie-service';
import { WishListService } from '../wish-list/wish-list.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../cart-list/cart.service';
import { LoginComponent } from '../../auth/login/login.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { RegisterComponent } from '../../auth/register/register.component';
import { OtpVeryficationComponent } from '../../auth/otp-veryfication/otp-veryfication.component';
import { CreateResetPinComponent } from '../../auth/create-reset-pin/create-reset-pin.component';
import { ForgetPinComponent } from '../../auth/forget-pin/forget-pin.component';
import { RegisterPopupComponent } from '../../auth/register-popup/register-popup.component';
import { TranslateModule } from '@ngx-translate/core';
import { ForgotPinOtpVerifyComponent } from '../../auth/forgot-pin-otp-verify/forgot-pin-otp-verify.component';
import { ForgotResetPinComponent } from '../../auth/forgot-reset-pin/forgot-reset-pin.component';

declare var $:any;

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SliderModule,
    FormsModule,
    MatSelectModule,
    PaginatorModule,
    CheckboxModule,
    RadioButtonModule,
    MatRadioModule,
    MatIconModule,
    MatPaginatorModule,
    LoginComponent,
    RegisterComponent,
    OtpVeryficationComponent,
    CreateResetPinComponent,
    ForgetPinComponent,
    RegisterPopupComponent,
    TranslateModule,
    ForgotPinOtpVerifyComponent,
    ForgotResetPinComponent
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit, OnDestroy,AfterViewInit{  
  rangeValues: any[] = [];
  minValue: any = 0;
  maxValue: any = 100;
  filteredProductKey:any;
  productList:any[] = [];
  loadingProductArray:any[] = [1,2,3,4,5,6];
  totalProductCount:number = 0;
  constants:any = CONSTANTS;
  filterProduct:any;
  isLoading:boolean = false;
  sortByAction: any;
  customerRating: any = 0;
  sortBy:any [] = [
    {
      key:'Discount-Low To High',
      value:'DLTH'
    },
    {
      key:'Discount-High To Low',
      value:'DHTL'
    },
    {
      key:'Price-Low To High',
      value:'PLTH'
    },
    {
      key:'Price-High To Low',
      value:'PHTL'
    },
  ];
  ratingSortBy: any = [
    {
      key:'All',
      value:'0'
    },
    {
      key:'5.0',
      value:'5'
    },
    {
      key:'4.0 +',
      value:'4'
    },
    {
      key:'3.0 +',
      value:'3'
    },
    {
      key:'2.0 +',
      value:'2'
    },
    {
      key:'1.0 +',
      value:'1'
    },
  ]
  productId: any;
  wishlistArray:any = [];
  cartlistArray:any = [];
  cookieCommonData:any;
  domainData:any;
  isLogin:boolean = false;
  isProductBuy:boolean = false;
  isPayloadCenerate:boolean = false;
  paginationPayloadObj:any;
  pageNo: any;
  limit: any = 6;
  buyVariant:any;
  
  isOpenLoginForm: boolean = false;
  isOpenRegisterForm: boolean = false;
  isOpenOtpVeryFicationForm: boolean = false;
  isOpenCreatePinForm: boolean = false;
  isOpenForgetPinForm: boolean = false;
  isChangeMail:boolean = false;
  isOpenForgotPinOtpVerifyForm: boolean = false;
  isOpenResetPinForm: boolean = false;
  hoverVideo:any;
  hoverIndex:any;
  @ViewChild('videoElement') videoElement: any;

  constructor(
    private _globalService:GlobalService,
    private _activatedRoute:ActivatedRoute,
    private _shopService:ShopService,
    private _globalFunction:GlobalFunctions,
    private _router:Router,
    private _cookieService:CookieService,
    private _wishListService:WishListService,
    private _cartService:CartService,
    private _toastr:ToastrService,
    private _globalFunctions:GlobalFunctions,
  ){
    $('.page-loader').fadeIn('fast');
    setTimeout(() => {
      $('.page-loader').fadeOut('slow');
    }, 1500);
    this.cookieCommonData = {      
      domain : "localhost",
      path : '/',
      secure : true,
      expiry : new Date()
    }
    this.cookieCommonData.expiry.setDate(this.cookieCommonData.expiry.getDate()+365);
    this.paginationPayloadObj = {
      page:1,
      limit:6,
      sortBy:'',
      startprice:0,
      endprice:0,
      rating: 0,
      from:'web',
      search:''
    }
  }

  ngAfterViewInit(): void {
    const video: HTMLVideoElement = this.videoElement?.nativeElement;
    video.autoplay = true; // Ensure video is muted
    video.muted = true; // Ensure video is muted
    video.play().catch(error => {
      console.error('Autoplay failed:', error);
    });
  }

  ngOnInit(): void {
    this._globalService.setMetaTags(this.constants.shopPageMetaTag);
    this._globalService.setOpenGraphTags(this.constants.shopPageMetaOgTag);
    this._globalService.setTwitterCardTags(this.constants.shopPageMetaTwitterTag);
    this._globalService.setJsonLdData(this.constants.shopBreadcrum,"bc");
    //this._globalService.setJsonLdData(this.constants.shopWebsiteSchema,"websch");
    this._globalService.setJsonLdData(this.constants.shopLBSchema,"lbSchema");
    this._globalService.setJsonLdData(this.constants.shopOrgSchema, 'orgSchema');
    this.sortBy.map((item:any)=>{
      if(item?.value == 'PHTL'){
        this.sortByAction = item?.value
      }
    })
    if(typeof window != 'undefined'){
      this.domainData = new URL(window.location.href);
    }
    this.cookieCommonData.domain = this.domainData.origin;
    if(typeof window != 'undefined' && localStorage.getItem('accessToken')){
      this.isLogin = true;
    }
    this._activatedRoute.queryParams.subscribe(params=>{
      if(params != undefined && params['key'] != ''){
        this.filteredProductKey = params['key']
      }
    });
    this.filteredProductKey = this.filteredProductKey ? this.filteredProductKey : 'all';
    this.filterProductType(this.filteredProductKey);
    this.getRangeValue();
    this._globalService.searchProductList$.subscribe((res:any)=>{
      if (localStorage.getItem("SP") != null && res) {
          this.allProductList();
      }
    })
    this.setCanonicalUrl();
  }

  setCanonicalUrl() {
    this._globalService.removeCanonicalUrl();
    let urlData = {
      url:`https://magicshaircare.com/shop`,
      title:'Shop Ayurvedic Hair Care Mix – Stop Hair Loss & Irritation for All.'
    };
    this._globalService.setCanonicalUrl(urlData);
  }

  // ngDoCheck(): void {
  //   if (localStorage.getItem("SP") != null) {
  //     this.allProductList();
  //   }
  // }

  priceChange(event:any){
    this.rangeValues = event?.values;
  }

  priceChangeEnd(event:any){    
    this.rangeValues[0] = event?.values[0];
    this.rangeValues[1] = event?.values[1];
    this.filterProductType(this.filteredProductKey);
  }

  ratingChange(event: any){
    this.customerRating = event;
    this.filterProductType(this.customerRating);
  }

  filterProductType(event:any){
    this.filteredProductKey = event;
    if(event == 'best-seller'){
      this.bestSellerProduct();
    } else if(event == 'combo'){
      this.comboProductList()
    } else {
      this.allProductList();
    }
  }

  sortByproduct(event:any){
    this.sortByAction = event;
    this.filterProductType(this.sortByAction)
  }

  addEditWishlist(event:any,variant:any){
    event.stopPropagation();
    if(typeof window != 'undefined' && !localStorage.getItem('accessToken')){
      // this.wishlistArray = JSON.parse(this._cookieService.get('wishList') !);
      this.isOpenLoginForm = true;
      // if(this.wishlistArray.length > 0){
      //   if(this.wishlistArray.findIndex((temp:any) => temp?._id == variant?._id) == -1){
      //     this.wishlistArray.push({_id:variant?._id,quantity:variant?.quantity})
      //   } else {
      //     this.wishlistArray.splice(this.wishlistArray.findIndex((temp:any) => temp?._id == variant?._id),1)
      //   }
      // } else {
      //   this.wishlistArray.push({_id:variant?._id,quantity:variant?.quantity});
      // }
      // this._cookieService.set('wishList',JSON.stringify(this.wishlistArray)); // ,this.cookieCommonData.expiry,this.cookieCommonData.path,this.cookieCommonData.domain,this.cookieCommonData.secure,'None'
      // this.getCartlistProductWithoutLogin('wishList');
    } else {
      this._wishListService.addEditWishList({variantid:variant?._id}).subscribe((result:any)=>{
        if(result && result.IsSuccess){
          this.filterProductType(this.customerRating);
          // this._toastr.clear();
          // this._toastr.success('Product add to wishlist','Success');
          Swal.fire({
            position: "center",
            icon: "success",
            title: 'Product add to wishlist',
            showConfirmButton: false,
            timer: 2000,
            width: '400px'
          });
        } else {
          // this._toastr.clear();
          this._globalFunction.successErrorHandling(result.Message,this,true);
        }
      },(error:any)=>{
        // this._toastr.clear();
        this._globalFunction.errorHanding(error,this,true);
      })
    }
  }

  addEditCartList(event:any,variant:any){
    event.stopPropagation()
    if(typeof window != 'undefined' && !localStorage.getItem('accessToken')){
      if(this._cookieService.get('cartList')){
        this.cartlistArray = JSON.parse(this._cookieService.get('cartList') !);
      }
      if(this.cartlistArray.length > 0){
        if(this.cartlistArray.findIndex((temp:any) => temp?._id == variant?._id) == -1){
          this.cartlistArray.push({productId:variant?.productId?._id,_id:variant?._id,quantity:variant?.quantity || 1})          
          Swal.fire({
            position: "center",
            icon: "success",
            title: 'Product add to cartList',
            showConfirmButton: false,
            timer: 2000,
            width: '400px'
          });
        } else {
          this.cartlistArray.splice(this.cartlistArray.findIndex((temp:any) => temp?._id == variant?._id),1);
          if(this.cartlistArray.length == 0){
            this._cookieService.delete('cartList');
            this._globalService.totalCartListCount$.next(0);
          };
          Swal.fire({
            position: "center",
            icon: "success",
            title: 'Product remove to cartList',
            showConfirmButton: false,
            timer: 2000,
            width: '400px'
          });
        }
      } else {
        this.cartlistArray.push({productId:variant?.productId?._id,_id:variant?._id,quantity:variant?.quantity || 1});
        Swal.fire({
          position: "center",
          icon: "success",
          title: 'Product add to cartList',
          showConfirmButton: false,
          timer: 2000,
          width: '400px'
        });
      };
      this._globalService.totalCartListCount$.next(this.cartlistArray.length);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      this._cookieService.set('cartList',JSON.stringify(this.cartlistArray), expiryDate, '/','') //,this.cookieCommonData.path,this.cookieCommonData.domain,this.cookieCommonData.secure,'None';
      this.getCartlistProductWithoutLogin('cartList');
    } else {
      if(variant.in_cart){
        this._cartService.removeCart({variantid:variant?._id}).subscribe((result:any)=>{
          if(result && result.IsSuccess){
            this.filterProductType(this.customerRating);
            this.getUserCartList();
            // this._globalService.cartListDataPagination$.next(null);console.log('api call');
          } else {
            this._globalFunction.successErrorHandling(result.Message,this,true);
          }
        },(error:any)=>{
          this._globalFunction.errorHanding(error,this,true);
        })
      } else {
        this._cartService.addCart({variantid:variant?._id,quantity:1}).subscribe((result:any)=>{
          if(result && result.IsSuccess){
            this.filterProductType(this.customerRating);
            this.getUserCartList();
            // this._globalService.cartListDataPagination$.next(null);console.log('api call');
            // this._toastr.clear();
            // this._toastr.success('Product add to cartList','Success');
            Swal.fire({
              position: "center",
              icon: "success",
              title: 'Product add to cartList',
              showConfirmButton: false,
              timer: 2000,
              width: '400px'
            });
          } else {
            // this._toastr.clear();
            this._globalFunction.successErrorHandling(result.Message,this,true);
          }
        },(error:any)=>{
          // this._toastr.clear();
          this._globalFunction.errorHanding(error,this,true);
        })
      }
    }
  }

  getCartlistProductWithoutLogin(type:any){
    if(!this.isLogin){
      if(type == 'cartList' && this._cookieService.get('cartList')){
        this.cartlistArray = JSON.parse(this._cookieService.get('cartList') !);
        // this._globalService.cartListDataFromCookies$.next(this.cartlistArray)
        this.getUserCartListFromCookie()
        // this._globalService.cartListDataPagination$.next(null);console.log('api call');
        this.productList.map((product:any)=>{
          product.in_cart = false;
          this.cartlistArray.map((cartProduct:any)=>{
            if(product?._id == cartProduct?._id){
              product.in_cart = true;
            };
          });
        });
      } else if(type == 'wishList' && this._cookieService.get('wishList')){
        this.wishlistArray = JSON.parse(this._cookieService.get('wishList') !);
        this.productList.map((product:any)=>{
          product.in_wishlist = false;
          this.wishlistArray.map((cartProduct:any)=>{
            if(product?._id == cartProduct?._id){
              product.in_wishlist = true;
            };
          });
        });
        Swal.fire({
          position: "center",
          icon: "success",
          title: 'Product add to wishList',
          showConfirmButton: false,
          timer: 2000,
          width: '400px'
        });
      } else {
        if(this._cookieService.get('cartList')){
          this.cartlistArray = JSON.parse(this._cookieService.get('cartList') !);
          this.productList.map((product:any)=>{
            product.in_cart = false;
            this.cartlistArray.map((cartProduct:any)=>{
              if(product?._id == cartProduct?._id){
                product.in_cart = true;
              };
            });
          });
          
        };
        if(this._cookieService.get('wishList')){
          this.wishlistArray = JSON.parse(this._cookieService.get('wishList') !);
          this.productList.map((product:any)=>{
            product.in_wishlist = false;
            this.wishlistArray.map((cartProduct:any)=>{
              if(product?._id == cartProduct?._id){
                product.in_wishlist = true;
              };
            });
          });
        };
      };
    };
  };

  getUserCartListFromCookie(){
    let obj:any = {
      page:1,
      limit:10,
      language: localStorage.getItem("lang") || "english"
    };
    obj.variants = JSON.parse(this._cookieService.get('cartList') !)
    if(this._cookieService.get('cartList') && JSON.parse(this._cookieService.get('cartList') !).length > 0){
      this._cartService.getVariant(obj).subscribe((result:any)=>{
        if(result && result.IsSuccess){
          let tempData:any = JSON.parse(this._cookieService.get('cartList') !)            
          result?.Data?.docs.map((item:any)=>{
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

            item.sizeDetails.map((size:any)=>{
              tempData.map((product:any)=>{
                if(size?.sizeId?._id == product?.sizeid){
                  item.sizeId = size?.sizeId;
                };
              });
            });
          });
          this._globalService.totalCartListCount$.next(result.Data.totalDocs);
          this._globalService.cartListData$.next(result);
        } else {
          this._globalFunction.successErrorHandling(result.Message,this,true);
        }
      },(error:any)=>{
        this._globalFunction.errorHanding(error,this,true);
      });
    } else {
      this._globalService.cartListData$.next(null);
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
    //         this._globalFunction.successErrorHandling(result.Message,this,true);
    //       }
    //     },(error:any)=>{
    //       this._globalFunction.errorHanding(error,this,true);
    //     });
    //   } else {
    //     this._globalService.cartListData$.next(null);
    //   }
    // });
  };

  bestSellerProduct(){
    this.isLoading = true;
    this._shopService.getBestSellerList(this.createPaginationPayload(),this.isLogin).subscribe((result:any)=>{
      if(result && result.IsSuccess){
        result.Data.docs.map((item:any)=>{
          item.quantity = 1;
          item.isBetweenRating = false;
          item.ratingArray = [];
          // let averageRating = Number(item?.averageRating);
          for (let index = 0; index < Math.floor(Number(item?.averageRating)); index++) {
            item.ratingArray.push({isBetween:false,ratting:true});
          };
          let tempRatingArrayLength = item.ratingArray.length;
          for (let index = 0; index < 5; index++) {
            if(tempRatingArrayLength <= 4){
              item.ratingArray[tempRatingArrayLength] = {isBetween:false,ratting:false}
              tempRatingArrayLength++;
            };
          };
          if (Math.floor(Number(item?.averageRating)) < Number(item?.averageRating) && Math.ceil(Number(item?.averageRating)) > Number(item?.averageRating)) {
            item.ratingArray[Math.floor(Number(item?.averageRating))].isBetween = true;
          };
        });

        result.Data.docs.map((i:any)=>{
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
        this.productList  = result.Data.docs;
        this.totalProductCount =  result.Data.totalDocs;
        this.getCartlistProductWithoutLogin('cartListAndwishlist');
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this._globalFunction.successErrorHandling(result.Medssage,this,true);
      }
    },(error:any)=>{
      this.isLoading = false;
      this._globalFunction.errorHanding(error,this,true);
    })
  }

  comboProductList(){
    this.isLoading = true;
    this._shopService.getComboProductList(this.createPaginationPayload(),this.isLogin).subscribe((result:any)=>{
      if(result && result.IsSuccess){
        result.Data.docs.map((item:any)=>{
          item.quantity = 1;
          item.isBetweenRating = false;
          item.ratingArray = [];
          // let averageRating = Number(item?.averageRating);
          for (let index = 0; index < Math.floor(Number(item?.averageRating)); index++) {
            item.ratingArray.push({isBetween:false,ratting:true});
          };
          let tempRatingArrayLength = item.ratingArray.length;
          for (let index = 0; index < 5; index++) {
            if(tempRatingArrayLength <= 4){
              item.ratingArray[tempRatingArrayLength] = {isBetween:false,ratting:false}
              tempRatingArrayLength++;
            };
          };
          if (Math.floor(Number(item?.averageRating)) < Number(item?.averageRating) && Math.ceil(Number(item?.averageRating)) > Number(item?.averageRating)) {
            item.ratingArray[Math.floor(Number(item?.averageRating))].isBetween = true;
          };
        });

        result.Data.docs.map((i:any)=>{
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
        this.productList  = result.Data.docs;
        this.totalProductCount =  result.Data.totalDocs;
        this.getCartlistProductWithoutLogin('cartListAndWishlist');
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this._globalFunction.successErrorHandling(result.Medssage,this,true);
      }
    },(error:any)=>{
      this.isLoading = false;
      this._globalFunction.errorHanding(error,this,true);
    })
  }

  allProductList(){
    this.isLoading = true;
    this._shopService.getProductList(this.createPaginationPayload(),this.isLogin).subscribe((result:any)=>{
      if(result && result.IsSuccess){
        result.Data.variantData.map((item:any)=>{
          item.quantity = 1;
          item.isBetweenRating = false;
          item.ratingArray = [];
          // let averageRating = Number(item?.averageRating);
          for (let index = 0; index < Math.floor(Number(item?.averageRating)); index++) {
            item.ratingArray.push({isBetween:false,ratting:true});
          };
          let tempRatingArrayLength = item.ratingArray.length;
          for (let index = 0; index < 5; index++) {
            if(tempRatingArrayLength <= 4){
              item.ratingArray[tempRatingArrayLength] = {isBetween:false,ratting:false}
              tempRatingArrayLength++;
            };
          };
          if (Math.floor(Number(item?.averageRating)) < Number(item?.averageRating) && Math.ceil(Number(item?.averageRating)) > Number(item?.averageRating)) {
            item.ratingArray[Math.floor(Number(item?.averageRating))].isBetween = true;
          };
        });

        result.Data.variantData.map((i:any)=>{
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
        this.productList  = result.Data.variantData;
        this.totalProductCount =  result.Data.totalDocs;
        this.getCartlistProductWithoutLogin('cartListAndwishlist');
        localStorage.removeItem('SP');
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this._globalFunction.successErrorHandling(result.Medssage,this,true);
        localStorage.removeItem('SP');
      }
    },(error:any)=>{
      this.isLoading = false;
      this._globalFunction.errorHanding(error,this,true);
      localStorage.removeItem('SP');
    })
  }

  getRangeValue(){
    this._shopService.getPriceRange().subscribe((result:any)=>{
      if(result && result.IsSuccess){
        this.minValue = result.Data?.finalminprice;
        this.maxValue = result.Data?.finalmaxprice;
        // this.rangeValues[0] = this.minValue;
        // this.rangeValues[1] = this.maxValue;
        this.rangeValues = [this.minValue,this.maxValue];
      } else {
        this._globalFunction.successErrorHandling(result.Medssage,this,true);
      }
    },(error:any)=>{
      this._globalFunction.errorHanding(error,this,true);
    })
  }
  
  buyNow(variant:any){
    this.buyVariant = variant
    if(typeof window != 'undefined' && localStorage.getItem('accessToken')){
      this.isProductBuy = false;
      if(variant.in_cart){
        //this._router.navigate(['/checkout'])
        window.location.href = window.location.origin + "/checkout"
      } else {
        this._cartService.addCart({variantid:variant?._id,quantity:variant?.quantity}).subscribe((result:any)=>{
          if(result && result.IsSuccess){
            this.getUserCartList();
            // this._globalService.cartListDataPagination$.next(null);console.log('api call');
            setTimeout(() => {
              //this._router.navigate(['/checkout']);
              window.location.href = window.location.origin + "/checkout"
            }, 100);
            Swal.fire({
              position: "center",
              icon: "success",
              title: 'Product add to cartList',
              showConfirmButton: false,
              timer: 2000,
              width: '400px'
            });
          } else {
            // this._toastr.clear();
            this._globalFunctions.successErrorHandling(result.Message,this,true);
          }
        },(error:any)=>{
          // this._toastr.clear();
          this._globalFunctions.errorHanding(error,this,true);
        })
      }
    } else {
      // this.isOpenLoginForm = true;
      if(this._cookieService.get('cartList')){
        this.cartlistArray = JSON.parse(this._cookieService.get('cartList') !);
      }
      if(this.cartlistArray.length > 0){
        if(this.cartlistArray.findIndex((temp:any) => temp?._id == variant?._id) == -1){
          this.cartlistArray.push({productId:variant?.productId?._id,_id:variant?._id,quantity:variant?.quantity || 1})          
          Swal.fire({
            position: "center",
            icon: "success",
            title: 'Product add to cartList',
            showConfirmButton: false,
            timer: 2000,
            width: '400px'
          });
        } else {
          this.cartlistArray[this.cartlistArray.findIndex((temp:any) => temp?._id == variant?._id)] = {productId:variant?.productId?._id,_id:variant?._id,quantity:variant?.quantity || 1}
          Swal.fire({
            position: "center",
            icon: "success",
            title: 'Product Edit to cartList',
            showConfirmButton: false,
            timer: 2000,
            width: '400px'
          });
        }
      } else {
        this.cartlistArray.push({productId:variant?.productId?._id,_id:variant?._id,quantity:variant?.quantity || 1});
        Swal.fire({
          position: "center",
          icon: "success",
          title: 'Product add to cartList',
          showConfirmButton: false,
          timer: 2000,
          width: '400px'
        });
      };
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      this._cookieService.set('cartList',JSON.stringify(this.cartlistArray), expiryDate, '/') //,this.cookieCommonData.path,this.cookieCommonData.domain,this.cookieCommonData.secure,'None';
      // this.getCartlistProductWithoutLogin('cartList');
      this.getUserCartListFromCookie();
      // localStorage.fsetItem('tempKey',JSON.stringify(false));
      setTimeout(() => {
        //this._router.navigate(['/checkout']);
        window.location.href = window.location.origin + "/checkout"
        // localStorage.setItem('tempKey',JSON.stringify(true));
      }, 500);
    }
  }

  // unknowUserlogIn(event:any){
  //   this.isOpenLoginForm = false;
  //   if(event){
  //   }
  //   // this._globalService.cartListDataPagination$.next(null);console.log('api call');
  //   this.isProductBuy = true;
  // }
  

  unknowUserlogIn(result: any) {
    // this.isOpenLoginForm = false;
    if(result && result.IsSuccess){
      this.isOpenLoginForm = false;
      if(result?.Data){      // && !result?.Data.isotpsend
        this.isOpenOtpVeryFicationForm = true;
      } else {
        this.isOpenOtpVeryFicationForm = true;
      }
    } else {      
      this.isOpenLoginForm = false;
    }
    if(result){
      this.isProductBuy = true;
      this.buyNow(this.buyVariant);
      this.filterProductType(this.filteredProductKey);
    };
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
      if(result?.Data && !result?.Data.isotpsend){
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
    this.isOpenOtpVeryFicationForm = false;
    if(event){
      this.isOpenCreatePinForm = true;
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

  onClickProduct(productid: any, productTag:any){
    // this._router.navigate(['/shop', productid]);
    // this._router.navigate(['/shop/productdetail']);
    this._router.navigate(['/shop/productdetail/' , productTag]);
     //window.location.href = window.location.origin + "/shop/productdetail/" + productTag;
    if(typeof window != 'undefined' && localStorage.getItem('PDID')){
      localStorage.removeItem('PDID');
    }
    localStorage.setItem('PDID', window.btoa(productid));
  }

  paginationPayload(event:any){
    this.paginationPayloadObj = event
    this.filterProductType(this.filteredProductKey);
  }

  createPaginationPayload(){
    // // Angular material paginator
    // this.pageNo = this.paginationPayloadObj? (this.paginationPayloadObj.pageIndex + 1) : 1;
    // this.limit = this.paginationPayloadObj.pageSize || 10;

    // Angular Prime Ng paginator;
    this.pageNo = (this.paginationPayloadObj?.page && this.paginationPayloadObj?.rows) ? (this.paginationPayloadObj.page + 1) : 1;
    this.limit = this.paginationPayloadObj.rows || 10;
    
    let payload = {
      page: this.pageNo,
      limit: this.limit,
      sortBy:this.sortByAction || '',
      startprice:this.rangeValues[0] ? this.rangeValues[0] : 0,
      endprice:this.rangeValues[1] ? this.rangeValues[1] : 0,
      rating: parseInt(this.customerRating || 0),
      from:'web',
      search: localStorage.getItem('SP') ? window.atob(localStorage.getItem('SP')!) : '',
      language : localStorage.getItem('lang') || "english"
    }
    return payload;
  }  

  getUserCartList(){
    let data = {
      page:1,
      limit:10,
      language: localStorage.getItem("lang") || "english"
    };
    this._cartService.cartList(data).subscribe((result:any)=>{
      if(result && result.IsSuccess){
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
        
        this._globalService.totalCartListCount$.next(result.Data.totalDocs);
        this._globalService.cartListData$.next(result);
      } else {
        this._globalFunction.successErrorHandling(result.Message,this,true);
      }
    },(error:any)=>{
      this._globalFunction.errorHanding(error,this,true);
    })
  }

  ngOnDestroy(): void {
    localStorage.removeItem('SP');
  }

  mouseHoverVideo(video:any,index:number) {
    if (video?.productId?.otherpath?.length > 0) {
      this.hoverIndex = index;
      this.hoverVideo = video.productId.otherpath[0].path;
    }
  }
  
  mouseOutVideo(image:any) {
    if(image?.productId?.bannerImage){
      this.hoverVideo = null;
      this.hoverIndex = null;
    }
  }
}
