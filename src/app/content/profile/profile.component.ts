import { CommonModule } from '@angular/common';
import { isNgContainer } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from '../../services/global.service';
import { LogoutComponent } from '../../common/logout/logout.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { TranslateModule } from '@ngx-translate/core';
declare var $:any;

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatTabsModule, CommonModule, RouterModule,TranslateModule, MatDialogModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  constructor(
    private _router: Router,
    private _cookieService: CookieService,
    private _toster: ToastrService,
    private _globalService: GlobalService,
    private _dialog: MatDialog
  ) { 
    $('.page-loader').fadeIn('fast');
    setTimeout(() => {
      $('.page-loader').fadeOut('slow');
    }, 1500);
  }

  ngOnInit(): void {
    if (typeof window != undefined && !localStorage.getItem('accessToken')) {
      this._router.navigate(['/home']);
    }
  }

  logoutSite() {
    const dialogRef = this._dialog.open(LogoutComponent, {
      width: '500px',
      data: [],
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        localStorage.clear();
        this._cookieService.deleteAll();
        this._toster.clear();
        // this._toster.success('Logout Successfully..', 'Success');
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Logout Successfully..!",
          showConfirmButton: false,
          timer: 2000,
          width: '400px'
        });
        this._router.navigate(['/home']);
        this._globalService.logoutPage$.next(null);
      }
    })
  }

  onScroll(event:any){
  }

}
