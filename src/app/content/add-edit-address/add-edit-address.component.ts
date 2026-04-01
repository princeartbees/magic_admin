import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AddressService } from './address.service';
import { GlobalFunctions } from '../../common/global-function';
import { CountryISO, NgxIntlTelInputModule, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from '../../services/global.service';
import { MatRadioModule } from '@angular/material/radio';
import Swal from 'sweetalert2';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-edit-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, NgxIntlTelInputModule, MatRadioModule, TranslateModule],
  templateUrl: './add-edit-address.component.html',
  styleUrl: './add-edit-address.component.scss'
})
export class AddEditAddressComponent implements OnInit {

  @Output() saveAndAddEditAddress: EventEmitter<any> = new EventEmitter<any>();
  @Input() addressObj: any;

  selectedCountry = 'india';
  addressId: any = '';
  locationData: any = [];
  addressForm: any = FormGroup;
  countriesWiseState: any = ['Gujarat', 'Maharashtra', 'Uttar Pradesh', 'punjab'];
  adfPincode: any;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.India];
  phoneForm: any = new FormGroup({
    phone: new FormControl(null, [Validators.required]),
  });
  alternatePhoneForm: any = new FormGroup({
    alternate_phone: new FormControl(null),
  });
  isAddEditAddress: boolean = false;
  isAddEditAddressLoading: boolean = false;
  selectedAddress: any;
  selectedAddressId: any;
  addressType: string[] = ['Home', 'Office', 'Other'];
  userDetailsFromStep:any;

  constructor(
    private _formBuilder: FormBuilder,
    private _addressService: AddressService,
    private _globalFunctions: GlobalFunctions,
    private _toastr: ToastrService,
    private _globalService: GlobalService
  ) { }

  ngOnInit(): void {
    this.prepareAddressFormObject();
    const data = JSON.parse(localStorage.getItem('userDetails')!);
    if (data) {
      this.addressForm.get('fullname').setValue(data?.fullname);
      this.phoneForm.get('phone').setValue(data?.country_wise_contact);
    } else {
      this.addressForm.get('fullname').setValue("");
      this.phoneForm.get('phone').setValue("");
    }
    if (this.addressObj) {
      this.addressId = this.addressObj?._id;
      this.phoneForm.get('phone').setValue(this.addressObj?.country_wise_contact);
      this.alternatePhoneForm.get('alternate_phone').setValue(this.addressObj?.alternate_country_wise_contact);
      this.prepareAddressFormObject(this.addressObj);
    }
  }

  getPincode(event: any = '') {
    if (event?.target?.value.length == 6) {
      this._addressService.getPincodeDetail({ pincode: event?.target?.value }).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.adfPincode = result?.Data[0]?.PostOffice?.[0];
          this.addressForm.get('state').setValue(this.adfPincode.State);
          this.addressForm.get('city').setValue(this.adfPincode.District);
        } else {
          this.addressForm.get('state').setValue('');
          this.addressForm.get('city').setValue('');
          this._globalFunctions.successErrorHandling(result.Message, this, true);
        }
      }, (error: any) => {
        this.addressForm.get('state').setValue('');
        this.addressForm.get('city').setValue('');
        this._globalFunctions.errorHanding(error, this, true);
      })
    }
  }

  saveAddress() {
    if (this.addressForm.invalid) {
      Object.keys(this.addressForm.controls).forEach((key) => {
        this.addressForm.controls[key].touched = true;
        this.addressForm.controls[key].markAsDirty();
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
    // if (this.alternatePhoneForm.invalid) {
    //   Object.keys(this.alternatePhoneForm.controls).forEach((key) => {
    //     this.alternatePhoneForm.controls[key].touched = true;
    //     this.alternatePhoneForm.controls[key].markAsDirty();
    //   })
    //   return;
    // }
    let addressDataObj: any = {
      addressId: this.addressId != '' ? this.addressId : '',
      fullname: this.addressForm.value.fullname || '',
      building: this.addressForm.value.building || '',
      sector: this.addressForm.value.sector || '',
      land_mark: this.addressForm.value.land_mark || '',
      pincode: this.addressForm.value.pincode || '',
      city: this.addressForm.value.city || '',
      state: this.addressForm.value.state || '',
      country: this.selectedCountry || 'india',
      addresstype: this.addressForm.value.address_type || ''
    }
    addressDataObj.country_wise_contact = this.phoneForm.value?.phone || "";
    const contactNumber = addressDataObj?.country_wise_contact?.e164Number;
    addressDataObj.country_code = addressDataObj?.country_wise_contact?.dialCode || "";
    addressDataObj.mobile = contactNumber.replace(addressDataObj?.country_code, '') || '';

    addressDataObj.alternate_country_wise_contact = this.alternatePhoneForm.value?.alternate_phone || "";
    const alternateContactNumber = addressDataObj?.alternate_country_wise_contact?.e164Number;
    addressDataObj.alternate_country_code = addressDataObj?.alternate_country_wise_contact?.dialCode || "";
    if (alternateContactNumber && addressDataObj.alternate_country_code) {
      addressDataObj.alternate_phone = alternateContactNumber.replace(addressDataObj.alternate_country_code, '') || '';
    } else {
      addressDataObj.alternate_phone = "";  // Handle case where alternateContactNumber is undefined or empty
    }

    if (typeof window != 'undefined' && localStorage.getItem('accessToken')) {
      this._addressService.saveAddress(addressDataObj).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.saveAndAddEditAddress.emit(addressDataObj)
          this._globalService.addressListDataPagination$.next(null);
          // this._toastr.clear();
          // this._toastr.success(result.Message,'Success');
          Swal.fire({
            position: "center",
            icon: "success",
            title: result.Message,
            showConfirmButton: false,
            timer: 2000,
            width: '400px'
          });
        } else {
          this._globalFunctions.successErrorHandling(result.Message, this, true);
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
      })
    } else {
      this.saveAndAddEditAddress.emit(addressDataObj);
      Swal.fire({
        position: "center",
        icon: "success",
        title: 'Your address is temporary saved.',
        showConfirmButton: false,
        timer: 2000,
        width: '400px'
      });
    }

  }

  prepareAddressFormObject(obj: any = {}) {
    this.addressForm = this._formBuilder.group({
      fullname: [obj?.fullname || '', Validators.required],
      building: [obj?.building || '', [Validators.required]],
      sector: [obj?.sector || '', [Validators.required]],
      city: [obj?.city || '', [Validators.required]],
      state: [obj?.state || '', [Validators.required]],
      land_mark: [obj?.land_mark || ''],
      pincode: [obj?.pincode || '', [Validators.required, Validators.maxLength(6)]],
      checkCondition: [obj?.select || ''],
      address_type: [obj?.addresstype || 'Other', Validators.required]
    })
  }


}
