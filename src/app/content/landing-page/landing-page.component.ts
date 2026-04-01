import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  DoCheck,
  NO_ERRORS_SCHEMA,
  OnInit,
} from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { GlobalFunctions } from '../../common/global-function';
import { CONSTANTS } from '../../common/constants';
import { CommonModule } from '@angular/common';
import { ShopService } from '../shop/shop.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { WishListService } from '../wish-list/wish-list.service';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from '../cart-list/cart.service';
import { LoginComponent } from '../../auth/login/login.component';
import Swal from 'sweetalert2';
import { BenefitService } from '../benefits/benefits.service';
import { RatingModule } from 'primeng/rating';
import { CustomRatingComponent } from '../../common/custom-rating/custom-rating.component';
import { StickyHeaderComponent } from '../sticky-header/sticky-header.component';
import { RegisterComponent } from '../../auth/register/register.component';
import { OtpVeryficationComponent } from '../../auth/otp-veryfication/otp-veryfication.component';
import { CreateResetPinComponent } from '../../auth/create-reset-pin/create-reset-pin.component';
import { ForgetPinComponent } from '../../auth/forget-pin/forget-pin.component';
import { RegisterPopupComponent } from '../../auth/register-popup/register-popup.component';
import { TranslateModule } from '@ngx-translate/core';
// import { Swiper } from "swiper";

declare var $: any;
declare var Swiper: any;

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RatingModule,
    CustomRatingComponent,
    StickyHeaderComponent,
    LoginComponent,
    RegisterComponent,
    OtpVeryficationComponent,
    CreateResetPinComponent,
    ForgetPinComponent,
    RegisterPopupComponent,
    TranslateModule
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit, DoCheck,AfterViewInit {
  pageNo: any;
  limit: any;
  benefitListData: any = [];
  cartlistArray: any = [];
  wishlistArray: any = [];
  storyList: any = [];
  bestSellerProduct: any;
  constants: any = CONSTANTS;
  isBestSellerLoading: boolean = false;
  isHairReport: boolean = false;
  experienceText: any =
    "Experience the power of India's best natural hair care solution with our Ayurvedic Shampoo Mix Powder. Trusted by thousands across the globe, our unique blend promotes healthier, stronger, and shinier hair. Join our growing international community and discover the secret to Ayurvedic hair transformation!";
  magicExpDesc: boolean = false;
  isCustomersReviewloading: boolean = false;
  customersReviewList: any = [];

  isOpenLoginForm: boolean = false;
  isOpenRegisterForm: boolean = false;
  isOpenOtpVeryFicationForm: boolean = false;
  isOpenCreatePinForm: boolean = false;
  isOpenForgetPinForm: boolean = false;
  isChangeMail: boolean = false;
  isOpenForgotPinOtpVerifyForm: boolean = false;
  isOpenResetPinForm: boolean = false;
  hoverIndex: any;
  hoverVideo: any;

  constructor(
    private _globalService: GlobalService,
    private _globalFunctions: GlobalFunctions,
    private _shopService: ShopService,
    private _wishListService: WishListService,
    private _router: Router,
    private _benefitService: BenefitService,
    private _cookieService: CookieService,
    private _cartService: CartService
  ) {
    $('.page-loader').fadeIn('fast');
    setTimeout(() => {
      $('.page-loader').fadeOut('slow');
    }, 1000);
  }

  ngOnInit(): void {
    this._globalService.stories$.subscribe((result: any) => {
      if (result && result.IsSuccess) {
        result.Data.docs.map((item: any) => {
          if (localStorage.getItem("lang") == "hindi") {
            item.title = item.hi_title; 
            item.brief = item.hi_brief;
            item.author = item.hi_author;
            item.content = item.hi_content;
          }
          else if (localStorage.getItem("lang") == "marathi") {
            item.title = item.mr_title; 
            item.brief = item.mr_brief;
            item.author = item.mr_author;
            item.content = item.mr_content;
          }
          else if (localStorage.getItem("lang") == "gujarati") {
            item.title = item.gu_title; 
            item.brief = item.gu_brief;
            item.author = item.gu_author;
            item.content = item.gu_content;
          }else{
            item.title = item.en_title; 
            item.brief = item.en_brief;
            item.author = item.en_author;
            item.content = item.en_content;
          }
          item.aboutStoryDesc = false;
        });
        this.storyList = result.Data.docs;
      }
    });
    this.setCanonicalUrl();
    this.getBestSellerProductList();
    this.getBenefitData();
    this.getCustomersReview();

    if (new Swiper()) {
      var Swipes = new Swiper('.customer-feedback', {
        loop: true,
        slidesPerView: 1,
        autoplay: true,
        pagination: false,
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
          },
        },
      });

      var dummyCustomersReview = new Swiper('.dummy-customers-review', {
        loop: true,
        slidesPerView: 1,
        autoplay: true,
        pagination: false,
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
          },
        },
      });

      var bestSellerProductSwiper = new Swiper('.best-seller', {
        loop: true,
        slidesPerView: 1,
        // autoplay: true,
        pagination: {
          el: '.swiper-pagination',
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
          },
        },
      });

      var bestSellerProductSwiper = new Swiper('.support_company', {
        loop: true,
        slidesPerView: 2,
        // autoplay:true,
        speed: 5000,
        grabCursor: true,
        freeMode: true,
        // loopAddBlankSlides:true,
        loopAdditionalSlides: 2,
        loopAddBlankSlides: true,
        // cssMode:true,
        // autoplay: {
        //   delay: 0,
        //   disableOnInteraction: false,
        // },
        breakpoints: {
          425: {
            slidesPerView: 4,
            spaceBetween: 0,
          },
          675: {
            slidesPerView: 5,
            spaceBetween: 0,
          },
          1024: {
            slidesPerView: 7,
            spaceBetween: 0,
          },
        },
      });

      var bestReelsSwiper = new Swiper('.best-reels', {
        loop: true,
        slidesPerView: 1,
        centeredSlides: true,
        pagination: {
          el: '.swiper-pagination',
        },
        breakpoints: {
          425: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          675: {
            slidesPerView: 3,
            spaceBetween: 0,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 0,
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 0,
          },
          1440: {
            slidesPerView: 7,
            spaceBetween: 0,
          },
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });

      var dummyRelatedProductSwiper = new Swiper('.dummy-best-seller', {
        loop: true,
        slidesPerView: 1,
        autoplay: true,
        pagination: {
          el: '.swiper-pagination',
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
          },
        },
      });
    }

    var bestReelsSwiper = new Swiper('.best-reels', {
      loop: true,
      slidesPerView: 1,
      centeredSlides: true,
      pagination: {
        el: '.swiper-pagination',
      },
      breakpoints: {
        425: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        675: {
          slidesPerView: 3,
          spaceBetween: 0,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 0,
        },
        1280: {
          slidesPerView: 5,
          spaceBetween: 0,
        },
        1440: {
          slidesPerView: 7,
          spaceBetween: 0,
        },
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

    var bannersSwiper = new Swiper('.hero_banners', {
      loop: true,
      slidesPerView: 1,
      autoplay: true,
      breakpoints: {
        425: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        675: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        1024: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
      },
    });

    var ingredientsDetailsSwiper = new Swiper(".ingredients", {
      loop: true,
      slidesPerView: 1,
      autoplay: true,
      spaceBetween: 30,
      pagination: {
        el: '.swiper-pagination'
      },
      breakpoints: {
        425: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
        675: {
          slidesPerView: 2,
          spaceBetween: 30,
        }
      }
    })

    document.addEventListener('DOMContentLoaded', () => {
      // Ensure videos are muted initially
      document.querySelectorAll('video').forEach(video => {
        video.muted = true;
      });
    
      window.addEventListener('scroll', function () {
        const swiperSection = document.querySelector('.best-reels') as HTMLElement;
    
        if (swiperSection) {
          const swiperSectionRect = swiperSection.getBoundingClientRect();
          const isInViewport = (
            swiperSectionRect.top < window.innerHeight &&
            swiperSectionRect.bottom >= 0
          );
    
          const activeSlide = bestReelsSwiper.slides[bestReelsSwiper.activeIndex];
          if (activeSlide) {
            const video = activeSlide.querySelector('video') as HTMLVideoElement;
    
            if (video) {
              if (isInViewport) {
                video.play().catch((error) => {
                  if (error.name === 'NotAllowedError') {
                    console.warn('Autoplay policy restriction: video cannot play without user interaction.');
                    // Optionally, prompt the user to interact with the page
                  } else {
                    console.warn('Video play failed:', error);
                  }
                });
              } else {
                video.pause();
              }
            } else {
              console.warn('No video element found in the active slide.');
            }
          } else {
            console.warn('Active slide not found.');
          }
        } else {
          console.warn('Swiper section not found.');
        }
      });
    
      bestReelsSwiper.on('slideChange', function () {
        const activeSlide = bestReelsSwiper.slides[bestReelsSwiper.activeIndex];
        const video = activeSlide.querySelector('video') as HTMLVideoElement;
    
        if (video) {
          video.play().catch((error) => {
            if (error.name === 'NotAllowedError') {
              console.warn('Autoplay policy restriction: video cannot play without user interaction.');
            } else {
              console.warn('Video play failed:', error);
            }
          });
        }
    
        // Pause videos on inactive slides
        bestReelsSwiper.slides.forEach(function (slide: any, index: any) {
          if (index !== bestReelsSwiper.activeIndex) {
            const video = slide.querySelector('video') as HTMLVideoElement;
            if (video) {
              video.pause();
            }
          }
        });
      });
    });
    

    this._globalService.setMetaTags(this.constants.homePageMetaTag);
    this._globalService.setOpenGraphTags(this.constants.homePageMetaOgTag);
    this._globalService.setTwitterCardTags(
      this.constants.homePageMetaTwitterTag
    );
    this._globalService.setJsonLdData(this.constants.homeBreadcrum, 'bc');
    this._globalService.setJsonLdData(
      this.constants.homeWebsiteSchema,
      'websch'
    );
    this._globalService.setJsonLdData(this.constants.homeLBSchema, 'lbSchema');
    this._globalService.setJsonLdData(this.constants.homeOrgSchema, 'orgSchema');
  }

  ngAfterViewInit(): void {
   
  }

  setCanonicalUrl() {
    this._globalService.removeCanonicalUrl();
    let urlData = {
      url: `https://magicshaircare.com/`,
      title: '100% Ayurvedic | Natural Shampoo Mix Powder | Magics Hair Care',
    };
    this._globalService.setCanonicalUrl(urlData);
  }

  ngDoCheck(): void {
    // var videos:any = document.getElementsByClassName("myVideo");
    // if (document.body.classList.contains('swiper-slide-active')) {
    //   for (var i = 0; i < videos.length; i++) {
    //     videos[i].autoplay = true;
    //   }
    // } else {
    //   for (var i = 0; i < videos.length; i++) {
    //     videos[i].pause();
    //     videos[i].autoplay = false;
    //   }
    // }
  }

  getBenefitData() {
    let benifitObj = {
      language: localStorage.getItem("lang") || "english"
    }
    this._benefitService.getBenefits(benifitObj).subscribe(
      (result: any) => {
        if (result && result.IsSuccess) {
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
          this.benefitListData = result?.Data;
        } else {
          this._globalFunctions.successErrorHandling(
            result.Message,
            this,
            true
          );
        }
      },
      (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
      }
    );
  }

  getBestSellerProductList() {
    this.isBestSellerLoading = true;
    let payload = {
      page: 1,
      limit: 10,
      sortBy: '', //"PLTH","PHTL","DLTH","DHTL"
      startprice: 0,
      endprice: 0,
      rating: 0,
      from: 'web', //pass web or mobile,
      language: localStorage.getItem("lang") || "english"
    };
    let isLogin: any;
    if (typeof window != 'undefined') {
      isLogin = localStorage.getItem('accessToken') ? true : false;
    }
    this._shopService.getBestSellerList(payload, isLogin).subscribe(
      (result: any) => {
        if (result && result.IsSuccess) {
          this.isBestSellerLoading = false;
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
            item.isBetweenRating = false;
            item.ratingArray = [];
            // let averageRating = Number(item?.averageRating);
            for (
              let index = 0;
              index < Math.floor(item?.averageRating);
              index++
            ) {
              item.ratingArray.push({ isBetween: false, ratting: true });
            }
            let tempRatingArrayLength = item.ratingArray.length;
            for (let index = 0; index < 5; index++) {
              if (tempRatingArrayLength <= 4) {
                item.ratingArray[tempRatingArrayLength] = {
                  isBetween: false,
                  ratting: false,
                };
                tempRatingArrayLength++;
              }
            }
            if (
              Math.floor(item?.averageRating) < item?.averageRating &&
              Math.ceil(item?.averageRating) > item?.averageRating
            ) {
              item.ratingArray[Math.floor(item?.averageRating)].isBetween =
                true;
            }
          });
          this.bestSellerProduct = result.Data.docs;
        } else {
          this.isBestSellerLoading = false;
          this._globalFunctions.successErrorHandling(
            result.Message,
            this,
            true
          );
        }
      },
      (error: any) => {
        this.isBestSellerLoading = false;
        this._globalFunctions.errorHanding(error, this, true);
      }
    );
  }

  getStoriesDetails(storyid: any,search_tag:any) {
    // this._router.navigate(['/stories',storyid])
    this._router.navigate(['/stories/storydetail',search_tag]);
    localStorage.setItem('STID', window.btoa(storyid));
  }

  getBestSellerProductDetail(bestSellerId: any,search_tag:any) {
    // this._router.navigate(['/shop',bestSellerId]);
    //this._router.navigate(['/shop/productdetail']);
    if (typeof window != 'undefined' && localStorage.getItem('PDID')) {
      localStorage.removeItem('PDID');
    }
    localStorage.setItem('PDID', window.btoa(bestSellerId));
    window.location.href =window.location.origin + "/shop/productdetail/" + search_tag
  }

  getCustomersReview() {
    this.isCustomersReviewloading = true;
    this._shopService.getCustomersReview().subscribe(
      (result: any) => {
        if (result && result.IsSuccess) {
          this.isCustomersReviewloading = false;
          result?.Data.map((item: any) => {
            item.ratingsArray = Array(Math.floor(item?.rating)).fill(0);
          });
          this.customersReviewList = result.Data;
        } else {
          this.isCustomersReviewloading = false;
          this._globalFunctions.successErrorHandling(
            result.Message,
            this,
            true
          );
        }
      },
      (error: any) => {
        this.isCustomersReviewloading = false;
        this._globalFunctions.errorHanding(error, this, true);
      }
    );
  }

  addEditWishlist(event: any, variant: any) {
    event.stopPropagation();
    if (typeof window != 'undefined' && !localStorage.getItem('accessToken')) {
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
      this._wishListService
        .addEditWishList({ variantid: variant?._id })
        .subscribe(
          (result: any) => {
            if (result && result.IsSuccess) {
              this.getBestSellerProductList();
              // this._toastr.clear();
              // this._toastr.success('Product add to wishlist','Success');
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Product add to wishlist',
                showConfirmButton: false,
                timer: 2000,
                width: '400px',
              });
            } else {
              // this._toastr.clear();
              this._globalFunctions.successErrorHandling(
                result.Message,
                this,
                true
              );
            }
          },
          (error: any) => {
            // this._toastr.clear();
            this._globalFunctions.errorHanding(error, this, true);
          }
        );
    }
  }

  addEditCartList(event: any, variant: any) {
    event.stopPropagation();
    if (typeof window != 'undefined' && !localStorage.getItem('accessToken')) {
      if (this._cookieService.get('cartList')) {
        this.cartlistArray = JSON.parse(this._cookieService.get('cartList')!);
      }
      if (this.cartlistArray.length > 0) {
        if (
          this.cartlistArray.findIndex(
            (temp: any) => temp?._id == variant?._id
          ) == -1
        ) {
          this.cartlistArray.push({
            productId: variant?.productId?._id,
            _id: variant?._id,
            quantity: variant?.quantity || 1,
          });
        } else {
          this.cartlistArray.splice(
            this.cartlistArray.findIndex(
              (temp: any) => temp?._id == variant?._id
            ),
            1
          );
          if (this.cartlistArray.length == 0) {
            this._cookieService.delete('cartList');
          }
        }
      } else {
        this.cartlistArray.push({
          productId: variant?.productId?._id,
          _id: variant?._id,
          quantity: variant?.quantity || 1,
        });
      }
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      this._cookieService.set('cartList', JSON.stringify(this.cartlistArray), expiryDate, '/'); //,this.cookieCommonData.path,this.cookieCommonData.domain,this.cookieCommonData.secure,'None';
      this.getCartlistProductWithoutLogin('cartList');
    } else {
      if (variant.in_cart) {
        this._cartService.removeCart({ variantid: variant?._id }).subscribe(
          (result: any) => {
            if (result && result.IsSuccess) {
              this.getBestSellerProductList();
              // this._globalService.cartListDataPagination$.next(null);console.log('api call');
              this.getUserCartList();
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Product add to cartList',
                showConfirmButton: false,
                timer: 2000,
                width: '400px',
              });
            } else {
              // this._toastr.clear();
              this._globalFunctions.successErrorHandling(
                result.Message,
                this,
                true
              );
            }
          },
          (error: any) => {
            // this._toastr.clear();
            this._globalFunctions.errorHanding(error, this, true);
          }
        );
      } else {
        this._cartService
          .addCart({ variantid: variant?._id, quantity: 1 })
          .subscribe(
            (result: any) => {
              if (result && result.IsSuccess) {
                this.getBestSellerProductList();
                // this._globalService.cartListDataPagination$.next(null);console.log('api call');
                this.getUserCartList();
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Product add to cartList',
                  showConfirmButton: false,
                  timer: 2000,
                  width: '400px',
                });
              } else {
                // this._toastr.clear();
                this._globalFunctions.successErrorHandling(
                  result.Message,
                  this,
                  true
                );
              }
            },
            (error: any) => {
              // this._toastr.clear();
              this._globalFunctions.errorHanding(error, this, true);
            }
          );
      }
    }
  }

  getCartlistProductWithoutLogin(type: any) {
    if (typeof window != undefined && !localStorage.getItem('accessToken')) {
      if (type == 'cartList' && this._cookieService.get('cartList')) {
        this.cartlistArray = JSON.parse(this._cookieService.get('cartList')!);
        this._globalService.cartListDataFromCookies$.next(this.cartlistArray);
        // this._globalService.cartListDataPagination$.next(null);console.log('api call');
        this.getUserCartListFromCookie(this.cartlistArray);
        this.bestSellerProduct.map((product: any) => {
          product.in_cart = false;
          this.cartlistArray.map((cartProduct: any) => {
            if (product?._id == cartProduct?._id) {
              product.in_cart = true;
            }
          });
        });
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Product add to cartList',
          showConfirmButton: false,
          timer: 2000,
          width: '400px',
        });
      } else if (type == 'wishList' && this._cookieService.get('wishList')) {
        this.wishlistArray = JSON.parse(this._cookieService.get('wishList')!);
        this.bestSellerProduct.map((product: any) => {
          product.in_wishlist = false;
          this.wishlistArray.map((cartProduct: any) => {
            if (product?._id == cartProduct?._id) {
              product.in_wishlist = true;
            }
          });
        });
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Product add to wishList',
          showConfirmButton: false,
          timer: 2000,
          width: '400px',
        });
      } else {
        if (this._cookieService.get('cartList')) {
          this.cartlistArray = JSON.parse(this._cookieService.get('cartList')!);
          this.bestSellerProduct.map((product: any) => {
            product.in_cart = false;
            this.cartlistArray.map((cartProduct: any) => {
              if (product?._id == cartProduct?._id) {
                product.in_cart = true;
              }
            });
          });
        }
        if (this._cookieService.get('wishList')) {
          this.wishlistArray = JSON.parse(this._cookieService.get('wishList')!);
          this.bestSellerProduct.map((product: any) => {
            product.in_wishlist = false;
            this.wishlistArray.map((cartProduct: any) => {
              if (product?._id == cartProduct?._id) {
                product.in_wishlist = true;
              }
            });
          });
        }
      }
    }
  }

  buyBestSellerProduct6(event: any, variant: any) {
    event.stopPropagation();
    // if (typeof window != 'undefined' && localStorage.getItem('accessToken')) {
    //   if (variant.in_cart) {
    //     // this._router.navigate(['/checkout']);
    //      window.location.href = window.location.origin + "/checkout"
    //   } else {
    //     this._cartService
    //       .addCart({ variantid: variant?._id, quantity: 1 })
    //       .subscribe(
    //         (result: any) => {
    //           if (result && result.IsSuccess) {
    //             // this._globalService.cartListDataPagination$.next(null);console.log('api call');
    //             this.getUserCartList();
    //             setTimeout(() => {
    //               this._router.navigate(['/cartlist']);
    //             }, 100);
    //             Swal.fire({
    //               position: 'center',
    //               icon: 'success',
    //               title: 'Product add to cartList',
    //               showConfirmButton: false,
    //               timer: 2000,
    //               width: '400px',
    //             });
    //           } else {
    //             // this._toastr.clear();
    //             this._globalFunctions.successErrorHandling(
    //               result.Message,
    //               this,
    //               true
    //             );
    //           }
    //         },
    //         (error: any) => {
    //           // this._toastr.clear();
    //           this._globalFunctions.errorHanding(error, this, true);
    //         }
    //       );
    //   }
    // } else {
    //   this.isOpenLoginForm = true;
    // }

    if (typeof window != 'undefined' && localStorage.getItem('accessToken')) {
      // this.isProductBuy = false;
      if (variant.in_cart) {
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

  // unknowUserlogIn(event:any){
  //   this.isOpenLoginForm = false;
  //   // this._globalService.cartListDataPagination$.next(null);console.log('api call');
  //   this.getBestSellerProductList();
  // }

  unknowUserlogIn(result: any) {
    if (result && result.IsSuccess) {
      this.isOpenLoginForm = false;
      if (result?.Data ) {      //&& !result?.Data.isotpsend
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
    if (result) {
      this.getBestSellerProductList();
    }
  }

  isOpenRegisterFormPopup(event: any) {
    if (event) {
      this.isOpenRegisterForm = true;
      this.isOpenLoginForm = false;
    }
  }
  unKnowUserRegister(result: any) {
    if (result && result.IsSuccess) {
      this.isOpenRegisterForm = false;
      if (result?.Data && !result?.Data.isotpsend) {
        this.isOpenOtpVeryFicationForm = true;
      } else {
        this.isOpenOtpVeryFicationForm = true;
      }
    } else {
      this.isOpenRegisterForm = false;
    }
  }

  isOpenLogInFormPopup(event: any) {
    if (event) {
      this.isOpenLoginForm = true;
      this.isOpenRegisterForm = false;
      this.isOpenForgetPinForm = false;
    }
  }

  unKnowUserVeryFiedOtp(event: any) {
    if (event) {
      this.isOpenOtpVeryFicationForm = false;
      // this.isOpenCreatePinForm = true;
    }
  }

  isOpenForGetPinFormPopup(event: any) {
    if (event.isSuccess) {
      this.isOpenOtpVeryFicationForm = false;
      this.isOpenForgotPinOtpVerifyForm = false;
      this.isOpenLoginForm = false;
      this.isOpenForgetPinForm = true;
      if (event.isChangeMail) {
        this.isChangeMail = true;
      }
    }
  }

  unKnowUserCreatePin(event: any) {
    if (event) {
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

  getUserCartList() {
    let data = {
      page: 1,
      limit: 10,
      language: localStorage.getItem("lang") || "english"
    };
    this._cartService.cartList(data).subscribe(
      (result: any) => {
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
          this._globalService.totalCartListCount$.next(result.Data.totalDocs);
          this._globalService.cartListData$.next(result);
        } else {
          this._globalFunctions.successErrorHandling(
            result.Message,
            this,
            true
          );
        }
      },
      (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
      }
    );
  }

  getUserCartListFromCookie(data: any) {
    let obj: any = {
      page: 1,
      limit: 10,
      language: localStorage.getItem("lang") || "english"
    };
    this._globalService.cartListDataFromCookies$.subscribe((result: any) => {
      if (result != null && result?.length > 0) {
        obj.variants = result;
      } else {
        if (this._cookieService.get('cartList')) {
          obj.variants = JSON.parse(this._cookieService.get('cartList')!);
        }
      }
      if (
        this._cookieService.get('cartList') &&
        JSON.parse(this._cookieService.get('cartList')!).length > 0
      ) {
        this._cartService.getVariant(obj).subscribe(
          (result: any) => {
            if (result && result.IsSuccess) {
              let tempData: any = JSON.parse(
                this._cookieService.get('cartList')!
              );
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
                    }
                  });
                });
              });
              this._globalService.totalCartListCount$.next(
                result.Data.totalDocs
              );
              this._globalService.cartListData$.next(result);
            } else {
              this._globalFunctions.successErrorHandling(
                result.Message,
                this,
                true
              );
            }
          },
          (error: any) => {
            this._globalFunctions.errorHanding(error, this, true);
          }
        );
      } else {
        this._globalService.cartListData$.next(null);
      }
    });
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
