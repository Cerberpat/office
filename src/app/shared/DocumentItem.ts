export class DocumentItem {
  id: number;
  idOrder: number;
  idInvoice: number;
  idOrderCompany: number;
  idProduct: number;
  idCategory: number;
  name: string;
  quantity: number;
  price: number;
  tax: number;
  currency: string;
  exchange: number;
  picking: number;
  packing: number;
  warehouseAction: number;
  active: number;

  constructor( data = null ) {
    this.id = 0;
    this.idOrder = 0;
    this.idInvoice = 0;
    this.idOrderCompany = 0;
    this.idProduct = 0;
    this.idCategory = 0;
    this.name = '';
    this.quantity = 0;
    this.price = 0;
    this.tax = 0;
    this.currency = '';
    this.exchange = 0;
    this.picking = 0;
    this.packing = 0;
    this.warehouseAction = 0;
    this.active = 0;

    if( data!==undefined && data!==null ){
      for (var key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
}
