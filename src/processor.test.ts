import { ECurrencyType, TransactionState } from './enums';
import { Processor } from './processor';

describe('Processor', () => {
  describe('process', () => {
    test('should return grouped arrays by currency', () => {
      const processor = new Processor([]);
      return processor.process(current, pending, submitted).then((data) => {
        expect(data).toBe(result);
      });
    });
  });
});

const current = [
  {
    period: 'January',
    items: [
      {
        periodName: 'January',
        state: TransactionState.CURRENT,
        countryName: 'HUN',
        countryId: 1,
        taxAmount: 10,
        currency: ECurrencyType.EUR,
      },
      {
        periodName: 'January',
        state: TransactionState.CURRENT,
        countryName: 'HUN',
        countryId: 1,
        taxAmount: 20,
        currency: ECurrencyType.USD,
      },
    ],
  },
];

const pending = [
  {
    period: 'February',
    items: [
      {
        periodName: 'February',
        state: TransactionState.PENDING,
        countryName: 'HUN',
        countryId: 1,
        taxAmount: 10,
        currency: ECurrencyType.GBP,
      },
    ],
  },
  {
    period: 'March',
    items: [
      {
        periodName: 'March',
        state: TransactionState.PENDING,
        countryName: 'HUN',
        countryId: 1,
        taxAmount: 15,
        currency: ECurrencyType.GBP,
      },
    ],
  },
];

const submitted = [
  {
    period: 'March',
    items: [
      {
        periodName: 'March',
        state: TransactionState.SUBMITTED,
        countryName: 'HUN',
        countryId: 1,
        taxAmount: 10,
        currency: ECurrencyType.USD,
      },
      {
        periodName: 'March',
        state: TransactionState.SUBMITTED,
        countryName: 'HUN',
        countryId: 1,
        taxAmount: 20,
        currency: ECurrencyType.GBP,
      },
    ],
  },
];

const result = {
  GBP: [
    {
      countryId: 1,
      countryName: 'HUN',
      currency: 3,
      periodName: 'January',
      state: 1,
      taxAmount: 20,
      taxAmountInEUR: 25,
    },
    {
      countryId: 1,
      countryName: 'HUN',
      currency: 3,
      periodName: 'March',
      state: 3,
      taxAmount: 10,
      taxAmountInEUR: 12.5,
    },
  ],
  USD: [
    {
      countryId: 1,
      countryName: 'HUN',
      currency: 2,
      periodName: 'February',
      state: 2,
      taxAmount: 10,
      taxAmountInEUR: 11.11,
    },
    {
      countryId: 1,
      countryName: 'HUN',
      currency: 2,
      periodName: 'March',
      state: 2,
      taxAmount: 15,
      taxAmountInEUR: 16.67,
    },
    {
      countryId: 1,
      countryName: 'HUN',
      currency: 2,
      periodName: 'March',
      state: 3,
      taxAmount: 20,
      taxAmountInEUR: 22.22,
    },
  ],
};
