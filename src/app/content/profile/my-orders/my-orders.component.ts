import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProfileService } from '../profile.service';
import { GlobalFunctions } from '../../../common/global-function';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Router, RouterModule } from '@angular/router';
import { CONSTANTS } from '../../../common/constants';
import { MatDialog } from '@angular/material/dialog';
import { RefundReplaceOrderComponent } from './refund-replace-order/refund-replace-order.component';
import { AddEditReview } from '../../view-all-ratting-review/add-edit-review/add-edit-review.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { OrderTrackingViaDTDCComponent } from './order-tracking-via-dtdc/order-tracking-via-dtdc.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule,MatStepperModule,RouterModule,InfiniteScrollModule,ReactiveFormsModule,FormsModule,TranslateModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent implements OnInit {

  orderListData: any;
  orderList: any = [];
  orderDetailList:any = [];
  isLoading: boolean = false;
  isDisplayLoad:boolean = false;
  pageNo: any;
  limit: any;
  tempScrollCount: number = 1;
  cancelOrderId:any = null;
  cancelOrderforReason:any = null;
  cancelOrderforMessage:any = null;
  isOpenCancelOrderForm: boolean = false;
  isCancelOrderError: any = null;
  constants:any = CONSTANTS;
  selectedOrderId:any;
  @ViewChild('stepper') stepper!: MatStepper;

  constructor(private _profileService:ProfileService, 
    private _globalFunctions:GlobalFunctions,
    private _dialog:MatDialog,
    private _router:Router,
    private http:HttpClient,
    private _toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllOrderList(this.tempScrollCount);
  }

  getAllOrderList(pageCount: number) {
    this.isLoading = true;
    const orderListObj = {
      page: 1,
      limit: pageCount * 10
    }
    this._profileService.getOrderList(orderListObj).subscribe((result:any) => {
      if(result && result.IsSuccess){
        this.isLoading = false;
        this.orderListData = result?.Data;
        this.orderList = result?.Data?.docs;
      }else {
        this.isLoading = false;
        this._globalFunctions.successErrorHandling(result.Message, this, true);
      }
    }, (error) => {
      this.isLoading = false;
      this._globalFunctions.errorHanding(error, this, true);
    })
  }

  orderDetails(orderId:any,stepper: MatStepper){
    this.isDisplayLoad = true;
    this.selectedOrderId = orderId;
    this.getOrderDetails(this.selectedOrderId);
    stepper.next();
  }

  getOrderDetails(orderId:any){
    const orderDetailObj = {
      orderid: this.selectedOrderId,
      // orderid: "6785183f148aa908ab249d58",
      language: localStorage.getItem("lang") || "english"
    }
    this._profileService.getOrderDetailsList(orderDetailObj).subscribe((result:any) => {
      if(result && result.IsSuccess){
        this.isDisplayLoad = false;
        result.Data.variants.map((i:any)=>{
          if (localStorage.getItem("lang") == "hindi") {
            i.variantId.productId.product_name = i.variantId.productId.hi_product_name; 
          }
          else if (localStorage.getItem("lang") == "marathi") {
            i.variantId.productId.product_name = i.variantId.productId.mr_product_name; 
          }
          else if (localStorage.getItem("lang") == "gujarati") {
            i.variantId.productId.product_name = i.variantId.productId.gu_product_name; 
          }else{
            i.variantId.productId.product_name = i.variantId.productId.en_product_name; 
          }
        });
        this.orderDetailList = result.Data;    
      }else {
        this.isDisplayLoad = false;
        this.stepper.previous();
        this._globalFunctions.successErrorHandling(result.Message, this, true);
      }
    }, (error) => {
      this.isDisplayLoad = false;
      this.stepper.previous();
      this._globalFunctions.errorHanding(error, this, true);
    })
  }

  openOrderTracking(trackingId:any){
    const dialogRef = this._dialog.open(OrderTrackingViaDTDCComponent, {
      width: '700px',
      height: 'fit-content',
      data:[{result:trackingId}],
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((res:any) => {
      window.location.reload();
    })
  }

  backDetails(stepper: MatStepper){
    stepper.previous();
  }

  replaceOrder(event:any, replaceorderId:any){
    event.stopPropagation();
    const dialogRef = this._dialog.open(RefundReplaceOrderComponent, {
      width: '500px',
      data:[{result:replaceorderId},
        {btnName:"Add"}],
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((res:any) => {
      if(res){
        this.getAllOrderList(this.tempScrollCount);
        this.getOrderDetails(this.selectedOrderId);
      }
    })
  }

  rateReview(event:any,productId:any){
    event.stopPropagation();
    const dialogRef = this._dialog.open(AddEditReview, {
      width: '500px',
      data:[{result:productId},
        {btnName:"Add"}],
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((res:any) => {
      if(res){
        this.getAllOrderList(this.tempScrollCount);
      }
    })
  }

  viewProductDetails(variantid:any){
    // this._router.navigate(['/shop', variantid]);
    this._router.navigate(['/shop/productdetail']);
    if(typeof window != 'undefined' && localStorage.getItem('PDID')){
      localStorage.removeItem('PDID');
    }
    localStorage.setItem('PDID', window.btoa(variantid));
  }

  downloadLabel(path:any = ''){
    this.http
    .get(this.constants.baseImageUrl + path, { responseType: 'blob' })
    .subscribe((res:any) => {
      let url = window.URL.createObjectURL(res);
      var myWindow = window.open(url, 'Labels', 'width=900,height=900');
      myWindow?.print();
      myWindow?.focus();
    });
  }

  cancelOrder(event:any, order:any){
    event.stopPropagation();
    this.cancelOrderId = order._id;
    this.isOpenCancelOrderForm = true;
  }

  createCancelOrder(){
    if(this.cancelOrderforReason == null || this.cancelOrderforReason == ''){
      this.isCancelOrderError = true;
      return;
    }
    if(this.cancelOrderforMessage == null || this.cancelOrderforMessage == ''){
      this.isCancelOrderError = true;
      return;
    }
    this.isOpenCancelOrderForm = false;
    this.isLoading = true;
    let data:any = {
      orderid:this.cancelOrderId,
      reason:this.cancelOrderforReason,
      message:this.cancelOrderforMessage
    }
    this._profileService.cancelOrder(data).subscribe((result:any)=>{
      if(result && result.IsSuccess){
        this.isLoading = false;
        this.getAllOrderList(this.tempScrollCount);
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
        this._globalFunctions.successErrorHandling(result.Message,this,true);
      }
    },(error:any)=>{
      this.isLoading = false;
      this._globalFunctions.errorHanding(error,this,true);
    })
  }

  onScroll(){
    this.tempScrollCount++;
    // if(((this.tempScrollCount * 10) / this.orderListData?.totalDocs) >= 1 || ((this.tempScrollCount * 10) / this.orderListData?.totalDocs) < 2){ 
    if(this.tempScrollCount <= Math.ceil(this.orderListData?.totalDocs / 10)){
      this.getAllOrderList(this.tempScrollCount);
    }
  }
}
