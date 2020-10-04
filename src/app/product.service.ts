import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './types';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const baseURL =
  'https://run.mocky.io/v3/21e78699-d36e-4e13-a9fd-8b5ab8fafa8e';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  products = new BehaviorSubject<Product[]>([]);
  error = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {}
  public getProducts() {
    this.http
      .get<Product[]>(baseURL + '/api/products')
      .subscribe((response) => this.products.next(response));
  }

  public createProduct(product: Product) {
    this.http.post<boolean>(baseURL + '/api/products', product).subscribe(
      (response) => {
        if (response) this.getProducts();
        else throw new Error('Product creation failed');
      },
      (error) => {
        this.error.next(String(error));
      }
    );
  }
}
