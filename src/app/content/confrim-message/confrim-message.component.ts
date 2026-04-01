import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GlobalFunctions } from '../../common/global-function';
import { SubscriptionService } from '../subscription/subscription.service';
import { CartService } from '../cart-list/cart.service';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../services/global.service';
declare var $: any;

@Component({
  selector: 'app-confrim-message',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confrim-message.component.html',
  styleUrl: './confrim-message.component.scss'
})
export class ConfrimMessageComponent implements OnInit,OnDestroy {
  orderDetail: any = null;
  isOrderConfrim: boolean = false;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _globalService: GlobalService,
  ) {
    history.pushState(null, "", location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    if( window.localStorage )
      {
        if( !localStorage.getItem('firstLoad') )
        {
          history.pushState(null, "", location.href);
            window.onpopstate = function () {
            history.go(1);
          };
          localStorage['firstLoad'] = true;
          // window.location.reload();
          window.history.back();
          $('.page-loader').fadeOut('fast');
        }  
        else{
          localStorage.removeItem('firstLoad');
        }
      }
    
    $('.page-loader').fadeIn('fast');
    setTimeout(() => {
      $('.page-loader').fadeOut('slow');
    }, 1500);

    history.pushState(null, "", location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }

  ngOnInit(): void {
    if(typeof window != 'undefined' && localStorage.getItem('OD')){
      this.orderDetail = JSON.parse(localStorage.getItem('OD')!);
      if(this.orderDetail.type == 'order'){
        this.isOrderConfrim = true;
      } else if(this.orderDetail.type == 'plan'){
        this.isOrderConfrim = false;
      }
    } else {
      this._router.navigate(['/shop'])
    }
  }

  ngOnDestroy(): void {
    if(typeof window != 'undefined' && localStorage.getItem('OD')){
      localStorage.removeItem('OD');
      localStorage.removeItem('firstLoad');
    }
  }

}
