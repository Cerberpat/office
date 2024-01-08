export class SetNr {
  id: number;
  type: string;
  documentId : number;
  setNr: number;

  constructor( data = null ) {
    this.id = 0;
    this.type = '';
    this.documentId = 0;
    this.setNr = 0;

    if( data!==undefined && data!==null ){
      for (var key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
}
