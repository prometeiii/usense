export interface CurrencyRateDTO {
    success: boolean;
    timestamp: number;
    base: string;
    date: string;
    rates: [];
}