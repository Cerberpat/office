export class DepositSplit {
  id: number;
  depositsId: number;
  invoiceId: number;
  amount: number;
  currency: string;
  isActive: boolean;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;

  constructor( data = null ) {
    this.id = 0;
    this.depositsId = 0;
    this.invoiceId = 0;
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
