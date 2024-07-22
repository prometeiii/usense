import { ApplicationRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CurrenciesConverterComponent } from './components/currencies-converter/currencies-converter.component';
import { CurrenciesRatesStoreService } from './services/currencies-rates-store.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CurrenciesConverterComponent],
  providers: [HttpClient],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private currenciesRatesStoreService: CurrenciesRatesStoreService, private appRef: ApplicationRef) {}
  ngOnInit(): void {
    this.currenciesRatesStoreService.updateStoreWithLastData();
  }

}
