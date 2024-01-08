export class PrivilageShemaPosition {
  id: number;
  privilagesId: number;
  schemaId: number;

  constructor( data = null ) {
    this.privilagesId = 0;
    this.schemaId = 0;

    if( data!==undefined && data!==null ){
      for (var key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
}
