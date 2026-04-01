import { NgModule } from "@angular/core";
import { ToastrModule } from "ngx-toastr";

@NgModule({
  imports:[    
    // ToastrModule.forRoot({
    //   positionClass :'toast-bottom-right'
    // }),
    ToastrModule.forRoot({
      timeOut: 3500,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),
  ],
  exports:[]
})

export class SharedModule{}