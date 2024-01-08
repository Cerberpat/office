export class Deposit {
  id: number;
  title: string;
  wholesalerId: number;
  amount: number;
  currency: string;
  isActive: boolean;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;

  constructor( data = null ) {
    this.id = 0;
    this.title = '';
    this.wholesalerId = 0;
    this.amount = 0;
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
