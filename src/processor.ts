import { getExchangeRatesOfCurrency } from './api-service';
import { ECurrencyType } from './enums';

export class Processor {
  private _cachedCountryFxRates = new Map();
  private generalCurrencies: Record<string, any> = {};

  public otherGroupPendingPeriods: any[] = [];
  public otherGroupSubmittedPeriods: any[] = [];
  public otherGroupCurrentPeriods: any[] = [];

  constructor(currencies: any[]) {
    currencies.forEach((c) => (this.generalCurrencies[c.id] = c.name));
  }

  async process(current: any[], other: any[], submitted: any[]): Promise<any> {
    const dict = {};
    this.collectRowsByCurrency(current, dict);
    this.collectRowsByCurrency(other, dict);
    this.collectRowsByCurrency(submitted, dict);

    console.log({ dict });

    await this.fillExchangeRates(dict);
    this._convertToArrays(submitted, current, other);

    return dict;
  }

  private collectRowsByCurrency(groups, dict: { [c: string]: any[] }) {
    groups.forEach((periodGroup) => {
      const rows = periodGroup.items;
      rows
        .filter((r) => r.taxAmount && r.currency && r.currency !== ECurrencyType.EUR)
        .forEach((r) => {
          let a = dict[this.generalCurrencies[r.currency]];
          if (!a) {
            a = dict[this.generalCurrencies[r.currency]] = [];
          }

          a.push(r);
        });
    });
  }

  private _convertToArrays(submittedGroups, currentGroups, otherGroups) {
    if (submittedGroups.length || currentGroups.length || otherGroups.length) {
      this.otherGroupSubmittedPeriods = [];
      this.otherGroupCurrentPeriods = [];
      this.otherGroupPendingPeriods = [];

      submittedGroups.forEach((periodGroup) => {
        this.otherGroupSubmittedPeriods.push(periodGroup.items);
      });

      currentGroups.forEach((periodGroup) => {
        this.otherGroupCurrentPeriods.push(periodGroup.items);
      });

      otherGroups.forEach((periodGroup) => {
        this.otherGroupPendingPeriods.push(periodGroup.items);
      });
    }
  }

  private fillExchangeRates(dict: { [currency: string]: any[] }) {
    const currencies = Object.keys(dict);

    return Promise.all(
      currencies.map((currency) => {
        const transactionRows = dict[currency];
        if (this._cachedCountryFxRates.get(currency)) {
          return this._fillTransactionRowEURAmount(transactionRows, currency, null);
        } else {
          console.log('FETCH', currency);
          return getExchangeRatesOfCurrency(currency as any).then((fxRate: any) => {
            this._fillTransactionRowEURAmount(transactionRows, currency, fxRate);
          });
        }
      }),
    );
  }

  private _fillTransactionRowEURAmount(transactionRows: any[], currency: string, apiFxRate: any) {
    for (const row of transactionRows) {
      const fxRate = apiFxRate ? apiFxRate : this._cachedCountryFxRates.get(currency);
      row.taxAmountInEUR = fxRate && fxRate.midRate ? Math.round((row.taxAmount / fxRate.midRate) * 100) / 100 : null;
      if (!this._cachedCountryFxRates.get(currency)) {
        this._cachedCountryFxRates.set(currency, fxRate);
      }
    }
  }
}
