export class StockLog {
  id: number;
  source: string;
  sourceID: number;
  productId: number;
  shelfId: number;
  warehouseId: number;
  company: number;
  quantity: number;
  isActive: boolean;
  addBy: number;
  createdAt: Date;
  updatedAt: Date;

  constructor( data = null ) {
    this.id = 0;
    this.source = '';
    this.sourceID = 0;
    this.productId = 0;
    this.shelfId = 0;
    this.warehouseId = 0;
    this.company = 0;
    this.quantity = 0;
    this.isActive = true;
    this.addBy = 0;
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
