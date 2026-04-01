import { CommonModule } from '@angular/common';
import { Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalFunctions } from '../../common/global-function';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-otp-veryfication',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgOtpInputModule, RouterModule],
  templateUrl: './otp-veryfication.component.html',
  styleUrl: './otp-veryfication.component.scss'
})
export class OtpVeryficationComponent implements OnInit, DoCheck {
  @Input() isUnknowUser!: boolean;
  @Output() unKnowUserVeryFiedOtp: EventEmitter<any> = new EventEmitter<any>()
  @Output() isOpenForGetPinFormPopup: EventEmitter<any> = new EventEmitter<any>()

  otpInputConfig: any = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: true,
    placeholder: '-',
  };
  otpValue: any;
  otp: FormControl | any;
  display: any;
  isBtnLoading: boolean = false;
  userEmail: string = '';
  isForgetPin: any;
  viewEmailAddress: any;
  isShowTimer: boolean = true;

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private toastr: ToastrService,
    private _globalFunctions: GlobalFunctions
  ) { }

  ngDoCheck(): void {
    if (typeof document !== 'undefined') {
      if (this.isShowTimer && document?.getElementById('showResendOTP') != null && document?.getElementById('showTimer') != null) {
        const element: any = document?.getElementById('showResendOTP');
        const sTimer: any = document?.getElementById('showTimer');
        if (this.isShowTimer) {
          element.style.display = 'none';
          sTimer.style.display = 'block';
        } else {
          element.style.display = 'block';
          sTimer.style.display = 'none';
        };
      }
    }
  }

  ngOnInit(): void {
    if (typeof window != 'undefined') {
      this.isForgetPin = JSON.parse(localStorage.getItem('isForgetPin')!)
      if (!localStorage.getItem('registerEmail') || localStorage.getItem('registerEmail') == null) {
        this._router.navigate(['/login']);
      } else {
        this.userEmail = localStorage.getItem('registerEmail')!;
        this.viewEmailAddress = localStorage.getItem('registerEmail')!.toString().slice(this.userEmail.indexOf('@') - 4).padStart(this.userEmail.length, "*");
      }
    }
    this.otp = new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern("^[0-9]*$")]);
    this.timer(1);
  }

  onOtpChange(event: any) {
    if (event.length == 6) {
      this.otp.markAsDirty();
      this.otp.markAsTouched();
    }
  }

  timer(minute: any) {
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.isShowTimer = false;
        clearInterval(timer);
      }
    }, 1000)
  }

  resendOTP() {
    this._authService.resendOtp({ email_or_mobile: this.userEmail }).subscribe((result: any) => {
      if (result.IsSuccess) {
       Swal.fire({
          position: "center",
          icon: "success",
          title: result.Message,
          showConfirmButton: false,
          timer: 2000,
          width: '400px'
        });
        // clearInterval(timer);
        this.timer(1);
        this.isShowTimer = true;
      } else {
        this._globalFunctions.successErrorHandling(result.Message, this, true)
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
    })
  }

  verifyOtp() {
    if (!this.otp.valid) {
      this.otp.markAsDirty();
      this.otp.markAsTouched();
      // this.toastr.clear();
      // this.toastr.error('Please enter valid OTP code');
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Please enter valid OTP code!'
      });
      return;
    }
    const otpObj: any = {
      email_or_mobile: this.userEmail,
      otp: this.otp.value
    };
    this._authService.verifyRegisterOtp(otpObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        // this.toastr.success(result.Message, 'Success');
        localStorage.setItem('accessToken', result.Data.accessToken);
        Swal.fire({
          position: "center",
          icon: "success",
          title: result.Message,
          showConfirmButton: false,
          timer: 2000,
          width: '400px'
        });
        if (this.isUnknowUser) {
          this.unKnowUserVeryFiedOtp.emit(true);
        } else if (result.Data.accesstoken){
          this._router.navigate(['/']);
        } else {
          // this._router.navigate(['/login']);
        }
        
        // else if (this.isForgetPin) {
          // this._router.navigate(['/createpin']);
          // localStorage.removeItem('isForgetPin')
        // } else {
          // this._router.navigate(['/createpin']);
          // localStorage.removeItem('isForgetPin')
        // }
        window.location.reload();
        this.isBtnLoading = false;
      } else {
        this.otp.enable();
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isBtnLoading = false;
      }
    }, (error: any) => {
      this.otp.enable();
      this.otp.setValue(null);
      this._globalFunctions.errorHanding(error, this, true);
      this.isBtnLoading = false;
    });
  }

  changeEmail() {
    if (this.isUnknowUser) {
      this.isOpenForGetPinFormPopup.emit({ isSuccess: true, isChangeMail: true });
    } else {
      this._router.navigate(['/forgetpin'])
    }
  }

  closeDialog() {
    this.unKnowUserVeryFiedOtp.emit(false);
  }

}
