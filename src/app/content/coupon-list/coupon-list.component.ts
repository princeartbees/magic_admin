import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ShopService } from '../shop/shop.service';
import { GlobalFunctions } from '../../common/global-function';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-coupon-list',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './coupon-list.component.html',
  styleUrl: './coupon-list.component.scss'
})
export class CouponListComponent implements OnInit {
  @Output() closeSidebar: EventEmitter<any> = new EventEmitter<any>();
  @Input() isOpen!: boolean;
  couponList: any = [];

  constructor(private _toastr:ToastrService,
    private _shopService:ShopService,
    private _globalFunctions:GlobalFunctions
  ) {
  }

  ngOnInit(): void {
    this.getAllCoupon();
  }

  onClose() {
    this.closeSidebar.emit();
  }

   // Method to start the timer based on start and end timestamps
 // Method to start the timer based on start and end timestamps
 startTimer(starttime:any, endtime:any, updateDisplayCallback:any) {
  let endTime:any = new Date(endtime);
  let currentTime :any= new Date(starttime);
  let remainingTime = Math.max(0, endTime - currentTime);

  // Function to format the remaining time
  const formatTime = (milliseconds:any) => {
      const totalSeconds = Math.floor(milliseconds / 1000);
      const days = Math.floor(totalSeconds / 86400); // 86400 seconds in a day
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const formatNumber = (num:any) => num.toString().padStart(2, '0');
      return `${days} day ${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
  };

  // Initial display update
  updateDisplayCallback(formatTime(remainingTime));

  // Set an interval to update the display every second
  const timer = setInterval(() => {
      currentTime = new Date();
      remainingTime = Math.max(0, endTime - currentTime);

      if (remainingTime <= 0) {
          clearInterval(timer);
          updateDisplayCallback('0 day 00:00:00'); // Display zero time if finished
      } else {
          updateDisplayCallback(formatTime(remainingTime));
      }
  }, 1000);
}



  copyCouponCode(myCode: HTMLElement) {
    const textarea = document.createElement('textarea');
    textarea.value = myCode.innerText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    this.closeSidebar.emit();
    // this._toastr.clear();
    // this._toastr.success("Coupon Copy Succssfully.","Success");
    Swal.fire({
      position: "center",
      icon: "success",
      title: 'Coupon Copy Successfully',
      showConfirmButton: false,
      timer: 2000,
      width: '400px'
    });
  }
 
  getAllCoupon(){
    const couponObj = {
      from:"web" 
    }
    this._shopService.getCoupon(couponObj).subscribe((result:any) => {
      if(result && result.IsSuccess){
        this.couponList = result.Data;  
        // Create timer instances for each object in the array
        this.couponList.forEach((data:any, index:any) => {
         
          // Define a callback to update the display element
          const updateDisplay = (formattedTime:any) => {
              data.timer = `${formattedTime}`;
          };
        
          // Start the timer
          this.startTimer(data.starttime, data.endtime, updateDisplay);
        });      
      }else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    },(error) => {
      this._globalFunctions.successErrorHandling(error, this, true);  
    })
  }
}
