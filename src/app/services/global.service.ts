import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CONSTANTS } from "../common/constants";
import { GlobalFunctions } from "../common/global-function";
import { Meta } from "@angular/platform-browser";

function _window() : any {
    // return the global native browser window object
    if(typeof window != undefined){
      return window;
    }
}

@Injectable({
  providedIn:'root'
})

export class GlobalService {

  public canonicalElement: HTMLLinkElement | null = null;

  public productList$ :BehaviorSubject <any>;
  public productListPagination$ :BehaviorSubject <any>;
  public benefitList$ :BehaviorSubject <any>;
  public benefitListPagination$ :BehaviorSubject <any>;
  public stories$ :BehaviorSubject <any>;
  public storiesPagination$ :BehaviorSubject <any>;
  public cartListData$ :BehaviorSubject <any>;
  public totalCartListCount$ :BehaviorSubject <any>;
  public cartListDataFromCookies$ :BehaviorSubject <any>;
  public cartListDataPagination$ :BehaviorSubject <any>;
  public addressListData$ :BehaviorSubject <any>;
  public addressListDataPagination$ :BehaviorSubject <any>;
  public logoutPage$ :BehaviorSubject <any>;
  public adsPageList$ :BehaviorSubject <any>;
  public placeOrderDetail$ :BehaviorSubject <any>;
  public placeOrderDetailForPlan$ :BehaviorSubject <any>;
  public searchProductList$ :BehaviorSubject <any>;
  
  constructor(
    private meta: Meta
  ){
    this.productList$ = new BehaviorSubject<any>(null);
    this.productListPagination$ = new BehaviorSubject<any>(null);
    this.benefitList$ = new BehaviorSubject<any>(null);
    this.benefitListPagination$ = new BehaviorSubject<any>(null);
    this.stories$ = new BehaviorSubject<any>(null);
    this.storiesPagination$ = new BehaviorSubject<any>(null);
    this.cartListData$ = new BehaviorSubject<any>(null);
    this.totalCartListCount$ = new BehaviorSubject<any>(null);
    this.cartListDataFromCookies$ = new BehaviorSubject<any>(null);
    this.cartListDataPagination$ = new BehaviorSubject<any>(null);
    this.addressListData$ = new BehaviorSubject<any>(null);
    this.addressListDataPagination$ = new BehaviorSubject<any>(null);
    this.logoutPage$ = new BehaviorSubject<any>(null);
    this.adsPageList$ = new BehaviorSubject<any>(null);
    this.placeOrderDetail$ = new BehaviorSubject<any>(null);
    this.placeOrderDetailForPlan$ = new BehaviorSubject<any>(null);
    this.searchProductList$ = new BehaviorSubject<any>(false);
  }

  setMetaTags(metaTags: { [key: string]: string }) {
    for (const [name, content] of Object.entries(metaTags)) {
      this.meta.updateTag({ name, content });
    }
  }

  setOpenGraphTags(ogTags: { [key: string]: string }) {
    for (const [property, content] of Object.entries(ogTags)) {
      this.meta.updateTag({ property, content });
    }
  }
  
  setTwitterCardTags(twitterTags: { [key: string]: string }) {
    for (const [name, content] of Object.entries(twitterTags)) {
      this.meta.updateTag({ name, content });
    }
  }

  setJsonLdData(jsonLdData: any,id:any) {

    if (id == "bc") {
      // Remove existing JSON-LD script if present
    this.removeJsonLdDataForbreadcrum();

    // Create a new JSON-LD script element
    const jsonLdScript = document.createElement('script');
    jsonLdScript.type = 'application/ld+json';
    jsonLdScript.id = id;
    jsonLdScript.text = JSON.stringify(jsonLdData);

     // Append the JSON-LD script element to the head of the document
     document.head.appendChild(jsonLdScript);
    }
    if (id == "websch") {
      // Remove existing JSON-LD script if present
    this.removeJsonLdDataForWebSchema();

    // Create a new JSON-LD script element
    const jsonLdScript = document.createElement('script');
    jsonLdScript.type = 'application/ld+json';
    jsonLdScript.id = id;
    jsonLdScript.text = JSON.stringify(jsonLdData);

     // Append the JSON-LD script element to the head of the document
     document.head.appendChild(jsonLdScript);
    }
    if (id == "lbSchema") {
      // Remove existing JSON-LD script if present
    this.removeJsonLdDataForLBSchema();

    // Create a new JSON-LD script element
    const jsonLdScript = document.createElement('script');
    jsonLdScript.type = 'application/ld+json';
    jsonLdScript.id = id;
    jsonLdScript.text = JSON.stringify(jsonLdData);

     // Append the JSON-LD script element to the head of the document
     document.head.appendChild(jsonLdScript);
    }
    if (id == "orgSchema") {
      // Remove existing JSON-LD script if present
    this.removeJsonDataForOrgSchema();

    // Create a new JSON-LD script element
    const jsonLdScript = document.createElement('script');
    jsonLdScript.type = 'application/ld+json';
    jsonLdScript.id = id;
    jsonLdScript.text = JSON.stringify(jsonLdData);

     // Append the JSON-LD script element to the head of the document
     document.head.appendChild(jsonLdScript);
    }
    
   
  }

  removeJsonLdDataForbreadcrum() {
    // Remove all JSON-LD script elements from the head
    // const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const scripts = document.querySelectorAll('#bc');
    scripts.forEach(script => document.head.removeChild(script));
  }

  removeJsonLdDataForWebSchema() {
    // Remove all JSON-LD script elements from the head
    // const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const scripts = document.querySelectorAll('#websch');
    scripts.forEach(script => document.head.removeChild(script));
  }

  removeJsonLdDataForLBSchema() {
    // Remove all JSON-LD script elements from the head
    // const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const scripts = document.querySelectorAll('#lbSchema');
    scripts.forEach(script => document.head.removeChild(script));
  }

  removeJsonDataForOrgSchema() {
    // Remove all JSON-LD script elements from the head
    // const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const scripts = document.querySelectorAll('#orgSchema');
    scripts.forEach(script => document.head.removeChild(script));
  }
  
  setCanonicalUrl(urlData: any) {
    // Remove existing canonical link if present
    this.removeCanonicalUrl();

    // Create a new canonical link element
    this.canonicalElement = document.createElement('link');
    this.canonicalElement.rel = 'canonical';
    this.canonicalElement.href = urlData.url;
    
    // Append the canonical link element to the head of the document
    document.head.appendChild(this.canonicalElement);
    document.getElementsByTagName('title')[0].innerText = `${urlData.title}`;
  }

  removeCanonicalUrl() {
    if (this.canonicalElement) {
      document.head.removeChild(this.canonicalElement);
      this.canonicalElement = null;
    }
  }

  get nativeWindow() : any {
    return _window();
  }
}