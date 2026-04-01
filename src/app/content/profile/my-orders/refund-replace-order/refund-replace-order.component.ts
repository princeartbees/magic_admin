import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CONSTANTS } from '../../../../common/constants';
import { ProfileService } from '../../profile.service';
import { GlobalFunctions } from '../../../../common/global-function';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-refund-replace-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule],
  templateUrl: './refund-replace-order.component.html',
  styleUrl: './refund-replace-order.component.scss'
})
export class RefundReplaceOrderComponent implements OnInit{

  refundReplaceOrderForm: any = FormGroup;
  replaceImages: any = [];
  allImages: any;
  constants: any = CONSTANTS;
  isUpload: boolean = false;
  selectedItemImg: any;
  isBtnLoading: boolean = false;
  constructor(public dialogRef: MatDialogRef<RefundReplaceOrderComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _toastr: ToastrService,
    private fb:FormBuilder,
    private _profileService:ProfileService,
    private _globalFunctions:GlobalFunctions
  ) { }

  ngOnInit(): void {
    this.initForm();
    if (this.data[0].result) {
      this.initForm();
    }
  }

  initForm(){
    this.refundReplaceOrderForm = this.fb.group({
      reason: ['', Validators.required],
      massage: ['', Validators.required],
      replace_img: ['', Validators.required],
    })
  }

  returnOrder(){
    const replaceObj = new FormData();
    replaceObj.append('orderid', this.data[0].result ? this.data[0].result : '');
    for (let index = 0; index < this.allImages.length; index++) {
      replaceObj.append('files', this.allImages[index] || []);
    }
    replaceObj.append('reason', this.refundReplaceOrderForm.value.reason || '');
    replaceObj.append('message', this.refundReplaceOrderForm.value.massage || '');

    this.refundReplaceOrderForm.disable();
    this._profileService.getReplaceOrder(replaceObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this._toastr.clear();
        this._toastr.success(result.Message, 'Success');
        this.isBtnLoading = false;
        this.dialogRef.close(true);
      } else {
        this.refundReplaceOrderForm.enable();
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isBtnLoading = false;
      }
    }, (error: any) => {
      this.refundReplaceOrderForm.enable();
      this._globalFunctions.errorHanding(error, this, true);
      this.isBtnLoading = false;
    });

  }

  upaloadFile(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      if (event.target.files.length <= 5) {
        if ((event.target.files.length + this.replaceImages.length) > 5) {
          this._toastr.clear();
          this._toastr.error('Please upload maximum 5 images', 'Error');
          return;
        }
        let count = 0;
        for (let i = 0; i < event.target.files.length; i++) {
          this.allImages = event.target.files;
          const file = event.target.files[i];
          let type = file.type.split('/')[0];
          if (type == "image") {
            if (!this.constants.imagearray.includes(file.type)) {
              count++;
            }
          } else if (type == "video") {
            if (!this.constants.videoarray.includes(file.type)) {
              count++;
            }
          }
          if (count > 0) {
            this._toastr.clear();
            this._toastr.error(
              'File type is not allowed.',
              'Error'
            );
            count = 0;
            return;
          }
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => { // called once readAsDataURL is completed
            this.isUpload = true;
            this.selectedItemImg = event?.target?.result;
            const itemImageFormControl = this.refundReplaceOrderForm.get('replace_img');
            itemImageFormControl.setValue(file);
            this.replaceImages.push(
              { type: file.type.split('/')[0], path: event?.target?.result }
            );
            this._toastr.clear();
            this._toastr.success("Image uploaded successfully.", 'Success');
          }
        }
      } else {
        this._toastr.clear();
        this._toastr.error('Please upload maximum 5 images', 'Error');
      }
    }
  }


  removeOtherImnages(index: any) {
    this.replaceImages.splice(index, 1)
  }

  imageOnError(event: any) {
    event.target.src = this.constants.defaultImage;
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
