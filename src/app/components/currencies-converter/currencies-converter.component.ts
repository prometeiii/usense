import { Component, OnDestroy, OnInit } from '@angular/core';
import { Currency } from '../../interfaces/Currency';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { filter, map, Observable, startWith, Subscription, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { CurrenciesRatesStoreService } from '../../services/currencies-rates-store.service';


@Component({
  selector: 'app-currencies-converter',
  standalone: true,
  imports: [MatAutocompleteModule, FormsModule, ReactiveFormsModule, AsyncPipe, MatFormFieldModule, MatInputModule],
  templateUrl: './currencies-converter.component.html',
  styleUrl: './currencies-converter.component.css'
})
export class CurrenciesConverterComponent implements OnInit, OnDestroy {
  converterFields = new FormGroup({
    firstCurrency: new FormGroup({
      name: new FormControl(''),
      amount: new FormControl(1)
    }),
    secondCurrency: new FormGroup({
      name: new FormControl(''),
      amount: new FormControl(0)
    })
  });

  firstFilteredCurrencies: Observable<string[]>;
  secondFilteredCurrencies: Observable<string[]>;

  private currencies: { [key: string]: number } = {};

  private storeSub: Subscription;

  private isRateUpdating: boolean = false;

  constructor(public store: CurrenciesRatesStoreService) {}
  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }

  ngOnInit(): void {
    this.storeSub = this.store.currenciesRates$.subscribe((curr) => {
      this.onUpdateCurrencies(curr);
    });
    this.handleRateChange();
  }

  private onUpdateCurrencies(newData: Currency[]): void {
    console.log('hello from currencies converter = ', this.currencies);
    this.currencies = {};
    newData.forEach((currency) => {
      this.currencies[currency.name.toUpperCase()] = currency.rate;
    });
    this.updateFilteredCurrencies();
  }

  private updateFilteredCurrencies(): void {
    this.firstFilteredCurrencies = this.converterFields.controls.firstCurrency.controls.name.valueChanges.pipe(
      startWith(''),
      map((currency) => {
        return currency ? this._filter(currency) : Object.keys(this.currencies).slice();
      }),
      tap((c) => {
        if (c.length !== 1) {
          return;
        }
        this.tryUpdateSecondCurrencyRate(c[0]);
      }),
    );

    this.secondFilteredCurrencies = this.converterFields.controls.secondCurrency.controls.name.valueChanges.pipe(
      startWith(''),
      map((currency) => {
        return currency ? this._filter(currency) : Object.keys(this.currencies).slice();
      }),
      tap((c) => {
        if (c.length !== 1) {
          return;
        }
        this.tryUpdateFirstCurrencyRate(c[0]);
      }),
    );   
  }

  private handleRateChange(): void {
    this.converterFields.get('firstCurrency.amount')?.valueChanges.subscribe((value) => {
      if (this.isRateUpdating) {
        return;
      }
      this.isRateUpdating = true;
      const firstCurrency = this.converterFields.controls.firstCurrency.controls.name.value;
      if (!firstCurrency) {
        return;
      }
      this.tryUpdateSecondCurrencyRate(firstCurrency);
      this.isRateUpdating = false;
    });

    this.converterFields.get('secondCurrency.amount')?.valueChanges.subscribe((value) => {
      if (this.isRateUpdating) {
        return;
      }
      this.isRateUpdating = true;
      const secondCurrency = this.converterFields.controls.secondCurrency.controls.name.value;
      if (!secondCurrency) {
        return;
      }
      this.tryUpdateFirstCurrencyRate(secondCurrency);
      this.isRateUpdating = false;

    });
  }

  private convertCurrencyRate(amount: number, fromRate: number, toRate: number): number {
    const amountInBase = amount / fromRate;
    return amountInBase * toRate;
  }

  private tryUpdateSecondCurrencyRate(firstCurrency: string): void {
    if (!this.currencies[firstCurrency.toUpperCase()]) {
      return;
    }
    const secondCurrency = this.converterFields.controls.secondCurrency.controls.name.value;
    if (!secondCurrency) {
      return;
    }
    const firstCurrencyAmount = Number(this.converterFields.controls.firstCurrency.controls.amount.value);
    const newAmount = this.convertCurrencyRate(firstCurrencyAmount, this.currencies[firstCurrency.toUpperCase()], this.currencies[secondCurrency.toUpperCase()]);

    this.converterFields.controls.secondCurrency.controls.amount.setValue(+(newAmount.toFixed(4)), { emitEvent: false });
  }

  private tryUpdateFirstCurrencyRate(secondCurrency: string): void {
    if (!this.currencies[secondCurrency.toUpperCase()]) {
      return;
    }
    const firstCurrency = this.converterFields.controls.firstCurrency.controls.name.value;
    if (!firstCurrency) {
      return;
    }
    const secondCurrencyAmount = Number(this.converterFields.controls.secondCurrency.controls.amount.value);
    const newAmount = this.convertCurrencyRate(secondCurrencyAmount, this.currencies[secondCurrency.toUpperCase()], this.currencies[firstCurrency.toUpperCase()]);

    this.converterFields.controls.firstCurrency.controls.amount.setValue(+(newAmount.toFixed(4)), { emitEvent: false });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return Object.keys(this.currencies).filter(currency => currency.toLowerCase().includes(filterValue));
  }
}
