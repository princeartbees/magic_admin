import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalFunctions } from '../../common/global-function';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { CommonModule, Location } from '@angular/common';
import Swal from 'sweetalert2';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-create-reset-pin',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,TranslateModule],
  templateUrl: './create-reset-pin.component.html',
  styleUrl: './create-reset-pin.component.scss'
})
export class CreateResetPinComponent implements OnInit{
  @Input() isUnknowUser!:boolean;
  @Output() unknowUserlogIn: EventEmitter<any> = new EventEmitter<any>()
  @Output() unKnowUserCreatePin: EventEmitter<any> = new EventEmitter<any>()

  @ViewChild('setNewPinForm') setNewPinForm: any;
  isBtnLoading: boolean = false;
  hidePin: boolean = true;
  hideConfrimPin: boolean = true;
  setPinForm:any = FormGroup;
  userEmail:string = '';
  isForgetPin:boolean = false;;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private toastr:ToastrService,
    private _authService:AuthService,
    private location:Location
  ){}

  ngOnInit(): void {
    this.setPinForm = this._formBuilder.group({
      confrimPin: ['', [Validators.required,Validators.maxLength(4)]],
      newPin: ['', [Validators.required,Validators.maxLength(4)]],
    });
    if(typeof window != 'undefined'){
      this.isForgetPin = JSON.parse(localStorage.getItem('isForgetPin') !)
      if(!localStorage.getItem('registerEmail') || localStorage.getItem('registerEmail') == null){
        this._router.navigate(['/login']);
      } else {
        this.userEmail = localStorage.getItem('registerEmail')!;
      }
    }
  }

  validate(): boolean {
    let flag: boolean = true;
    const errorFields: any = [];
    if (!this.setPinForm.value.newPin || this.setPinForm.value.newPin === "") {
      // this._sNotify.error('Password is required!', 'Oops!');
      errorFields.push('PIN');
      flag = false;
      // return false;
    }
    if (!this.setPinForm.value.confrimPin || this.setPinForm.value.confrimPin === "") {
      // this._sNotify.error('Password is required!', 'Oops!');
      errorFields.push('Confrim PIN');
      flag = false;
      // return false;
    }
    if (!flag) {
      let errorString: string = '';
      errorString = errorFields.join(' & ');
      // this.toastr.error(errorString + ' must be filled!', 'Oops!');
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorString + ' must be filled!'
      });
    }
    return flag;
    // return true;
  }

  setPin(){
    this.isBtnLoading = true;
    if (!this.validate()) {
      return;
    }
    if(this.setPinForm.value.newPin !== this.setPinForm.value.confrimPin){
      this.setPinForm.value.confrimPin = '';
      this.toastr.clear();
      // this.toastr.error('Please enter a same PIN','Error')
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Please enter a same PIN'
      });
      return;
    }
    const setPinObject: any = {
      email_or_mobile : this.userEmail,      
      pin   : this.setPinForm.value.newPin,     
    };
    this.setPinForm.disable();
    this._authService.createNewPin(setPinObject).subscribe((result: any) => {
      if (result && result.IsSuccess) {
         this.toastr.success(result.Message, 'Success');
        localStorage.setItem('accessToken', result.Data.accessToken);
        if(this.isUnknowUser){
          this.unKnowUserCreatePin.emit(true);
        } else if (result.Data.accesstoken){
          this._router.navigate(['/']);
        } else {
          // this._router.navigate(['/login']);
        }
        // this.location.back();
        if(typeof window != 'undefined'){
          localStorage.removeItem('isForgetPin');
        }
        this.isBtnLoading = false;
        Swal.fire({
          position: "center",
          icon: "success",
          title: result.Message,
          showConfirmButton: false,
          timer: 2000,
          width: '400px'
        });
      } else {
        this.setPinForm.enable();
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isBtnLoading = false;
      }
    }, (error: any) => {
      this.setPinForm.enable();
      this.setPinForm.resetForm();
      this._globalFunctions.errorHanding(error, this, true);
      this.isBtnLoading = false;
    });
  }

  closeDialog(){
    this.unKnowUserCreatePin.emit(false);
  }
}