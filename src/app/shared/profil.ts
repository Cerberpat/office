export class Profil {
  id: number;
  login: string;
  haslo: string;
  imie: string;
  nazwisko: string;
  mail: string;
  language: string;
  dostep: number;
  urlop: number;
  urlop_nz: number;
  urlop_odz: number;
  urlop_zal: number;
  urlop_rozg: number;
  urlop_wkon: number;
  urlop_swie: number;
  urlop_opie: number;
  urlop_ojc: number;
  urlop_zdal: number;
  przelozony: any;
  aktywnosc: number;

  constructor( data=null ) {
    this.id = 0;
    this.login = '';
    this.haslo = '';
    this.imie = '';
    this.nazwisko = '';
    this.mail = '';
    this.dostep = 0;
    this.przelozony = {};
    this.urlop = 0;
    this.urlop_nz = 0;
    this.urlop_odz = 0;
    this.urlop_zal = 0;
    this.urlop_rozg = 0;
    this.urlop_wkon = 0;
    this.urlop_swie = 0;
    this.urlop_opie = 0;
    this.urlop_ojc = 0;
    this.urlop_zdal = 0;
    this.przelozony = [];
    this.aktywnosc = 1;

    if( data!==undefined && data!==null ){
      for (var key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
}
