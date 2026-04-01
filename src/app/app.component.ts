import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './content/header/header.component';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './services/shared.module';
import { FooterComponent } from './content/footer/footer.component';

import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { LanguageTranslateService } from './services/language-translate.service';
import { CONSTANTS } from './common/constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SharedModule,
    
  ],
  providers: [
    
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'  
})
export class AppComponent {
  title = 'magichair_website_html';

  constructor(private _translateLanguage: LanguageTranslateService){
    if (typeof window !== 'undefined' && window.localStorage) {
    let selectedLanguage = localStorage.getItem('lang');
    if (!selectedLanguage || selectedLanguage == '') {
      localStorage.setItem('lang', CONSTANTS.languageJSON[0].value);
      selectedLanguage = CONSTANTS.languageJSON[0].value;
    }
  
    this._translateLanguage.setLanguageCode(selectedLanguage || CONSTANTS.languageJSON[0].value);
  }
  }
}
