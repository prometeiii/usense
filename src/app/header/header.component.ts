import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Currency } from '../interfaces/Currency';
import { CommonModule } from '@angular/common';
import { CurrenciesRatesStoreService } from '../services/currencies-rates-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(public store: CurrenciesRatesStoreService) {}

}
