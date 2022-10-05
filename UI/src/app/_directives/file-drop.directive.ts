import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';


@Directive({
  selector: '[fileDropInput]'
})
export class FileDropDirective {
  @HostBinding('class.fileover') fileOver: boolean;
  @Output() fileDropped = new EventEmitter<any>();
  constructor() { }

  @HostListener('dragover', ['$event']) onDragOver(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.fileOver = false;
  }

  @HostListener('drop', ['$event']) public ondrop(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.fileOver = false;
    const file = (e as DragEvent).dataTransfer.files;

    if (file.length > 0) {
      this.fileDropped.emit(file);
    }
  }

}
