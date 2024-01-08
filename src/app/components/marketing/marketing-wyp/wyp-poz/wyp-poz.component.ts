import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {Profil} from '../../../../shared/profil';
import {MarketingWypPoz} from '../../../../shared/marketingWypPoz';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-wyp-poz',
  templateUrl: './wyp-poz.component.html',
  styleUrls: ['./wyp-poz.component.sass']
})
export class WypPozComponent implements OnInit {
  @Input() source: string;
  @Input() sourceId: number;
  wypozyczeniaPozycje: any = [];
  wypozyczeniaPozycjeClone: any = [];
  filters: any = {};
  cols: any = [];
  logedUser: Profil;
  profiles: any = [];

  constructor(
    private servService: ApiService
  ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.filters.perPage = 10;

    this.cols = [
      { field: 'nazwa', header: 'Nazwa' },
      { field: 'ilosc', header: 'Ilość' },
      { field: 'wysylka', header: 'Wysyłka' },
      { field: 'zwrot', header: 'Zwrot' },
      { field: 'dodal', header: 'Dodał/a' }
    ];
  }

  ngOnInit(): void {
    this.getWypozyczeniaPozycje( this.sourceId );
    this.getProfiles();
  }

  getWypozyczeniaPozycje( id ): void {
    this.servService.getMarketingWypPozs(id).subscribe((res) => {
      this.wypozyczeniaPozycje = res;
    });
  }

  getProfiles(): void {
    this.servService.getProfils().subscribe((res) => {
      this.profiles = res;
    });
  }

  getProfileNazwa( id ) {
    const temp = this.profiles.filter(x => x.id === id);
    if ( temp[0] !== undefined ) {
      return temp[0].imie + ' ' + temp[0].nazwisko;
    } else {
      return '';
    }
  }

  onRowEditInit(wypozyczeniaPozycje: MarketingWypPoz) {
    this.wypozyczeniaPozycjeClone[wypozyczeniaPozycje.id] = {...wypozyczeniaPozycje};
  }

  onRowEditSave(wypozyczeniaPozycje: MarketingWypPoz) {
    if (wypozyczeniaPozycje.id > 0) {
      if ( this.wypozyczeniaPozycjeClone[wypozyczeniaPozycje.id].wysylka !== wypozyczeniaPozycje.wysylka ){
        wypozyczeniaPozycje.wysylkaCzas = this.getRealData( new Date() );
        wypozyczeniaPozycje.wysylkaAdm = this.logedUser.id;
      }
      if ( this.wypozyczeniaPozycjeClone[wypozyczeniaPozycje.id].zwrot !== wypozyczeniaPozycje.zwrot ){
        wypozyczeniaPozycje.zwrotCzas = this.getRealData( new Date() );
        wypozyczeniaPozycje.zwrotAdm = this.logedUser.id;
      }
      this.servService.updateMarketingWypPoz( wypozyczeniaPozycje.id, wypozyczeniaPozycje ).subscribe((data: {}) => {
        delete this.wypozyczeniaPozycjeClone[wypozyczeniaPozycje.id];
        this.getWypozyczeniaPozycje( this.sourceId );
      });
    } else {
      alert('error');
    }
  }

  onRowEditCancel(wypozyczeniaPozycje: MarketingWypPoz, index: number) {
    this.wypozyczeniaPozycje[index] = this.wypozyczeniaPozycjeClone[wypozyczeniaPozycje.id];
    delete this.wypozyczeniaPozycjeClone[wypozyczeniaPozycje.id];
  }

  getRealData( data ) {
    // data = data.setMinutes( data.getMinutes() + (new Date().getTimezoneOffset()) );
    return formatDate(data, 'yyyy-MM-dd HH:mm:ss', 'pl-PL');
  }

  log( cos ) {
    console.log(cos);
  }
}
