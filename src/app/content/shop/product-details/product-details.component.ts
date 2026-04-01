import { AfterViewInit, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CouponListComponent } from '../../coupon-list/coupon-list.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { ShopService } from '../shop.service';
import { CONSTANTS } from '../../../common/constants';
import { RatingModule } from 'primeng/rating';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomRatingComponent } from '../../../common/custom-rating/custom-rating.component';
import { GlobalFunctions } from '../../../common/global-function';
import { ImageModule } from 'primeng/image';
import { RettingsReviewComponent } from '../rettings-review/rettings-review.component';
import { AddEditReview } from '../../view-all-ratting-review/add-edit-review/add-edit-review.component';
import { GlobalService } from '../../../services/global.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../cart-list/cart.service';
import { LoginComponent } from '../../../auth/login/login.component';
import { WishListService } from '../../wish-list/wish-list.service';
import Swal from 'sweetalert2';
import { RegisterComponent } from '../../../auth/register/register.component';
import { OtpVeryficationComponent } from '../../../auth/otp-veryfication/otp-veryfication.component';
import { CreateResetPinComponent } from '../../../auth/create-reset-pin/create-reset-pin.component';
import { ForgetPinComponent } from '../../../auth/forget-pin/forget-pin.component';
import { RegisterPopupComponent } from '../../../auth/register-popup/register-popup.component';
import { ContentService } from '../../content.service';
import { TranslateModule } from '@ngx-translate/core';
import { ForgotPinOtpVerifyComponent } from '../../../auth/forgot-pin-otp-verify/forgot-pin-otp-verify.component';
import { ForgotResetPinComponent } from '../../../auth/forgot-reset-pin/forgot-reset-pin.component';
declare var $:any;

declare var Swiper: any;
@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    CouponListComponent,
    RettingsReviewComponent,
    RouterModule,
    RatingModule,
    FormsModule,
    ReactiveFormsModule,
    CustomRatingComponent,
    ImageModule,
    AddEditReview,
    LoginComponent,
    RegisterComponent,
    OtpVeryficationComponent,
    CreateResetPinComponent,
    ForgetPinComponent,
    RegisterPopupComponent,TranslateModule,
    ForgotPinOtpVerifyComponent,
    ForgotResetPinComponent
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit,AfterViewInit,OnDestroy {
  @HostBinding('class.sidebar') sidebarClass = true;

  bgStyle = 'rgba(0, 0, 0, 0.5)'; // light black blur background
  cookieData: any;
  isRattingReview: boolean = false;
  isOpenCouponList: boolean = false;
  couponListData: any = [];
  productDetails: any = [];
  relatedProductData: any = [];
  couponList: any = [];
  reviewList: any = [];
  cartlistArray: any = [];
  wishlistArray: any = [];
  reviewListData: any = [];
  constants: any = CONSTANTS
  hoverImagePath: any;
  productId: any;
  isLoading: boolean = false;
  variant: any = { quantity: 10 };
  isAddEditReview: boolean = false;
  ratingArray: any = [];
  isBetweenRating: boolean = false;
  cookieCommonData: any;
  isLogin: boolean = false;
  isProductBuy: boolean = false;
  productDescription: any;
  adsMediaObj: any;
  relatedProductLoading: boolean = false;

  isOpenLoginForm: boolean = false;
  isOpenRegisterForm: boolean = false;
  isOpenOtpVeryFicationForm: boolean = false;
  isOpenCreatePinForm: boolean = false;
  isOpenForgetPinForm: boolean = false;
  isChangeMail:boolean = false;
  isOpenForgotPinOtpVerifyForm: boolean = false;
  isOpenResetPinForm: boolean = false;
  displayDay: any = "";
  displayHour: any = "";
  displayMinutes: any = "";
  displaySeconds: any = "";
  adsPagelistArray: any = [];
  isFromQuery:boolean = false
  productSlug: any;
  productTag:any;
  hoverIndex: any;
  hoverVideo: any;
  videoElement!: HTMLVideoElement;
  mobileViewProductSwiper:any;

  constructor(
    private _shopService: ShopService,
    private _globalFunctions: GlobalFunctions,
    private _globalService: GlobalService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _toastr: ToastrService,
    private _cookieService: CookieService,
    private _cartService: CartService,
    private _wishListService: WishListService,
    private _contentService:ContentService
  ) {
    $('.page-loader').fadeIn('fast');
    setTimeout(() => {
      $('.page-loader').fadeOut('slow');
    }, 1500);
    this.cookieCommonData = {
      domain: "",
      path: '/',
      secure: true,
      expiry: new Date()
    }
    this.cookieCommonData.expiry.setDate(this.cookieCommonData.expiry.getDate() + 365);
  }

  ngAfterViewInit(): void {
    $("main").addClass("pr_dtl");
    
  }

  ngOnDestroy(): void {
    $("main").removeClass("pr_dtl");
  }

  ngOnInit(): void {
    window.addEventListener("popstate", function (event) {
      window.location.href = window.location.origin + "/shop"  
  });
    this.timer();
   setTimeout(() => {
    $(document).ready(function() {
       window.scrollTo(0, 0);
    });
   }, 1200);
   
   this.productTag = this._activatedRoute.snapshot.paramMap.get('producttag');
  //  this.setCanonicalUrl(this.productTag);
    // this.productId = this._activatedRoute.snapshot.paramMap.get('productid');
    this._activatedRoute.queryParams.subscribe(params => {
      this.productId = params['PDID'] || window.atob(localStorage.getItem('PDID')!);
      this.productSlug = params['SLUG'] || window.atob(localStorage.getItem('PDSLUG')!);
      if (this.productId || this.productSlug) {
        localStorage.setItem("PDID",window.btoa(this.productId));
        localStorage.setItem("PDSLUG",window.btoa(this.productSlug));
        this.isFromQuery = true;
      }
    });
    if(typeof window != 'undefined' && localStorage.getItem('PDID') != null || typeof window != 'undefined' && localStorage.getItem('PDSLUG') != null){ 
      this.productId = window.atob(localStorage.getItem('PDID')!);
      this.productSlug = window.atob(localStorage.getItem('PDSLUG')!);
    }
    if (this.isFromQuery) {
      this._activatedRoute.queryParams.subscribe(params => {
        this.productId = params['PDID'] || window.atob(localStorage.getItem('PDID')!);
        this.productSlug = params['SLUG'] || window.atob(localStorage.getItem('PDSLUG')!);
        localStorage.setItem("PDID",window.btoa(this.productId));
        localStorage.setItem("PDSLUG",window.btoa(this.productSlug));
      });
    }
    if (this._activatedRoute.snapshot.paramMap.get('producttag')) {
      this.productId = "";
      this.productSlug = this.productTag;
    }
    else {
      this._router.navigate(['/shop']);
    }
    // this._globalService.adsPageList$.subscribe((result: any) => {
    //   result.map((item: any) => {
    //     if (item.title == this._activatedRoute.snapshot.data['title']) {
    //       this.adsMediaObj = item;
    //     };
    //   });
    // });

    //For Ad
    this._contentService.getAd().subscribe((result:any)=>{
      if(result && result.IsSuccess){
        result.Data.map((item:any)=>{
          item?.advertisingpage.map((subItem:any)=>{
            this.adsPagelistArray.push({
              mediatype:item?.mediatype,
              media:item?.media,
              title:subItem?.pageid?.title
            });
          });
        });
        this.adsPagelistArray.map((item:any)=>{
              if(item.title == this._activatedRoute.snapshot.data['title']){
                this.adsMediaObj = item;
              };
            });
       // this._globalService.adsPageList$.next(this.adsPagelistArray);
      } else {
        this._globalFunctions.successErrorHandling(result.Message,this,true);
      }
    },(error:any)=>{
      this._globalFunctions.errorHanding(error,this,true);
    });

    this.getAllCoupon();
    if (typeof window != undefined && localStorage.getItem('accessToken')) {
      this.isLogin = true
    } else {
      this.isLogin = false
    }
    this.getProductDetails(this.isLogin);
   // this.getAllRelatedProduct(this.isLogin);
    if (new Swiper()) {
      var ingredientsDetailsSwiper = new Swiper(".ingredients", {
        loop: true,
        slidesPerView: 1,
        autoplay: true,
        pagination: {
          el: '.swiper-pagination'
        },
        breakpoints: {
          425: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          675: {
            slidesPerView: 2,
            spaceBetween: 0,
          }
        }
      })

      var howToUseDetailsSwiper = new Swiper(".howToUse", {
        loop: true,
        slidesPerView: 1,
        autoplay: true,
        pagination: {
          el: '.swiper-pagination'
        },
        breakpoints: {
          425: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          675: {
            slidesPerView: 2,
            spaceBetween: 0,
          }
        }
      })

      var relatedProductSwiper = new Swiper(".related-product", {
        loop: true,
        slidesPerView: 1,
        // autoplay: true,
        pagination: {
          el: '.swiper-pagination'
        },
        breakpoints: {
          425: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          675: {
            slidesPerView: 2,
            spaceBetween: 0,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 0,
          }
        }
      })

      var dummyRelatedProductSwiper = new Swiper(".dummy-related-product", {
        loop: true,
        slidesPerView: 1,
        // autoplay: true,
        pagination: {
          el: '.swiper-pagination'
        },
        breakpoints: {
          425: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          675: {
            slidesPerView: 2,
            spaceBetween: 0,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 0,
          }
        }
      })

    }
     this.mobileViewProductSwiper = new Swiper(".product-other-img", {
      loop: true,
      slidesPerView: 1,
      // autoplay: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: {
        425: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        675: {
          slidesPerView: 2,
          spaceBetween: 0,
        }
      },
      on: {
        slideChange: () => this.onSlideChange(),
      },
    });
    
  }

  onSlideChange(): void {
      const activeSlide = this.mobileViewProductSwiper?.slides[this.mobileViewProductSwiper.activeIndex];
      if (activeSlide) {
        const video = activeSlide.querySelector('video') as HTMLVideoElement;
  
        if (video) {
          if ( this.mobileViewProductSwiper.activeIndex == 1) {
            video.play().catch((error) => {
              if (error.name === 'NotAllowedError') {
                console.warn('Autoplay policy restriction: video cannot play without user interaction.');
              } else {
                console.warn('Video play failed:', error);
              }
            });
          } else {
            this.videoElement = document.getElementById('toggle-video_2') as HTMLVideoElement;
            this.videoElement.pause();
          }
            
         
        } else {
          this.videoElement = document.getElementById('toggle-video_1') as HTMLVideoElement;
          if (this.videoElement.played){
            this.videoElement.pause();
          }
        }
      } else {
        console.warn('Active slide not found.');
      }
  }


  // timer(minute:any){
  //   let seconds : number = minute * 60;
  //   let textSec : any = '0';
  //   let statSec : number = 60;

  //   const prefix = minute < 10 ? "0": "";

  //   const timer = setInterval(()=>{
  //     seconds --;
  //     if (statSec != 0) statSec--;
  //     else statSec = 59;

  //     if(statSec < 10){
  //       textSec = "0" + statSec;
  //     } else textSec = statSec;

  //     this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

  //     if(seconds == 0) {
  //       this.timer(720);
  //     }
  //   },1000)
  // }

//   timer(minutes:any) {
//     let totalSeconds = minutes * 60;
    
//     const updateDisplay = () => {
//         // Calculate days, hours, minutes, and seconds
//         const days = Math.floor(totalSeconds / 86400); // 86400 seconds in a day
//         const hours = Math.floor((totalSeconds % 86400) / 3600);
//         const minutes = Math.floor((totalSeconds % 3600) / 60);
//         const seconds = totalSeconds % 60;

//         // Format numbers as two digits
//         const formatNumber = (num:any) => num.toString().padStart(2, '0');

//         // Update display
//         this.displayDay = `${days}`;
//         this.displayHour = `${formatNumber(hours)}`;
//         this.displayMinutes = `${formatNumber(minutes)}`;
//         this.displaySeconds = `${formatNumber(seconds)}`;
//     };

//     updateDisplay(); // Initial display update

//     const timer = setInterval(() => {
//         if (totalSeconds <= 0) {
//             clearInterval(timer);
//             this.displayDay = '0';
//             this.displayHour = '00';
//             this.displayMinutes = '00';
//             this.displaySeconds = '00';
//         } else {
//             totalSeconds--;
//             updateDisplay();
//         }
//     }, 1000);

// }

timer() {
  const millisecondsInDay = 24 * 60 * 60 * 1000; // Total milliseconds in a day

  const updateDisplay = (totalSeconds:any) => {
      // Calculate days, hours, minutes, and seconds
      const days = Math.floor(totalSeconds / 86400); // 86400 seconds in a day
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      // Format numbers as two digits
      const formatNumber = (num:any) => num.toString().padStart(2, '0');

      // Update display
      this.displayDay = `${days}`;
      this.displayHour = `${formatNumber(hours)}`;
      this.displayMinutes = `${formatNumber(minutes)}`;
      this.displaySeconds = `${formatNumber(seconds)}`;
  };

  // Calculate the end of the current day
  const now:any = new Date();
  const endOfDay:any = new Date();
  endOfDay.setHours(23, 59, 59, 999); // Set to end of the day (23:59:59.999)
  let totalSeconds = Math.floor((endOfDay - now) / 1000);

  // Initial display update
  updateDisplay(totalSeconds);

  const timer = setInterval(() => {
      totalSeconds--;
      if (totalSeconds <= 0) {
          clearInterval(timer);
          this.displayDay = '0';
          this.displayHour = '00';
          this.displayMinutes = '00';
          this.displaySeconds = '00';
      } else {
          updateDisplay(totalSeconds);
      }
  }, 1000);
}

  openCouponList() {
    this.isOpenCouponList = true;
  }

  closeCouponList() {
    this.isOpenCouponList = false;
  }

 ingredientsDetails:any = [];
 howToUseDetails:any = [];
  getProductDetails(isLogin: any) {
    this.isLoading = true;
    this.isRattingReview = true;
    const productObj = {
      variantid: this.productId,
      from: "web",
      slug: this.productSlug,
      language: localStorage.getItem("lang") || "english"
    }
    this._shopService.getProductDetailsOne(productObj, isLogin).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        $(document).ready(function() {
          // $(window).scrollTop(0);
           window.scrollTo(0, 0);
        });
        this.productId=result?.Data?._id;
        this.getAllRelatedProduct(this.isLogin);
        this.isRattingReview = false;
        result.Data.productId.otherpath.unshift({ path: result?.Data?.productId?.bannerImage, type: 'image' });
        result.Data.newImage = { path: result?.Data?.productId?.bannerImage, type: 'image' }
        result.Data.quantity = 1;
        // this.ratingArray = Array(Math.floor(result?.Data?.averageRating)).fill(0);
        this.ratingArray = [];
        for (let index = 0; index < Math.floor(result?.Data?.averageRating); index++) {
          this.ratingArray.push({isBetween:false,ratting:true});
        };
        let tempRatingArrayLength = this.ratingArray.length;
        for (let index = 0; index < 5; index++) {
          if(tempRatingArrayLength <= 4){
            this.ratingArray[tempRatingArrayLength] = {isBetween:false,ratting:false}
            tempRatingArrayLength++;
          };
        };
        if (
          Math.floor(result?.Data?.averageRating) < result?.Data?.averageRating &&
          Math.ceil(result?.Data?.averageRating) > result?.Data?.averageRating
        ) {
          this.ratingArray[Math.floor(result?.Data?.averageRating)].isBetween = true;
        } else {
          this.isBetweenRating = false;
        };     
        if (typeof window != 'undefined' && !localStorage.getItem('accessToken')) {
          if (this._cookieService.get('cartList')) {
            this.cartlistArray = JSON.parse(this._cookieService.get('cartList')!);
            this.cartlistArray.map((cartProduct: any) => {
              if (result?.Data?._id == cartProduct?._id) {
                result.Data.in_cart = true;
              };
            });
          }
        }
        [result?.Data?.productId].map((i:any) => {
          this.ingredientsDetails = i.ingredients;
          this.howToUseDetails = i.howtouse;
        })

          if (localStorage.getItem("lang") == "hindi") {
            result.Data.productId.product_name = result?.Data.productId.hi_product_name; 
            result.Data.productId.description = result.Data.productId.hi_description; 
            result.Data.productId.ingredients.map((ing:any)=>{
              ing.title = ing.hi_title;
              ing.description = ing.hi_description;
            });
            result.Data.productId.howtouse.map((htu:any)=>{
              htu.stepno = htu.hi_stepno;
              htu.description = htu.hi_description;
            });
          }
          else if (localStorage.getItem("lang") == "marathi") {
            result.Data.productId.product_name = result.Data.productId.mr_product_name; 
            result.Data.productId.description = result.Data.productId.mr_description; 
            result.Data.productId.ingredients.map((ing:any)=>{
              ing.title = ing.mr_title;
              ing.description = ing.mr_description;
            });
            result.Data.productId.howtouse.map((htu:any)=>{
              htu.stepno = htu.mr_stepno;
              htu.description = htu.mr_description;
            });
          }
          else if (localStorage.getItem("lang") == "gujarati") {
            result.Data.productId.product_name = result.Data.productId.gu_product_name; 
            result.Data.productId.description = result.Data.productId.gu_description; 
            result.Data.productId.ingredients.map((ing:any)=>{
              ing.title = ing.gu_title;
              ing.description = ing.gu_description;
            });
            result.Data.productId.howtouse.map((htu:any)=>{
              htu.stepno = htu.gu_stepno;
              htu.description = htu.gu_description;
            });
          }else{
            result.Data.productId.product_name = result.Data.productId.en_product_name; 
            result.Data.productId.description = result.Data.productId.en_description; 
            result.Data.productId.ingredients.map((ing:any)=>{
              ing.title = ing.en_title;
              ing.description = ing.en_description;
            });
            result.Data.productId.howtouse.map((htu:any)=>{
              htu.stepno = htu.en_stepno;
              htu.description = htu.en_description;
            });
          }

          this.productDetails = result?.Data;
        if (this.isProductBuy) {
          this.buyNow(this.productDetails);
        }
        this.isLoading = false;
        //SEO Changes Add
        let metaTag:any = this.constants.shopPageMetaTag;
        metaTag.title = result?.Data?.seo_title;
        metaTag.description = result?.Data?.seo_description;
        let shopPageMetaOgTag:any = this.constants.shopPageMetaOgTag;
        shopPageMetaOgTag["og:title"] = result?.Data?.seo_title;
        shopPageMetaOgTag["og:description"] = result?.Data?.seo_description;
        shopPageMetaOgTag["og:url"] = `https://magicshaircare.com/shop/productdetail/` + result?.Data?.search_tag;
        let shopPageMetaTwitterTag:any = this.constants.shopPageMetaTwitterTag;
        shopPageMetaTwitterTag["twitter:title"] = result?.Data?.seo_title;
        shopPageMetaTwitterTag["twitter:description"] = result?.Data?.seo_description;
        shopPageMetaTwitterTag["twitter:site"] = `https://magicshaircare.com/shop/productdetail/` + result?.Data?.search_tag;
        let shopBreadcrum:any = this.constants.shopBreadcrum;
        shopBreadcrum.itemListElement[1].item = `https://magicshaircare.com/shop/productdetail/` + result?.Data?.search_tag;
        let shopLBSchema:any = this.constants.shopLBSchema;
        shopLBSchema.url = `https://magicshaircare.com/shop/productdetail/` + result?.Data?.search_tag;
        let shopOrgSchema:any = this.constants.shopOrgSchema;
        shopOrgSchema.url = `https://magicshaircare.com/shop/productdetail/` + result?.Data?.search_tag;

        this._globalService.setMetaTags(metaTag);
        this._globalService.setOpenGraphTags(shopPageMetaOgTag);
        this._globalService.setTwitterCardTags(shopPageMetaTwitterTag);
        this._globalService.setJsonLdData(shopBreadcrum,"bc");
        //this._globalService.setJsonLdData(this.constants.shopWebsiteSchema,"websch");
        this._globalService.setJsonLdData(shopLBSchema,"lbSchema");
        this._globalService.setJsonLdData(shopOrgSchema, 'orgSchema');
        this.setCanonicalUrl(result?.Data?.search_tag, result?.Data?.seo_title);

      } else {
        this.isLoading = false;
        this.isRattingReview = false;
        this._globalFunctions.successErrorHandling(result, this, true);
        //this._router.navigate(['/shop']);
        window.location.href = window.location.origin + "/shop";
      }
    }, (error) => {
      this.isLoading = false;
      this.isRattingReview = false;
      localStorage.removeItem("PDID");
      localStorage.removeItem("PDSLUG");
      window.location.href = window.location.origin + "/shop";
     // this._globalFunctions.successErrorHandling(error, this, true);
      this._router.navigate(['/shop']);
    })
  }

  setCanonicalUrl(search_tag:any, title:any) {
    this._globalService.removeCanonicalUrl();
    let urlData = {
      url:`https://magicshaircare.com/shop/productdetail/` + search_tag,
      title: title
    };
    this._globalService.setCanonicalUrl(urlData);
  }

  hoverIamge(image: any) {
    this.productDetails.newImage = image;
  }

  getAllRelatedProduct(isLogin:boolean) {
    this.relatedProductLoading = true;
    const relatedProductObj = {
      variantid: this.productId,
      language: localStorage.getItem("lang") || "english"
    }
    this._shopService.getRelatedProduct(relatedProductObj,isLogin).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        result?.Data.map((item:any) => {
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
        result.Data.map((i:any)=>{
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
        this.relatedProductData = result.Data;
        this.relatedProductLoading = false;
      } else {
        this.relatedProductLoading = false;
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error) => {
      this.relatedProductLoading = false;
      this._globalFunctions.successErrorHandling(error, this, true);
    })
  }

  increaseQuantity(quantity: any) {
    return this.productDetails.quantity++;
  }

  decreaseQuantity(quantity: any) {
    if (this.productDetails.quantity > 1) {
      this.productDetails.quantity--;
    }
  }

  getAllCoupon() {
    const couponObj = {
      from:"web" 
    }
    this._shopService.getCoupon(couponObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.couponList = result.Data;
        result.Data.map((ele: any, index: any) => {
          if (index < 1) {
            this.couponListData.push(ele);
          }
        })
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error) => {
      this._globalFunctions.successErrorHandling(error, this, true);
    })
  }

  buyNow(variant:any) {
    if (typeof window != 'undefined' && localStorage.getItem('accessToken')) {
      this.isProductBuy = false;
      if (this.productDetails.in_cart) {
        //this._router.navigate(['/checkout'])
        window.location.href = window.location.origin + "/checkout"
      } else {
        this._cartService.addCart({ variantid: variant?._id, quantity: variant?.quantity }).subscribe((result: any) => {
          if (result && result.IsSuccess) {
            // this.getProductDetails(this.isLogin);
            // this._globalService.cartListDataPagination$.next(null);console.log('api call');
            this.getUserCartList();
            setTimeout(() => {
              //this._router.navigate(['/checkout'])
              window.location.href = window.location.origin + "/checkout"
            }, 100);
            // this._toastr.clear();
            // this._toastr.success('Product add to cartList','Success');
            // Swal.fire({
            //   position: "center",
            //   icon: "success",
            //   title: 'Product add to cartList',
            //   showConfirmButton: false,
            //   timer: 2000,
            //   width: '400px'
            // });
          } else {
            // this._toastr.clear();
            this._globalFunctions.successErrorHandling(result.Message, this, true);
          }
        }, (error: any) => {
          // this._toastr.clear();
          this._globalFunctions.errorHanding(error, this, true);
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
          // Swal.fire({
          //   position: "center",
          //   icon: "success",
          //   title: 'Product add to cartList',
          //   showConfirmButton: false,
          //   timer: 2000,
          //   width: '400px'
          // });
        } else {
          // this.cartlistArray.splice(this.cartlistArray.findIndex((temp:any) => temp?._id == variant?._id),1);
          this.cartlistArray[this.cartlistArray.findIndex((temp:any) => temp?._id == variant?._id)] = {productId:variant?.productId?._id,_id:variant?._id,quantity:variant?.quantity || 1}
          if(this.cartlistArray.length == 0){
            this._cookieService.delete('cartList');
          };
          this._globalService.totalCartListCount$.next(0);
          // Swal.fire({
          //   position: "center",
          //   icon: "success",
          //   title: 'Product remove to cartList',
          //   showConfirmButton: false,
          //   timer: 2000,
          //   width: '400px'
          // });
        }
      } else {
        this.cartlistArray.push({productId:variant?.productId?._id,_id:variant?._id,quantity:variant?.quantity || 1});
        // Swal.fire({
        //   position: "center",
        //   icon: "success",
        //   title: 'Product add to cartList',
        //   showConfirmButton: false,
        //   timer: 2000,
        //   width: '400px'
        // });
      };
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      this._cookieService.set('cartList',JSON.stringify(this.cartlistArray), expiryDate, '/') //,this.cookieCommonData.path,this.cookieCommonData.domain,this.cookieCommonData.secure,'None';
      this.getCartlistProductWithoutLogin('cartList');
      setTimeout(() => {
        //this._router.navigate(['/checkout']);
        window.location.href = window.location.origin + "/checkout"
      }, 100);
    }
  }

  buyRelatedProduct(event: any, variant: any) {
    event.stopPropagation();
    // if (typeof window != 'undefined' && localStorage.getItem('accessToken')) {
    //   this.isProductBuy = false;
    //   if (variant.in_cart) {
    //     //this._router.navigate(['/checkout'])
    //     window.location.href = window.location.origin + "/checkout"
    //   } else {
    //     this._cartService.addCart({ variantid: variant?._id, quantity: 1 }).subscribe((result: any) => {
    //       if (result && result.IsSuccess) {
    //         // this.getProductDetails(this.isLogin);
    //         // this._globalService.cartListDataPagination$.next(null);console.log('api call');
    //         this.getUserCartList();
    //         setTimeout(() => {
    //           window.location.href = window.location.origin + "/checkout"
    //           //this._router.navigate(['/checkout'])
    //         }, 100);
    //         // this._toastr.clear();
    //         // this._toastr.success('Product add to cartList','Success');
    //         // Swal.fire({
    //         //   position: "center",
    //         //   icon: "success",
    //         //   title: 'Product add to cartList',
    //         //   showConfirmButton: false,
    //         //   timer: 2000,
    //         //   width: '400px'
    //         // });
    //       } else {
    //         // this._toastr.clear();
    //         this._globalFunctions.successErrorHandling(result.Message, this, true);
    //       }
    //     }, (error: any) => {
    //       // this._toastr.clear();
    //       this._globalFunctions.errorHanding(error, this, true);
    //     })
    //   }
    // } else {
    //   this.isOpenLoginForm = true;
    // }
    if (typeof window != 'undefined' && localStorage.getItem('accessToken')) {
      this.isProductBuy = false;
      if (this.productDetails.in_cart) {
        //this._router.navigate(['/checkout'])
        window.location.href = window.location.origin + "/checkout"
      } else {
        this._cartService.addCart({ variantid: variant?._id, quantity: 1 }).subscribe((result: any) => {
          if (result && result.IsSuccess) {
            // this.getProductDetails(this.isLogin);
            // this._globalService.cartListDataPagination$.next(null);console.log('api call');
            this.getUserCartList();
            setTimeout(() => {
              //this._router.navigate(['/checkout'])
              window.location.href = window.location.origin + "/checkout"
            }, 100);
            // this._toastr.clear();
            // this._toastr.success('Product add to cartList','Success');
            // Swal.fire({
            //   position: "center",
            //   icon: "success",
            //   title: 'Product add to cartList',
            //   showConfirmButton: false,
            //   timer: 2000,
            //   width: '400px'
            // });
          } else {
            // this._toastr.clear();
            this._globalFunctions.successErrorHandling(result.Message, this, true);
          }
        }, (error: any) => {
          // this._toastr.clear();
          this._globalFunctions.errorHanding(error, this, true);
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
          // Swal.fire({
          //   position: "center",
          //   icon: "success",
          //   title: 'Product add to cartList',
          //   showConfirmButton: false,
          //   timer: 2000,
          //   width: '400px'
          // });
        } else {
          // this.cartlistArray.splice(this.cartlistArray.findIndex((temp:any) => temp?._id == variant?._id),1);
          this.cartlistArray[this.cartlistArray.findIndex((temp:any) => temp?._id == variant?._id)] = {productId:variant?.productId?._id,_id:variant?._id,quantity:variant?.quantity || 1}
          if(this.cartlistArray.length == 0){
            this._cookieService.delete('cartList');
          };
          this._globalService.totalCartListCount$.next(0);
          // Swal.fire({
          //   position: "center",
          //   icon: "success",
          //   title: 'Product remove to cartList',
          //   showConfirmButton: false,
          //   timer: 2000,
          //   width: '400px'
          // });
        }
      } else {
        this.cartlistArray.push({productId:variant?.productId?._id,_id:variant?._id,quantity:variant?.quantity || 1});
        // Swal.fire({
        //   position: "center",
        //   icon: "success",
        //   title: 'Product add to cartList',
        //   showConfirmButton: false,
        //   timer: 2000,
        //   width: '400px'
        // });
      };
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      this._cookieService.set('cartList',JSON.stringify(this.cartlistArray), expiryDate, '/') //,this.cookieCommonData.path,this.cookieCommonData.domain,this.cookieCommonData.secure,'None';
      this.getCartlistProductWithoutLogin('cartList');
      setTimeout(() => {
        //this._router.navigate(['/checkout']);
        window.location.href = window.location.origin + "/checkout"
      }, 100);
    }
  }

  // unknowUserlogIn(event: any) {
  //   this.isOpenLoginForm = false;
  //   // this._globalService.cartListDataPagination$.next(null);console.log('api call');
  //   if (event) {
  //     this.isProductBuy = true;
  //   }
  //   this.getProductDetails(event);
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
      this.getProductDetails(result);
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

  addEditWishlist(event: any, variant: any) {
    event.stopPropagation();
    if (typeof window != 'undefined' && !localStorage.getItem('accessToken')) {
      // this.wishlistArray = JSON.parse(this._cookieService.get('wishList') !);
      this.isOpenLoginForm = true;
    } else {
      this._wishListService.addEditWishList({ variantid: variant?._id }).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.getAllRelatedProduct(this.isLogin);
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
          this._globalFunctions.successErrorHandling(result.Message, this, true);
        }
      }, (error: any) => {
        // this._toastr.clear();
        this._globalFunctions.errorHanding(error, this, true);
      })
    }
  }

  addEditCartList(event: any, variant: any) {
    event.stopPropagation()
    if (typeof window != 'undefined' && !localStorage.getItem('accessToken')) {
      if (this._cookieService.get('cartList')) {
        this.cartlistArray = JSON.parse(this._cookieService.get('cartList')!);
      }
      if(this.cartlistArray.length > 0){
        if(this.cartlistArray.findIndex((temp:any) => temp?._id == variant?._id) == -1){
          this.cartlistArray.push({productId:variant?.productId?._id,_id:variant?._id,quantity:variant?.quantity || 1})
        } else {
          this.cartlistArray.splice(this.cartlistArray.findIndex((temp: any) => temp?._id == variant?._id), 1)
          if (this.cartlistArray.length == 0) {
            this._cookieService.delete('cartList')
          }
        }
      } else {
        this.cartlistArray.push({productId:variant?.productId?._id,_id:variant?._id,quantity:variant?.quantity || 1});
      };
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      this._cookieService.set('cartList', JSON.stringify(this.cartlistArray), expiryDate, '/') //,this.cookieCommonData.path,this.cookieCommonData.domain,this.cookieCommonData.secure,'None';
      this.getCartlistProductWithoutLogin('cartList');
    } else {
      if (variant.in_cart) {
        this._cartService.removeCart({ variantid: variant?._id }).subscribe((result: any) => {
          if (result && result.IsSuccess) {
            this.getAllRelatedProduct(this.isLogin);
            // this._globalService.cartListDataPagination$.next(null);console.log('api call');
            this.getUserCartList();
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
            this._globalFunctions.successErrorHandling(result.Message, this, true);
          }
        }, (error: any) => {
          // this._toastr.clear();
          this._globalFunctions.errorHanding(error, this, true);
        })
      } else {
        this._cartService.addCart({ variantid: variant?._id, quantity: variant?.quantity || 1 }).subscribe((result: any) => {
          if (result && result.IsSuccess) {
            this.getAllRelatedProduct(this.isLogin);            
            // this._globalService.cartListDataPagination$.next(null);console.log('api call');
            this.getUserCartList();
            Swal.fire({
              position: "center",
              icon: "success",
              title: 'Product add to cartList',
              showConfirmButton: false,
              timer: 2000,
              width: '400px'
            });
            this.getProductDetails(this.isLogin);
          } else {
            // this._toastr.clear();
            this._globalFunctions.successErrorHandling(result.Message, this, true);
          }
        }, (error: any) => {
          // this._toastr.clear();
          this._globalFunctions.errorHanding(error, this, true);
        })
      }
    }
  }

  getCartlistProductWithoutLogin(type: any) {
    if (!this.isLogin) {
      if (type == 'cartList' && this._cookieService.get('cartList')) {
        this.cartlistArray = JSON.parse(this._cookieService.get('cartList')!);
        this._globalService.cartListDataFromCookies$.next(this.cartlistArray)
        this.getUserCartListFromCookie(this.cartlistArray)
        // this._globalService.cartListDataPagination$.next(null);console.log('api call');
        this.relatedProductData.map((product: any) => {
          product.in_cart = false;
          this.cartlistArray.map((cartProduct: any) => {
            if (product?._id == cartProduct?._id) {
              product.in_cart = true;
            };
          });
        });
        Swal.fire({
          position: "center",
          icon: "success",
          title: 'Product add to cartList',
          showConfirmButton: false,
          timer: 2000,
          width: '400px'
        });
        this.getProductDetails(this.isLogin);
      } else if (type == 'wishList' && this._cookieService.get('wishList')) {
        this.wishlistArray = JSON.parse(this._cookieService.get('wishList')!);
        this.relatedProductData.map((product: any) => {
          product.in_wishlist = false;
          this.wishlistArray.map((cartProduct: any) => {
            if (product?._id == cartProduct?._id) {
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
        if (this._cookieService.get('cartList')) {
          this.cartlistArray = JSON.parse(this._cookieService.get('cartList')!);
          this.relatedProductData.map((product: any) => {
            product.in_cart = false;
            this.cartlistArray.map((cartProduct: any) => {
              if (product?._id == cartProduct?._id) {
                product.in_cart = true;
              };
            });
          });
        };
        if (this._cookieService.get('wishList')) {
          this.wishlistArray = JSON.parse(this._cookieService.get('wishList')!);
          this.relatedProductData.map((product: any) => {
            product.in_wishlist = false;
            this.wishlistArray.map((cartProduct: any) => {
              if (product?._id == cartProduct?._id) {
                product.in_wishlist = true;
              };
            });
          });
        };
      };
    }
  };

  imageOnError(event: any) {
    event.target.src = this.constants.defaultImage;
  }

  viewAllReview() {
    // this._router.navigate(['/review', this.productId])
    if(typeof window != 'undefined' && localStorage.getItem('PDID')){
      localStorage.removeItem('PDID');
    }
    localStorage.setItem('PDID', window.btoa(this.productId));
    // this._router.navigate(['/review/productreview']);
    window.location.href = window.location.origin + "/review/productreview"
  }

  getRelatedProductDetail(relatedProductId: any,search_tag:any) {
    window.scrollTo(0, 0);
    // this._router.navigate(['/shop', relatedProductId]);
    // this._router.navigate(['/shop/product-detail']);
    if(typeof window != 'undefined' && localStorage.getItem('PDID')){
      localStorage.removeItem('PDID');
    }
    localStorage.setItem('PDID', window.btoa(relatedProductId));
    this.productId = relatedProductId;
    // this.getProductDetails(this.isLogin);
    // this.getAllRelatedProduct(this.isLogin);
    this.relatedProductData = [];
    window.location.href =window.location.origin + "/shop/productdetail/" + search_tag
  };
  

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
        this._globalFunctions.successErrorHandling(result.Message,this,true);
      }
    },(error:any)=>{
      this._globalFunctions.errorHanding(error,this,true);
    })
  }

  getUserCartListFromCookie(data:any){
    let obj:any = {
      page:1,
      limit:10,
      language: localStorage.getItem("lang") || "english"
    };
    this._globalService.cartListDataFromCookies$.subscribe((result:any)=>{
      if(result != null && result?.length > 0){
        obj.variants = result;
      } else {
        if(this._cookieService.get('cartList')){
          obj.variants = JSON.parse(this._cookieService.get('cartList') !)
        }
      };
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
            this._globalFunctions.successErrorHandling(result.Message,this,true);
          }
        },(error:any)=>{
          this._globalFunctions.errorHanding(error,this,true);
        });
      } else {
        this._globalService.cartListData$.next(null);
      }
    });
  };

  goToSection2() {
    document.getElementById('reviews')!.scrollIntoView();
  }

  copyLink(event:any,myCode: any, mySlug:any) {
    event.stopPropagation();
    let shareLink = "https://magicshaircare.com/shop/productdetail/"+mySlug+"?PDID="+ myCode + "&SLUG=" + mySlug;
    const textarea = document.createElement('textarea');
    textarea.value = shareLink;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
   
    Swal.fire({
      position: "center",
      icon: "success",
      title: 'Share URL Copied.',
      showConfirmButton: false,
      timer: 2000,
      width: '400px'
    });
  }

  redirectToSpecificPage(page:any){
    window.location.href = window.location.origin + "/" + page
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

  togglePlayPause(index:any): void {
    this.videoElement = document.getElementById('toggle-video_'+index) as HTMLVideoElement;
    if (this.videoElement.paused) {
      this.videoElement.play();
    } else {
      this.videoElement.pause();
    }
  }
}