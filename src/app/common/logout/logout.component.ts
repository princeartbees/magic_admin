import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent{

  constructor(public dialogRef: MatDialogRef<LogoutComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ){}

  logoutPage(){
    this.dialogRef.close(true);
  }

  onClose(){
    this.dialogRef.close(false);
  }

}
