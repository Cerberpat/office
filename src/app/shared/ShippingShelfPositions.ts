export class ShippingShelfPositions {
  id: number;
  shippingId: number;
  shelfId: number;
  positionId: number;
  quantity: number;
  isActive: boolean;

  constructor( data = null ) {
    this.id = 0;
    this.shippingId = 0;
    this.shelfId = 0;
    this.positionId = 0;
    this.quantity = 0;
    this.isActive = true;

    if( data!==undefined && data!==null ){
      for (var key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
}
