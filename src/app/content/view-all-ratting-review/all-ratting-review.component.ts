import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { RettingsReviewComponent } from "../shop/rettings-review/rettings-review.component";
import { ShopService } from "../shop/shop.service";
import { GlobalFunctions } from "../../common/global-function";
import { CONSTANTS } from "../../common/constants";
import { AddEditReview } from "./add-edit-review/add-edit-review.component";
import { MatDialog } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
declare var $:any;
@Component({
  selector:'app-ratting-review',
  standalone:true,
  imports:[CommonModule,RouterModule,FormsModule,RettingsReviewComponent,TranslateModule],
  templateUrl:'./all-ratting-review.component.html'
})

export class AllRattingReviewComponent implements OnInit{

  productId:any;
  productDetails:any;
  isLoading:boolean = false;
  constants:any = CONSTANTS;
  ratingArray: any = [];
  isBetweenRating: boolean = false;
  isLogin: boolean = false;

  constructor(
    private _activatedRoute:ActivatedRoute,
    private _shopService:ShopService,
    private _globalFunctions:GlobalFunctions,
    private _dialog:MatDialog,
    private _router:Router
  ){
    $('.page-loader').fadeIn('fast');
    setTimeout(() => {
      $('.page-loader').fadeOut('slow');
    }, 1500);
  }

  ngOnInit(): void {
    // this.productId = this._activatedRoute.snapshot.paramMap.get('productid');    
    if(typeof window != 'undefined' && localStorage.getItem('PDID') != null){
      this.productId = window.atob(localStorage.getItem('PDID')!);
    }else {
      this._router.navigate(['/shop']);
    }
    if(typeof window != undefined && localStorage.getItem('accessToken')){
      this.isLogin = true
    } else {
      this.isLogin = false
    }
    const productObj = {
      variantid: this.productId,
      from: "web"
    }
    this._shopService.getProductDetailsOne(productObj,this.isLogin).subscribe((result: any) => {
      if (result && result.IsSuccess) {
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
        this.productDetails = result?.Data;
        this.isLoading = false;
      } else {
      this.isLoading = false;
      this._globalFunctions.successErrorHandling(result, this, true);
    }
        }, (error) => {
      this.isLoading = false;
      this._globalFunctions.successErrorHandling(error, this, true);
    })
  }

  addReview(productId:any){
    const dialogRef = this._dialog.open(AddEditReview, {
      width: '500px',
      data:[{result:productId},
        {btnName:"Add"}],
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((res:any) => {
      window.location.reload();
    })
  }

}