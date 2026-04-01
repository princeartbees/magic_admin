import { CommonModule, isPlatformServer } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GalleyService } from './gallery.service';
import { GlobalFunctions } from '../../common/global-function';
import { ToastrService } from 'ngx-toastr';
import { CONSTANTS } from '../../common/constants';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RouterModule } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule,InfiniteScrollModule, RouterModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit{
  isLoading:boolean = false;
  galleryVideoList:any = [];
  galleryImageList:any = [];
  tempGalleryList:any = [];
  tempSecondGalleryArray:any = [];
  galleryData:any;
  galleryList:any = [];
  tempScrollCount = 1;
  constants:any = CONSTANTS;
  videoCount = 0;
  imgCount = 0;

  constructor(
    private _galleryService:GalleyService,
    private _globalFunctions:GlobalFunctions,
    private _toastr:ToastrService
  ){
    $('.page-loader').fadeIn('fast');
    setTimeout(() => {
      $('.page-loader').fadeOut('slow');
    }, 1500);
  }

  ngOnInit(): void {
    this.getGallery(this.tempScrollCount);
  }

  getGallery(pageCount:number){
    this.isLoading = true;
    let data:any = {
      page:1,
      limit: pageCount *10
    }
    this._galleryService.getGalleryList(data).subscribe((result:any)=>{
      if(result && result.IsSuccess){
        this.isLoading = false;
        this.galleryData = result.Data;
        this.tempGalleryList = result.Data.docs;
        result.Data.docs.map((item:any)=>{
          if(item?.mediatype == 'video'){
            this.galleryVideoList.push(item);
          } else {
            this.galleryImageList.push(item);
          }
        });
        this.tempGalleryList.map((_:any,index:any)=>{
          if(((index) % 5) == 0 ){
            this.tempGalleryList[index] = this.galleryVideoList[this.videoCount]
            this.videoCount++;
          } else {
            this.tempGalleryList[index] = this.galleryImageList[this.imgCount];
            this.imgCount++;
          }
        });
        this.tempGalleryList = Array.from({ length: Math.ceil(this.tempGalleryList.length / 5) }, (_, i) =>
          this.tempGalleryList.slice(i * 5, (i + 1) * 5)
        );
      } else {
        this.isLoading = false;
        this._globalFunctions.successErrorHandling(result.Message,this,true);
      }
    },(error:any)=>{
      this.isLoading = false;
      this._globalFunctions.errorHanding(error,this,true);
    })
  }

  onScroll(){
    this.tempScrollCount++;
    // if(((this.tempScrollCount * 10) / this.galleryData?.totalDocs) >= 1 && ((this.tempScrollCount * 10) / this.galleryData?.totalDocs) < 2){ // && this.reviewListData?.totalDocs >= this.tempScrollCount * 10;
    if(this.tempScrollCount <= Math.ceil(this.galleryData?.totalDocs / 10)){
      this.getGallery(this.tempScrollCount)
    }
  }
} 
// [[[1,2,3,4,5,6],[5,6,7,8,9,10]],[[11,12,13,14,15]]]
// [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15]]