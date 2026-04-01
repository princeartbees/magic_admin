import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import { FAQLIST } from '../../common/faq';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SupportService } from './support.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalFunctions } from '../../common/global-function';
import { CONSTANTS } from '../../common/constants';
import Swal from 'sweetalert2';
import { GlobalService } from '../../services/global.service';
import { TranslateModule } from '@ngx-translate/core';
declare var $:any;

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [MatTabsModule,MatExpansionModule,CommonModule,FormsModule,ReactiveFormsModule,RouterModule,TranslateModule],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss'
})
export class SupportComponent implements OnInit{

  faqList:any= FAQLIST
  supportForm:any = FormGroup;
  constants:any = CONSTANTS;
  isUploadLoading:boolean = false; 
  isUpload: boolean = false;
  selectedImage: any;
  @ViewChild ("supportNgForm") supportNgForm:any;
  fileName: any;
  createdCaptchaUrl: any;
  createdCaptchaText: any;

  constructor(private fb:FormBuilder, 
    private _supportService:SupportService, 
    private _toastr:ToastrService,
    private _globalFunctions:GlobalFunctions,
    private _globalService:GlobalService,
  ){
    $('.page-loader').fadeIn('fast');
    setTimeout(() => {
      $('.page-loader').fadeOut('slow');
    }, 1500);
  }

  ngOnInit(): void {
    this.initForm();
    this.setCanonicalUrl();
    this._globalService.setMetaTags(this.constants.supportPageMetaTag);
    this._globalService.setOpenGraphTags(this.constants.supportPageMetaOgTag);
    this._globalService.setTwitterCardTags(
      this.constants.supportPageMetaTwitterTag
    );
    this._globalService.setJsonLdData(this.constants.supportBreadcrum, 'bc');
    // this._globalService.setJsonLdData(
    //   this.constants.supportWebsiteSchema,
    //   'websch'
    // );
    this._globalService.setJsonLdData(this.constants.supportLBSchema, 'lbSchema');
    this._globalService.setJsonLdData(this.constants.supportOrgSchema, 'orgSchema');
  }

  setCanonicalUrl() {
    this._globalService.removeCanonicalUrl();
    let urlData = {
      url: `https://magicshaircare.com/support/`,
      title: "We're Here to Help"
    };
    this._globalService.setCanonicalUrl(urlData);
  }

  initForm(){
    this.supportForm = this.fb.group({
      support_image: [''],
      name: ['', Validators.required],
      email: ['', Validators.required],
      subject: ['', Validators.required],
      comments: [''],
      captcha: ['']
    });
    this.createdCaptchaUrl = this.CreateCaptcha();
  }

  CreateCaptcha(){
    let alpha = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
    let i;
    let a,b,c,d,e,f;
    for (i = 0; i < 6; i++) {
      a = alpha[Math.floor(Math.random() * alpha.length)];
      b = alpha[Math.floor(Math.random() * alpha.length)];
      c = alpha[Math.floor(Math.random() * alpha.length)];
      d = alpha[Math.floor(Math.random() * alpha.length)];
      e = alpha[Math.floor(Math.random() * alpha.length)];
      f = alpha[Math.floor(Math.random() * alpha.length)];
    }
    let cd = a + ' ' + b + ' ' + c + ' ' + d + ' ' + e + ' ' + f;
    this.createdCaptchaText = cd.replaceAll(' ','');
    const canvas = document.createElement("canvas");
    canvas.style.display = "none";
    canvas.width = 200;
    canvas.height = 32;
    document.body.appendChild(canvas);
    const context = canvas.getContext("2d")!;
    context.fillStyle = "#3E6227";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = "16px Helvetica";
    context.fillStyle = "#fff";
    context.fillText(cd, 11, 22);
    const data = canvas.toDataURL();
    document.body.removeChild(canvas);
    return data;
  }

  reGenerateCaptcha(){
    this.createdCaptchaUrl = this.CreateCaptcha();
  }

  onSubmit(){
    if (this.supportForm.invalid) {
      Object.keys(this.supportForm.controls).forEach((key)=> {
        this.supportForm.controls[key].touched = true;
        this.supportForm.controls[key].markAsDirty();
      });
      return;
    };

    if(this.createdCaptchaText !== this.supportForm.value.captcha){
      // this._toastr.clear();
      // this._toastr.error('Please enter a valid captcha','Oops..!');
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Please enter a valid captcha',
      });
      return;
    };

    const supportObj = new FormData();
    supportObj.append('file', this.supportForm.value.support_image || '');
    supportObj.append('name', this.supportForm.value.name || '');
    supportObj.append('email', this.supportForm.value.email.toLowerCase() || '');
    supportObj.append('subject', this.supportForm.value.subject || '');
    supportObj.append('message', this.supportForm.value.comments || '');

    this.supportForm.disable();
    this._supportService.addSupport(supportObj).subscribe((result:any) => {
      if(result && result.IsSuccess){
        this.supportForm.enable();
        this.createdCaptchaUrl = this.CreateCaptcha();
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
        this.supportForm.enable();
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error: any) => {
      this.supportForm.enable();
      this._globalFunctions.errorHanding(error, this, true);
    });
    this.supportForm.reset()
  };

  uploadItemImage(event:any){
    this.isUploadLoading = true;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.fileName = file.name;
      let type = file.type.split('/')[0]; 
      if (type == "image") {
        if (!this.constants.imagearray.includes(file.type)) {
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
          return;
        }
      } else if (type == "video") {
        if (!this.constants.videoarray.includes(file.type)) {
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
          return;
        }
      }
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.isUpload = true;
        this.selectedImage = event?.target?.result;
        const itemImageFormControl = this.supportForm.get('support_image');
        itemImageFormControl.setValue(file);
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
  }
}
