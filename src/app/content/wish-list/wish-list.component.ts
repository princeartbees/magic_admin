import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { WishListService } from './wish-list.service';
import { GlobalFunctions } from '../../common/global-function';
import { CommonModule } from '@angular/common';
import { CONSTANTS } from '../../common/constants';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../cart-list/cart.service';
import { GlobalService } from '../../services/global.service';
import Swal from 'sweetalert2';
import { ContentService } from '../content.service';
import { TranslateModule } from '@ngx-translate/core';
declare var $:any;

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [CommonModule,RouterModule,RatingModule,FormsModule,TranslateModule],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.scss'
})
export class WishListComponent implements OnInit{

  wishList:any = [];
  isLoading:boolean = false;
  tempCount:number = 1;
  constants:any = CONSTANTS;
  adsMediaObj:any;
  wishListRes:any = {};
  adsPagelistArray: any = [];

  constructor(
    private _wishListService:WishListService,
    private _globalFunctions:GlobalFunctions,
    private _globalService:GlobalService,
    private _cartService:CartService,
    private _toastr:ToastrService,
    private _activatedRoute:ActivatedRoute,
    private _contentService:ContentService
  ){
    $('.page-loader').fadeIn('fast');
    setTimeout(() => {
      $('.page-loader').fadeOut('slow');
    }, 1500);
  }


  ngOnInit(): void {
    // this._globalService.adsPageList$.subscribe((result:any)=>{
    //   result.map((item:any)=>{
    //     if(item.title == this._activatedRoute.snapshot.data['title']){
    //       this.adsMediaObj = item;
    //     };
    //   });
    // });
    
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
    })
    if(typeof window != 'undefined' && localStorage.getItem('accessToken')){
      this.getWishlistData(this.tempCount);
    }

    this.setCanonicalUrl();
    this._globalService.setMetaTags(this.constants.wishlistPageMetaTag);
    this._globalService.setOpenGraphTags(this.constants.wishlistPageMetaOgTag);
    this._globalService.setTwitterCardTags(
      this.constants.wishlistPageMetaTwitterTag
    );
    this._globalService.setJsonLdData(this.constants.wishlistBreadcrum, 'bc');
    // this._globalService.setJsonLdData(
    //   this.constants.wishlistWebsiteSchema,
    //   'websch'
    // );
    this._globalService.setJsonLdData(this.constants.wishlistLBSchema, 'lbSchema');
    this._globalService.setJsonLdData(this.constants.wishlistOrgSchema, 'orgSchema');
  }

  setCanonicalUrl() {
    this._globalService.removeCanonicalUrl();
    let urlData = {
      url: `https://magicshaircare.com/wishlist`,
      title: 'Save Your Faves',
    };
    this._globalService.setCanonicalUrl(urlData);
  }

  getWishlistData(pageCount:number){
    this.isLoading = true;
    let wishObj = {
       language: localStorage.getItem("lang") || "english"
    }
    this._wishListService.allWishList(wishObj).subscribe((result:any)=>{
      if(result && result.IsSuccess){
        this.wishListRes =result?.Data;
        if (Object.keys(this.wishListRes).length > 0) {
          this.wishList = result?.Data?.variants;
          this.wishList.map((item:any)=>{
            if (localStorage.getItem("lang") == "hindi") {
              item.variantId.productId.product_name = item.variantId.productId.hi_product_name; 
            }
            else if (localStorage.getItem("lang") == "marathi") {
              item.variantId.productId.product_name = item.variantId.productId.mr_product_name; 
            }
            else if (localStorage.getItem("lang") == "gujarati") {
              item.variantId.productId.product_name = item.variantId.productId.gu_product_name; 
            }else{
              item.variantId.productId.product_name = item.variantId.productId.en_product_name; 
            }


            item.timestamp = new Date(item.timestamp);
            item.quantity = 1;
            item.isBetweenRating = false;
            item.ratingArray = Array(Math.floor(item?.variantId?.averageRating)).fill(0);
            if (
              Math.floor(item?.variantId?.averageRating) < item?.variantId?.averageRating &&
              Math.ceil(item?.variantId?.averageRating) > item?.variantId?.averageRating
            ) {
              item.isBetweenRating = true;
            } else {
              item.isBetweenRating = false;
            }
          });
        }
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this._globalFunctions.successErrorHandling(result?.Message,this,true);
      }
    },(error:any)=>{
      this.isLoading = false;
      this._globalFunctions.errorHanding(error,this,true);
    })
  }

  addEditWishlist(variant:any){
    this._wishListService.addEditWishList({variantid:variant?.variantId?._id}).subscribe((result:any)=>{
      if(result && result.IsSuccess){
        this.getWishlistData(this.tempCount)
        // this._toastr.clear();
        // this._toastr.success('Product add to wishlist','Success');
        Swal.fire({
          position: "center",
          icon: "success",
          title: 'Product remove to wishlist',
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

  addEditCartList(variant: any) {
    if (variant.in_cart) {
      this._cartService.removeCart({ variantid: variant?.variantId?._id }).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.getWishlistData(this.tempCount)
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
        } else {
          // this._toastr.clear();
          this._globalFunctions.successErrorHandling(result.Message, this, true);
        }
      }, (error: any) => {
        // this._toastr.clear();
        this._globalFunctions.errorHanding(error, this, true);
      })
    } else {
      this._cartService.addCart({ variantid: variant?.variantId?._id, quantity: variant?.quantity }).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.getWishlistData(this.tempCount)
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

}
