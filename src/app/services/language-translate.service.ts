import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CONSTANTS } from '../common/constants';

@Injectable({
  providedIn: 'root'
})
export class LanguageTranslateService {

  constructor(
    public translate: TranslateService
  ) {
    // this.translate.setDefaultLang('us-english');
    // this.translate.use('us-english');
  }

  setLanguageCode(code: any = CONSTANTS.languageJSON[0].value) {
    this.translate.setDefaultLang(code);
    this.translate.use(code);
  }
}
