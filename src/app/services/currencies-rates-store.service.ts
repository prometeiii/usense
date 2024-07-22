import { Injectable } from '@angular/core';
import { Currency } from '../interfaces/Currency';
import { CurrenciesRatesService } from './currencies-rates.service';
import { BehaviorSubject, Observable, skip } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesRatesStoreService {

  private base: string;
  private date: string;

  private readonly _currenciesRates = new BehaviorSubject<Currency[]>([]);
  public readonly currenciesRates$: Observable<Currency[]> = this._currenciesRates.asObservable();

  constructor(private currenciesRatesService: CurrenciesRatesService) {}

  public updateStoreWithLastData(): void {
    this.currenciesRatesService.getLastRates('UAH', ['USD', 'EUR', 'GBP']).subscribe(data => {
      this.base = data.base;
      this.date = data.date;
      console.log('updateStore before next = ', this.getCurrentCurrencies());
      const rates = Object.entries(data.rates).map(([name, rate]) => ({ name, rate: +rate }));
      rates.push({ name: this.base, rate: 1});
      this._currenciesRates.next(rates);
      console.log('updateStore = ', this.getCurrentCurrencies());
    });
  }

  public getCurrentCurrencies(): Currency[] {
    return this._currenciesRates.getValue();
  }

  public get Base(): string {
    return this.base;
  }

  public get Date(): string {
    return this.date;
  }
}
