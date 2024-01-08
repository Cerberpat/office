import { Injectable } from '@angular/core';
import {Product} from '../shared/product';
import {ApiService} from './api.service';
import {ProductNames} from '../shared/productNames';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  produkty: Product[];

  constructor(
    private servService: ApiService
  ) {
    this.produkty = JSON.parse(localStorage.getItem('produkty'));
    localStorage.setItem('produkty', JSON.stringify(this.produkty));
  }

  loadProdukty(): void {
    this.servService.getProdukty( {} ).subscribe((res) => {
      localStorage.setItem('produkty', JSON.stringify(res));
    });
  }
  loadProduktyNazwy(): void {
    this.servService.getProduktyNazwy({}).subscribe((res) => {
      localStorage.setItem('produktyNazwy', JSON.stringify(res));
    });
  }
}
