import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: [],
})
export class ProductCreateComponent {
  showForm = false;
  code = '';
  name = '';
  description = '';

  constructor(public service: ProductService) {}

  onSubmit() {
    this.service.createProduct({
      code: this.code,
      name: this.name,
      description: this.description,
    });
    this.showForm = false;
  }
}
