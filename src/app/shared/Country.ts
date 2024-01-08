export class Country {
  id: number;
  name: string;
  isoCode2: string;
  isoCode3: string;
  language: string;

  constructor( data=null ) {
    this.id = 0;
    this.name = '';
    this.isoCode2 = '';
    this.isoCode3 = '';
    this.language = '';

    if( data!==undefined && data!==null ){
      for (var key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
/*
  load( json ){
    for (var key in json) {
      if (this.hasOwnProperty(key)) {
        this[key] = json[key];
      }
    }
  }*/
}
