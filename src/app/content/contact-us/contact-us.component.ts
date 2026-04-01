import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactUsService } from './contact-us.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalFunctions } from '../../common/global-function';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { GlobalService } from '../../services/global.service';
import { CONSTANTS } from '../../common/constants';
import { TranslateModule } from '@ngx-translate/core';
import { CountryISO, NgxIntlTelInputModule, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
declare var $: any;

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule, TranslateModule, NgxIntlTelInputModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent implements OnInit {

  contactForm: any = FormGroup;
  @ViewChild('contactNgForm') contactNgForm: any;
  createdCaptchaUrl: any;
  createdCaptchaText: any;
  constants: any = CONSTANTS;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.India];
  phoneForm: any = new FormGroup({
    phone: new FormControl(null, [Validators.required]),
  });

  constructor(private fb: FormBuilder,
    private _contactService: ContactUsService,
    private _toastr: ToastrService,
    private _globalFunctions: GlobalFunctions,
    private _globalService: GlobalService
  ) {
    $('.page-loader').fadeIn('fast');
    setTimeout(() => {
      $('.page-loader').fadeOut('slow');
    }, 1500);
  }

  ngOnInit(): void {
    this._globalService.setMetaTags(this.constants.contactUsPageMetaTag);
    this._globalService.setOpenGraphTags(this.constants.contactUsPageMetaOgTag);
    this._globalService.setTwitterCardTags(this.constants.contactUsPageMetaTwitterTag);
    this._globalService.setJsonLdData(this.constants.contactusBreadcrum, "bc");
    //this._globalService.setJsonLdData(this.constants.contactusWebsiteSchema,"websch");
    this._globalService.setJsonLdData(this.constants.contactusLBSchema, "lbSchema");
    this._globalService.setJsonLdData(this.constants.contactusOrgSchema, 'orgSchema');
    this.initForm();
    this.setCanonicalUrl();
  }

  setCanonicalUrl() {
    this._globalService.removeCanonicalUrl();
    let urlData = {
      url: `https://magicshaircare.com/contactus`,
      title: 'For More Enquiry Give Us Call on 18008892066'
    };
    this._globalService.setCanonicalUrl(urlData);
  }

  initForm() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      subject: ['', Validators.required],
      message: [''],
      captcha: ['']
    });
    this.createdCaptchaUrl = this.CreateCaptcha();
  }

  CreateCaptcha() {
    let alpha = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
    let i;
    let a, b, c, d, e, f;
    for (i = 0; i < 6; i++) {
      a = alpha[Math.floor(Math.random() * alpha.length)];
      b = alpha[Math.floor(Math.random() * alpha.length)];
      c = alpha[Math.floor(Math.random() * alpha.length)];
      d = alpha[Math.floor(Math.random() * alpha.length)];
      e = alpha[Math.floor(Math.random() * alpha.length)];
      f = alpha[Math.floor(Math.random() * alpha.length)];
    }
    let cd = a + ' ' + b + ' ' + c + ' ' + d + ' ' + e + ' ' + f;
    this.createdCaptchaText = cd.replaceAll(' ', '');
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

  reGenerateCaptcha() {
    this.createdCaptchaUrl = this.CreateCaptcha();
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      Object.keys(this.contactForm.controls).forEach((key) => {
        this.contactForm.controls[key].touched = true;
        this.contactForm.controls[key].markAsDirty();
      });
      return;
    };

    if (this.createdCaptchaText !== this.contactForm.value.captcha) {
      // this._toastr.clear();
      // this._toastr.error('Please enter a valid captcha','Oops..!');
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Please enter a valid captcha'
      });
      return;
    };
    const contactObj:any = {
      name: this.contactForm.value.name,
      email: this.contactForm.value.email.toLowerCase(),
      subject: this.contactForm.value.subject,
      message: this.contactForm.value.message,
    }
    contactObj.country_wise_contact = this.phoneForm.value?.phone || "";
    const contactNumber = contactObj?.country_wise_contact?.e164Number;
    contactObj.country_code = contactObj?.country_wise_contact?.dialCode || "";
    contactObj.mobile = contactNumber.replace(contactObj?.country_code, '') || '';
    this.contactForm.disable();
    this._contactService.addContact(contactObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.contactForm.enable();
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
      } else {
        this.contactForm.enable();
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error: any) => {
      this.contactForm.enable();
      this._globalFunctions.errorHanding(error, this, true);
    });
    this.contactForm.reset();
    this.phoneForm.reset();
  }
}
