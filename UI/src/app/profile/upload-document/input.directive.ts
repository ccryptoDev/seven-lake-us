import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { InputService } from './input.service';

@Directive({
  selector: '[appInput]'
})
export class InputDirective {
@HostBinding('class.fileover') fileOver:boolean;
@Output() fileDropped = new EventEmitter<any>();
  constructor(private inputservice:InputService) { }
@HostListener('dragover',['$event'])  onDragOver(evt){
  evt.preventDefault();
  evt.stopPropagation();
  this.fileOver = true;
  // console.log('drag level');
}
@HostListener('dragleave', ['$event']) public onDragLeave(evt) {
  evt.preventDefault();
  evt.stopPropagation();
  this.fileOver = false;
}
@HostListener('drop',['$event']) public ondrop(evt){
  evt.preventDefault();
  evt.stopPropagation();
  this.fileOver= false;
  const file = evt.dataTransfer.files;
  // this.inputservice.prepareFilesList(file);
  console.log(file);

  if( file.length > 0){

    this.fileDropped.emit(file);
  }
}
}
