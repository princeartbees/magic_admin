import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { CONSTANTS } from '../../common/constants';
import { TranslateModule } from '@ngx-translate/core';
declare var Swiper: any;
declare var $:any;

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [RouterModule,TranslateModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent implements OnInit{
  constants:any = CONSTANTS
constructor(private _globalService:GlobalService){
  $('.page-loader').fadeIn('fast');
    setTimeout(() => {
      $('.page-loader').fadeOut('slow');
    }, 1500);
}

  ngOnInit(): void {
    this._globalService.setMetaTags(this.constants.aboutUsPageMetaTag);
    this._globalService.setOpenGraphTags(this.constants.aboutUsPageMetaOgTag);
    this._globalService.setTwitterCardTags(this.constants.aboutUsPageMetaTwitterTag);
    this._globalService.setJsonLdData(this.constants.aboutusBreadcrum,"bc");
    //this._globalService.setJsonLdData(this.constants.aboutusWebsiteSchema,"websch");
    this._globalService.setJsonLdData(this.constants.aboutusLBSchema,"lbSchema");
    this._globalService.setJsonLdData(this.constants.aboutusOrgSchema, 'orgSchema');
    var Swipes = new Swiper('.voice-satisfaction', {
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
        }
      },
    });
    this.setCanonicalUrl();
  } 
  

  setCanonicalUrl() {
    this._globalService.removeCanonicalUrl();
    let urlData = {
      url:`https://magicshaircare.com/aboutus`,
      title:'Pure Natural & Ayurvedic Powder Mix Hair Care Product'
    };
    this._globalService.setCanonicalUrl(urlData);
  }
}
