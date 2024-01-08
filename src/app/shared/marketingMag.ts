export class MarketingMag {
  id: number;
  firma: number;
  kategoria: number;
  nazwa: string;
  prodId: number;
  wypozyczenieId: number;
  lokalizacja: number;
  lokalizacjaOpis: string;
  numerSeryjny: string;
  materialMarketingowy: number;
  identyfikator: number;
  iloscAktualna: number;
  iloscPoczatkowa: number;
  opiekun: number;
  finansowanie: string;
  nrDokWpro: string;
  dodal: number;
  czasDodania: string;
  doWypozyczen: number;
  aktywnosc: number;

  constructor() {
    this.firma = 0;
    this.kategoria = 0;
    this.nazwa = '';
    this.prodId = 0;
    this.wypozyczenieId = 0;
    this.lokalizacja = 0;
    this.lokalizacjaOpis = '';
    this.numerSeryjny = '';
    this.materialMarketingowy = 0;
    this.identyfikator = 0;
    this.iloscAktualna = 1;
    this.iloscPoczatkowa = 1;
    this.opiekun = 0;
    this.finansowanie = '';
    this.nrDokWpro = '';
    this.dodal = 0;
    this.czasDodania = '';
    this.doWypozyczen = 0;
    this.aktywnosc = 1;
  }
}
