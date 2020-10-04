import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import mock, { sequence } from 'xhr-mock';
import { render, screen } from '@testing-library/angular';
import user from '@testing-library/user-event';

import { baseURL } from './product.service';
import { Product } from './types';

import { AppComponent } from './app.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCreateComponent } from './product-create/product-create.component';

const products: Product[] = [
  {
    name: 'Product Z',
    description: 'Product description',
    code: 'Z',
  },
];

const newProduct: Product = {
  name: 'Product A',
  description: 'Product description',
  code: 'A',
};

describe('AppComponent', () => {
  afterEach(() => mock.teardown());
  beforeEach(async () => {
    mock.setup();
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [
        AppComponent,
        ProductListComponent,
        ProductCreateComponent,
      ],
    }).compileComponents();
  });

  it('4. On successful submission, product is added to product list', async () => {
    //The product is added to list when API call is successful
    mock
      .get(
        baseURL + '/api/products',
        sequence([
          {
            status: 200,
            reason: 'OK',
            body: products,
          },
          {
            status: 200,
            reason: 'OK',
            body: [...products, newProduct],
          },
        ])
      )
      .post(baseURL + '/api/products', {
        status: 201,
        reason: 'Created',
        body: true,
      });

    render(AppComponent);

    await screen.findByText(new RegExp(products[0].name));

    //User click 'Add Product'
    user.click(await screen.findByText(/Add Product/));

    //User fills up form
    user.type(await screen.findByLabelText(/Name/), newProduct.name);
    user.type(await screen.findByLabelText(/Description/), newProduct.code);
    user.type(await screen.findByLabelText(/Code/), newProduct.description);

    //There's a submit button that calls API service
    user.click(await screen.findByText(/Submit/));

    //The product is added to list when API call is successful
    expect(await screen.findByText(new RegExp(newProduct.name))).toBeDefined();

  });

  it('5. On failed submission, an error message is shown', async () => {
    mock
      .get(
        baseURL + '/api/products',
        sequence([
          {
            status: 200,
            reason: 'OK',
            body: products,
          },
          {
            status: 200,
            reason: 'OK',
            body: products,
          },
        ])
      )
      .post(baseURL + '/api/products', {
        status: 500,
        reason: 'Internal Server Error',
        body: false,
      });

    render(AppComponent);

    //User click 'Add Product'
    user.click(await screen.findByText(/Add Product/));

    //User fills up form
    user.type(await screen.findByLabelText(/Name/), newProduct.name);
    user.type(await screen.findByLabelText(/Description/), newProduct.code);
    user.type(await screen.findByLabelText(/Code/), newProduct.description);

    //There's a submit button that calls API service
    user.click(await screen.findByText(/Submit/));

    //Error message is shown
    expect(await screen.findByText(/Something went wrong/)).toBeDefined();
  });
});
