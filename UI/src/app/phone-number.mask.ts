// @todo make this dynamic based on card type detected
export function cardMaskFactory() {
    return {
      placeholderChar: '\u2000',
      mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    };
  }