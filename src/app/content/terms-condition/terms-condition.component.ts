import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from '../../common/constants';
import { CommonModule } from '@angular/common';
import { tAnsC } from '../../common/terms-and-condition';
import { RouterModule } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { TranslateModule } from '@ngx-translate/core';
declare var $:any;

@Component({
  selector: 'app-terms-condition',
  standalone: true,
  imports: [CommonModule,RouterModule,TranslateModule],
  templateUrl: './terms-condition.component.html',
  styleUrl: './terms-condition.component.scss'
})
export class TermsConditionComponent implements OnInit {
  constant:any = CONSTANTS;
  termsAndCondition:any = tAnsC;

  constructor(private _globalService:GlobalService,){
    $('.page-loader').fadeIn('fast');
    setTimeout(() => {
      $('.page-loader').fadeOut('slow');
    }, 1500);
  }

  ngOnInit(): void {
    this.setCanonicalUrl();
    this._globalService.setMetaTags(this.constant.tncPageMetaTag);
    this._globalService.setOpenGraphTags(this.constant.tncPageMetaOgTag);
    this._globalService.setTwitterCardTags(
      this.constant.tncPageMetaTwitterTag
    );
    this._globalService.setJsonLdData(this.constant.tncBreadcrum, 'bc');
    // this._globalService.setJsonLdData(
    //   this.constant.tncWebsiteSchema,
    //   'websch'
    // );
    this._globalService.setJsonLdData(this.constant.tncLBSchema, 'lbSchema');
    this._globalService.setJsonLdData(this.constant.tncOrgSchema, 'orgSchema');
  }

  setCanonicalUrl() {
    this._globalService.removeCanonicalUrl();
    let urlData = {
      url: `https://magicshaircare.com/termsandcondition/`,
      title: 'Clear & Simple',
    };
    this._globalService.setCanonicalUrl(urlData);
  }
}
