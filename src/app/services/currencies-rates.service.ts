import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyRateDTO } from '../dto/currency-rate.dto';

@Injectable({
  providedIn: 'root',
})
export class CurrenciesRatesService {

  private token: string = 'gCn14d05XuOldiwZnn7rSApcJoPBT12P';
  private apiUri: string = 'https://api.currencybeacon.com/v1';

  constructor(private http: HttpClient) { }

  public getLastRates(base: string, symbols: string[]): Observable<CurrencyRateDTO> {
    const symbolsStr = symbols.join(',');

    return this.http.get<CurrencyRateDTO>(`${this.apiUri}/latest?api_key=${this.token}&base=${base.toUpperCase()}&symbols=${symbolsStr}`);
  }
}
