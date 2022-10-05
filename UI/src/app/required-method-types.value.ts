import { ICardType } from './card-type.interface';
import { getCardTypeByName } from './card-types.value';

export const requiredMethodTypes: Record<string, ICardType> = {
  'visa': getCardTypeByName('visa'),
  'visa-electron': getCardTypeByName('visa'),
  'maestro': getCardTypeByName('maestro'),
  'mastercard': getCardTypeByName('mastercard'),
};
