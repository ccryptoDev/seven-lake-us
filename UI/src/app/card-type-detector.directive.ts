import { Directive, HostListener, EventEmitter, Output } from '@angular/core';

import { ICardType } from './card-type.interface';
import { cardTypes } from './card-types.value';

@Directive({
  selector: '[appCardTypeDetector]',
})
export class CardTypeDetectorDirective {

  @Output() cardDetect = new EventEmitter<ICardType>();

  @HostListener('keyup', ['$event'])
  onKeyup($event: KeyboardEvent) {
    const input = $event.target as HTMLInputElement;
    const value = input.value;
    if (!value) {
      this.cardDetect.next(null);
      return;
    }

    cardTypes.forEach(type => {
      if (type.pattern.test(value)) {
        this.cardDetect.next(type);
      }
    });
  }
}
