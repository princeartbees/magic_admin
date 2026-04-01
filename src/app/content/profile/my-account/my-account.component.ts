import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AddEditAddressComponent } from '../../add-edit-address/add-edit-address.component';
import {MatRadioModule} from '@angular/material/radio';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxIntlTelInputModule,CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { MatSelectModule } from '@angular/material/select';
import { ProfileService } from '../profile.service';
import { CONSTANTS } from '../../../common/constants';
import { ToastrService } from 'ngx-toastr';
import { GlobalFunctions } from '../../../common/global-function';
import { GlobalService } from '../../../services/global.service';
import { AddressService } from '../../add-edit-address/address.service';
import { ImageModule } from 'primeng/image';
import Swal from 'sweetalert2';
import { TranslateModule } from '@ngx-translate/core';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule,AddEditAddressComponent,MatRadioModule,ReactiveFormsModule,FormsModule,NgxIntlTelInputModule,MatSelectModule,ImageModule,TranslateModule],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss'
})
export class MyAccountComponent implements OnInit{
  personalInfoForm: any = FormGroup;
  edieData: any;
  selectedValue: string = '';
  imageUrl: any = '';
  addressId:any = '';
  constents:any = CONSTANTS;
  isAddEditAddress: boolean = false;
  isAddEditAddressLoading: boolean = false;
  selectedAddress: any;
  selectedAddressId: any;
  addressDetailsList:any = [];
  isDisable:boolean = false;

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.India];
  phoneForm:any = new FormGroup({
    phone: new FormControl(''),
  });
  @Output() saveAndAddEditAddress:EventEmitter<any> = new EventEmitter<any>();
  @Input() addressObj: any;

  constructor(private fb:FormBuilder,
    private _profileService:ProfileService,
    private _toastr:ToastrService,
    private _globalFunctions:GlobalFunctions,
    private _globalService:GlobalService,
    private _addressService:AddressService
  ){} 

  ngOnInit(): void {
    this.intitForm();
    this._globalService.addressListData$.subscribe((result:any) => {
      if(result){
        this.addressDetailsList = result?.Data?.docs;
      }
    })
    this.getOneProfile();
  }

  intitForm(obj:any = {}){
    this.personalInfoForm = this.fb.group({
      profile_img: [''],
      fullName: [obj?.fullname || '',Validators.required],
      gender: [obj?.gender || ''],
      email: [{value: '', disabled: true}],
      currency: [{value: '', disabled: true}]
    });
  }

  getOneProfile(){
    this._profileService.getProfileData().subscribe((result:any) => {
      if(result && result.IsSuccess){
        this.imageUrl = result?.Data?.profile_pic;
        this.personalInfoForm.get('profile_img').setValue(result?.Data?.profile_pic);
        this.personalInfoForm.get('fullName').setValue(result?.Data?.fullname);
        this.personalInfoForm.get('gender').setValue(result?.Data?.gender);
        this.personalInfoForm.get('email').setValue(result?.Data?.email);
        this.personalInfoForm.get('currency').setValue(result?.Data?.base_currency);
        this.phoneForm.get('phone').setValue(result?.Data?.country_code + " " + result?.Data?.mobile);
      }
    })
    // this.isDisable = false;
  }

  uploadImage(event:any){
    if(event.target.files && event.target.files[0]){
      const file = event.target.files[0];
      if(file == 'image'){
        if(!this.constents.imagearray.includes(file.type)){
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
      const fileObj: any = new FormData();
      fileObj.append('file', file);
      this._profileService.getProfile(fileObj).subscribe((result:any) => {
        if(result && result.IsSuccess){
          this.imageUrl = result?.Data?.profile_pic;
          const profileFormControl = this.personalInfoForm.get('profile_img');
          profileFormControl.setValue(result?.Data?.profile_pic);
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
          this._globalFunctions.successErrorHandling(result, this, true);
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
      })
    }
  }

  getEditProfile(){
    if (this.phoneForm.invalid) {
      Object.keys(this.phoneForm.controls).forEach((key) => {
        this.phoneForm.controls[key].touched = true;
        this.phoneForm.controls[key].markAsDirty();
      })
      return;
    }
    // this.isDisable = true;
    const editDataobj:any = {
      fullname: this.personalInfoForm.value.fullName || '',
      gender: this.personalInfoForm.value.gender || '',
    };
    editDataobj.country_wise_contact = this.phoneForm.value?.phone || "";
    const contactNumber = editDataobj?.country_wise_contact?.e164Number;
    editDataobj.country_code = editDataobj?.country_wise_contact?.dialCode || "";
    editDataobj.mobile = contactNumber.replace(editDataobj?.country_code, '') || '';

    this._profileService.editProfile(editDataobj).subscribe((result:any) => {
      if(result && result.IsSuccess){
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
        this.isDisable = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isDisable = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isDisable = false;
    })
  }  

  // setEditFullName(ele:any){
  //   this.personalInfoForm.get('fullName').setValue(ele?.fullname);

  // }

  selectedAddressChange(event:any){
    this.selectedAddressId = event?.value;
    const addressObj = {
      addressid: this.selectedAddressId
    }
    this._addressService.selectAddress(addressObj).subscribe((result:any) => {
      if(result && result.IsSuccess){
        this._globalService.addressListDataPagination$.next(null);
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
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
    })
  }

  editAddress(addressObj:any){
    this.isAddEditAddressLoading = true;
    this.isAddEditAddress = false;
    setTimeout(() => {
      this.selectedAddress = addressObj;
      this.isAddEditAddress = true;
      this.isAddEditAddressLoading = false;
    }, 500);
  }

  deleteAddress(addressObj:any){
    this._addressService.deleteAddress({addressid:addressObj?._id}).subscribe((result:any)=>{
      if(result && result.IsSuccess){
        this._globalService.addressListDataPagination$.next(null);
        Swal.fire({
          position: "center",
          icon: "success",
          title: result.Message,
          showConfirmButton: false,
          timer: 2000,
          width: '400px'
        });
      }else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
    });
  }

  addressAddEdit(event:any) {
    this.isAddEditAddress = false;
  }
}
