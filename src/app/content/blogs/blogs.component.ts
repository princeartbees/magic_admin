import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';
import { CONSTANTS } from '../../common/constants';
import { BlogsService } from './blogs.service';
import { Router, RouterModule } from '@angular/router';
import { LoginComponent } from '../../auth/login/login.component';
import { GlobalFunctions } from '../../common/global-function';
import Swal from 'sweetalert2';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorModule } from 'primeng/paginator';
import { RegisterComponent } from '../../auth/register/register.component';
import { OtpVeryficationComponent } from '../../auth/otp-veryfication/otp-veryfication.component';
import { CreateResetPinComponent } from '../../auth/create-reset-pin/create-reset-pin.component';
import { ForgetPinComponent } from '../../auth/forget-pin/forget-pin.component';
import { RegisterPopupComponent } from '../../auth/register-popup/register-popup.component';
import { TranslateModule } from '@ngx-translate/core';
import { ForgotPinOtpVerifyComponent } from '../../auth/forgot-pin-otp-verify/forgot-pin-otp-verify.component';
import { ForgotResetPinComponent } from '../../auth/forgot-reset-pin/forgot-reset-pin.component';

declare var $:any;

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatPaginatorModule,
    PaginatorModule,
    LoginComponent,
    RegisterComponent,
    OtpVeryficationComponent,
    CreateResetPinComponent,
    ForgetPinComponent,
    RegisterPopupComponent,
    TranslateModule,
    ForgotPinOtpVerifyComponent,
    ForgotResetPinComponent
  ],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss'
})
export class BlogsComponent implements OnInit{

  storiesList:any;
  constants:any = CONSTANTS;
  totalStoryCount:number = 0;
  isStoryloading:boolean = false;
  selectedStoryId:any;
  pageNo: any;
  limit: any = 6;
  paginationEvent:any;
  
  isOpenLoginForm: boolean = false;
  isOpenRegisterForm: boolean = false;
  isOpenOtpVeryFicationForm: boolean = false;
  isOpenCreatePinForm: boolean = false;
  isOpenForgetPinForm: boolean = false;
  isChangeMail:boolean = false;
  isOpenForgotPinOtpVerifyForm: boolean = false;
  isOpenResetPinForm: boolean = false;

  constructor(
    private _globalService:GlobalService,
    private _blogService:BlogsService,
    private _globalFunctions:GlobalFunctions,
    private _router:Router
  ){
    $('.page-loader').fadeIn('fast');
    setTimeout(() => {
      $('.page-loader').fadeOut('slow');
    }, 1500);
  }

  ngOnInit(): void {
    this._globalService.setMetaTags(this.constants.blogPageMetaTag)
    this._globalService.setOpenGraphTags(this.constants.blogPageMetaOgTag);
    this._globalService.setTwitterCardTags(this.constants.blogPageMetaTwitterTag);
    this._globalService.setJsonLdData(this.constants.storyBreadcrum,"bc");
    //this._globalService.setJsonLdData(this.constants.storyWebsiteSchema,"websch");
    this._globalService.setJsonLdData(this.constants.storyLBSchema,"lbSchema");
    this._globalService.setJsonLdData(this.constants.storiesOrgSchema, 'orgSchema');
    this.getStoriesList();
    this.setCanonicalUrl();
  };  

  setCanonicalUrl() {
    this._globalService.removeCanonicalUrl();
    
    let urlData = {
      url:`https://magicshaircare.com/stories`,
      title:"The Evolution of Magics Hair Care's Natural Products." // Tips & Tricks
    };
    this._globalService.setCanonicalUrl(urlData);
  }

  getStoriesList(event:any = ''){
    this.isStoryloading = true;
    this.paginationEvent = event;
    this.pageNo = this.paginationEvent?.page ? (this.paginationEvent.page + 1) : 1;
    this.limit = this.paginationEvent.rows || 9;
    let data = {
      page: this.pageNo,
      limit: this.limit,
      // language: localStorage.getItem("lang") || "english"
    };
    this._blogService.getBlogsList(data).subscribe((result:any)=>{
      if(result && result.IsSuccess){
        this.isStoryloading = false;
        result?.Data.docs.map((item: any) => {
          item.title = item.en_title; 
          item.brief = item.en_brief;
          item.author = item.en_author;
          // if (localStorage.getItem("lang") == "hindi") {
          //   item.title = item.hi_title; 
          //   item.brief = item.hi_brief;
          //   item.author = item.hi_author;
          // }
          // else if (localStorage.getItem("lang") == "marathi") {
          //   item.title = item.mr_title; 
          //   item.brief = item.mr_brief;
          //   item.author = item.mr_author;
          // }
          // else if (localStorage.getItem("lang") == "gujarati") {
          //   item.title = item.gu_title; 
          //   item.brief = item.gu_brief;
          //   item.author = item.gu_author;
          // }else{
          //   item.title = item.en_title; 
          //   item.brief = item.en_brief;
          //   item.author = item.en_author;
          // }
        });
        this._globalService.stories$.next(result);
        this.totalStoryCount = result?.Data?.totalDocs;
        this.storiesList = result?.Data?.docs;
      } else {
        this.isStoryloading = false;
        this._globalFunctions.successErrorHandling(result.Message,this,true);
      }
    },(error:any)=>{
      this.isStoryloading = false;
      this._globalFunctions.errorHanding(error,this,true);
    })
  }

  checkLogin(event:any,story:any){
    event.stopPropagation();
    this.selectedStoryId = story?._id
    if(typeof window != 'undefined' && localStorage.getItem('accessToken')){
      this.likeStory(this.selectedStoryId);
    } else {
      this.isOpenLoginForm = true;
    }
  }

  likeStory(storyId:any){
    if(typeof window != 'undefined' && localStorage.getItem('accessToken')){
      this._blogService.addEditlikeStory({storyid:storyId}).subscribe((result:any)=>{
        if(result && result.IsSuccess){
          this.isStoryloading = true;
          this.getStoriesList(this.paginationEvent);    
          Swal.fire({
            position: "center",
            icon: "success",
            title: result?.Message,
            showConfirmButton: false,
            timer: 2000,
            width: '400px'
          });
        } else {
          this._globalFunctions.successErrorHandling(result?.Message,this,true);
        }
      },(error:any)=>{
        this._globalFunctions.errorHanding(error,this,true);
      })
    } else {
      this.isOpenLoginForm = true;
    }
  };

  disLikeStory(event:any,story:any){
    event.stopPropagation();
    if(story.isLike && !story.isDisLike){
      story.isLike = false;
      story.isDisLike = true;
    } else if(story.isLike && story.isDisLike){
      story.isDisLike = false;
    } else {
      story.isDisLike = !story.isDisLike;
    }
  }


  getStoriesDetails(storyid:any,storytag:any){
    this._router.navigate(['/stories/storydetail',storytag]);
    localStorage.setItem('STID', window.btoa(storyid));
  }

  // unknowUserlogIn(event:any){
  //   if(event){
  //     this.likeStory(this.selectedStoryId);
  //     this.isOpenLoginForm = false;
  //   } else {
  //     this.isOpenLoginForm = false;
  //   }
  // }

  unknowUserlogIn(result: any) {
    // this.isOpenLoginForm = false;
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
    if(event){
      this.likeStory(this.selectedStoryId);
    };
  };

  isOpenRegisterFormPopup(event:any){
    if(event){
      this.isOpenRegisterForm = true;
      this.isOpenLoginForm = false;
    }
  }
  unKnowUserRegister(result: any) {
    if(result && result.IsSuccess){
      this.isOpenRegisterForm = false;
      if(result?.Data){      // && !result?.Data.isotpsend
        this.isOpenOtpVeryFicationForm = true;
      } else {
        this.isOpenOtpVeryFicationForm = true;
      }
    } else {      
      this.isOpenRegisterForm = false;
    }
  };

  isOpenLogInFormPopup(event:any){
    if(event){
      this.isOpenLoginForm = true;
      this.isOpenRegisterForm = false;
      this.isOpenForgetPinForm = false;
    }
  }

  unKnowUserVeryFiedOtp(event:any){
    if(event){
      this.isOpenOtpVeryFicationForm = false;
      // this.isOpenCreatePinForm = true;
    };
  };

  isOpenForGetPinFormPopup(event:any){
    if(event.isSuccess){
      this.isOpenOtpVeryFicationForm = false;
      this.isOpenLoginForm = false;
      this.isOpenForgetPinForm = true;
      if(event.isChangeMail){
        this.isChangeMail = true
      };
    };
  };

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
}
