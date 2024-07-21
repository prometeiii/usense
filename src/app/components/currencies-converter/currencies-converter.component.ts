import { Component } from '@angular/core';
import { Currency } from '../../interfaces/Currency';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, startWith, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';


@Component({
  selector: 'app-currencies-converter',
  standalone: true,
  imports: [MatAutocompleteModule, FormsModule, ReactiveFormsModule, AsyncPipe, MatFormFieldModule, MatInputModule],
  templateUrl: './currencies-converter.component.html',
  styleUrl: './currencies-converter.component.css'
})
export class CurrenciesConverterComponent {
  converterFields = new FormGroup({
    firstCurrency: new FormGroup({
      name: new FormControl(''),
      rate: new FormControl(1)
    }),
    secondCurrency: new FormGroup({
      name: new FormControl(''),
      rate: new FormControl(0)
    })
  });

  firstFilteredCurrenies: Observable<Currency[]>;
  secondFilteredCurrencies: Observable<Currency[]>;

  public currencies: Currency[] = [
    { name: 'USD', rate: 41 },
    { name: 'EUR', rate: 45 },
    { name: 'UAN', rate: 30 }
  ];

  constructor() {
    this.firstFilteredCurrenies = this.converterFields.controls.firstCurrency.valueChanges.pipe(
      startWith(''),
      map((currency) => {
        const name = typeof currency === 'string' ? currency : currency?.name;
        return name ? this._filter(name as string) : this.currencies.slice();
      }),
    );

    this.secondFilteredCurrencies = this.converterFields.controls.secondCurrency.valueChanges.pipe(
      startWith(''),
      map((currency) => {
        const name = typeof currency === 'string' ? currency : currency?.name;
        return name ? this._filter(name as string) : this.currencies.slice();
      }),
    );
  }

  private _filter(value: string): Currency[] {
    const filterValue = value.toLowerCase();
    return this.currencies.filter(currency => currency.name.toLowerCase().includes(filterValue));
  }
}
