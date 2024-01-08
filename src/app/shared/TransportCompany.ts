export class TransportCompany {
  id: number;
  name: string;
  usedIn: string;
  isActive: number;

  constructor( data = null ){
    this.id = 0;
    this.name = '';
    this.usedIn = '';
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
