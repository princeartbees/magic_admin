import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild, booleanAttribute, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../services/global.service';
import { GlobalFunctions } from '../../common/global-function';
import { AddEditAddressComponent } from '../add-edit-address/add-edit-address.component';
import { MatRadioModule } from '@angular/material/radio';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../cart-list/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CONSTANTS } from '../../common/constants';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CouponListComponent } from '../coupon-list/coupon-list.component';
import { ShopService } from '../shop/shop.service';
import { CheckOutService } from './check-out.service';
import { Router, RouterModule } from '@angular/router';
// import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { CountryISO, NgxIntlTelInputModule, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { HttpClient } from '@angular/common/http';
import { LoginComponent } from '../../auth/login/login.component';
import { SubscriptionService } from '../subscription/subscription.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, Observable } from 'rxjs';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MenuItem } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { AuthService } from '../../auth/auth.service';
import { OtpVeryficationComponent } from '../../auth/otp-veryfication/otp-veryfication.component';
import { AddressService } from '../add-edit-address/address.service';
declare var $: any;

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [
    CommonModule,
    AddEditAddressComponent,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    RadioButtonModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    CouponListComponent,
    RouterModule,
    // MatStepper,
    MatStepperModule,
    NgxIntlTelInputModule,
    LoginComponent,
    TranslateModule,
    MatIconModule,
    StepsModule,
    OtpVeryficationComponent
  ],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.scss',
  providers: []
})
export class CheckOutComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() isUnknowUser!: boolean;
  @Output() unKnowUserRegister: EventEmitter<any> = new EventEmitter<any>();
  isOpenOtpVeryFicationForm: boolean = false;
  steps: MenuItem[] = [];
  activeIndex: number = 0;
  step: number = 1;
  step1Completed = false;
  step2Completed = false;
  isEditable = false;
  addressDetails: any = [];
  cartList: any = [];
  saveForLatterList: any = [];
  relatedProductData: any = [];
  constants: any = CONSTANTS;
  isCartListLoading: any;
  priceDetailsObj: any = {};
  isGeneratBillLoading: any;
  cartDataList: any;
  selectedAddress: any;
  selectedAddressId: any;
  isAddEditAddressLoading: boolean = false;
  isAddEditAddress: boolean = false;
  isOpenCouponList: boolean = false;
  isRelatedProductLoading: boolean = false;
  couponeCodeText: any = "";
  couponeDiscountData: any;
  paymentType: any;
  placedOrderData: any;
  isStatus: boolean = false;
  cartDataFromCookie: any = [];
  userAddressObj: any;
  isProductVariantOpen: boolean = false;
  isPaymentConfirm: boolean = false;
  variantCouponData: any;

  checkEmail: any;
  userForm: any = FormGroup;

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.India];
  phoneForm: any = new FormGroup({
    phone: new FormControl(null, [Validators.required]),
  });
  gendersArray: string[] = ['male', 'female', 'other'];
  hidePin: boolean = false;
  isWithOutLogIn: boolean = false;
  applyedProductCouponList: any = [];
  is_user_exist: boolean = false;
  isOpenLoginForm: boolean = false;
  isFreeShipping: boolean = false;

  errorCount: number = 0;
  couponList: any = [];
  isLogin: boolean = false;
  isPlacingOrder: boolean = false;

  private popstateListener: any;
  private beforeUnloadListener: any;
  private keydownListener: any;

  stepperOrientation$!: Observable<'horizontal' | 'vertical'>;

  @ViewChild('stepper2') matStepper2!: MatStepper;
  @ViewChild('stepper') matStepper!: MatStepper;

  constructor(
    private _globalService: GlobalService,
    private _globalFunctions: GlobalFunctions,
    private _cartService: CartService,
    private _cookieService: CookieService,
    private _toastr: ToastrService,
    private _shopService: ShopService,
    private _checkOutService: CheckOutService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _httpClient: HttpClient,
    private _subscriptionService: SubscriptionService,
    private renderer: Renderer2,
    private breakpointObserver: BreakpointObserver,
    private _authService: AuthService,
    private _addressService: AddressService
  ) {

    this.stepperOrientation$ = this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(map(result => result.matches ? 'vertical' : 'horizontal'));

    this.isWithOutLogIn = false;
    $('.page-loader').fadeIn('fast');
    setTimeout(() => {
      $('.page-loader').fadeOut('slow');
    }, 1500);
  }

  ngOnInit(): void {
    this.steps = [
      // { label: 'User Details' },
      { label: 'Address Details' },
      { label: 'Summary & Payment' },
    ];

    if (typeof window != undefined && localStorage.getItem('accessToken')) {
      this.isLogin = true
    } else {
      this.isLogin = false
      this.steps.unshift({ label: 'User Details' })
    }

    if (this.isPaymentConfirm) {
      history.pushState(null, '', location.href);
      window.addEventListener('popstate', () => {
        history.pushState(null, '', location.href);
        alert('Back navigation is disabled during payment.');
      });

      window.addEventListener('beforeunload', function (event) {
        event.preventDefault();
        event.returnValue = 'Are you sure you want to leave? Your payment may not be processed.';
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
          event.preventDefault();
          alert('Page refresh is disabled during payment.');
        }
      });
    }

    this.getAllCoupon();
    if (typeof window != 'undefined' && !localStorage.getItem('accessToken')) {
      this.isWithOutLogIn = true;
      this.prePareUserFormObj();
    }
    if (this._cookieService.get('cartList')) {
      this.cartDataFromCookie = JSON.parse(this._cookieService.get('cartList')!);
    }
    this._globalService.cartListData$.subscribe((result: any) => {
      if (result?.Data?.cartDetails?.length > 0) {
        result?.Data?.cartDetails.map((item: any) => {
          item.isApplyCoupon = false;
          if (this._router.url == '/checkout') {
            this._shopService.getProductCoupon({ variantid: item?._id, from: "web" }).subscribe((result: any) => {
              item.productCoupon = result?.Data != null ? result?.Data : {};
              item.isProductCoupon = Object.keys(item.productCoupon).length === 0 ? false : true;
              this.priceDetailsObj.couponCodesList.map((i: any) => {
                if (i.productCoupon?.coupon_code == item.productCoupon.coupon_code) {
                  if (this.paymentType != "cod") {
                    item.isApplyCoupon = true;
                  }
                }
              });
            });
          }
        })
        this.cartList = result?.Data?.cartDetails;
        this.isStatus = result?.Data?.codstatus;
        // this.cartList.map((i: any) => {
        //   this.isFreeShipping = i.productId?.is_free;
        // })
      } else if (result?.Data?.docs?.length > 0) {
        this.isCartListLoading = false;
        result?.Data?.docs.map((item: any) => {
          item.isApplyCoupon = false;
          this.cartDataFromCookie.map((tempItem: any) => {
            if (tempItem?._id == item?._id) {
              item.quantity = tempItem.quantity;
            };
          });
          if (this._router.url == '/checkout') { //  && typeof window != undefined && localStorage.getItem('tempKey') && JSON.parse(localStorage.getItem('tempKey') !)
            this._shopService.getProductCoupon({ variantid: item?._id, from: "web" }).subscribe((result: any) => {
              item.productCoupon = result?.Data != null ? result?.Data : {};
              item.isProductCoupon = Object.keys(item.productCoupon).length === 0 ? false : true;
              this.priceDetailsObj.couponCodesList.map((i: any) => {
                if (i.productCoupon?.coupon_code == item.productCoupon.coupon_code) {
                  item.isApplyCoupon = true;
                }
              });
            });
          }
        });
        this.cartList = result?.Data?.docs;
        this.cartList.map((i: any) => {
          this.isFreeShipping = i.productId?.is_free;
        })
      } else {
        this.cartList = [];
      };
      this.generateBillDetails();
    });
    this._globalService.addressListData$.subscribe((result: any) => {
      if (result) {
        let hasSelectedAddress = false;
        result?.Data?.docs.map((item: any) => {
          if (item.select) {
            this.selectedAddressId = item._id;
            hasSelectedAddress = true;
          }
        });
        
        // If no address is selected and there are addresses available, select the first one
        if (!hasSelectedAddress && result?.Data?.docs && result.Data.docs.length > 0) {
          this.selectedAddressId = result.Data.docs[0]._id;
          // Update the address list to mark the first address as selected
          this.addressDetails = result.Data.docs.map((item: any, index: number) => ({
            ...item,
            select: index === 0
          }));
        } else {
          this.addressDetails = result?.Data?.docs;
        }
      }
    })

  };

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.cartList.length == 0 && this.priceDetailsObj.totalAmount == "0.00") {
        this._router.navigate(['/home']);
        return;
      }
    }, 1500);

    // setTimeout(() => {
    //   if(this.addressDetails.length > 0){
    //     this.addressDetails.forEach((item:any) => {
    //       const pincodeObj = {
    //         pincode: item?.pincode
    //       }
    //       this._checkOutService.getPincode(pincodeObj).subscribe((result:any) => {
    //         if(result && result.IsSuccess){
    //           if(result.Data.codavailable){
    //             if(typeof window != 'undefined' && localStorage.getItem('accessToken')){
    //               this.isStatus = true;
    //             }else{
    //               this.isStatus = false;
    //             }
    //           } else {
    //             this.isStatus = false;
    //             this.paymentType = null;
    //             Swal.fire({
    //               position: "center",
    //               icon: "error",
    //               title: 'This selected pincode is not available for COD delivery...!',
    //               showConfirmButton: false,
    //               timer: 4000,
    //               width: '400px'
    //             });
    //           }
    //         } else {
    //           this._globalFunctions.successErrorHandling(result, this, true);
    //         }
    //       },(error) => {
    //         this._globalFunctions.successErrorHandling(error, this, true);  
    //       });
    //     });
    //   }
    // }, 500);
  }

  startTimer(starttime: any, endtime: any, updateDisplayCallback: any) {
    let endTime: any = new Date(endtime);
    let currentTime: any = new Date(starttime);
    let remainingTime = Math.max(0, endTime - currentTime);

    // Function to format the remaining time
    const formatTime = (milliseconds: any) => {
      const totalSeconds = Math.floor(milliseconds / 1000);
      const days = Math.floor(totalSeconds / 86400); // 86400 seconds in a day
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const formatNumber = (num: any) => num.toString().padStart(2, '0');
      return `${days} day ${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
    };

    // Initial display update
    updateDisplayCallback(formatTime(remainingTime));

    // Set an interval to update the display every second
    const timer = setInterval(() => {
      currentTime = new Date();
      remainingTime = Math.max(0, endTime - currentTime);

      if (remainingTime <= 0) {
        clearInterval(timer);
        updateDisplayCallback('0 day 00:00:00'); // Display zero time if finished
      } else {
        updateDisplayCallback(formatTime(remainingTime));
      }
    }, 1000);
  }

  getAllCoupon() {
    const couponObj = {
      from: "web"
    }
    this._shopService.getCoupon(couponObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        result.Data.map((item: any) => {
          item.isApplyed = false;
        });
        this.couponList = result.Data;
        this.couponList.forEach((data: any, index: any) => {

          // Define a callback to update the display element
          const updateDisplay = (formattedTime: any) => {
            data.timer = `${formattedTime}`;
          };
          // Start the timer
          this.startTimer(data.starttime, data.endtime, updateDisplay);
        });
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error) => {
      this._globalFunctions.successErrorHandling(error, this, true);
    })
  }

  getVariantsDetails(result: any) {
    if (result?.Data?.cartDetails?.length > 0) {
      this.cartList = result?.Data?.cartDetails;
      this.isStatus = result?.Data?.codstatus;
    } else if (result?.Data?.docs?.length > 0) {
      this.isCartListLoading = false;
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
        this.cartDataFromCookie.map((tempItem: any) => {
          if (tempItem?._id == item?._id) {
            item.quantity = tempItem.quantity;
          };
        });
        if (this._router.url == '/checkout') {
          this._shopService.getProductCoupon({ variantid: item?._id, from: "web" }).subscribe((result: any) => {
            item.productCoupon = result?.Data != null ? result?.Data : {};
            item.isProductCoupon = Object.keys(item.productCoupon).length === 0 ? false : true;
            item.isApplyCoupon = false;
          });
        };
      });
      this.cartList = result?.Data?.docs;
    } else {
      this.cartList = [];
    };
    this.generateBillDetails();
  }

  prePareUserFormObj() {
    this.userForm = this._formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      gender: ['', Validators.required],
      // pin: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern("^[0-9]*$")]], // Validators.pattern('[0-9]{4}')
    })
  }

  checkEmailId(event: any) {
  };

  getUserCartList() {
    let data = {
      page: 1,
      limit: 10,
      language: localStorage.getItem("lang") || "english"
    };
    this._cartService.cartList(data).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        if (result.Data.totalDocs == 0) {
          this._router.navigate(['/shop'])
        }
        result.Data.cartDetails.map((i: any) => {
          if (localStorage.getItem("lang") == "hindi") {
            i.productId.product_name = i.productId.hi_product_name;
          }
          if (localStorage.getItem("lang") == "marathi") {
            i.productId.product_name = i.productId.mr_product_name;
          }
          if (localStorage.getItem("lang") == "gujarati") {
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
  };

  isAllLoading(loading: boolean) {
    this.isCartListLoading = loading;
    this.isGeneratBillLoading = loading;
  };

  increaseProductQuantity(sizeId: any, variant: any) {
    variant.quantity += 1;
    this.changeSize(sizeId, variant)
  };

  decreaseProductQuantity(sizeId: any, variant: any) {
    if (variant.quantity >= 1) {
      variant.quantity -= 1;
      if (variant.quantity == 0) {
        variant.quantity = 1;
        return;
      }
      this.changeSize(sizeId, variant)
    }
  };

  changeSize(event: any, variant: any) {
    let tempObj: any = {
      sizeid: event,
      _id: variant?._id,
      quantity: variant?.quantity
    }
    this.editCartProduct(tempObj, variant);
  };

  editCartProduct(data: any, variant: any) {
    this.isAllLoading(true);
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
          this.isAllLoading(false);
          // this._toastr.clear();
          this.getUserCartList();
          // this._globalService.cartListDataPagination$.next(null);console.log('api call');
        } else {
          this.isAllLoading(false);
          this._globalFunctions.successErrorHandling(result.Message, this, true);
        }
      }, (error: any) => {
        this.isAllLoading(false);
        this._globalFunctions.errorHanding(error, this, true);
      });
    }
  };

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
      if (this.applyedProductCouponList?.length > 0) {
        if (this.applyedProductCouponList.findIndex((tempItem: any) => tempItem?._id == variant?._id) != -1) {
          this.applyedProductCouponList.splice(this.applyedProductCouponList.findIndex((tempItem: any) => tempItem?._id == variant?._id), 1)
        }
      };
      // this._cookieService.set('cartList',JSON.stringify(this.cartList)) //,this.cookieCommonData.path,this.cookieCommonData.domain,this.cookieCommonData.secure,'None';
    } else {
      this.isAllLoading(true);
      this._cartService.removeCart({ variantid: variant?._id }).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          if (this.applyedProductCouponList?.length > 0) {
            if (this.applyedProductCouponList.findIndex((tempItem: any) => tempItem?._id == variant?._id) != -1) {
              this.applyedProductCouponList.splice(this.applyedProductCouponList.findIndex((tempItem: any) => tempItem?._id == variant?._id), 1)
            }
          }
          this.isAllLoading(false);

          this.cartList.splice(this.cartList.findIndex((temp: any) => temp?._id == variant?._id), 1);
          this.generateBillDetails();
          // this.getUserCartList();
          // this._globalService.cartListDataPagination$.next(null);console.log('api call');
          Swal.fire({
            position: "center",
            icon: "success",
            title: 'Product remove to cartList',
            showConfirmButton: false,
            timer: 2000,
            width: '400px'
          });
        } else {
          this.isAllLoading(false);
          this._globalFunctions.successErrorHandling(result.Message, this, true);
        }
      }, (error: any) => {
        this.isAllLoading(false);
        this._globalFunctions.errorHanding(error, this, true);
      })
    }
  };

  getUserCartListFromCookie(data: any) {
    let obj: any = {
      page: 1,
      limit: 10,
      language: localStorage.getItem("lang") || "english"
    };
    obj.variants = JSON.parse(this._cookieService.get('cartList')!)
    if (this._cookieService.get('cartList') && JSON.parse(this._cookieService.get('cartList')!).length > 0) {
      this._cartService.getVariant(obj).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          let tempData: any = JSON.parse(this._cookieService.get('cartList')!)
          result?.Data?.docs.map((item: any) => {
            if (localStorage.getItem("lang") == "hindi") {
              item.productId.product_name = item.productId.hi_product_name;
            }
            if (localStorage.getItem("lang") == "marathi") {
              item.productId.product_name = item.productId.mr_product_name;
            }
            if (localStorage.getItem("lang") == "gujarati") {
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
    }
    // this._globalService.cartListDataFromCookies$.subscribe((result:any)=>{
    //   if(result != null && result?.length > 0){
    //     obj.variants = result;
    //   } else {
    //     if(this._cookieService.get('cartList')){
    //       obj.variants = JSON.parse(this._cookieService.get('cartList') !);
    //     };
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

  editAddress(addressObj: any) {
    this.isAddEditAddressLoading = true;
    this.isAddEditAddress = false;
    setTimeout(() => {
      this.selectedAddress = addressObj;
      this.isAddEditAddress = true;
      this.isAddEditAddressLoading = false;
      
      // Clear selectedAddressId when editing an address
      this.selectedAddressId = null;
      this.userAddressObj = null;
    }, 500);
  };

  cancelAddressEdit() {
    this.isAddEditAddress = false;
    this.selectedAddress = null;
    this.userAddressObj = null;
    
    // Restore the previously selected address if available
    if (this.addressDetails && this.addressDetails.length > 0) {
      const selectedAddress = this.addressDetails.find((item: any) => item.select);
      if (selectedAddress) {
        this.selectedAddressId = selectedAddress._id;
      }
    }
  };

  addNewAddress() {
    this.isAddEditAddress = true;
    this.selectedAddress = null;
    this.selectedAddressId = null;
    this.userAddressObj = null;
  };

  addressAddEdit(event: any) {
    // this.isAddEditAddress = false;
    this.userAddressObj = event?.fullname ? event : null;
    if (this.userAddressObj) {
      this.selectedAddressId = null;
    }
    this.isAddEditAddress = false;
    this.selectedAddress = null;
  };

  selectAddressChange(event: any) {
    this.selectedAddressId = event?.value;
    if (this.addressDetails && this.addressDetails.length > 0) {
      this.addressDetails = this.addressDetails.map((item: any) => ({
        ...item,
        select: item._id === this.selectedAddressId
      }));
    }
    if (this.selectedAddressId) {      //this.isLogin && 
      this._addressService.selectAddress({ addressid: this.selectedAddressId }).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this._globalService.addressListDataPagination$.next(null);
        }
      });
    }
  };

  // checkPinCodeForDTDC(e:any){
  //   const pincodeObj = {
  //     pincode: e?.pincode.toString() || ""
  //   }
  //   this._checkOutService.getPincode(pincodeObj).subscribe((result:any) => {
  //     if(result && result.IsSuccess){
  //       if(result.Data.codavailable){
  //         if(typeof window != 'undefined' && localStorage.getItem('accessToken')){
  //           this.isStatus = true;
  //         }else{
  //           this.isStatus = false;
  //         }
  //       } else {
  //         this.isStatus = false;
  //         this.paymentType = null;
  //         Swal.fire({
  //           position: "center",
  //           icon: "error",
  //           title: 'This selected pincode is not available for COD delivery...!',
  //           showConfirmButton: false,
  //           timer: 4000,
  //           width: '400px'
  //         });
  //       }
  //     } else {
  //       this._globalFunctions.successErrorHandling(result, this, true);
  //     }
  //   },(error) => {
  //     this._globalFunctions.successErrorHandling(error, this, true);  
  //   });
  // }

  closeCouponList() {
    this.isOpenCouponList = false;
  };

  applyCouponCode(couponCode: any) {
    if (this.paymentType && this.paymentType != "cod") {
      let couponCodeObj: any = {
        code: this.couponeCodeText,
        total_purchase: this.priceDetailsObj.totalAmount || 0,
        from: "web"
      }
      this._shopService.applyCoupon(couponCodeObj).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.couponeDiscountData = result?.Data
          this.generateBillDetails();
          // this._toastr.clear();
          // this._toastr.success('Coupon code apply Succssfully','Success')
          Swal.fire({
            position: "center",
            icon: "success",
            title: 'Coupon code apply Succssfully',
            showConfirmButton: false,
            timer: 2000,
            width: '400px'
          });
          this.couponeCodeText = "";
        } else {
          this._globalFunctions.successErrorHandling(result.Message, this, true);
          this.couponeCodeText = "";
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.couponeCodeText = "";
      })
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: 'Please select pay online payment type option for apply coupon...!',
        showConfirmButton: true,
        width: '400px'
      });
    }

  };

  applyDirectCouponCode(coupon: any) {
    let alreadyMainCouponApplied = this.couponList.filter((i: any) => i.isApplyed).length;
    if (alreadyMainCouponApplied > 0) {
      this.isOpenCouponList = false;
      Swal.fire({
        position: "center",
        icon: "error",
        title: 'Coupon code already applied.',
        showConfirmButton: false,
        timer: 2000,
        width: '400px'
      });
      return;
    }
    if (!this.paymentType || this.paymentType == "cod") {
      this.isOpenCouponList = false;
      Swal.fire({
        position: "center",
        icon: "error",
        title: 'Please select pay online payment type option for apply coupon...!',
        showConfirmButton: true,
        width: '400px'
      });
      return;
    }
    this.couponList.map((tempCoupon: any) => {
      tempCoupon.isApplyed = false;
      if (tempCoupon.coupon_code == coupon.coupon_code && this.paymentType != "cod") {
        tempCoupon.isApplyed = true;
      }
    });
    if (typeof window != undefined && localStorage.getItem('accessToken')) {
      let couponCodeObj: any = {
        code: coupon?.coupon_code,
        total_purchase: this.priceDetailsObj.totalAmount || 0,
        from: "web"
      };
      this._shopService.applyCoupon(couponCodeObj).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.couponeDiscountData = result?.Data;
          this.applyedProductCouponList.push({
            productCoupon: { coupon_code: result?.Data.coupon_code },
            discount_inr_amount: result?.Data?.currency == 'INR' ? result?.Data?.coupon_discount_amount : 0,
            discount_usd_amount: result?.Data?.currency == 'USD' ? result?.Data?.coupon_discount_amount : 0
          })
          this.isOpenCouponList = false;
          this.generateBillDetails();
          // this._toastr.clear();
          // this._toastr.success('Coupon code apply Succssfully','Success')
          Swal.fire({
            position: "center",
            icon: "success",
            title: 'Coupon code apply Succssfully',
            showConfirmButton: false,
            timer: 2000,
            width: '400px'
          });
          this.couponeCodeText = "";
        } else {
          this._globalFunctions.successErrorHandling(result.Message, this, true);
          this.couponeCodeText = "";
          this.isOpenCouponList = false;
          this.couponList.map((tempCoupon: any) => {
            tempCoupon.isApplyed = false;
          });
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isOpenCouponList = false;
        this.couponeCodeText = "";
        this.couponList.map((tempCoupon: any) => {
          tempCoupon.isApplyed = false;
        });
      });
    } else {
      this.isOpenCouponList = false;
      Swal.fire({
        position: "center",
        icon: "success",
        title: 'Coupon code apply Succssfully',
        showConfirmButton: false,
        timer: 2000,
        width: '400px'
      });
      let tempDiscount_inr_amount: any, tempDiscount_usd_amount: any;
      if (coupon.discount_type == 'percentage') {
        if (this.priceDetailsObj.currency == 'inr') {
          tempDiscount_inr_amount = ((this.priceDetailsObj.discountTotalAmount * coupon?.discount) / 100);
        } else if (this.priceDetailsObj.currency == 'usd') {
          tempDiscount_usd_amount = ((this.priceDetailsObj.discountTotalAmount * coupon?.discount) / 100);
        }
      } else if (coupon.discount_type == 'amount') {
        if (this.priceDetailsObj.currency == 'inr') {
          tempDiscount_inr_amount = coupon?.discount
        } else if (this.priceDetailsObj.currency == 'usd') {
          tempDiscount_usd_amount = coupon?.discount
        }
      };
      this.applyedProductCouponList.push({
        productCoupon: { coupon_code: coupon.coupon_code },
        discount_inr_amount: this.priceDetailsObj.currency == 'inr' ? tempDiscount_inr_amount : 0,
        discount_usd_amount: this.priceDetailsObj.currency == 'usd' ? tempDiscount_usd_amount : 0
      });
      this.generateBillDetails();
    }
  }

  cancelApplyDirectCouponCode(coupon: any) {
    this.couponList.map((singleCoupon: any) => {
      if (singleCoupon?.coupon_code == coupon?.coupon_code) {
        coupon.isApplyed = false;
      };
    });
    if (this.applyedProductCouponList.findIndex((tempItem: any) => tempItem?.productCoupon?.coupon_code === coupon?.coupon_code) != -1) {
      this.applyedProductCouponList.splice(this.applyedProductCouponList.findIndex((tempItem: any) => tempItem?.productCoupon?.coupon_code === coupon?.coupon_code), 1)
    }
    this.generateBillDetails();
    this.isOpenCouponList = false;
    Swal.fire({
      position: "center",
      icon: "success",
      title: 'Coupon code removed Succssfully',
      showConfirmButton: false,
      timer: 2000,
      width: '400px'
    });
  }

  getAllRelatedProduct(productId: any) {
    this.isRelatedProductLoading = true;
    const relatedProductObj = {
      variantid: productId
    }
    this._shopService.getRelatedProduct(relatedProductObj, this.isLogin).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.relatedProductData = result.Data;
        this.isRelatedProductLoading = false;
      } else {
        this.isRelatedProductLoading = false;
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error) => {
      this.isRelatedProductLoading = false;
      this._globalFunctions.successErrorHandling(error, this, true);
    })
  };

  getProductCoupon(variant: any) {
    if (!this.paymentType || this.paymentType == "cod") {
      this.priceDetailsObj.couponCodesList = [];
      this.applyedProductCouponList = [];
      this.priceDetailsObj.couponeDiscountValue = 0;
      Swal.fire({
        position: "center",
        icon: "error",
        title: 'Please select pay online payment type option for apply coupon...!',
        showConfirmButton: true,
        width: '400px'
      });
      return;
    }
    this.applyedProductCouponList = [];
    this.isProductVariantOpen = true;
    this.variantCouponData = variant;
  };

  applyVariantCoupon(variantData: any) {
    this.isProductVariantOpen = false;
    if (typeof window != 'undefined' && !localStorage.getItem('accessToken')) {
      variantData.isApplyCoupon = !variantData.isApplyCoupon;
      this.cartList.map((item: any) => {
        if (item?._id == variantData?._id) {
          if (variantData.isApplyCoupon) {
            item.isApplyCoupon = variantData.isApplyCoupon;
            if (variantData.productCoupon?.discount_type == 'percentage') {
              if (item?.inr_gross_amount) {
                item.discounted_inr_amount = item?.inr_gross_amount - ((item?.inr_gross_amount * variantData?.productCoupon?.discount) / 100);
                item.discount_inr_amount = ((item?.inr_gross_amount * variantData?.productCoupon?.discount) / 100)
              } else if (item?.usd_gross_amount) {
                item.discounted_usd_amount = item?.usd_gross_amount - ((item?.usd_gross_amount * variantData?.productCoupon?.discount) / 100);
                item.discount_usd_amount = ((item?.usd_gross_amount * variantData?.productCoupon?.discount) / 100);
              };
            } else if (variantData.productCoupon?.discount_type == 'amount') {
              if (item?.inr_gross_amount) {
                item.discounted_inr_amount = item?.inr_gross_amount - variantData?.productCoupon?.discount;
                item.discount_inr_amount = variantData?.productCoupon?.discount;
              } else if (item?.usd_gross_amount) {
                item.discounted_usd_amount = item?.usd_gross_amount - variantData?.productCoupon?.discount;
                item.discount_usd_amount = variantData?.productCoupon?.discount;
              };
            };
          } else {
            item.isApplyCoupon = variantData.isApplyCoupon;
            if (item?.inr_gross_amount) {
              item.discounted_inr_amount = item?.inr_gross_amount;
              item.discount_inr_amount = 0;
            } else if (item?.usd_gross_amount) {
              item.discounted_usd_amount = item?.usd_gross_amount;
              item.discount_usd_amount = 0;
            };
          };
        };
      });
      if (this.paymentType != "cod") {
        this.applyedProductCouponList.push(variantData);
        this.generateBillDetails();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Your selected payment type is COD , It Could\'nt applied any coupon.'
        });
      }
    } else {
      let data: any = {
        couponcode: variantData?.productCoupon?.coupon_code,
        from: "web"
      };
      this._shopService.applyProductCoupon(data).subscribe((result: any) => {
        if (result && result?.IsSuccess) {
          variantData.isApplyCoupon = !variantData.isApplyCoupon;
          this.cartList.map((item: any) => {
            if (item?._id == variantData?._id) {
              if (variantData.isApplyCoupon) {
                item.isApplyCoupon = variantData.isApplyCoupon;
                if (variantData.productCoupon?.discount_type == 'percentage') {
                  if (item?.inr_gross_amount) {
                    item.discounted_inr_amount = item?.inr_gross_amount - ((item?.inr_gross_amount * variantData?.productCoupon?.discount) / 100);
                    item.discount_inr_amount = ((item?.inr_gross_amount * variantData?.productCoupon?.discount) / 100)
                  } else if (item?.usd_gross_amount) {
                    item.discounted_usd_amount = item?.usd_gross_amount - ((item?.usd_gross_amount * variantData?.productCoupon?.discount) / 100);
                    item.discount_usd_amount = ((item?.usd_gross_amount * variantData?.productCoupon?.discount) / 100);
                  };
                } else if (variantData.productCoupon?.discount_type == 'amount') {
                  if (item?.inr_gross_amount) {
                    item.discounted_inr_amount = item?.inr_gross_amount - variantData?.productCoupon?.discount;
                    item.discount_inr_amount = variantData?.productCoupon?.discount;
                  } else if (item?.usd_gross_amount) {
                    item.discounted_usd_amount = item?.usd_gross_amount - variantData?.productCoupon?.discount;
                    item.discount_usd_amount = variantData?.productCoupon?.discount;
                  };
                };
              } else {
                item.isApplyCoupon = variantData.isApplyCoupon;
                if (item?.inr_gross_amount) {
                  item.discounted_inr_amount = item?.inr_gross_amount;
                  item.discount_inr_amount = 0;
                } else if (item?.usd_gross_amount) {
                  item.discounted_usd_amount = item?.usd_gross_amount;
                  item.discount_usd_amount = 0;
                };
              };
            };
          });
          if (this.paymentType != "cod") {
            let existsCoupon = this.applyedProductCouponList.filter((i: any) => i.productCoupon?.coupon_code == variantData.productCoupon?.coupon_code).length;

            if (existsCoupon == 0) {
              this.applyedProductCouponList.push(variantData);
            }
            this.generateBillDetails();
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: 'Your selected payment type is COD , It Could\'nt applied any coupon.'
            });
          }
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
        };
      }, (error) => {
        this._globalFunctions.errorHanding(error, this, true);
      });
    };
  };

  cancelApplyProductCoupon(variantData: any) {
    // if(typeof window != 'undefined' && !localStorage.getItem('accessToken')){
    variantData.isApplyCoupon = !variantData.isApplyCoupon;
    this.cartList.map((item: any) => {
      if (item?._id == variantData?._id) {
        if (!variantData.isApplyCoupon) {
          item.isApplyCoupon = variantData.isApplyCoupon;
          if (item?.inr_gross_amount) {
            item.discounted_inr_amount = item?.inr_gross_amount;
            item.discount_inr_amount = 0;
          } else if (item?.usd_gross_amount) {
            item.discounted_usd_amount = item?.usd_gross_amount;
            item.discount_usd_amount = 0;
          };
        };
      };
    });
    if (this.applyedProductCouponList?.length > 0) {
      this.applyedProductCouponList.splice(this.applyedProductCouponList.findIndex((tempItem: any) => tempItem?._id == variantData?._id), 1)
    }
    this.generateBillDetails();
    // }
  }

  generateBillDetails() {
    this.priceDetailsObj.currency = this.cartList[0]?.inr_price ? 'inr' : 'usd';
    this.priceDetailsObj.noOfItem = this.cartList.length;
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
    this.priceDetailsObj.subTotal = parseFloat(this.priceDetailsObj.subTotal).toFixed(2);
    this.priceDetailsObj.total_gst = ((parseFloat(this.priceDetailsObj.subTotal) * 0) / 100).toFixed(2);
    if (this.paymentType != "cod") {
      this.priceDetailsObj.shippingCharge = 0;
      this.priceDetailsObj.couponCodesList = this.applyedProductCouponList;
      this.priceDetailsObj.couponeDiscountValue = 0;
      // this.priceDetailsObj.couponeDiscountValue = this.couponeDiscountData?.coupon_discount_amount ? this.couponeDiscountData.coupon_discount_amount : 0;
      if (this.priceDetailsObj.couponCodesList?.length > 0) {
        this.priceDetailsObj.couponCodesList.map((item: any) => {
          this.priceDetailsObj.couponeDiscountValue += this.priceDetailsObj.currency == 'inr' ? item?.discount_inr_amount : item.discount_usd_amount
        })
      }
      this.priceDetailsObj.couponeDiscountValue = this.priceDetailsObj.couponeDiscountValue.toFixed(2);
    } else {
      this.priceDetailsObj.couponCodesList = [];
      this.applyedProductCouponList = [];
      this.priceDetailsObj.couponeDiscountValue = 0;
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Your selected payment type is COD , It Could\'nt applied any coupon.'
      });
    }
    let shippingCharge = this.priceDetailsObj.shippingCharge || 0;
    this.priceDetailsObj.totalAmount = parseFloat(this.priceDetailsObj.subTotal) + parseFloat(this.priceDetailsObj.total_gst) + (this.priceDetailsObj.currency == 'inr' ? this.priceDetailsObj.inrDeliveryCharges : this.priceDetailsObj.usdDeliveryCharges) + shippingCharge;
    this.priceDetailsObj.totalAmount = this.priceDetailsObj.totalAmount.toFixed(2);
    this.priceDetailsObj.discountTotalAmount = this.priceDetailsObj.totalAmount - this.priceDetailsObj.couponeDiscountValue;
    // console.log(this.priceDetailsObj);
  };

  selectPaymentType(event: any) {
    this.paymentType = event;
    if (this.paymentType == 'cod') {
      this.cartList.map((i: any) => {
        if (i?.productId?.is_free == false)
          this.priceDetailsObj.shippingCharge = this.constants.isShippingCharge;
        // this.generateBillDetails();
      });
      if (this.priceDetailsObj.couponCodesList.length > 0) {
        this.priceDetailsObj.couponCodesList = [];
        this.applyedProductCouponList = [];
        this.priceDetailsObj.couponeDiscountValue = 0;
        this.generateBillDetails();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Your selected payment type is COD , It Could\'nt applied any coupon.'
        });
      }
      let shippingCharge = this.priceDetailsObj.shippingCharge || 0;
      this.priceDetailsObj.totalAmount = parseFloat(this.priceDetailsObj.subTotal) + parseFloat(this.priceDetailsObj.total_gst) + (this.priceDetailsObj.currency == 'inr' ? this.priceDetailsObj.inrDeliveryCharges : this.priceDetailsObj.usdDeliveryCharges) + shippingCharge;
      this.priceDetailsObj.totalAmount = this.priceDetailsObj.totalAmount.toFixed(2);
      this.priceDetailsObj.discountTotalAmount = this.priceDetailsObj.totalAmount - this.priceDetailsObj.couponeDiscountValue;
    } else {
      this.priceDetailsObj.shippingCharge = 0;
      this.priceDetailsObj.totalAmount = parseFloat(this.priceDetailsObj.subTotal) + parseFloat(this.priceDetailsObj.total_gst) + (this.priceDetailsObj.currency == 'inr' ? this.priceDetailsObj.inrDeliveryCharges : this.priceDetailsObj.usdDeliveryCharges) + this.priceDetailsObj.shippingCharge;
      this.priceDetailsObj.totalAmount = this.priceDetailsObj.totalAmount.toFixed(2);
      this.priceDetailsObj.discountTotalAmount = this.priceDetailsObj.totalAmount - this.priceDetailsObj.couponeDiscountValue;
    }
  };

  unknowUserlogIn(event: any) {
    this.isOpenLoginForm = false;
    if (event) {
      if (typeof window != undefined && localStorage.getItem('accessToken')) {
        let tempCartList = JSON.parse(this._cookieService.get('cartList')!);
        let payload = {
          cartproducts: tempCartList,
        };
        this._cartService.addMultiProductToCart(payload).subscribe((result: any) => {
          if (result && result.IsSuccess) {
            // this._globalService.cartListDataPagination$.next(null);console.log('api call');
            this.getUserCartList();
          } else {
            this._globalFunctions.successErrorHandling(result?.message, this, true);
          };
        }, (error: any) => {
          this._globalFunctions.errorHanding(error, this, true);
        });
      };
      this.isWithOutLogIn = false;
    }
  }

  // checkUserDetails() {
  //   if (typeof window != undefined && !localStorage.getItem('accessToken') && this.userForm.invalid) {
  //     Object.keys(this.userForm.controls).forEach((key: any) => {
  //       this.userForm.controls[key].touched = true;
  //       this.userForm.controls[key].markAsDirty();
  //     });
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: 'Please add User details'
  //     });
  //     this.errorCount++;
  //     return;
  //   }
  //   if (typeof window != undefined && !localStorage.getItem('accessToken') && this.phoneForm.invalid) {
  //     Object.keys(this.phoneForm.controls).forEach((key) => {
  //       this.phoneForm.controls[key].touched = true;
  //       this.phoneForm.controls[key].markAsDirty();
  //     });
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: 'Please add Phone number'
  //     });
  //     this.errorCount++;
  //     return;
  //   }
  //   if (typeof window != undefined && !localStorage.getItem('accessToken')) {
  //     let data: any = {
  //       email: this.userForm.value.email.toLowerCase(),
  //       mobile: this.phoneForm.value?.phone?.e164Number.replace(this.phoneForm.value?.phone?.e164Number?.dialCode, '') || ''
  //     }
  //     this._httpClient.post(this.constants.appUrl + 'user/login/exist', data, this._globalFunctions.getHeader()).subscribe((result: any) => {
  //       this.is_user_exist = result?.Data?.is_exist;
  //       if (result?.Data?.is_exist) {
  //         Swal.fire({
  //           icon: "error",
  //           title: "Oops...",
  //           text: result?.Message
  //         });
  //         setTimeout(() => {
  //           this.isOpenLoginForm = true;
  //         }, 1000);
  //         this.errorCount++;
  //         return;
  //       };
  //     });
  //   };
  //   if (typeof window != undefined && !localStorage.getItem('accessToken') && !this.is_user_exist && !this.userAddressObj) {
  //     // this._toastr.clear();
  //     // this._toastr.error('Please select address','Error');
  //     // Swal.fire({
  //     //   icon: "error",
  //     //   title: "Oops...",
  //     //   text: 'Please add address details'
  //     // });
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: 'Please add address details'
  //     });
  //     this.errorCount++;
  //     return;
  //   };
  // }

  checkUserDetails(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!localStorage.getItem('accessToken')) {
        if (this.userForm.invalid) {
          Swal.fire({ icon: "error", title: "Oops...", text: "Please add user details" });
          return resolve(false);
        }
        if (this.phoneForm.invalid) {
          Swal.fire({ icon: "error", title: "Oops...", text: "Please add phone number" });
          return resolve(false);
        }
        const data = {
          email: this.userForm.value.email.toLowerCase(),
          mobile: this.phoneForm.value?.phone?.e164Number?.replace(this.phoneForm.value?.phone?.dialCode, '') || ''
        };
        this._httpClient.post(this.constants.appUrl + 'user/login/exist', data, this._globalFunctions.getHeader())
          .subscribe((res: any) => {
            if (res?.Data?.is_exist) {
              Swal.fire({ icon: "error", title: "Oops...", text: res?.Message });
              this.isOpenLoginForm = true;
              return resolve(false);
            }
            // if (!this.userAddressObj) {
            //   Swal.fire({ icon: "error", title: "Oops...", text: "Please add address details" });
            //   return resolve(false);
            // }
            resolve(true);
          }, () => resolve(false));
      } else {
        // if (!this.userAddressObj) {
        //   Swal.fire({ icon: "error", title: "Oops...", text: "Please add address details" });
        //   return resolve(false);
        // }
        resolve(true);
      }
    });
  }

  async placeOrder() {
    await this.checkUserDetails();
    if (this.cartList.length == 0 && this.priceDetailsObj.totalAmount == "0.00") {
      this._router.navigate(['/home']);
      return;
    }
    if (this.errorCount == 0) {
      if (typeof window != undefined && localStorage.getItem('accessToken') && !this.selectedAddressId && !this.userAddressObj) {
        // this._toastr.clear();
        // this._toastr.error('Please select address','Error');
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Please select address'
        });
        return;
      };
      if (!this.paymentType) {
        // this._toastr.clear();
        // this._toastr.error('Please select payment type','Error');
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Please select payment type'
        });
        return;
      };
      this.errorCount = 0;
      if (this.paymentType == 'online') {

        const orderData = {
          amount: Number(this.priceDetailsObj.discountTotalAmount * 100).toFixed(2), // amount in smallest currency unit
          currency: this.priceDetailsObj.currency == 'inr' ? 'INR' : 'USD',
          receipt: 'receipt#1',
        };
        this._subscriptionService.createPaymentOrder(orderData).subscribe((order: any) => {
          this.isPaymentConfirm = true;
          this.preventNavigation();
          const orderId = order?.Data?.id;
          let options: any = {
            key: this.constants.razorpayKeyId,
            amount: Number(this.priceDetailsObj.discountTotalAmount * 100).toFixed(2),
            currency: 'INR',
            name: "Magics Hair Care",
            description: "dummy data",
            method: "",
            // image: this.constants?.logo,
            image: `https://magicshaircare.com/assets/images/Logo2.webp`,
            order_id: orderId, // Pass the generated order_id
            modal: {
              "escape": false
            },
            theme: {
              "color": "#3E6227"
            }
          };
          options.handler = ((response: any) => {
            if (response.error) {
              // this._toastr.error(response.error.description, 'Oops!');
              this.isPaymentConfirm = false;
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: response.error.descriptions
              });
            } else {
              options['payment_response_id'] = response.razorpay_payment_id;
              // this.getPaymentDetails(response.razorpay_payment_id);
              const paymentType = response.method;
              let orderObj: any;
              if (typeof window != undefined && localStorage.getItem('accessToken')) {
                let tempCartList: any = [];
                this.cartList.map((item: any) => {
                  tempCartList.push({
                    _id: item?._id, // pass variant Id here
                    quantity: item?.quantity,
                    code: item?.isApplyCoupon ? item?.productCoupon?.coupon_code : '',
                    coupondiscount: item?.isApplyCoupon ? item?.productCoupon?.discount : 0
                  });
                });
                orderObj = {
                  code: this.couponeDiscountData?.coupon_code || '',
                  payment_type: this.paymentType,
                  paymentid: response.razorpay_payment_id,
                  razorpay_orderid: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  addressid: this.selectedAddressId,
                  variants: tempCartList,
                  order_from: "Web"
                };
                this.buyNow(orderObj);
              } else {
                let tempCartList: any = [];
                this.cartList.map((item: any) => {
                  tempCartList.push({
                    _id: item?._id, // pass variant Id here
                    quantity: item?.quantity,
                    code: item?.isApplyCoupon ? item?.productCoupon?.coupon_code : '',
                    coupondiscount: item?.isApplyCoupon ? item?.productCoupon?.discount : 0
                  });
                });
                orderObj = {
                  code: this.couponeDiscountData?.coupon_code || '',
                  payment_type: this.paymentType,
                  paymentid: response.razorpay_payment_id,
                  addressdetails: this.userAddressObj,
                  userdetails: {
                    fullname: this.userForm.value.fullname,
                    email: this.userForm.value.email.toLowerCase(),
                    gender: this.userForm.value.gender,
                    // pin: this.userForm.value.pin,
                  },
                  variants: tempCartList,
                  order_from: "Web"
                };
                orderObj.userdetails.country_wise_contact = this.phoneForm.value?.phone || "";
                const contactNumber = orderObj?.userdetails?.country_wise_contact?.e164Number;
                orderObj.userdetails.country_code = orderObj?.userdetails?.country_wise_contact?.dialCode || "";
                orderObj.userdetails.mobile = contactNumber.replace(orderObj?.userdetails?.country_code, '') || '';

                // orderObj.userdetails.alternate_country_wise_contact = this.phoneForm.value?.phone || "";
                // const altercontactNumber = orderObj?.userdetails?.alternate_country_wise_contact?.e164Number;
                // orderObj.userdetails.alternate_country_code = orderObj?.userdetails?.alternate_country_wise_contact?.dialCode || "";
                // orderObj.userdetails.alternate_phone = altercontactNumber.replace(orderObj?.userdetails?.alternate_country_code, '') || '';

                this._httpClient.post(this.constants.appUrl + 'user/order/create', orderObj, this._globalFunctions.getHeader()).subscribe((result: any) => {
                  if (result && result.IsSuccess) {
                    this.placedOrderData = result?.Data;
                    const expiryDate = new Date();
                    expiryDate.setDate(expiryDate.getDate() + 7);
                    this._cookieService.set('cartList', JSON.stringify([]), expiryDate, '/');
                    this._globalService.cartListData$.next(null);
                    this._globalService.totalCartListCount$.next(0);
                    let tempObj: any = { type: 'order', data: result?.Data };
                    localStorage.setItem('OD', JSON.stringify(tempObj));
                    this._router.navigate(['/orderdetail'])
                    Swal.fire({
                      position: "center",
                      icon: "success",
                      title: 'Order place Successfully',
                      showConfirmButton: false,
                      timer: 2000,
                      width: '400px'
                    });
                    this._router.navigate(['/orderdetail'])
                  } else {
                    this._globalFunctions.successErrorHandling(result, this, true);
                  }
                }, (error: any) => {
                  this._globalFunctions.errorHanding(error, this, true);
                });
              }
            }
          });
          options.modal.ondismiss = ((response: any) => {
            this.isPaymentConfirm = false;
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: 'Payment cancelled by the user.'
            });
          });
          let rzp = new this._globalService.nativeWindow.Razorpay(options);
          rzp.open();
          this.isPaymentConfirm = false;
        }, (error: any) => {
          this.isPaymentConfirm = false;
          this._globalFunctions.errorHanding(error, this, true);
        });
      } else if (this.paymentType == 'cod') {
        this.isPlacingOrder = true;
        let ordersObj: any;
        if (typeof window != undefined && localStorage.getItem('accessToken')) { //
          let tempCartList: any = [];
          this.cartList.map((item: any) => {
            tempCartList.push({
              _id: item?._id, // pass variant Id here
              quantity: item?.quantity,
              code: item?.isApplyCoupon ? item?.productCoupon?.coupon_code : '',
              coupondiscount: item?.isApplyCoupon ? item?.productCoupon?.discount : 0
            });
          });
          ordersObj = {
            code: this.couponeDiscountData?.coupon_code || '',
            payment_type: this.paymentType,
            addressid: this.selectedAddressId,
            variants: tempCartList,
            order_from: "Web"
          };
          // this.buyNow(ordersObj);
        } else {
          let tempCartList: any = [];
          this.cartList.map((item: any) => {
            tempCartList.push({
              _id: item?._id, // pass variant Id here
              quantity: item?.quantity,
              code: item?.isApplyCoupon ? item?.productCoupon?.coupon_code : '',
              coupondiscount: item?.isApplyCoupon ? item?.productCoupon?.discount : 0
            });
          });
          ordersObj = {
            code: this.couponeDiscountData?.coupon_code || '',
            payment_type: this.paymentType,
            addressdetails: this.userAddressObj,
            userdetails: {
              fullname: this.userForm?.value?.fullname,
              email: this.userForm?.value?.email.toLowerCase(),
              gender: this.userForm?.value?.gender,
              // pin: this.userForm?.value?.pin,
            },
            variants: tempCartList,
            order_from: "Web"
          };
          ordersObj.userdetails.country_wise_contact = this.phoneForm.value?.phone || "";
          const contactNumber = ordersObj?.userdetails?.country_wise_contact?.e164Number;
          ordersObj.userdetails.country_code = ordersObj?.userdetails?.country_wise_contact?.dialCode || "";
          ordersObj.userdetails.mobile = contactNumber?.replace(ordersObj?.userdetails?.country_code, '') || '';
          this._httpClient.post(this.constants.appUrl + 'user/order/create', ordersObj, this._globalFunctions.getHeader()).subscribe((result: any) => {
            if (result && result.IsSuccess) {
              this.placedOrderData = result?.Data;
              const expiryDate = new Date();
              expiryDate.setDate(expiryDate.getDate() + 7);
              this._cookieService.set('cartList', JSON.stringify([]), expiryDate, '/');
              this._globalService.cartListData$.next(null);
              this._globalService.totalCartListCount$.next(0);
              let tempObj: any = { type: 'order', data: result?.Data };
              localStorage.setItem('OD', JSON.stringify(tempObj));
              this._router.navigate(['/orderdetail']);
              this.isPlacingOrder = false;
              Swal.fire({
                position: "center",
                icon: "success",
                title: 'Order place Successfully',
                showConfirmButton: false,
                timer: 2000,
                width: '400px'
              });
              this._router.navigate(['/orderdetail'])
            } else {
              this.isPlacingOrder = false;
              this._globalFunctions.successErrorHandling(result, this, true);
            }
          }, (error: any) => {
            this.isPlacingOrder = false;
            this._globalFunctions.errorHanding(error, this, true);
          });
        }
        // let orderObj:any = {
        //   code:this.couponeDiscountData?.coupon_code || '',
        //   payment_type:this.paymentType,
        //   addressid:this.selectedAddressId,
        //   variants:this.cartList
        // }
        this.buyNow(ordersObj);
      }
    } else {
      this.errorCount = 0;
      this.isPlacingOrder = false;
    }
  };

  buyNow(orderObj: any) {
    if (typeof window != undefined && localStorage.getItem('accessToken')) {
      this._checkOutService.createOrder(orderObj).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.placedOrderData = result?.Data;
          this._globalService.cartListData$.next(null);
          this._globalService.totalCartListCount$.next(0);
          let tempObj: any = { type: 'order', data: result?.Data };
          localStorage.setItem('OD', JSON.stringify(tempObj));
          this._router.navigate(['/orderdetail'])
          Swal.fire({
            position: "center",
            icon: "success",
            title: 'Order place Successfully',
            showConfirmButton: false,
            timer: 2000,
            width: '400px'
          });
          this.isPaymentConfirm = false;
          this.isPlacingOrder = false;
          this._router.navigate(['/orderdetail'])
        } else {
          this.isPaymentConfirm = false;
          this.isPlacingOrder = false;
          this._globalFunctions.successErrorHandling(result, this, true);
        }
      }, (error: any) => {
        this.isPaymentConfirm = false;
        this.isPlacingOrder = false;
        this._globalFunctions.errorHanding(error, this, true);
      });
    }
  };

  preventNavigation() {
    if (!this.isPaymentConfirm) return;

    // Prevent Back/Forward Navigation
    history.pushState(null, '', location.href);
    this.popstateListener = this.renderer.listen(window, 'popstate', () => {
      history.pushState(null, '', location.href);
      alert('Back navigation is disabled during payment.');
    });

    // Prevent Page Refresh or Tab Close
    this.beforeUnloadListener = this.renderer.listen(window, 'beforeunload', (event) => {
      event.preventDefault();
      event.returnValue = 'Are you sure you want to leave? Your payment may not be processed.';
    });

    // Prevent Refresh (F5, Ctrl+R)
    this.keydownListener = this.renderer.listen(document, 'keydown', (event) => {
      if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
        event.preventDefault();
        alert('Page refresh is disabled during payment.');
      }
    });
  }

  // Cleanup listeners when component is destroyed
  ngOnDestroy() {
    if (this.popstateListener) this.popstateListener();
    if (this.beforeUnloadListener) this.beforeUnloadListener();
    if (this.keydownListener) this.keydownListener();
  }

  getVisibleStepIndex(step: number): boolean {
    return this.activeIndex === step;
  }

  onStepClicked(index: number): void {
    const actualStep = this.isWithOutLogIn ? index : index + 1;
    if (actualStep === 0) {
      this.activeIndex = 0;
    } else if (actualStep === 1 && this.step1Completed) {
      this.activeIndex = this.isWithOutLogIn ? 1 : 0;
    } else if (actualStep === 2 && this.step2Completed) {
      this.activeIndex = this.isWithOutLogIn ? 2 : 1;
    }
  }

  // onNext() {
  //   const orderObj: any = {
  //     userdetails: {
  //       fullname: this.userForm?.value?.fullname,
  //       email: this.userForm?.value?.email.toLowerCase(),
  //       gender: this.userForm?.value?.gender,
  //       pin: this.userForm?.value?.pin,
  //     },
  //     order_from: "Web"
  //   };
  //   orderObj.userdetails.country_wise_contact = this.phoneForm.value?.phone || "";
  //   const contactNumber = orderObj?.userdetails?.country_wise_contact?.e164Number;
  //   orderObj.userdetails.country_code = orderObj?.userdetails?.country_wise_contact?.dialCode || "";
  //   orderObj.userdetails.mobile = contactNumber?.replace(orderObj?.userdetails?.country_code, '') || '';

  //   this.step1Completed = true;
  //   if (this.userForm.invalid) {
  //     Object.keys(this.userForm.controls).forEach((key) => {
  //       this.userForm.controls[key].touched = true;
  //       this.userForm.controls[key].markAsDirty();
  //     });
  //     return;
  //   }
  //   if (this.phoneForm.invalid) {
  //     Object.keys(this.phoneForm.controls).forEach((key) => {
  //       this.phoneForm.controls[key].touched = true;
  //       this.phoneForm.controls[key].markAsDirty();
  //     })
  //     return;
  //   }
  //   this.checkUserDetails();
  //   if (this.activeIndex < this.steps.length - 1) {
  //     this.activeIndex++;
  //     localStorage.setItem('userDetails', JSON.stringify(orderObj.userdetails));
  //   }
  // }

  async onNext() {
    this.step1Completed = true;
    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach((key) => {
        this.userForm.controls[key].touched = true;
        this.userForm.controls[key].markAsDirty();
      });
      return;
    }
    if (this.phoneForm.invalid) {
      Object.keys(this.phoneForm.controls).forEach((key) => {
        this.phoneForm.controls[key].touched = true;
        this.phoneForm.controls[key].markAsDirty();
      })
      return;
    }
    // const orderObj: any = {
    //   userdetails: {
    //     profile: "",
    //     fullname: this.userForm?.value?.fullname,
    //     email: this.userForm?.value?.email.toLowerCase(),
    //     gender: this.userForm?.value?.gender,
    //     currency: ""
    //     // pin: this.userForm?.value?.pin,
    //   },
    //   order_from: "Web"
    // };
    // orderObj.userdetails.country_wise_contact = this.phoneForm.value?.phone || "";
    // const contactNumber = orderObj?.userdetails?.country_wise_contact?.e164Number;
    // orderObj.userdetails.country_code = orderObj?.userdetails?.country_wise_contact?.dialCode || "";
    // orderObj.userdetails.mobile = contactNumber?.replace(orderObj?.userdetails?.country_code, '') || '';
    const signupDataObj: any = {
      profile: "",
      fullname: this.userForm.value.fullname,
      email: this.userForm.value.email.toLowerCase(),
      currency: "INR",
      gender: this.userForm.value.gender,
      user_from: "Web"
    };
    signupDataObj.country_wise_contact = this.phoneForm.value?.phone || "";
    const contactNumber = signupDataObj?.country_wise_contact?.e164Number;
    signupDataObj.country_code = signupDataObj?.country_wise_contact?.dialCode || "";
    signupDataObj.mobile = contactNumber.replace(signupDataObj?.country_code, '') || '';
    
    const isValid = await this.checkUserDetails();
    if (!isValid) return;
    this._authService.register(signupDataObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        let coupon_code: any = result?.Data?.coupon_code;
        Swal.fire({
          position: "center",
          icon: "success",
          title: result.Message,
          showConfirmButton: false,
          timer: 2000,
          width: '400px'
        });
        let rawNumber = this.phoneForm.value.phone.number;
        let cleanedNumber = rawNumber.replace(/\D/g, '').slice(-10);
        localStorage.setItem('registerEmail', cleanedNumber);
        if (this.isUnknowUser) {
          this.unKnowUserRegister.emit(result);
        }
        this.isOpenOtpVeryFicationForm = true;
      } else {
        this.userForm.resetForm();  
        this.phoneForm.reset();
        this.isOpenOtpVeryFicationForm = false;
        this._globalFunctions.successErrorHandling(result?.Message, this, true);
        // this.isBtnLoading = false;
      }
    }, (error: any) => {
      this.userForm.resetForm();
      this.phoneForm.reset();
      this.isOpenOtpVeryFicationForm = false;
      this._globalFunctions.errorHanding(error, this, true);
      // this.isBtnLoading = false;
    });

    localStorage.setItem('userDetails', JSON.stringify(signupDataObj));
    if (this.activeIndex < this.steps.length - 1) {
      this.activeIndex++;
    }
  }

  onNextSecondStep() {
    this.step2Completed = true;
    if (!this.selectedAddressId && this.addressDetails.length > 0 && !this.isAddEditAddress) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Please select an address to continue.'
      });
      return;
    }
    if (this.addressDetails.length === 0 && !this.userAddressObj && !this.isAddEditAddress) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Please add address details and click on save button.'
      });
      return;
    }
    if (!this.selectedAddressId && !this.userAddressObj && !this.isAddEditAddress) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Please select an existing address or add a new address to continue.'
      });
      return;
    }
    if (this.isAddEditAddress) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Please complete adding/editing your address before proceeding.'
      });
      return;
    }
    if (this.activeIndex < this.steps.length - 1) {
      this.activeIndex++;
    }
  }

  back() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  unKnowUserVeryFiedOtp(event: any) {
    if (event) {
      this.isOpenOtpVeryFicationForm = false;  
      // this.isLogin = true;
      this.isWithOutLogIn = false;
      this.steps = [
        { label: 'Address Details' },
        { label: 'Summary & Payment' },
      ];
      this._addressService.addressList({ page: 1, limit: 10 }).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this._globalService.addressListData$.next(result);
          
          if (result?.Data?.docs && result.Data.docs.length > 0) {
            let selectedAddress = result.Data.docs.find((item: any) => item.select);
            
            if (!selectedAddress && result.Data.docs.length > 0) {
              selectedAddress = result.Data.docs[0];
              this.selectedAddressId = selectedAddress._id;
              
              this.addressDetails = result.Data.docs.map((item: any) => ({
                ...item,
                select: item._id === this.selectedAddressId
              }));
              
              this._addressService.selectAddress({ addressid: this.selectedAddressId }).subscribe((selectResult: any) => {
                if (selectResult && selectResult.IsSuccess) {
                  this._globalService.addressListDataPagination$.next(null);
                }
              });
            } else if (selectedAddress) {
              this.selectedAddressId = selectedAddress._id;
              this.addressDetails = result.Data.docs.map((item: any) => ({
                ...item,
                select: item._id === this.selectedAddressId
              }));
            }
          }
        }
      });
      this.activeIndex = 0;
      this.step1Completed = true;
      if (typeof window != 'undefined' && localStorage.getItem('accessToken') && this._cookieService.get('cartList')) {
        let tempCartList = JSON.parse(this._cookieService.get('cartList')!);
        if (tempCartList && tempCartList.length > 0) {
          let payload = {
            cartproducts: tempCartList,
          };
          this._cartService.addMultiProductToCart(payload).subscribe((result: any) => {
            if (result && result.IsSuccess) {
              this.getUserCartList();
            } else {
              this._globalFunctions.successErrorHandling(result?.message, this, true);
            };
          }, (error: any) => {
            this._globalFunctions.errorHanding(error, this, true);
          });
        }
      }
    }
  }
}
