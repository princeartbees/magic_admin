import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { GlobalFunctions } from '../../common/global-function';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../services/global.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { CONSTANTS } from '../../common/constants';
import { TranslateModule } from '@ngx-translate/core';
declare const google: any;
declare const FB: any;
declare var AppleID: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, AfterViewInit {
  userData: any;
  @Input() isUnknowUser!: boolean;
  @Output() unknowUserlogIn: EventEmitter<any> = new EventEmitter<any>()
  @Output() isOpenRegisterFormPopup: EventEmitter<any> = new EventEmitter<any>()
  @Output() isOpenForGetPinFormPopup: EventEmitter<any> = new EventEmitter<any>()
  @ViewChild('logInNgForm') logInNgForm: any;
  logInForm: any = FormGroup;
  isBtnLoading: boolean = false;
  hidePin: boolean = true;
  constants: any = CONSTANTS;
  // location:any = Location
  // @Output() userLogin:any = new EventEmitter();

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private toastr: ToastrService,
    private _authService: AuthService,
    private _globalService: GlobalService,
    private location: Location
    // private _dialog:MatDialogRef<LogInComponent>,
    // @Inject(MAT_DIALOG_DATA) public data:any,
  ) {
  }

  ngOnInit() {

    //Apple Login
    AppleID.auth.init({
      clientId: 'com.magicshaircare',
      scope: 'name email',
      redirectURI: 'https://magicshaircare.com/', // Replace with your redirect URL
      state: 'random_state',
      usePopup: true // Set to true if you want to handle the login in a popup window
    });


    // // Material dialog
    // if(this.data?.productId){
    //   this.isUnknowUser = true
    // }
    // if(this.productId){
    //   this.isUnknowUser = true
    // }
    // if(typeof window != 'undefined'){
    //   localStorage.clear();
    // }
    this.logInForm = this._formBuilder.group({
      email: ['', [Validators.required]],
      // pin: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    // Manually render the Google Sign-In button after view initialization
    google.accounts.id.initialize({
      client_id: this.constants.googleLoginClientID,
      callback: this.handleCredentialResponse.bind(this)
    });

    google.accounts.id.renderButton(
      document.getElementById('googleSignInButton'),
      { type: "standard", theme: "outline", size: "large", shape: "circle", width: "100", logo_alignment: "left" }   // Customize button as needed
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
              this.unknowUserlogIn.emit(result);
              localStorage.removeItem('userDetails');
            } else {
              // this.location.back();
              const fallbackUrl = window.location.origin; // Set a valid fallback URL
              if (this.location && typeof this.location.back === "function") {
                let currentUrl: any = this.location.back();
                if (!currentUrl || currentUrl.includes("undefined")) {
                  window.location.href = fallbackUrl; // Redirect to fallback URL if invalid
                }
              } else {
                window.location.href = fallbackUrl; // Redirect directly if no valid back method
              }
            }
            this.isBtnLoading = false;

          } else {
            this._globalFunctions.successErrorHandling(result, this, true);
            this.unknowUserlogIn.emit(false);
          }
        }, (error: any) => {
          this._globalFunctions.errorHanding(error, this, true);
        });
      } else {
        this._globalFunctions.successErrorHandling("Something went wrong..!", this, true);
        this.unknowUserlogIn.emit(false);
      }

    } else {
      this._globalFunctions.successErrorHandling("Something went wrong..!", this, true);
      this.unknowUserlogIn.emit(false);
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
                  this.unknowUserlogIn.emit(result);
                  localStorage.removeItem('userDetails');
                } else {
                  // this.location.back();
                  const fallbackUrl = window.location.origin; // Set a valid fallback URL
                  if (this.location && typeof this.location.back === "function") {
                    let currentUrl: any = this.location.back();
                    if (!currentUrl || currentUrl.includes("undefined")) {
                      window.location.href = fallbackUrl; // Redirect to fallback URL if invalid
                    }
                  } else {
                    window.location.href = fallbackUrl; // Redirect directly if no valid back method
                  }
                }
                this.isBtnLoading = false;

              } else {
                this._globalFunctions.successErrorHandling(result, this, true);
                this.unknowUserlogIn.emit(false);
              }
            }, (error: any) => {
              this._globalFunctions.errorHanding(error, this, true);
            });
          } else {
            this._globalFunctions.successErrorHandling("Something went wrong..!", this, true);
            this.unknowUserlogIn.emit(false);
          }
        });
      } else {
        this._globalFunctions.successErrorHandling("Something went wrong..!", this, true);
        this.unknowUserlogIn.emit(false);
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
                this.unknowUserlogIn.emit(result);
                localStorage.removeItem('userDetails');
              } else {
                // this.location.back();
                const fallbackUrl = window.location.origin; // Set a valid fallback URL
                if (this.location && typeof this.location.back === "function") {
                  let currentUrl: any = this.location.back();
                  if (!currentUrl || currentUrl.includes("undefined")) {
                    window.location.href = fallbackUrl; // Redirect to fallback URL if invalid
                  }
                } else {
                  window.location.href = fallbackUrl; // Redirect directly if no valid back method
                }
              }
              this.isBtnLoading = false;

            } else {


              this._globalFunctions.successErrorHandling(result, this, true);
              this.unknowUserlogIn.emit(false);
            }
          }, (error: any) => {


            this._globalFunctions.errorHanding(error, this, true);
            this.unknowUserlogIn.emit(false);
          });
        } else {

          this._globalFunctions.successErrorHandling("Something went wrong..!", this, true);
          this.unknowUserlogIn.emit(false);
        }
      } else {

        this._globalFunctions.successErrorHandling("Something went wrong..!", this, true);
        this.unknowUserlogIn.emit(false);
      }

    }).catch((error: any) => {
      this._globalFunctions.successErrorHandling("Something went wrong..!", this, true);
      this.unknowUserlogIn.emit(false);
    });
  }

  validate(): boolean {
    let flag: boolean = true;
    const errorFields: any = [];
    if (!this.logInForm.value.email || this.logInForm.value.email === "") {
      // this._sNotify.error('phone or mobile is required!', 'Oops!');

      errorFields.push('username');
      flag = false;
      // return false;
    }
    // if (!this.logInForm.value.pin || this.logInForm.value.pin === "") {
    //   // this._sNotify.error('Password is required!', 'Oops!');
    //   errorFields.push('PIN');
    //   flag = false;
    //   // return false;
    // }
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

  logIn(): void {
    this.isBtnLoading = true;
    if (!this.validate()) {
      return;
    }
    const loginDataObj: any = {
      emailormobile: this.logInForm.value.email.toString(),
      // pin: this.logInForm.value.pin
    };
    this.logInForm.disable();
    this._authService.getLogIn(loginDataObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        // ? localStorage.setItem('accessToken', result.Data.accessToken);
        // this._globalService.logoutPage$.next(null);
        let coupon_code: any = result?.Data?.coupon_code;
        Swal.fire({
          position: "center",
          icon: "success",
          title: result.Message,
          showConfirmButton: false,
          timer: 2000,
          width: '400px'
        });
         localStorage.setItem('registerEmail', this.logInForm.value.email.toString());
        // ? Swal.fire({
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
        //   window.location.reload();
        // ? });

        // this._router.navigate(['/']);
        if (this.isUnknowUser) {
          this.unknowUserlogIn.emit(result);
          localStorage.removeItem('userDetails');
        } else {
          // this.location.back();
          const fallbackUrl = window.location.origin; // Set a valid fallback URL
          if (this.location && typeof this.location.back === "function") {
            let currentUrl: any = this.location.back();
            if (!currentUrl || currentUrl.includes("undefined")) {
              window.location.href = fallbackUrl; // Redirect to fallback URL if invalid
            }
          } else {
            window.location.href = fallbackUrl; // Redirect directly if no valid back method
          }
          // ? if (this.location?.history?.length > 0) {
          // } else {
          //   this._router.navigate(['/home']);
          // ? }
        }
        this.isBtnLoading = false;

      } else {
        this.logInForm.enable();
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isBtnLoading = false;
        if (this.isUnknowUser) {
          this.unknowUserlogIn.emit(result);
        }
      }
    }, (error: any) => {
      this.logInForm.enable();
      this.logInNgForm.resetForm();
      this._globalFunctions.errorHanding(error, this, true);
      this.isBtnLoading = false;
      if (this.isUnknowUser) {
        this.unknowUserlogIn.emit({ IsSuccess: false, Message: 'Login failed' });
      }
    });
  }

  registerUser() {
    if (this.isUnknowUser) {
      this.isOpenRegisterFormPopup.emit(true);
    } else {
      this._router.navigate(['/register']);
    }
  };

  forGetPin() {
    if (this.isUnknowUser) {
      this.isOpenForGetPinFormPopup.emit({ isSuccess: true, isChangeMail: false });
    } else {
      this._router.navigate(['/forgetpin']);
    }
  }

  closeDialog() {
    this.unknowUserlogIn.emit(false);
  }

}