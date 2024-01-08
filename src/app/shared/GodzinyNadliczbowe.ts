export class GodzinyNadliczbowe {
  id: number;
  wlasciciel: number;
  minut: number;
  komentarz: string;
  aktywnosc: number;
  dodano: Date;
  dodal: number;

  constructor( data=null ) {
    this.id = 0;
    this.wlasciciel = 0;
    this.minut = 0;
    this.komentarz = '';
    this.aktywnosc = 1;
    this.dodano = new Date();
    this.dodal = 0;

    if( data!==undefined && data!==null ){
      for (var key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
}

