export class ShippingPosition {
  id: number;
  shippingId: number;
  productId: number;
  name: string;
  orderedQuantity: number;
  deliveredQuantity: number;
  confirmedQuantity: number;
  price: number;
  currency: string;
  oldCurrency: string;
  exchange: number;
  isActive: boolean;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;

  constructor( data = null ) {
    this.id = 0;
    this.shippingId = 0;
    this.productId = 0;
    this.name = '';
    this.orderedQuantity = 0;
    this.deliveredQuantity = 0;
    this.confirmedQuantity = 0;
    this.price = 0;
    this.currency = '';
    this.oldCurrency = '';
    this.exchange = 0;
    this.isActive = true;
    this.createdBy = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();

    if( data!==undefined && data!==null ){
      for (var key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
}
