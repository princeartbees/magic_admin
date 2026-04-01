import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { GlobalFunctions } from '../../../common/global-function';
import { BlogsService } from '../blogs.service';
import { GlobalService } from '../../../services/global.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CONSTANTS } from '../../../common/constants';
import { CommonModule, DOCUMENT } from '@angular/common';
import Swal from 'sweetalert2';
import { LoginComponent } from '../../../auth/login/login.component';
import { RegisterComponent } from '../../../auth/register/register.component';
import { CreateResetPinComponent } from '../../../auth/create-reset-pin/create-reset-pin.component';
import { OtpVeryficationComponent } from '../../../auth/otp-veryfication/otp-veryfication.component';
import { ForgetPinComponent } from '../../../auth/forget-pin/forget-pin.component';
import { TranslateModule } from '@ngx-translate/core';
import { ShopService } from '../../shop/shop.service';
import { ForgotPinOtpVerifyComponent } from '../../../auth/forgot-pin-otp-verify/forgot-pin-otp-verify.component';
import { ForgotResetPinComponent } from '../../../auth/forgot-reset-pin/forgot-reset-pin.component';
declare var $: any;

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginComponent, RegisterComponent, CreateResetPinComponent, OtpVeryficationComponent, ForgetPinComponent, TranslateModule, ForgotPinOtpVerifyComponent, ForgotResetPinComponent],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.scss'
})
export class BlogDetailsComponent implements OnInit, OnDestroy {

  blogDetails: any;
  blogId: any;
  blogSlug: any;
  blogList: any = [];
  constants: any = CONSTANTS;
  content: any;
  selectedStoryId: any;
  isOpenLoginForm: boolean = false;
  isOpenOtpVeryFicationForm: boolean = false;
  isChangeMail: boolean = false;
  isOpenForgetPinForm: boolean = false;
  isOpenRegisterForm: boolean = false;
  isOpenCreatePinForm: boolean = false;
  isOpenForgotPinOtpVerifyForm: boolean = false;
  isOpenResetPinForm: boolean = false;
  isFromQuery: boolean = false;
  storyTag: any;
  recommendateData: any;

  constructor(
    private _globalFunctions: GlobalFunctions,
    private _blogService: BlogsService,
    private _globalService: GlobalService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _shopService: ShopService,

    @Inject(DOCUMENT) private _document: Document
  ) {
    $('.page-loader').fadeIn('fast');
    setTimeout(() => {
      $('.page-loader').fadeOut('slow');
    }, 1500);
  }

  ngOnInit(): void {
    window.addEventListener("popstate", function (event) {
      window.location.href = window.location.origin + "/stories"
    });
    this.blogId = this._activatedRoute.snapshot.paramMap.get('storyid');
    this.storyTag = this._activatedRoute.snapshot.paramMap.get('storytag');
    // if(typeof window != 'undefined' && localStorage.getItem('STID') != null){
    //   this.blogId = window.atob(localStorage.getItem('STID')!);
    //   this.getSingleBlogDetails(this.blogId);
    // }else {
    //   this._router.navigate(['/stories']);
    // }

    this._activatedRoute.queryParams.subscribe(params => {
      this.blogId = params['STID'] || window.atob(localStorage.getItem('STID')!);
      this.blogSlug = params['SLUG'] || window.atob(localStorage.getItem('STSLUG')!);
      if (this.blogId || this.blogSlug) {
        localStorage.setItem("STID", window.btoa(this.blogId));
        localStorage.setItem("STSLUG", window.btoa(this.blogSlug));
        this.isFromQuery = true;
      }
    });
    if (typeof window != 'undefined' && localStorage.getItem('STID') != null || typeof window != 'undefined' && localStorage.getItem('STSLUG') != null) {
      this.blogId = window.atob(localStorage.getItem('STID')!);
      this.blogSlug = window.atob(localStorage.getItem('STSLUG')!);
    }
    if (this.isFromQuery) {
      this._activatedRoute.queryParams.subscribe(params => {
        this.blogId = params['STID'] || window.atob(localStorage.getItem('STID')!);
        this.blogSlug = params['SLUG'] || window.atob(localStorage.getItem('STSLUG')!);
        localStorage.setItem("STID", window.btoa(this.blogId));
        localStorage.setItem("STSLUG", window.btoa(this.blogSlug));
      });
    }
    if (this._activatedRoute.snapshot.paramMap.get('storytag')) {
      this.blogId = "";
      this.blogSlug = this.storyTag;
    }
    else {
      this._router.navigate(['/stories']);
    }
    this.getSingleBlogDetails(this.blogId);
    this.getSingleVariant();
  }


  ngOnDestroy(): void {
    localStorage.removeItem('STID');
    localStorage.removeItem('STSLUG');
  }

  getSingleVariant() {
    if (typeof window != 'undefined' && localStorage.getItem('PDID')) {
      localStorage.removeItem('PDID');
    };

    let obj = {
      language: localStorage.getItem("lang") || "english"
    }
    let isLogin: any;
    if (typeof window != 'undefined') {
      isLogin = localStorage.getItem('accessToken') ? true : false;
    }
    this._shopService.getSingleProduct(obj, isLogin).subscribe((result: any) => {
      if (result && result?.Data?._id) {
        if (localStorage.getItem("lang") == "hindi") {
          result.Data.productId.product_name = result.Data.productId.hi_product_name; 
        }
        else if (localStorage.getItem("lang") == "marathi") {
          result.Data.productId.product_name = result.Data.productId.mr_product_name; 
        }
        else if (localStorage.getItem("lang") == "gujarati") {
          result.Data.productId.product_name = result.Data.productId.gu_product_name; 
        }else{
          result.Data.productId.product_name = result.Data.productId.en_product_name; 
        }
        this.recommendateData = result?.Data;
        localStorage.setItem('PDID', window.btoa(result?.Data?._id));
        // this._router.navigate(['/shop/productdetail',result?.Data?.search_tag]);
        //window.location.href = window.location.origin + "/shop/productdetail";
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result.Message
        });
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
    })
  }

  redirectToProductDTLPage(search_tag: any) {
    window.location.href = window.location.origin + "/shop/productdetail/" + search_tag;
  }


  getSingleBlogDetails(blogId: any) {
    const blogObj = {
      storyid: blogId,
      slug: this.blogSlug,
      // language: localStorage.getItem("lang") || "english"
    }
    this._blogService.getSingleBlog(blogObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        result.Data.title = result.Data.en_title;
        result.Data.brief = result.Data.en_brief;
        result.Data.author = result.Data.en_author;
        result.Data.content = result.Data.en_content;
        // if (localStorage.getItem("lang") == "hindi") {
        //   result.Data.title = result.Data.hi_title; 
        //   result.Data.brief = result.Data.hi_brief;
        //   result.Data.author = result.Data.hi_author;
        //   result.Data.content = result.Data.hi_content;
        // }
        // else if (localStorage.getItem("lang") == "marathi") {
        //   result.Data.title = result.Data.mr_title; 
        //   result.Data.brief = result.Data.mr_brief;
        //   result.Data.author = result.Data.mr_author;
        //   result.Data.content = result.Data.mr_content;
        // }
        // else if (localStorage.getItem("lang") == "gujarati") {
        //   result.Data.title = result.Data.gu_title; 
        //   result.Data.brief = result.Data.gu_brief;
        //   result.Data.author = result.Data.gu_author;
        //   result.Data.content = result.Data.gu_content;
        // }
        // else{
        //   result.Data.title = result.Data.en_title; 
        //   result.Data.brief = result.Data.en_brief;
        //   result.Data.author = result.Data.en_author;
        //   result.Data.content = result.Data.en_content;
        // }
        this.blogDetails = result.Data;
        this.content = result.Data.content;
        const contentElement = document.getElementById("content_text");
        if (contentElement) {
          contentElement.innerHTML = this.content;
        }
        let tempBlogList: any = [];
        this._globalService.stories$.subscribe((result: any) => {
          result?.Data?.docs.map((i:any)=>{
            i.title = i.en_title; 
                i.brief = i.en_brief;
                i.author = i.en_author;
                i.content = i.en_content;
          //   if (localStorage.getItem("lang") == "hindi") {
          //     i.title = i.hi_title; 
          //     i.brief = i.hi_brief;
          //     i.author = i.hi_author;
          //     i.content = i.hi_content;
          //   }
          //   else if (localStorage.getItem("lang") == "marathi") {
          //     i.title = i.mr_title; 
          //     i.brief = i.mr_brief;
          //     i.author = i.mr_author;
          //     i.content = i.mr_content;
          //   }
          //   else if (localStorage.getItem("lang") == "gujarati") {
          //     i.title = i.gu_title; 
          //     i.brief = i.gu_brief;
          //     i.author = i.gu_author;
          //     i.content = i.gu_content;
          //   }else{
          //     i.title = i.en_title; 
          //     i.brief = i.en_brief;
          //     i.author = i.en_author;
          //     i.content = i.en_content;
          //   }
          });

          tempBlogList = result?.Data?.docs.filter((item: any) => item._id != this.blogDetails._id);
          if (tempBlogList?.length > 0) {
            tempBlogList.map((item: any, index: number) => {
              if (index < 5)
                this.blogList.push(item)
            })
          }
        });

        //SEO Changes Add
        let metaTag: any = this.constants.blogPageMetaTag;
        metaTag.title = result?.Data?.seo_title;
        metaTag.description = result?.Data?.seo_description;

        let blogPageMetaOgTag: any = this.constants.blogPageMetaOgTag;
        blogPageMetaOgTag["og:title"] = result?.Data?.seo_title;
        blogPageMetaOgTag["og:description"] = result?.Data?.seo_description;
        blogPageMetaOgTag["og:url"] = `https://magicshaircare.com/stories/storydetail/` + result?.Data?.search_tag;

        let blogPageMetaTwitterTag: any = this.constants.blogPageMetaTwitterTag;
        blogPageMetaTwitterTag["twitter:title"] = result?.Data?.seo_title;
        blogPageMetaTwitterTag["twitter:description"] = result?.Data?.seo_description;
        blogPageMetaTwitterTag["twitter:site"] = `https://magicshaircare.com/stories/storydetail/` + result?.Data?.search_tag;

        let blogBreadcrum: any = this.constants.storyBreadcrum;
        blogBreadcrum.itemListElement[1].item = `https://magicshaircare.com/stories/storydetail/` + result?.Data?.search_tag;

        let blogLBSchema: any = this.constants.storyLBSchema;
        blogLBSchema.url = `https://magicshaircare.com/stories/storydetail/` + result?.Data?.search_tag;

        let blogOrgSchema: any = this.constants.storiesOrgSchema;
        blogOrgSchema.url = `https://magicshaircare.com/stories/storydetail/` + result?.Data?.search_tag;

        this._globalService.setMetaTags(metaTag);
        this._globalService.setOpenGraphTags(blogPageMetaOgTag);
        this._globalService.setTwitterCardTags(blogPageMetaTwitterTag);
        this._globalService.setJsonLdData(blogBreadcrum, "bc");
        //this._globalService.setJsonLdData(this.constants.storyWebsiteSchema,"websch");
        this._globalService.setJsonLdData(blogLBSchema, "lbSchema");
        this._globalService.setJsonLdData(blogOrgSchema, 'orgSchema');
        this.setCanonicalUrl(result?.Data?.search_tag, result?.Data?.seo_title);
      } else {
        //this._router.navigate(['/stories']);
        window.location.href = window.location.origin + "/stories";
        this._globalFunctions.successErrorHandling(result.Message, this, true);
      }
    }, (error: any) => {
      //this._router.navigate(['/stories']);
      localStorage.removeItem("STID");
      localStorage.removeItem("STSLUG");
      window.location.href = window.location.origin + "/stories";
      this._globalFunctions.errorHanding(error, this, true);
    });
  };

  setCanonicalUrl(search_tag: any, title: any) {
    this._globalService.removeCanonicalUrl();

    let urlData = {
      url: `https://magicshaircare.com/stories/storydetail/` + search_tag,
      title: title
    };
    this._globalService.setCanonicalUrl(urlData);
  }

  getStoriesDetails(storyid: any, search_tag: any) {
    localStorage.setItem('STID', window.btoa(storyid));
    //this.getSingleBlogDetails(storyid);
    //this._router.navigate(['/stories/storydetail']);
    window.location.href = window.location.origin + "/stories/storydetail/" + search_tag
  }

  checkLogin(event: any, story: any) {
    event.stopPropagation();
    this.selectedStoryId = story?._id
    if (typeof window != 'undefined' && localStorage.getItem('accessToken')) {
      this.likeStory(this.selectedStoryId);
    } else {
      this.isOpenLoginForm = true;
    }
  }

  likeStory(blogId: any) {
    if (typeof window != 'undefined' && localStorage.getItem('accessToken')) {
      this._blogService.addEditlikeStory({ storyid: blogId }).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.getSingleBlogDetails(this.blogId);
          this._globalService.storiesPagination$.next(null);
          Swal.fire({
            position: "center",
            icon: "success",
            title: result?.Message,
            showConfirmButton: false,
            timer: 2000,
            width: '400px'
          });
        } else {
          this._globalFunctions.successErrorHandling(result?.Message, this, true);
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
      })
    } else {
      this.isOpenLoginForm = false;
    }
  };

  disLikeStory(event: any, story: any) {
    event.stopPropagation();
    if (story.isLike && !story.isDisLike) {
      story.isLike = false;
      story.isDisLike = true;
    } else if (story.isLike && story.isDisLike) {
      story.isDisLike = false;
    } else {
      story.isDisLike = !story.isDisLike;
    }
  }

  unknowUserlogIn(result: any) {
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
    if (result) {
      this.likeStory(this.selectedStoryId);
      // this.getSingleBlogDetails(this.blogId);  
      // this._globalService.storiesPagination$.next(null);
      this.isOpenLoginForm = false;
    } else {
      this.isOpenLoginForm = false;
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

  isOpenForGetPinFormPopup(event: any) {
    if (event.isSuccess) {
      this.isOpenOtpVeryFicationForm = false;
      this.isOpenLoginForm = false;
      this.isOpenForgetPinForm = true;
      if (event.isChangeMail) {
        this.isChangeMail = true;
      }
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
    this.isOpenOtpVeryFicationForm = false;
    if (event) {
      this.isOpenCreatePinForm = true;
    }
  }

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

  redirectToSpecificPage(page: any) {
    window.location.href = window.location.origin + "/" + page
  }
}
