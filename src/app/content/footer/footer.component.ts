  import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { GlobalFunctions } from '../../common/global-function';
import { CartService } from '../cart-list/cart.service';
import { AddressService } from '../add-edit-address/address.service';
import { CookieService } from 'ngx-cookie-service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule,TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit{

  cartListCount:any;

  constructor(
    private _globalService: GlobalService,
    private _globalFunction: GlobalFunctions,
    private _cartService: CartService,
    private _addressService: AddressService,
    private _cookieService: CookieService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._globalService.totalCartListCount$.subscribe((result) => {
      this.cartListCount = result;
    })
  }

  redirectToSpecificPage(page:any){
    window.location.href = window.location.origin + "/" + page
  }

}
