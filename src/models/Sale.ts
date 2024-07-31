import type { Product } from './Product';

export interface Sale {
    products: Product[];
    date: string;
    subtotal: number;
    tax: number;
    total: number;
}
