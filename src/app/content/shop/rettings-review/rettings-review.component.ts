import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomRatingComponent } from '../../../common/custom-rating/custom-rating.component';
import { ShopService } from '../shop.service';
import { GlobalFunctions } from '../../../common/global-function';
import { ImageModule } from 'primeng/image';
import { CONSTANTS } from '../../../common/constants';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PaginatorModule } from 'primeng/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { valHooks } from 'jquery';
import { GlobalService } from '../../../services/global.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-rettings-review',
  standalone: true,
  imports: [CommonModule,CustomRatingComponent,ImageModule,RatingModule,FormsModule,InfiniteScrollModule,PaginatorModule,MatFormFieldModule,MatOptionModule,MatSelectModule,TranslateModule],
  templateUrl: './rettings-review.component.html',
  styleUrl: './rettings-review.component.scss'
})
export class RettingsReviewComponent implements OnInit{

  @Input() productId:any;
  @Input() isProductDetailsPage:any;
  @Input() ispagination:boolean = true;

  reviewList:any;
  reviewListData:any;
  constants:any = CONSTANTS;
  ratingArray: any = [];
  isBetweenRating: boolean = false;
  isLoading: boolean = false;
  totalReview:number = 0;
  paginationPayloadObj: any;
  limit: any;
  pageNo: any;
  // tempScrollCount = 1;
  sortReivew:any = [
    { key:'Most Recent', value:''},
    { key:'This Month', value:'TM' },
    { key:'Last Month', value:'LM' },
    { key:'Last 6 Month', value:'LSM' },
    { key:'This year', value:'TY' },
  ]
  filteredProductKey: any;

  constructor(    
    private _shopService: ShopService,
    private _globalFunctions: GlobalFunctions,
    private _activatedRoute:ActivatedRoute,
    private _router:Router,
    private _globalService:GlobalService,
  ){}

  ngOnInit(): void {
    // if(!this.productId){
    //   this.productId = this._activatedRoute.snapshot.paramMap.get('productid')
    // }
    this.getAllReview();
  //  this.setCanonicalUrl();
   // this._globalService.setMetaTags(this.constants.reviewPageMetaTag);
    //this._globalService.setOpenGraphTags(this.constants.reviewPageMetaOgTag);
    //this._globalService.setTwitterCardTags(
    //  this.constants.reviewPageMetaTwitterTag
    //);
    //this._globalService.setJsonLdData(this.constants.reviewBreadcrum, 'bc');
    //this._globalService.setJsonLdData(
    //  this.constants.reviewWebsiteSchema,
    //  'websch'
    //);
    //this._globalService.setJsonLdData(this.constants.reviewLBSchema, 'lbSchema');
    //this._globalService.setJsonLdData(this.constants.reviewOrgSchema, 'orgSchema');
  }

  setCanonicalUrl() {
    this._globalService.removeCanonicalUrl();
    let urlData = {
      url: `https://magicshaircare.com/review/productreview/`,
      title: 'Give Us your Valuables Reviews!',
    };
    this._globalService.setCanonicalUrl(urlData);
  }

  sortByReview(event:any){
    this.filteredProductKey = event;
    this.getAllReview();
  }

  paginationPayload(event:any){
    this.isLoading = true;
    if (this.ispagination == true) {
      this.paginationPayloadObj = event;
    }
    this.getAllReview();
  }

  getAllReview(event:any = ''){
    this.isLoading = true;
    // this.pageNo = (this.paginationPayloadObj?.page && this.paginationPayloadObj?.rows) ? (this.paginationPayloadObj.page + 1) : 1;
    // this.limit = this.paginationPayloadObj.rows || 10;
    this.pageNo = (this.paginationPayloadObj && this.paginationPayloadObj.page && this.paginationPayloadObj.rows) ? (this.paginationPayloadObj.page + 1) : 1;
    this.limit = (this.paginationPayloadObj && this.paginationPayloadObj.rows) ? this.paginationPayloadObj.rows : 10;
    let data:any = {
      page: this.pageNo,
      limit: this.limit,
      variantid: this.productId,
      rating: 0,
      sorting:this.filteredProductKey || ''
    }
    this._shopService.getReview(data).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        result?.Data?.docs.map((item:any) => {
          item.reviewDesc = false;
          item.isBetweenRating = false;
          item.ratingArray = [];
          for (let index = 0; index < Math.floor(item?.rating); index++) {
            item.ratingArray.push({isBetween:false,ratting:true});
          };
          let tempRatingArrayLength = item.ratingArray.length;
          for (let index = 0; index < 5; index++) {
            if(tempRatingArrayLength <= 4){
              item.ratingArray[tempRatingArrayLength] = {isBetween:false,ratting:false}
              tempRatingArrayLength++;
            };
          };
          if (
            Math.floor(item?.rating) < item?.rating &&
            Math.ceil(item?.rating) > item?.rating
          ) {
            item.ratingArray[Math.floor(item?.rating)].isBetween = true;
          }
        })
        this.reviewList = result.Data.docs;
        this.reviewListData = result.Data; 
        this.totalReview = result?.Data?.totalDocs;       
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
        this.isLoading = false;      
      } else {
        this.isLoading = false;
        this._globalFunctions.successErrorHandling(result.Message,this,true);
      }
    },(error:any)=>{
      this.isLoading = false;
      this._globalFunctions.errorHanding(error,this,true);
    })
  }

  imageOnError(event: any){
    event.target.src = this.constants.defaultImage;
  }

  // onScroll(){
  //   this.tempScrollCount++;
  //   if(!this.isProductDetailsPage && ((this.tempScrollCount * 10) / this.reviewListData?.totalDocs) >= 1 && ((this.tempScrollCount * 10) / this.reviewListData?.totalDocs) < 2){ // && this.reviewListData?.totalDocs >= this.tempScrollCount * 10
  //     this.getAllReview(this.tempScrollCount)
  //   }
  // }
}
