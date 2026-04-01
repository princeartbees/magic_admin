import { Component, OnInit } from '@angular/core';
import { BenefitService } from './benefits.service';
import { every } from 'rxjs';
import { GlobalFunctions } from '../../common/global-function';
import { GlobalService } from '../../services/global.service';
import { CONSTANTS } from '../../common/constants';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';
declare var $:any;

@Component({
  selector: 'app-benefits',
  standalone: true,
  imports: [CommonModule,RouterModule,InfiniteScrollModule,TranslateModule],
  templateUrl: './benefits.component.html',
  styleUrl: './benefits.component.scss'
})
export class BenefitsComponent implements OnInit {
  pageNo: any;
  limit: any;
  benefitsList: any = [];
  constants: any = CONSTANTS;
  tempScrollCount = 1;

  constructor(private _benefitService: BenefitService, 
    private _globalService: GlobalService,
    private _globalFunctions: GlobalFunctions) { 
      $('.page-loader').fadeIn('fast');
    setTimeout(() => {
      $('.page-loader').fadeOut('slow');
    }, 1500);
    }

  ngOnInit(): void {
    this.benefitsAllList(1);
    this.setCanonicalUrl();
    this._globalService.setMetaTags(this.constants.benifitPageMetaTag);
    this._globalService.setOpenGraphTags(this.constants.benifitPageMetaOgTag);
    this._globalService.setTwitterCardTags(
      this.constants.benifitPageMetaTwitterTag
    );
    this._globalService.setJsonLdData(this.constants.benifitBreadcrum, 'bc');
    // this._globalService.setJsonLdData(
    //   this.constants.benifitWebsiteSchema,
    //   'websch'
    // );
    this._globalService.setJsonLdData(this.constants.benifitLBSchema, 'lbSchema');
    this._globalService.setJsonLdData(this.constants.benifitOrgSchema, 'orgSchema');
  }

  setCanonicalUrl() {
    this._globalService.removeCanonicalUrl();
    let urlData = {
      url: `https://magicshaircare.com/benefits/`,
      title: 'Discover the Magic of Healthy & Natural Hair with Magics Hair Care.',
    };
    this._globalService.setCanonicalUrl(urlData);
  }

  benefitsAllList(pageCount:any = ''){
    const paginationObj = {
      language: localStorage.getItem("lang") || "english"
    }
    this._benefitService.getProductBenefitListWithoutPagination(paginationObj).subscribe((result:any)=>{
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
        this.benefitsList = result?.Data;
      } else {
        this._globalFunctions.successErrorHandling(result.Message,this,true);
      }
    },(error:any)=>{
      this._globalFunctions.errorHanding(error,this,true);
    })
  }

  // onScroll(){
  //   this.tempScrollCount++;
  //   if(this.tempScrollCount < Math.ceil(this.benefitsList?.length)){
  //     this.benefitsAllList(this.tempScrollCount);
  //   }
  // }
}
