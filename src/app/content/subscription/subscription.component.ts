import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SubscriptionService } from './subscription.service';
import { GlobalFunctions } from '../../common/global-function';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { CONSTANTS } from '../../common/constants';
import { GlobalService } from '../../services/global.service';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { AddEditAddressComponent } from '../add-edit-address/add-edit-address.component';
import { LoginComponent } from '../../auth/login/login.component';
import { AddressService } from '../add-edit-address/address.service';
import Swal from 'sweetalert2';
import { RegisterComponent } from '../../auth/register/register.component';
import { OtpVeryficationComponent } from '../../auth/otp-veryfication/otp-veryfication.component';
import { CreateResetPinComponent } from '../../auth/create-reset-pin/create-reset-pin.component';
import { ForgetPinComponent } from '../../auth/forget-pin/forget-pin.component';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { ForgotPinOtpVerifyComponent } from '../../auth/forgot-pin-otp-verify/forgot-pin-otp-verify.component';
import { ForgotResetPinComponent } from '../../auth/forgot-reset-pin/forgot-reset-pin.component';

declare var $:any;

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [TranslateModule,CommonModule,RouterModule,MatStepperModule,MatRadioModule,FormsModule,AddEditAddressComponent,LoginComponent,RegisterComponent,OtpVeryficationComponent,CreateResetPinComponent,ForgetPinComponent, ForgotPinOtpVerifyComponent, ForgotResetPinComponent],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent implements OnInit,AfterViewInit{

  planList:any;
  getOnePlan:any;
  isLoading:boolean = false;
  isAddEditAddressLoading:boolean = false;
  isSinglePalnLoading:boolean = false;
  isOpenLoginForm:boolean = false;
  isAddEditAddress:boolean = false;
  selectedAddress:any;
  selectedAddressId:any;
  constants:any = CONSTANTS;
  addressDetails:any = [];
  placedOrderDataForPlan:any;
  selectedStepperIndex:Number = 0;
  isNextPage:boolean = false;
  renewId:any;
  isOpenOtpVeryFicationForm: boolean = false;
  isChangeMail: boolean = false;
  isOpenForgetPinForm:boolean = false;
  isOpenRegisterForm: boolean = false;
  isOpenCreatePinForm: boolean = false;
  isOpenForgotPinOtpVerifyForm: boolean = false;
  isOpenResetPinForm: boolean = false;
  @ViewChild('stepper') matStepper!:MatStepper;
  
  constructor(
    private _router:Router,
    private _subscriptionService:SubscriptionService,
    private _globalFunctions:GlobalFunctions,
    private _toastr:ToastrService,
    private _globalService:GlobalService,
    private _addressService:AddressService,
    private _activatedRoute:ActivatedRoute,
    private http:HttpClient
  ){
    $('.page-loader').fadeIn('fast');
    setTimeout(() => {
      $('.page-loader').fadeOut('slow');
    }, 1500);
  }

  ngOnInit(): void {
    this._globalService.setMetaTags(this.constants.subscriptionPageMetaTag);
    this._globalService.setOpenGraphTags(this.constants.subscriptionPageMetaOgTag);
    this._globalService.setTwitterCardTags(this.constants.subscriptionPageMetaTwitterTag);
    this._globalService.setJsonLdData(this.constants.subscriptionBreadcrum,"bc");
    //this._globalService.setJsonLdData(this.constants.subscriptionWebsiteSchema,"websch");
    this._globalService.setJsonLdData(this.constants.subscriptionLBSchema,"lbSchema");
    this._globalService.setJsonLdData(this.constants.subscriptionOrgSchema, 'orgSchema');
    this.selectedStepperIndex = 0;   
    this.getPlanList();
    this._globalService.addressListData$.subscribe((result:any)=>{
      if(result){
        this.addressDetails = result?.Data?.docs;
        result?.Data?.docs.map((item:any)=>{
          if(item?.select){
            this.selectedAddressId = item?._id
          }
        })
      }
    });
    this.setCanonicalUrl();
  }  

  formatDuration(duration:any) {
    // Use a regular expression to separate the number and the unit
    const match = duration.match(/^(\d+)([a-zA-Z]+)$/);
    if (match) {
        const number = match[1];
        const unit = match[2];
        // Capitalize the first letter of the unit and add a space
        const formattedUnit = unit.charAt(0).toUpperCase() + unit.slice(1).toLowerCase();
        return `${number} ${formattedUnit}`;
    }
    // Return the original string if it doesn't match the expected format
    return duration;
  }

  setCanonicalUrl() {
    this._globalService.removeCanonicalUrl();
    let urlData = {
      url:`https://magicshaircare.com/subscription`,
      title:'Commit to Healthy Hair | Explore Our Plans | Msgics Hair Care' // Expert Crafted Plans
    };
    this._globalService.setCanonicalUrl(urlData);
  }

  ngAfterViewInit(): void {
    if(typeof window != 'undefined' && localStorage.getItem('PLANID') != null){
      this.renewId = window.atob(localStorage.getItem('PLANID')!);
      this.matStepper.next();
    }
    // if(this._activatedRoute.snapshot.paramMap.get('renewId') &&  this._activatedRoute.snapshot.paramMap.get('renewId') != null){
    //   // this.selectedStepperIndex = 1;
    //   this.matStepper.next();
    // }
  }

  getPlanList(){
    this.isLoading = true;
    let planObj = {
      language: localStorage.getItem("lang") || "english"
    }
    this._subscriptionService.getSubscriptionPlanlist(planObj).subscribe((result:any)=>{
      if(result && result.IsSuccess){
        this.isLoading = false;
        result.Data?.map((item:any)=>{
          if (localStorage.getItem("lang") == "hindi") {
            item.planname = item.hi_planname; 
            item.description = item.hi_description;
           item.planbenefits.map((i:any)=>{
            i.benefits = i.hi_benefits;
           });
          }
          else if (localStorage.getItem("lang") == "marathi") {
            item.planname = item.mr_planname; 
            item.description = item.mr_description;
           item.planbenefits.map((i:any)=>{
            i.benefits = i.mr_benefits;
           });
          }
          else if (localStorage.getItem("lang") == "gujarati") {
            item.planname = item.gu_planname; 
            item.description = item.gu_description;
           item.planbenefits.map((i:any)=>{
            i.benefits = i.gu_benefits;
           });
          }else{
            item.planname = item.en_planname; 
            item.description = item.en_description;
           item.planbenefits.map((i:any)=>{
            i.benefits = i.en_benefits;
           });
          }
        })
        this.planList = result.Data;
        if(this.renewId &&  this.renewId != null){
          result.Data?.map((item:any)=>{
            if (localStorage.getItem("lang") == "hindi") {
              item.planname = item.hi_planname; 
              item.description = item.hi_description;
             item.planbenefits.map((i:any)=>{
              i.benefits = i.hi_benefits;
             });
            }
            else if (localStorage.getItem("lang") == "marathi") {
              item.planname = item.mr_planname; 
              item.description = item.mr_description;
             item.planbenefits.map((i:any)=>{
              i.benefits = i.mr_benefits;
             });
            }
            else if (localStorage.getItem("lang") == "gujarati") {
              item.planname = item.gu_planname; 
              item.description = item.gu_description;
             item.planbenefits.map((i:any)=>{
              i.benefits = i.gu_benefits;
             });
            }else{
              item.planname = item.en_planname; 
              item.description = item.en_description;
             item.planbenefits.map((i:any)=>{
              i.benefits = i.en_benefits;
             });
            }


            if(item?._id === this.renewId){
              this.createPlanCartDetails(item);
            }
          })
        }
      } else {
        this.isLoading = false;
        this._globalFunctions.successErrorHandling(result.Message,this,true);
      }
    },(error:any)=>{
      this.isLoading = false;
      this._globalFunctions.errorHanding(error,this,true);
    })
  }

  selectAddressChange(event:any){
    this.selectedAddressId = event?.value;
    this._addressService.selectAddress({addressid: this.selectedAddressId}).subscribe((result:any) => {
      if(result && result.IsSuccess){
        this._globalService.addressListDataPagination$.next(null);
        // this._toastr.clear();
        // this._toastr.success(result.Message, 'Success');
        Swal.fire({
          position: "center",
          icon: "success",
          title: result.Message,
          showConfirmButton: false,
          timer: 2000,
          width: '400px'
        });
      }else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
    })
  }

  addressAddEdit(event:any){
    this.isAddEditAddress = false;
  }

  editAddress(addressObj:any,event:any = ''){
    event.preventDefault();
    this.isAddEditAddressLoading = true;
    this.isAddEditAddress = false;
    setTimeout(() => {
      this.selectedAddress = addressObj;
      this.isAddEditAddress = true;
      this.isAddEditAddressLoading = false;
    }, 500);
  }

  cancelPlanBuy(stepper:MatStepper){
    stepper.previous();
  }

  placeOrder(stepper:MatStepper,plan:any){
    if(typeof window != undefined && localStorage.getItem('accessToken')){
      stepper.next();
      this.createPlanCartDetails(plan);
    } else  {
      // this._toastr.clear();
      // this._toastr.error('Please Login,after buy plan','Error');
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Kindly login to purchase a plan.',
      });
      setTimeout(() => {
        this.isOpenLoginForm = true;
        this.createPlanCartDetails(plan);
      }, 2000);
    }
  }  

  unknowUserlogIn(result:any){
    if(result){
      this.matStepper.next();
    }
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
  }

  createPlanCartDetails(plan:any){
    this.getOnePlan = plan;
  }

  createPayment(stepper:MatStepper,plan:any){
    if(typeof window != undefined && localStorage.getItem('accessToken')){
       // Step 1: Create Razorpay order directly from Angular
    const orderData = {
      amount: Number(plan?.discounted_inr_amount ? (plan?.discounted_inr_amount * 100) : (plan.discounted_usd_amount * 100 * 80)).toFixed(2), // amount in smallest currency unit
      currency: plan?.discounted_inr_amount ? 'INR' : 'USD',
      receipt: 'receipt#1',
    };

      this._subscriptionService.createPaymentOrder(orderData).subscribe((order: any) => {
        const orderId = order?.Data?.id;
      let options:any = {
        key: this.constants.razorpayKeyId,
        amount: Number(plan?.discounted_inr_amount ? (plan?.discounted_inr_amount * 100) : (plan.discounted_usd_amount * 100 * 80)).toFixed(2),
        currency: plan?.discounted_inr_amount ? 'INR' : 'USD',
        name: "Magics Hair Care",
        description: "dummy data",
        method: "",
        image: `https://magicshaircare.com/assets/images/Logo2.webp`,
        order_id: orderId, // Pass the generated order_id
        modal: {
          "escape": false
        },
        theme: {
          "color": "#3E6227"
        }
      };
      options.handler = ((response: any) => {
        if (response.error) {
          // this._toastr.error(response.error.description, 'Oops!');
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: response.error.description,
          });
        } else {
          options['payment_response_id'] = response.razorpay_payment_id;
          const paymentType = response.method;
          let orderObj:any = {
            planid:plan?._id,
            paymentid:response.razorpay_payment_id,
            razorpay_orderid: response.razorpay_order_id,
            razorpay_signature:response.razorpay_signature,
            paidamount:plan?.discounted_inr_amount ? (plan?.discounted_inr_amount) : (plan.discounted_usd_amount),
            addressid:this.selectedAddressId,
            previousplanid:'',
            order_from:"Web"
          }
          this.buyPlan(stepper,orderObj);
        }
      });
      options.modal.ondismiss = ((response: any) => {
        // this._toastr.error('Payment cancelled by the user.', 'Oops!');
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Payment cancelled by the user.',
        });
      });
      let rzp = new this._globalService.nativeWindow.Razorpay(options);
      rzp.open();
    },(error:any)=>{
      this._globalFunctions.errorHanding(error,this,true);
    });
    }
  }

  buyPlan(stepper:MatStepper,object:any){
    this._subscriptionService.buyPlan(object).subscribe((result:any)=>{
      if(result && result.IsSuccess){
        let tempObj:any = {type:'plan',data:result?.Data};
        localStorage.setItem('OD',JSON.stringify(tempObj));
        this.placedOrderDataForPlan = result?.Data;
        this._router.navigate(['/plandetail']);
        Swal.fire({
          position: "center",
          icon: "success",
          title: result.Message,
          showConfirmButton: false,
          timer: 2000,
          width: '400px'
        });
        this._router.navigate(['/plandetail']);
      } else {
        // this.isLoading = false;
        this._globalFunctions.successErrorHandling(result.Message,this,true);
      }
    },(error:any)=>{
      // this.isLoading = false;
      this._globalFunctions.errorHanding(error,this,true);
    })
  }

  goNextPage(stepper:MatStepper){
    if(this.isNextPage){
      stepper.next();
      this.isNextPage = false;
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
}
