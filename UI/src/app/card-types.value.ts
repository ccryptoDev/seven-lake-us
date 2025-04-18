import { ICardType } from './card-type.interface';

export const defaultFormat = /(\d{1,4})/g;
export const defaultInputFormat = /(?:^|\s)(\d{4})$/;

export const cardTypes: ICardType[] = [
  {
    name: 'maestro',
    prettyName: 'Maestro',
    pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
    format: defaultFormat,
    inputFormat: defaultInputFormat,
    lengths: [12, 13, 14, 15, 16, 17, 18, 19],
    cvcLengths: [3],
    luhn: true,
  },
  {
    name: 'dinersclub',
    prettyName: 'Diners Club',
    pattern: /^(36|38|30[0-5])/,
    format: defaultFormat,
    inputFormat: defaultInputFormat,
    lengths: [14],
    cvcLengths: [3],
    luhn: true,
  },
  {
    name: 'laser',
    prettyName: 'Laser',
    pattern: /^(6706|6771|6709)/,
    format: defaultFormat,
    inputFormat: defaultInputFormat,
    lengths: [16, 17, 18, 19],
    cvcLengths: [3],
    luhn: true,
  },
  {
    name: 'jcb',
    prettyName: 'JCB',
    pattern: /^35/,
    format: defaultFormat,
    inputFormat: defaultInputFormat,
    lengths: [16],
    cvcLengths: [3],
    luhn: true,
  },
  {
    name: 'unionpay',
    prettyName: 'UnionPay',
    pattern: /^62/,
    format: defaultFormat,
    inputFormat: defaultInputFormat,
    lengths: [16, 17, 18, 19],
    cvcLengths: [3],
    luhn: false,
  },
  {
    name: 'discover',
    prettyName: 'Discover',
    pattern: /^(6011|65|64[4-9]|622)/,
    format: defaultFormat,
    inputFormat: defaultInputFormat,
    lengths: [16],
    cvcLengths: [3],
    luhn: true,
  },
  {
    name: 'mastercard',
    prettyName: 'MasterCard',
    pattern: /^(5[1-5]|2[2-7])/,
    format: defaultFormat,
    inputFormat: defaultInputFormat,
    lengths: [16],
    cvcLengths: [3],
    luhn: true,
  },
  {
    name: 'amex',
    prettyName: 'American Express (AMEX)',
    pattern: /^3[47]/,
    format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
    inputFormat: /^(\d{4}|\d{4}\s\d{6})$/,
    lengths: [15],
    cvcLengths: [3, 4],
    luhn: true,
  },
  {
    name: 'visa',
    prettyName: 'VISA',
    pattern: /^4/,
    format: defaultFormat,
    inputFormat: defaultInputFormat,
    lengths: [13, 14, 15, 16],
    cvcLengths: [3],
    luhn: true,
  },
];

export function getCardTypeByName(name: string) {
  return cardTypes.find(type => type.name === name);
}
