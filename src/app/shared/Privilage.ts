export class Privilage {
  id: number;
  system: string;
  tab: string;
  specific: string;
  description: string;

  constructor( data = null ) {
    this.id = 0;
    this.system = '';
    this.tab = '';
    this.specific = '';
    this.description = '';

    if( data!==undefined && data!==null ){
      for (var key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
}
