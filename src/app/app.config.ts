import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouterModule, provideRouter, withHashLocation } from '@angular/router'

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { GlobalFunctions } from './common/global-function';
import { ToastNoAnimation, ToastrService, provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CookieService } from 'ngx-cookie-service';
import { HashLocationStrategy, Location } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Factory function for the HTTP loader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),     
    provideAnimations(),
    GlobalFunctions,    
    provideToastr(),
    { provide: ToastrService, useClass: ToastrService },
    { provide: ToastNoAnimation, useClass: ToastNoAnimation },
    provideAnimationsAsync(),
    CookieService,
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    TranslateService
    // { provide: Location, useClass: HashLocationStrategy }
  ]
};
