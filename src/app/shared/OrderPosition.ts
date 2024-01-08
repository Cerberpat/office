import {CategoryNames} from './CategoryNames';

export class OrderPosition {
  id: number;
  setNr: number;
  idOrderCompany: number;
  idProduct: number;
  idCategory: number;
  categoryObj: CategoryNames;
  name: string;
  quantity: number;
  price: number;
  priceNettoTotal: number;
  priceBrutto: number;
  priceBruttoTotal: number;
  tax: number;
  currency: string;
  exchange: number;
  picking: number;
  packing: number;
  warehouseAction: number;
  addBy: number;
  isActive: number;

  constructor( data = null ) {
    this.id = 0;
    this.setNr = 0;
    this.idOrderCompany = 0;
    this.idProduct = 0;
    this.idCategory = 0;
    this.categoryObj = new CategoryNames();
    this.name = '';
    this.quantity = 0;
    this.price = 0;
    this.priceBrutto = 0;
    this.priceBruttoTotal = 0;
    this.priceNettoTotal = 0;
    this.tax = 0;
    this.currency = '';
    this.exchange = 0;
    this.picking = 0;
    this.packing = 0;
    this.warehouseAction = 0;
    this.addBy = 0;
    this.isActive = 1;

    if( data!==undefined && data!==null ){
      for (var key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
}
