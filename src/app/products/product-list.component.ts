import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { EMPTY, Subject, combineLatest, forkJoin } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  
  private categorySelectedSubject = new Subject<number>();
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  products$ = combineLatest
  ([
    this.productService.productWithAdd$,
    this.categorySelectedAction$
    .pipe( 
       startWith(0)
    )

  ])
   .pipe(
     map(([products, selectedCategoryId ]) =>
      products.filter(products =>
        selectedCategoryId ? products.categoryId === selectedCategoryId : true
        )),
      catchError(err => { 
        this.errorMessage = err;
        return EMPTY;
      })
    );

    ///filter///

    categories$ = this.productCategoryService.productCategories$
    .pipe(
      catchError(err=> {
        this.errorMessage = err;
        return EMPTY;
      })
    )


  constructor(private productService: ProductService,
              private productCategoryService: ProductCategoryService) { }

   
  onAdd(): void {
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId)
  }
}
