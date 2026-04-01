import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { CountryISO, NgxIntlTelInputModule, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { CONSTANTS } from '../../common/constants';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { GlobalFunctions } from '../../common/global-function';
import { Router, RouterModule } from '@angular/router';
import { empty } from 'rxjs';
import Swal from 'sweetalert2';
import { GlobalService } from '../../services/global.service';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
declare const google: any;
declare const FB: any;
declare var AppleID: any;

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatRadioModule, NgxIntlTelInputModule, RouterModule, TranslateModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, AfterViewInit {
  userData: any;
  @Input() isUnknowUser!: boolean;
  @Output() unKnowUserRegister: EventEmitter<any> = new EventEmitter<any>()
  @Output() isOpenLogInFormPopup: EventEmitter<any> = new EventEmitter<any>()
  @ViewChild('registerNgForm') registerNgForm: any;
  favoriteSeason: any;
  seasons: string[] = ['male', 'female', 'other'];
  selectedValue: string = '';

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.India];
  phoneForm: any = new FormGroup({
    phone: new FormControl(null, [Validators.required]),
  });

  registerForm: any = FormGroup;
  constents: any = CONSTANTS;
  profileImage: any = '';
  constructor(private fb: FormBuilder,
    private _toastr: ToastrService,
    private _authService: AuthService,
    private _globalFunctions: GlobalFunctions,
    private _globalService: GlobalService,
    private _router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {

    //Apple Login
    AppleID.auth.init({
      clientId: 'com.magicshaircare',
      scope: 'name email',
      redirectURI: 'https://magicshaircare.com/', // Replace with your redirect URL
      state: 'random_state',
      usePopup: true // Set to true if you want to handle the login in a popup window
    });
    // if (typeof window != 'undefined') {
    //   localStorage.clear();
    // }
    this.buildForm();
  }

  ngAfterViewInit(): void {
    // Manually render the Google Sign-In button after view initialization
    google.accounts.id.initialize({
      client_id: this.constents.googleLoginClientID,
      callback: this.handleCredentialResponse.bind(this)
    });

    google.accounts.id.renderButton(
      document.getElementById('googleSignInButton'),
      { theme: 'outline', size: 'large', shape: "circle", width: "200", logo_alignment: "left" }  // Customize button as needed
    );

  }

  async handleCredentialResponse(response: any) {
    // console.log("Encoded JWT ID token: " + response.credential);
    if (response.credential) {
      this.userData = this._globalFunctions.decodeJwt(response.credential);
      if (this.userData) {
        const loginDataObj: any = {
          fullname: this.userData?.name || "",
          email: this.userData.email || "",
          auth_obj: this.userData || {},
          fcm_token: "",
          user_from: "Web"
        };
        await this._authService.makeExternalLogin(loginDataObj).subscribe((result: any) => {
          if (result && result.IsSuccess) {
            localStorage.setItem('accessToken', result.Data.accessToken);
            this._globalService.logoutPage$.next(null);
            let coupon_code: any = result?.Data?.coupon_code;
            Swal.fire({
              title: "<strong>Coupen Code</strong> " + coupon_code,
              icon: "success",
              html: result.Message,
              showDenyButton: true,
              confirmButtonText: "Ok",
              denyButtonText: `Copy Coupon`
            }).then((result) => {
              if (result.isConfirmed) {
              } else if (result.isDenied) {
                const textarea = document.createElement('textarea');
                textarea.value = coupon_code;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: 'Coupon Copy Successfully',
                  showConfirmButton: false,
                  timer: 2000,
                  width: '400px'
                });
              }
            });
            if (this.isUnknowUser) {
              this.unKnowUserRegister.emit(true);
            } else {
              this.location.back();
            }

          } else {
            this._globalFunctions.successErrorHandling(result, this, true);
            this.unKnowUserRegister.emit(false);
          }
        }, (error: any) => {
          this._globalFunctions.errorHanding(error, this, true);
        });
      } else {
        this._globalFunctions.successErrorHandling("Something went wrong..!", this, true);
        this.unKnowUserRegister.emit(false);
      }

    } else {
      this._globalFunctions.successErrorHandling("Something went wrong..!", this, true);
      this.unKnowUserRegister.emit(false);
    }

  }

  // Facebook login method
  async loginWithFacebook() {
    FB.login(async (response: any) => {
      if (response.authResponse) {
        // Retrieve the access token from the response
        const accessToken = response.authResponse.accessToken;

        // Make a request to get user profile data
        await FB.api('/me', { fields: 'id,name,email,picture' }, async (profile: any) => {
          this.userData = {
            token: accessToken,
            id: profile.id,
            name: profile.name,
            email: profile.email,
            picture: profile.picture.data.url // Profile picture URL
          };
          if (this.userData) {
            const loginDataObj: any = {
              fullname: this.userData?.name || "",
              email: this.userData.email || "",
              auth_obj: this.userData || {},
              fcm_token: "",
              user_from: "Web"
            };
            await this._authService.makeExternalLogin(loginDataObj).subscribe((result: any) => {
              if (result && result.IsSuccess) {
                localStorage.setItem('accessToken', result.Data.accessToken);
                this._globalService.logoutPage$.next(null);
                let coupon_code: any = result?.Data?.coupon_code;
                Swal.fire({
                  title: "<strong>Coupen Code</strong> " + coupon_code,
                  icon: "success",
                  html: result.Message,
                  showDenyButton: true,
                  confirmButtonText: "Ok",
                  denyButtonText: `Copy Coupon`
                }).then((result) => {
                  if (result.isConfirmed) {
                  } else if (result.isDenied) {
                    const textarea = document.createElement('textarea');
                    textarea.value = coupon_code;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    Swal.fire({
                      position: "center",
                      icon: "success",
                      title: 'Coupon Copy Successfully',
                      showConfirmButton: false,
                      timer: 2000,
                      width: '400px'
                    });
                  }
                });
                if (this.isUnknowUser) {
                  this.unKnowUserRegister.emit(true);
                } else {
                  this.location.back();
                }

              } else {
                this._globalFunctions.successErrorHandling(result, this, true);
                this.unKnowUserRegister.emit(false);
              }
            }, (error: any) => {
              this._globalFunctions.errorHanding(error, this, true);
            });
          } else {
            this._globalFunctions.successErrorHandling("Something went wrong..!", this, true);
            this.unKnowUserRegister.emit(false);
          }
        });
      } else {
        this._globalFunctions.successErrorHandling("Something went wrong..!", this, true);
        this.unKnowUserRegister.emit(false);
      }
    }, { scope: 'public_profile,email' });  // Request permissions for public profile and email
  }

  //Apple Login
  signInWithApple() {
    AppleID.auth.signIn().then(async (response: any) => {
      if (response) {
        this.userData = this._globalFunctions.decodeJwt(response?.authorization?.id_token);
        if (this.userData) {
          const loginDataObj: any = {
            fullname: this.userData?.email.split('@')[0] || "",
            email: this.userData.email || "",
            auth_obj: this.userData || {},
            fcm_token: "",
            user_from: "Web"
          };
          await this._authService.makeExternalLogin(loginDataObj).subscribe((result: any) => {
            if (result && result.IsSuccess) {
              localStorage.setItem('accessToken', result.Data.accessToken);
              this._globalService.logoutPage$.next(null);
              let coupon_code: any = result?.Data?.coupon_code;
              Swal.fire({
                title: "<strong>Coupen Code</strong> " + coupon_code,
                icon: "success",
                html: result.Message,
                showDenyButton: true,
                confirmButtonText: "Ok",
                denyButtonText: `Copy Coupon`
              }).then((result) => {
                if (result.isConfirmed) {
                } else if (result.isDenied) {
                  const textarea = document.createElement('textarea');
                  textarea.value = coupon_code;
                  document.body.appendChild(textarea);
                  textarea.select();
                  document.execCommand('copy');
                  document.body.removeChild(textarea);
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: 'Coupon Copy Successfully',
                    showConfirmButton: false,
                    timer: 2000,
                    width: '400px'
                  });
                }
              });
              if (this.isUnknowUser) {
                this.unKnowUserRegister.emit(false);
              } else {
                this.location.back();
              }

            } else {
              this._globalFunctions.successErrorHandling(result, this, true);
              this.unKnowUserRegister.emit(false);
            }
          }, (error: any) => {
            this._globalFunctions.errorHanding(error, this, true);
          });
        } else {
          this._globalFunctions.successErrorHandling("Something went wrong..!", this, true);
          this.unKnowUserRegister.emit(false);
        }
      } else {
        this._globalFunctions.successErrorHandling("Something went wrong..!", this, true);
        this.unKnowUserRegister.emit(false);
      }

    }).catch((error: any) => {
      this._globalFunctions.successErrorHandling("Something went wrong..!", this, true);
      this.unKnowUserRegister.emit(false);
    });
  }

  buildForm() {
    this.registerForm = this.fb.group({
      profileUpload: [''],
      fullname: ['', Validators.required],
      email: [null, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      currency: ['', Validators.required],
      gender: ['', Validators.required]
    })
  }

  validate(): boolean {
    let flag: boolean = true;
    const errorFields: any = [];
    if (!this.registerForm.value.email || this.registerForm.value.email === "") {
      // this._sNotify.error('email or mobile is required!', 'Oops!');

      errorFields.push('Email');
      flag = false;
      // return false;
    }
    if (!this.registerForm.value.currency || this.registerForm.value.currency === "") {
      // this._sNotify.error('Password is required!', 'Oops!');
      errorFields.push('Currency');
      flag = false;
      // return false;
    }
    if (!this.registerForm.value.gender || this.registerForm.value.gender === "") {
      // this._sNotify.error('Password is required!', 'Oops!');
      errorFields.push('Gender');
      flag = false;
      // return false;
    };
    if (!flag) {
      let errorString: string = '';
      errorString = errorFields.join(' & ');
      // this._toastr.error(errorString + ' must be filled!', 'Oops!');
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorString + ' must be filled!'
      });
    }
    return flag;
    // return true;
  }

  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file == 'image') {
        if (!this.constents.imagearray.includes(file.type)) {
          // this._toastr.clear();
          // this._toastr.error('File type is not allowed.','Error');
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: 'File type is not allowed.'
          });
          return;
        }
      }
      const fileObj: any = new FormData();
      fileObj.append('profile', file);
      this._authService.getProfile(fileObj).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.profileImage = result?.Data?.imagePath;
          const profileFormControl = this.registerForm.get('profileUpload');
          profileFormControl.setValue(result?.Data?.imagePath);
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
          this._globalFunctions.successErrorHandling(result?.Message, this, true);
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
      })
    }
  }

  // signUp(): void {
  //   // this.isBtnLoading = true;
  //   if (this.registerForm.invalid) {
  //     Object.keys(this.registerForm.controls).forEach((key) => {
  //       this.registerForm.controls[key].touched = true;
  //       this.registerForm.controls[key].markAsDirty();
  //     });
  //     return;
  //   }
  //   if (this.phoneForm.invalid) {
  //     Object.keys(this.phoneForm.controls).forEach((key) => {
  //       this.phoneForm.controls[key].touched = true;
  //       this.phoneForm.controls[key].markAsDirty();
  //     })
  //     return;
  //   }
  //   if (!this.validate()) {
  //     return;
  //   }
  //   const signupDataObj: any = {
  //     profile: this.registerForm.value.profileUpload,
  //     fullname: this.registerForm.value.fullname,
  //     email: this.registerForm.value.email,
  //     currency: this.registerForm.value.currency,
  //     gender: this.registerForm.value.gender,
  //   };
  //   signupDataObj.country_wise_contact = this.phoneForm.value?.phone || "";
  //   const contactNumber = signupDataObj?.country_wise_contact?.e164Number;
  //   signupDataObj.country_code = signupDataObj?.country_wise_contact?.dialCode || "";
  //   signupDataObj.mobile = contactNumber.replace(signupDataObj?.country_code, '') || '';
  //   // this.registerForm.disable();
  //   this._authService.register(signupDataObj).subscribe((result: any) => {
  //     if (result && result.IsSuccess) {
  //       // localStorage.setItem('accessToken', result.Data.token);
  //       // this._toastr.success(result.Message, 'Success');
  //       Swal.fire({
  //         position: "center",
  //         icon: "success",
  //         title: result.Message,
  //         showConfirmButton: false,
  //         timer: 2000,
  //         width: '400px'
  //       });
  //       localStorage.setItem('registerEmail', this.registerForm.value.email);
  //       if(this.isUnknowUser){
  //         this.unKnowUserRegister.emit(result);
  //         // this._dialog.close(true);
  //         // this._router.navigate([this.data?.path,this.data?.productId]);
  //       } else if (result?.Data && result?.Data.pinset && result?.Data.pinset == false) {
  //         this._router.navigate(['/create-pin'])
  //       } else {
  //         this._router.navigate(['/otp']);
  //       }
  //     } else {
  //       this.registerForm.enable();
  //       this._globalFunctions.successErrorHandling(result?.Message, this, true);
  //       // this.isBtnLoading = false;
  //     }
  //   }, (error: any) => {
  //     this.registerForm.enable();
  //     this.registerNgForm.resetForm();
  //     this.phoneForm = empty;
  //     this.profileImage = ''
  //     this._globalFunctions.errorHanding(error, this, true);
  //     // this.isBtnLoading = false;
  //   });
  // }

  signUp(): void {
    // this.isBtnLoading = true;
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach((key) => {
        this.registerForm.controls[key].touched = true;
        this.registerForm.controls[key].markAsDirty();
      });
      return;
    }
    if (this.phoneForm.invalid) {
      Object.keys(this.phoneForm.controls).forEach((key) => {
        this.phoneForm.controls[key].touched = true;
        this.phoneForm.controls[key].markAsDirty();
      })
      return;
    }
    if (!this.validate()) {
      return;
    }
    const signupDataObj: any = {
      profile: this.registerForm.value.profileUpload,
      fullname: this.registerForm.value.fullname,
      email: this.registerForm.value.email.toLowerCase(),
      currency: this.registerForm.value.currency,
      gender: this.registerForm.value.gender,
      user_from: "Web"
    };
    signupDataObj.country_wise_contact = this.phoneForm.value?.phone || "";
    const contactNumber = signupDataObj?.country_wise_contact?.e164Number;
    signupDataObj.country_code = signupDataObj?.country_wise_contact?.dialCode || "";
    signupDataObj.mobile = contactNumber.replace(signupDataObj?.country_code, '') || '';
    // this.registerForm.disable();
    this._authService.register(signupDataObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        // localStorage.setItem('accessToken', result.Data.token);
        // this._toastr.success(result.Message, 'Success');
        let coupon_code: any = result?.Data?.coupon_code;
        Swal.fire({
          position: "center",
          icon: "success",
          title: result.Message,
          showConfirmButton: false,
          timer: 2000,
          width: '400px'
        });
        // Swal.fire({
        //   title: "<strong>Coupen Code</strong> " + coupon_code,
        //   icon: "success",
        //   html: result.Message,
        //   showDenyButton: true,
        //   confirmButtonText: "Ok",
        //   denyButtonText: `Copy Coupon`
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //   } else if (result.isDenied) {
        //     const textarea = document.createElement('textarea');
        //     textarea.value = coupon_code;
        //     document.body.appendChild(textarea);
        //     textarea.select();
        //     document.execCommand('copy');
        //     document.body.removeChild(textarea);
        //     Swal.fire({
        //       position: "center",
        //       icon: "success",
        //       title: 'Coupon Copy Successfully',
        //       showConfirmButton: false,
        //       timer: 2000,
        //       width: '400px'
        //     });
        //   }
        // });
        let rawNumber = this.phoneForm.value.phone.number;
        let cleanedNumber = rawNumber.replace(/\D/g, '').slice(-10);
        localStorage.setItem('registerEmail', cleanedNumber);
        if (this.isUnknowUser) {
          this.unKnowUserRegister.emit(result);
          this.registerForm.reset();
          this.phoneForm.reset();
          // this._dialog.close(true);
          // this._router.navigate([this.data?.path,this.data?.productId]);
        // } else if (result?.Data && result?.Data.pinset && result?.Data.pinset == false) {
        //   this._router.navigate(['/createpin'])
        // } else {
        //   this._router.navigate(['/otp']);
        }
      } else {
        this.registerForm.enable();
        this.phoneForm.enable();
        this._globalFunctions.successErrorHandling(result?.Message, this, true);
        // this.isBtnLoading = false;
      }
    }, (error: any) => {
      this.registerForm.enable();
      this.phoneForm.enable();
      this.registerNgForm.resetForm();
      this.phoneForm.reset();
      // this.phoneForm = empty;
      this.profileImage = ''
      this._globalFunctions.errorHanding(error, this, true);
      // this.isBtnLoading = false;
    });
  }

  loginUser() {
    if (this.isUnknowUser) {
      this.isOpenLogInFormPopup.emit(true);
    } else {
      this._router.navigate(['/login'])
    }
  }

  closeDialog() {
    this.unKnowUserRegister.emit(false);
  }

  removeItemAvatar() {
  }
}
