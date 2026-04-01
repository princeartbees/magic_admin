import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { flush } from '@angular/core/testing';
import { CONSTANTS } from '../../common/constants';
import { LanguageTranslateService } from '../../services/language-translate.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports:[CommonModule],
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit{
  constants: any = CONSTANTS;
  languageArr:any = CONSTANTS.languageJSON;
  filteredLanguageArr:any = CONSTANTS.languageJSON;
  selectedLanguage: any;
  languageDropdownHeight:any;
  languageInputSearch:any = '';
  isLanguageDropdownOpen:boolean = false;
  isOpenDialog:boolean = false;

  @Output() closePopup:any = new EventEmitter();

  constructor(
    private _translateLanguage: LanguageTranslateService,
    private elRef:ElementRef
  ){}

  ngOnInit(): void {
    setTimeout(() => {
      this.initialSetData()
      this.isOpenDialog = true;      
    }, 100);
  }

  initialSetData() {
    this.languageDropdownHeight = this.elRef.nativeElement.querySelector('#language-dropdown').clientHeight;
    if(localStorage.getItem('lang') && localStorage.getItem('lang') != ''){
      this.filteredLanguageArr.map((language:any)=>{
        language.isSelected = false;
        if(language.value == localStorage.getItem('lang')){
          this.selectedLanguage = language;
          language.isSelected = true;
        }
      })
    }
  }

  selectLanguageDropdown(){
    this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
  }

  selectionChangeLanguage(element:any){
    this.languageArr.map((item:any)=>{
      item.isSelected = false;
      if(element.value == item.value){
        item.isSelected = true;
        this.selectedLanguage = element;
      }
    });
    setTimeout(() => {
      this.isLanguageDropdownOpen = false;      
    }, 100);
    this.clearLanguageFilter();
  }

  searchLanguage(event:any){
    this.isLanguageDropdownOpen = true;
    this.languageInputSearch = event.target.value;
    this.filteredLanguageArr = this.languageArr.filter((language:any)=>{
      if(language.name.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1){
        return language;
      }
    })
    setTimeout(() => {
      this.languageDropdownHeight = this.elRef.nativeElement.querySelector('#language-dropdown').clientHeight;      
    }, 50);
  }

  // Clear input with dynamic ID
  clearSearch(elementId:any){
    this.elRef.nativeElement.querySelector(elementId).value = '';
    this.clearLanguageFilter();
  }
  
  // Clear input with static value
  clearLanguageFilter(){
    this.languageInputSearch = '';
    this.filteredLanguageArr = this.languageArr;
    setTimeout(() => {
      this.languageDropdownHeight = this.elRef.nativeElement.querySelector('#language-dropdown').clientHeight;      
    }, 50);
  };

  closeDialog(){
    this.closePopup.emit();
  }
  
  onSubmit(){
    localStorage.setItem('lang', this.selectedLanguage?.value);
    localStorage.setItem('lang', this.selectedLanguage?.value);
    this._translateLanguage.setLanguageCode(this.selectedLanguage?.value);
    this.closeDialog();
    location.reload();
  }

}
