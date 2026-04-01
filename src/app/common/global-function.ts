import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CONSTANTS } from "./constants";
import Swal from "sweetalert2";

@Injectable()

export class GlobalFunctions{

  accessToken:any;

  constructor(
    private _toastr:ToastrService,
    private _router:Router
  ){
    if(typeof window != 'undefined'){
      this.accessToken = localStorage.getItem('accessToken');
    }
  }

  getHeader():any{
    return {
      headers: new HttpHeaders({
        'content-type':'application/json'
      })
    }
  };

  getFileAuthorizationHeader():any {
    return {
      headers: new HttpHeaders({
        'Authorization':'bearer ' + localStorage.getItem('accessToken')
      })
    }
  };

  getAuthorizationHeader() :any {
    return {
      headers: new HttpHeaders({
        'content-type':'application/json',
        'Authorization':'bearer '+ localStorage.getItem('accessToken')
      })
    }
  };

  getRazorpayHeader() :any {
    return {
      headers: new HttpHeaders({
        //test
        // 'Authorization': `Basic ${btoa(`${'rzp_test_xLCgO4y8whu5mi'}:${'XcmjX9kA8a8uqhLPnhOXoH9U'}`)}`,
        // 'Content-Type': 'application/json'

        //live
        'Authorization': `Basic ${btoa(`${'rzp_live_iHbyVn589aKEAn'}:${'LMmdd6x68lnZodgzJZ89WrEI'}`)}`,
        'Content-Type': 'application/json'
      })
    }
  };

  getRazorpayHeaderWithAuth() :any {
    return {
      headers: new HttpHeaders({
        'Authorization': 'bearer '+ localStorage.getItem('accessToken'),
        'Content-Type': 'application/json'
      })
    }
  };


  successErrorHandling(response: any, that: any, messageVariable: any): any {
    this._toastr.clear();
    let messageText = '';
    messageText = response.message || CONSTANTS.message.INTERNAL_ERROR;
    if (response.code === CONSTANTS.errorCodes.UNAUTHORIZED ||
      response.code === CONSTANTS.errorCodes.TOKEN_EXPIRED ||
      response.code === CONSTANTS.errorCodes.TOKEN_REQUIRED) {
      if(typeof window != 'undefined'){
        localStorage.removeItem('accessToken');          
      }
      // this._toastr.error(messageText, 'Oops..!');
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: messageText,
        showCancelButton:false,
        timer:1500
      });
      // window.location.href = '/login';
      this._router.navigate(['/login'], { queryParams: { redirectURL: this._router.url } });
    } else {
      // this._toastr.error(messageText, 'Oops..!');
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: messageText,
        showCancelButton:false,
        timer:1500
      });
    }
    if (messageVariable) {
      messageVariable = messageText;
    }
  }

  errorHanding(errorResponse: any, that: any, messageVariable: any, isSingleErrorReturn: boolean = false): any {
    // let error = errorResponse.json();
    const error = errorResponse.error;
    this._toastr.clear();
    let messageText = '';
    messageText = errorResponse.message || CONSTANTS.message.INTERNAL_ERROR;
    if (error) {
      if (error.detail) {
        messageText = error.detail;
      } else if (error.error) {
        messageText = error.error;
      } else if (error.Message) {
        messageText = error.Message;
      }
    }
    if (errorResponse.status === CONSTANTS.errorCodes.UNAUTHORIZED ||
      errorResponse.status === CONSTANTS.errorCodes.TOKEN_EXPIRED ||
      errorResponse.status === CONSTANTS.errorCodes.TOKEN_REQUIRED) {
      if(typeof window != 'undefined'){
        localStorage.removeItem('accessToken');          
      }
      // this._toastr.error(messageText, 'Oops..!');
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: messageText,
        timer : 1500,
        showConfirmButton:false
      });
      // window.location.href = '/login';
      this._router.navigate(['/login'], { queryParams: { redirectURL: this._router.url } });
    } else if (errorResponse.status === CONSTANTS.errorCodes.ERROR_CODE_VALIDATION_FAILED ||
      errorResponse.status === CONSTANTS.errorCodes.ALREADY_EXISTS) {
      if (error.error && Object.keys(error.error).length) {
        messageText = '';
        error.error
        error.error.forEach((message: any, key: any) => {
          messageText = messageText + ' ' + message;
          if (isSingleErrorReturn) {
            if (messageVariable) {
              messageVariable = messageText;
            };
            that.message.error = messageText;
            return;
          }          
        });
        // this._toastr.error(messageText, 'Oops..!');
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: messageText,
          timer : 1500,
        showConfirmButton:false

        });
      }
    } else if (errorResponse.status === CONSTANTS.errorCodes.BAD_REQUEST ||
      errorResponse.status === CONSTANTS.errorCodes.NOT_FOUND_HTTP_EXCEPTION ||
      errorResponse.status === CONSTANTS.errorCodes.PERMISSION_DENIED ||
      errorResponse.status === CONSTANTS.errorCodes.METHOD_NOT_FOUND ||
      // errorResponse.status === CONSTANTS.errorCodes.ALREADY_EXISTS ||
      errorResponse.status === CONSTANTS.errorCodes.DATABASE_INITIALIZATION_FAIL ||
      errorResponse.status === CONSTANTS.errorCodes.INVALID_DOMAIN) {
      // this._toastr.error(messageText, 'Oops..!');
       Swal.fire({
        icon: "error",
        title: "Oops...",
        text: messageText
      });
    } else {
      // this._toastr.error(messageText, 'Oops..!');
       Swal.fire({
        icon: "error",
        title: "Oops...",
        text: messageText
      });
    }
    if (!messageVariable) {
      if (that.message && that.message) {
        that.message.error = messageText;
      }
    } else {
      messageVariable = messageText;
    }
    if (that.isLoading) {
      that.isLoading = false;
    }
  }

   // Manually decode JWT token
   decodeJwt(token: string) {
    try {
      const base64Url = token.split('.')[1];  // Extract payload part
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }
}

// Basic btoa(rzp_test_xLCgO4y8whu5mi:XcmjX9kA8a8uqhLPnhOXoH9U)
// Basic btoa('rzp_test_xLCgO4y8whu5mi:XcmjX9kA8a8uqhLPnhOXoH9U')
// 'Basic ' + btoa('rzp_test_xLCgO4y8whu5mi:XcmjX9kA8a8uqhLPnhOXoH9U')
