import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ImageModule } from 'primeng/image';
import { ProfileService } from '../../profile.service';
import { GlobalFunctions } from '../../../../common/global-function';
import { CommonModule } from '@angular/common';
import { CONSTANTS } from '../../../../common/constants';
import moment from 'moment';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-order-tracking-via-dtdc',
  standalone: true,
  imports: [ CommonModule,
    MatExpansionModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    ImageModule,
    MatDialogModule,
  TranslateModule],
  templateUrl: './order-tracking-via-dtdc.component.html',
  styleUrl: './order-tracking-via-dtdc.component.scss'
})
export class OrderTrackingViaDTDCComponent implements OnInit{

  panelOpenState = false;
  odertrackingDetials:any = [];
  trackingId:any;
  constants:any = CONSTANTS;
  constructor(public dialogRef: MatDialogRef<OrderTrackingViaDTDCComponent>,
      @Inject(MAT_DIALOG_DATA) private data: any,
      private _profileService:ProfileService,
      private _globalFunctions:GlobalFunctions
    ){}

  ngOnInit(): void {
    this.trackingId = this.data[0].result;
    this.orderTracking();
  }

  orderTracking(){
    let filter = {
      orderid: this.trackingId || '',
      language: localStorage.getItem("lang") || "english"
    }

    this._profileService.oderTrackingViaDTDC(filter).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        // result.Data.variants.map((i:any)=>{
        //   if (localStorage.getItem("lang") == "hindi") {
        //     i.variantId.productId.product_name = i.variantId.productId.hi_product_name; 
        //   }
        //   else if (localStorage.getItem("lang") == "marathi") {
        //     i.variantId.productId.product_name = i.variantId.productId.mr_product_name; 
        //   }
        //   else if (localStorage.getItem("lang") == "gujarati") {
        //     i.variantId.productId.product_name = i.variantId.productId.gu_product_name; 
        //   }else{
        //     i.variantId.productId.product_name = i.variantId.productId.en_product_name; 
        //   }
        // });
        // this.odertrackingDetials = result?.Data;
        this.odertrackingDetials = result?.Data?.[0]?.tracking_data?.shipment_track_activities?.slice().reverse() ?? [];
        this.odertrackingDetials.map((i:any) => {
            i.strActionDate = moment(i.date,"YY-MM-DD HH:mm:ss").format('DD MMM, YYYY')
            i.strActionTime = moment(i.date,"HHmm").format('hh:mm A')
        });
        // result?.Data?.variants.map((i:any) => {
        //   i.ordertrackingDetails?.trackDetails.map((j:any) => {
        //     j.strActionDate = moment(j.strActionDate,"DDMMYYYY").format('DD MMM, YYYY')
        //     j.strActionTime = moment(j.strActionTime,"HHmm").format('hh:mm A')
        //   })
        // })
      } else {
        this._globalFunctions.successErrorHandling(result, this, true)
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
    })
  }

  closeDailog(){
    this.dialogRef.close();
  }

}
