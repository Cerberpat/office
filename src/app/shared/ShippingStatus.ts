export class ShippingStatus {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor( data = null ) {
    this.id = 0;
    this.name = '';
    this.description = '';
    this.isActive = true;
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
