import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { GlobalFunctions } from '../../common/global-function';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-forget-pin',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule,TranslateModule],
  templateUrl: './forget-pin.component.html',
  styleUrl: './forget-pin.component.scss'
})
export class ForgetPinComponent implements OnInit{

  @Input() isUnknowUser!:boolean;
  @Input() isChangeMail!:boolean;
  @Output() unKnowUserForgetPin:EventEmitter<any> = new EventEmitter<any>();
  @Output() isOpenLogInFormPopup:EventEmitter<any> = new EventEmitter<any>();
  @Output() unknowUserlogIn: EventEmitter<any> = new EventEmitter<any>()

  @ViewChild('forgetPinForm') forgetPinForm: any;
  isBtnLoading: boolean = false;
  hidePin: boolean = true;
  hideConfrimPin: boolean = true;
  forgetPin:any = FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private toastr:ToastrService,
    private _authService:AuthService
  ){}

  ngOnInit(): void {
    this.forgetPin = this._formBuilder.group({
      email:['',[Validators.required]]
    })
  }

  getOtp(){
    if(!this.forgetPin.valid){
      return;
    }
    this._authService.forgetPin({email_or_mobile:this.forgetPin.value.email}).subscribe((result:any)=>{
      if(result.IsSuccess){
        if(typeof window != 'undefined'){
          localStorage.setItem('registerEmail',this.forgetPin.value.email);
          localStorage.setItem('isForgetPin',JSON.stringify(true))
        }
        // this.toastr.success(result.Message, 'Success');
        Swal.fire({
          position: "center",
          icon: "success",
          title: result.Message,
          showConfirmButton: false,
          timer: 2000,
          width: '400px'
        });
        if(this.isUnknowUser){
          this.unKnowUserForgetPin.emit({isSuccess:true,isChangeMail:false, isCheck:false});
        } else {
          this._router.navigate(['/otp']);          
        }
      } else{
        this._globalFunctions.successErrorHandling(result.Message,this,true)
      }
    },(error:any)=>{
      this._globalFunctions.errorHanding(error,this,true);
    })
  };

  loginUser(){
    if(this.isUnknowUser){
      this.isOpenLogInFormPopup.emit(true);
    } else {
      this._router.navigate(['/login'])
    }
  }

  closeDialog(){
    this.unknowUserlogIn.emit(false);
  }

}
