import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, DoCheck, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { GlobalService } from '../services/global.service';
import { SharedModule } from '../services/shared.module';
import { HttpClient } from '@angular/common/http';
import { GlobalFunctions } from '../common/global-function';
import { CONSTANTS } from '../common/constants';
import { StickyHeaderComponent } from './sticky-header/sticky-header.component';
import { Meta } from '@angular/platform-browser';
import { ContentService } from './content.service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageComponent } from './language/language.component';
import { LoginComponent } from '../auth/login/login.component';
import { RegisterComponent } from '../auth/register/register.component';
import { OtpVeryficationComponent } from '../auth/otp-veryfication/otp-veryfication.component';
import { ForgetPinComponent } from '../auth/forget-pin/forget-pin.component';
import { CreateResetPinComponent } from '../auth/create-reset-pin/create-reset-pin.component';
import { LanguageTranslateService } from '../services/language-translate.service';
import { routes } from '../app.routes';
import { ForgotPinOtpVerifyComponent } from '../auth/forgot-pin-otp-verify/forgot-pin-otp-verify.component';
import { ForgotResetPinComponent } from "../auth/forgot-reset-pin/forgot-reset-pin.component";

// import { Link } from '@angular/platform-browser';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent, FooterComponent, SharedModule, StickyHeaderComponent, TranslateModule, LanguageComponent, LoginComponent, RegisterComponent, OtpVeryficationComponent, ForgetPinComponent, CreateResetPinComponent, ForgotPinOtpVerifyComponent, ForgotResetPinComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent implements OnInit, AfterViewInit {

  adsPagelistArray: any[] = [];
  constants: any = CONSTANTS;
  isLoading: boolean = false;
  // Predefined valid paths
  validPaths: string[] = [
    '/',
    '/benefits',
    '/aboutus',
    '/about-us',
    '/stories',
    '/stories/storydetail',
    '/shop',
    '/shop/productdetail',
    '/review/productreview',
    '/gallery',
    '/contactus',
    '/contact-us',
    '/wishlist',
    '/wish-list',
    '/cartlist',
    '/cart-list',
    '/checkout',
    '/subscription',
    '/renew/renewplan',
    '/renew/renew-plan',
    '/profile',
    '/profile/account',
    '/profile/order',
    '/profile/subscription',
    '/termsandcondition',
    '/terms-and-condition',
    '/support',
    '/privacypolicy',
    '/privacy-policy',
    '/orderdetail',
    '/plandetail',
    '/plan-detail',
  ];
  isBanner: boolean = false;
  isOpenLoginForm: boolean = false;
  isOpenForgetPinForm: boolean = false;
  isOpenRegisterForm: boolean = false;
  isOpenOtpVeryFicationForm: boolean = false;
  isOpenCreatePinForm: boolean = false;
  isChangeMail: boolean = false;
  isOpenForgotPinOtpVerifyForm: boolean = false;
  isOpenResetPinForm: boolean = false;

  constructor(
    private _toastr: ToastrService,
    private _globalService: GlobalService,
    private _httpClient: HttpClient,
    private _globalFunctions: GlobalFunctions,
    private _router: Router,
    private meta: Meta,
    private _contentService: ContentService,
    private _translateLanguage: LanguageTranslateService,
    // private linkService: Link
  ) {
    // setTimeout(() => {
    //   // $('.page-loader').fadeOut('slow');
    //   this.isLoading = false;
    // }, 1500);
    this.isLoading = false;
  }

  ngOnInit(): void {
    if (localStorage.getItem('accessToken')) {
      // Get all elements with the "banner" class
      const banners = document.querySelectorAll(".banner");

      // Loop through each element and remove the class
      banners.forEach(banner => {
        banner.classList.add("hidden");
      });
    }
    // this.isBanner = true;
    // setTimeout(() => {
    //   if(!localStorage.getItem('accessToken')){
    //     this.isBanner = true;
    //   }
    //   }, 5000);

    // if (typeof document !== 'undefined'){
    //   let navbar: any = document.getElementById('main_header');
    //   let navOffset = navbar?.offsetTop;
    //   window.addEventListener('scroll', () => {
    //     window.scrollY > navOffset
    //     ? navbar?.classList.add('fixed-header')
    //     : navbar?.classList.remove('fixed-header');
    //   });

    if (!localStorage.getItem('gbLang')) {
      localStorage.setItem('gbLang', 'true');
      //this.getLanguage();
      this.setAllRotueApi();
    }


    this._router.events.subscribe((evt: any) => {
      if (!(evt instanceof NavigationEnd)) {
        if (this.validPaths.includes(location.pathname)) {
          return; // Path is valid, allow navigation
        } else {
          // Invalid path, redirect to the default route
          this._router.navigate(['/']);
        }
      }
      window.scrollTo(0, 0)
    });
    // }

    // this.getAdsPageList();
    this._router.events.subscribe(event => {
      let route: ActivatedRoute = this._router.routerState.root;
      let routeTitle = '';
      while (route!.firstChild) {
        route = route.firstChild;
      }
      if (route.snapshot.data['title']) {
        routeTitle = route!.snapshot.data['title'];
      }
    });
    this.generateSitemap();
  }

  getAllRoutes(routes: any[], prefix: string = ''): string[] {
    let paths: string[] = [];
    routes.forEach(route => {
      const currentPath = route.path ? `${prefix}/${route.path}` : prefix;
      if (route.children && route.children.length > 0) {
        paths = paths.concat(this.getAllRoutes(route.children, currentPath));
      } else if (!route.redirectTo) {
        paths.push(currentPath.replace(/\/+/g, '/')); // Avoid multiple slashes
      }
    });
    return paths;
  }

  generateSitemap() {
    const baseUrl = 'https://magicshaircare.com'; // Replace with your domain
    const allRoutes = this.getAllRoutes(routes); // Call the helper function

    const today = new Date().toISOString();
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    allRoutes.forEach((route: any) => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}${route}</loc>\n`;
      sitemap += `    <lastmod>${today}</lastmod>\n`;
      sitemap += `    <changefreq>daily</changefreq>\n`;
      sitemap += `    <priority>0.8</priority>\n`;
      sitemap += `  </url>\n`;
    });

    sitemap += `</urlset>`;

    // Serve the sitemap as a downloadable file
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);

    // Automatically download the sitemap.xml
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'sitemap.xml';
    // a.click();
  }

  setAllRotueApi() {
    const allRouteObj = {
      routeslist: this.getAllRoutes(routes) || []
    }
    this._contentService.getAllRoute(allRouteObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
      } else {
        this._globalFunctions.successErrorHandling(result.Message, this, true);
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
    })
  }

  ngAfterViewInit(): void {

  }

  closeBanner() {
    this.isBanner = false;
    // Get all elements with the "banner" class
    const banners = document.querySelectorAll(".banner");

    // Loop through each element and remove the class
    banners.forEach(banner => {
      banner.classList.add("hidden");
    });
  }

  getLanguage() {
    this._contentService.getGlobalLanguage().subscribe((result: any) => {
      if (result && result.IsSuccess) {
        localStorage.setItem('lang', result?.Data?.language);
        this._translateLanguage.setLanguageCode(localStorage.getItem('lang'));
        location.reload();
      } else {
        this._globalFunctions.successErrorHandling(result.Message, this, true);
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
    })
  }

  getAdsPageList() {
    this._contentService.getAd().subscribe((result: any) => {
      if (result && result.IsSuccess) {
        result.Data.map((item: any) => {
          item?.advertisingpage.map((subItem: any) => {
            this.adsPagelistArray.push({
              mediatype: item?.mediatype,
              media: item?.media,
              title: subItem?.pageid?.title
            });
          });
        });
        this._globalService.adsPageList$.next(this.adsPagelistArray);
      } else {
        this._globalFunctions.successErrorHandling(result.Message, this, true);
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
    })
  }

  unknowUserlogIn(result: any) {
     if (result && result.IsSuccess) {
      this.isOpenLoginForm = false;
      if (result?.Data) {              // && !result?.Data.isotpsend
        this.isOpenOtpVeryFicationForm = true;
        // ? this.isOpenCreatePinForm = true;
      } else {
        this.isOpenOtpVeryFicationForm = true;
      }
    } else {
      this.isOpenLoginForm = false;
    }
    // ? this.isOpenLoginForm = false;
    //  this.isOpenForgetPinForm = false;
    // this.isOpenRegisterForm = false;
    // this.isOpenOtpVeryFicationForm = true;
    // if (event == false) {
    //   return;
    // ? };
    // this.redirectToPage(this.pageRoute);
  };

  isOpenForGetPinFormPopup(event: any) {
    if (event.isSuccess) {
      this.isOpenOtpVeryFicationForm = false;
      this.isOpenForgotPinOtpVerifyForm = false;
      this.isOpenLoginForm = false;
      this.isOpenForgetPinForm = true;
      if (event.isChangeMail) {
        this.isChangeMail = true
      };
    };
  };

  isOpenRegisterFormPopup(event: any) {
    if (event) {
      this.isOpenRegisterForm = true;
      this.isOpenLoginForm = false;
    }
  }

  isOpenLogInFormPopup(event: any) {
    if (event) {
      this.isOpenLoginForm = true;
      this.isOpenRegisterForm = false;
      this.isOpenForgetPinForm = false;
    }
  }

  unKnowUserRegister(result: any) {
    if (result && result.IsSuccess) {
      this.isOpenRegisterForm = false;
      if (result?.Data && !result?.Data.isotpsend) {           
        this.isOpenOtpVeryFicationForm = true;
        // ? this.isOpenCreatePinForm = true;
      } else {
        this.isOpenOtpVeryFicationForm = true;
      }
    } else {
      this.isOpenRegisterForm = false;
    }
  };

  unKnowUserVeryFiedOtp(event: any) {
    if (event) {
      this.isOpenOtpVeryFicationForm = false;
      // ? this.isOpenCreatePinForm = true;
    };
  };

  unKnowUserCreatePin(event: any) {
    if (event) {
      this.isOpenCreatePinForm = false;
      // this.isOpenLoginForm = true;
    }
    if (event == false) {
      // this.isOpenLoginForm = true;
    }
  }

  unKnowUserForgetPin(event: any) {
    if (event.isSuccess) {
      this.isOpenForgetPinForm = false;
      this.isOpenForgotPinOtpVerifyForm = true;
    };
  }

  unKnowUserForgotPinVeryFiedOtp(event: any) {
    if (event) {
      this.isOpenForgotPinOtpVerifyForm = false;
      // ? this.isOpenResetPinForm = true;
    };
  };

  isOpenForGetPinViaOtpFormPopup(event: any) {
    if (event.isSuccess) {
      this.isOpenForgotPinOtpVerifyForm = false;
      this.isOpenOtpVeryFicationForm = false;
      this.isOpenLoginForm = false;
      this.isOpenForgetPinForm = true;
      if (event.isChangeMail) {
        this.isChangeMail = true
      };
    };
  };

  unKnowUseResetPin(event: any) {
    if (event) {
      this.isOpenResetPinForm = false;
      // this.isOpenLoginForm = true;
    }
  }

}
