export interface ICardType {
    /** Example: mastercard */
    name: string;
  
    /** Example: MasterCard */
    prettyName: string;
  
    pattern: RegExp;
    format: RegExp;
    inputFormat: RegExp;
    lengths: number[];
    cvcLengths: number[];
    luhn: boolean;
  }
  