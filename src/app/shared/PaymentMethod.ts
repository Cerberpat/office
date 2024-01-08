export class PaymentMethod {
  id: number;
  name: string;

  constructor( data = null ){
    this.id = 0;
    this.name = '';

    if( data!==undefined && data!==null ){
      for (var key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
}
