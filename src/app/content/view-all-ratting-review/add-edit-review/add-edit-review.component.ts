import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { RatingModule } from 'primeng/rating';
import { CONSTANTS } from "../../../common/constants";
import { ToastrService } from "ngx-toastr";
import { ViewAllRattingReviewService } from "../view-all-ratting-review.service";
import { GlobalFunctions } from "../../../common/global-function";
import Swal from "sweetalert2";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'app-add-edit-review',
  standalone: true,
  imports: [RatingModule, CommonModule, RouterModule, FormsModule, ReactiveFormsModule,TranslateModule],
  templateUrl: './add-edit-review.component.html'
})

export class AddEditReview implements OnInit {

  addReviewForm: any = FormGroup;
  constants: any = CONSTANTS;
  @ViewChild('reviewNgForm') reviewNgForm: any;
  filetype: any;
  isUpload: boolean = false;
  isBtnLoading: boolean = false;
  reviewImages: any = [];
  selectedItemImg: any;
  allImages: any;
  constructor(public dialogRef: MatDialogRef<AddEditReview>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private _toastr: ToastrService,
    private _viewReviewService: ViewAllRattingReviewService,
    private _globalFunctions: GlobalFunctions
  ) { }

  ngOnInit(): void {
    this.initForm();
    if (this.data[0].result) {
      this.initForm();
    }
  }

  initForm(obj: any = {}) {
    this.addReviewForm = this.fb.group({
      rating: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      upload_review: ['', Validators.required]
    });
  }

  addProductReview() {
    const reviewObj = new FormData();
    reviewObj.append('variantid', this.data[0].result ? this.data[0].result : '');
    for (let index = 0; index < this.allImages.length; index++) {
      reviewObj.append('files', this.allImages[index] || []);
    }
    reviewObj.append('rating', this.addReviewForm.value.rating || '');
    reviewObj.append('title', this.addReviewForm.value.title || '');
    reviewObj.append('description', this.addReviewForm.value.description || '');
    
    this.addReviewForm.disable();
    this._viewReviewService.addReview(reviewObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
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
        this.isBtnLoading = false;
        this.dialogRef.close(true);
      } else {
        this.addReviewForm.enable();
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isBtnLoading = false;
      }
    }, (error: any) => {
      this.addReviewForm.enable();
      this._globalFunctions.errorHanding(error, this, true);
      this.isBtnLoading = false;
    });

  }

  upaloadFile(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      if (event.target.files.length <= 5) {
        if ((event.target.files.length + this.reviewImages.length) > 5) {
          // this._toastr.clear();
          // this._toastr.error('Please upload maximum 5 images', 'Error');
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: 'Please upload maximum 5 images',
          });
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
            // this._toastr.clear();
            // this._toastr.error(
            //   'File type is not allowed.',
            //   'Error'
            // );
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: 'File type is not allowed.',
            });
            count = 0;
            return;
          }
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => { // called once readAsDataURL is completed
            this.isUpload = true;
            this.selectedItemImg = event?.target?.result;
            const itemImageFormControl = this.addReviewForm.get('upload_review');
            itemImageFormControl.setValue(file);
            this.reviewImages.push(
              { type: file.type.split('/')[0], path: event?.target?.result }
            );
            // this._toastr.clear();
            // this._toastr.success("Image uploaded successfully.", 'Success');
            Swal.fire({
              position: "center",
              icon: "success",
              title: 'Image uploaded successfully.',
              showConfirmButton: false,
              timer: 2000,
              width: '400px'
            });
          }
        }
      } else {
        // this._toastr.clear();
        // this._toastr.error('Please upload maximum 5 images', 'Error');
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Please upload maximum 5 images',
        });
      }
    }
  }

  removeOtherImnages(index: any) {
    this.reviewImages.splice(index, 1)
  }

  imageOnError(event: any) {
    event.target.src = this.constants.defaultImage;
  }

  onClose() {
    this.dialogRef.close(false);
  }

}