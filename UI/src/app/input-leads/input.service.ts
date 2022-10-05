import { Injectable,Output,EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InputService {
 @Output() fileList:EventEmitter<any> =new EventEmitter();
  constructor() { }
  
  prepareFilesList(watingforfile){
     this.fileList.emit(watingforfile);
    
  }
}
