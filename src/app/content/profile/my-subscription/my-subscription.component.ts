import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ProfileService } from '../profile.service';
import { GlobalFunctions } from '../../../common/global-function';
import { CONSTANTS } from '../../../common/constants';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-my-subscription',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,InfiniteScrollModule,TranslateModule],
  templateUrl: './my-subscription.component.html',
  styleUrl: './my-subscription.component.scss'
})
export class MySubscriptionComponent implements OnInit{

  planList:any;
  isLoading:boolean = false;
  isOpenCancelPlanForm:boolean = false;
  isCancelPlanError:boolean = false;
  constants:any = CONSTANTS;
  cancelPlanId:any = null;
  cancelPlanforReason:any = null;
  tempScrollCount:number = 1;
  totalPlanDocs:any;
  tempArray:any = [
    {
      name:'redtToShipe',
      title:'confriem',
      status:false,
      icon:'icon-confriem'
    },
    {
      name:'shiped',
      title:'Rady to shipe',
      status:false,
      icon:'icon-shiped'
    },
    {
      name:'delivered',
      title:'Delivered',
      status:false,
      icon:'icon-delivered'
    },
    {
      name:'cancel',
      title:'Cancel',
      status:false,
      icon:'icon-Cancel'
    },
  ];
  status:string = 'delivered';
  statusTrackingArray:any = [];

  constructor(
    private _profileService:ProfileService,
    private _globalFunction:GlobalFunctions,
    private _toastr:ToastrService,
    private _router:Router
  ){}

  ngOnInit(): void {
    this.getUserPlans(this.tempScrollCount);
    this.tempArray.map((item:any,index:number)=>{
      if(item?.name == this.status){
        for (let i = 0; i <= index; i++) {
          this.tempArray[i].status = true;
          // this.statusTrackingArray.push(this.tempArray[i])
        }
      }
    });
  }

  getUserPlans(pageCount:any){
    this.isLoading = true;
    let data:any = {
      page:1,
      limit:pageCount * 10,
      language: localStorage.getItem("lang") || "english"
    };
    this._profileService.getUserSubscriptionList(data).subscribe((result:any)=>{
      if(result && result.IsSuccess){
        this.isLoading = false;
        result.Data?.docs.map((item:any)=>{
          if (localStorage.getItem("lang") == "hindi") {
            item.planid.planname = item.planid.hi_planname; 
          }
          else if (localStorage.getItem("lang") == "marathi") {
            item.planid.planname = item.planid.mr_planname; 
          }
          else if (localStorage.getItem("lang") == "gujarati") {
            item.planid.planname = item.planid.gu_planname; 
          }else{
            item.planid.planname = item.planid.en_planname; 
          }
        })
        this.totalPlanDocs = result?.Data;
        this.planList = result?.Data?.docs;
      } else {
        this.isLoading = false;
        this._globalFunction.successErrorHandling(result?.Message,this,true)
      }
    });

  }

  renewPlan(plan:any){
    // this._router.navigate(['/renew',plan?.planid?._id]);
    this._router.navigate(['/renew/renewplan']);
    localStorage.setItem('PLANID', window.btoa(plan?.planid?._id));
  }

  cancelPlan(plan:any){
    this.cancelPlanId = plan?._id;
    this.isOpenCancelPlanForm = true;
  }
  
  createCancelPlan(){
    if(this.cancelPlanforReason == null || this.cancelPlanforReason == ''){
      this.isCancelPlanError = true;
      return;
    }
    this.isOpenCancelPlanForm = false;
    this.isLoading = true;
    let data:any = {
      planid:this.cancelPlanId,
      reason:this.cancelPlanforReason
    }
    this._profileService.cancelPlan(data).subscribe((result:any)=>{
      if(result && result.IsSuccess){
        this.isLoading = false;
        this.getUserPlans(1);
        // this._toastr.clear();
        // this._toastr.success(result.Message,'Success')
        Swal.fire({
          position: "center",
          icon: "success",
          title: result.Message,
          showConfirmButton: false,
          timer: 2000,
          width: '400px'
        });
      } else {
        this.isLoading = false;
        this._globalFunction.successErrorHandling(result.Message,this,true);
      }
    },(error:any)=>{
      this.isLoading = false;
      this._globalFunction.errorHanding(error,this,true);
    })
  }

  onScroll(){
    this.tempScrollCount++;
    if(this.tempScrollCount <= Math.ceil(this.totalPlanDocs?.totalDocs / 10)){
      this.getUserPlans(this.tempScrollCount)
    }
  }

}
