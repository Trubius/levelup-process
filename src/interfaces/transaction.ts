import { ECurrencyType } from '../enums';

export interface ITransaction {
  periodName: string;
  countryName: string;
  countryId: number;
  taxAmount: number;
  currency: ECurrencyType;
  taxAmountInEUR?: number;
}
