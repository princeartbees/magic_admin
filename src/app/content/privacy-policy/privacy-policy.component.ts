import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from '../../common/constants';
import { CommonModule } from '@angular/common';
import { PRIVACY_POLICY } from '../../common/privacy-policy';
import { RouterModule } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { TranslateModule } from '@ngx-translate/core';
declare var $:any;

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule,RouterModule,TranslateModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent implements OnInit{

  constant:any = CONSTANTS;
  privacy_policy:any = PRIVACY_POLICY;

  constructor(private _globalService:GlobalService,){
    $('.page-loader').fadeIn('fast');
    setTimeout(() => {
      $('.page-loader').fadeOut('slow');
    }, 1500);
  }

  ngOnInit(): void {
    this.setCanonicalUrl();
    this._globalService.setMetaTags(this.constant.privacyPageMetaTag);
    this._globalService.setOpenGraphTags(this.constant.privacyPageMetaOgTag);
    this._globalService.setTwitterCardTags(
      this.constant.privacyPageMetaTwitterTag
    );
    this._globalService.setJsonLdData(this.constant.privacyBreadcrum, 'bc');
    // this._globalService.setJsonLdData(
    //   this.constant.privacyWebsiteSchema,
    //   'websch'
    // );
    this._globalService.setJsonLdData(this.constant.privacyLBSchema, 'lbSchema');
    this._globalService.setJsonLdData(this.constant.privacyOrgSchema, 'orgSchema');
  }

  setCanonicalUrl() {
    this._globalService.removeCanonicalUrl();
    let urlData = {
      url: `https://magicshaircare.com/privacypolicy/`,
      title: 'Your Data, Your Trust',
    };
    this._globalService.setCanonicalUrl(urlData);
  }
}
