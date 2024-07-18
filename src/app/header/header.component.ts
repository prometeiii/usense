import { Component } from '@angular/core';
import { Currency } from '../interfaces/Currency';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  public currencies: Currency[] = [
    { name: 'USD', rate: 41 },
    { name: 'EUR', rate: 45 },
    { name: 'UAN', rate: 30 }
  ];
}
