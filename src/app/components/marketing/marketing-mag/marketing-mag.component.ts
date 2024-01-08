import { Component, OnInit } from '@angular/core';
import {Profil} from '../../../shared/profil';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ApiService} from '../../../services/api.service';
import {MarketingMag} from '../../../shared/marketingMag';
import {EditMagComponent} from './edit-mag/edit-mag.component';

@Component({
  selector: 'app-marketing-mag',
  templateUrl: './marketing-mag.component.html',
  styleUrls: ['./marketing-mag.component.sass'],
  providers: [DialogService]
})
export class MarketingMagComponent implements OnInit {
  logedUser: Profil;
  profiles: any = [];
  magazyn: any = [];
  kategorie: any = [];
  cols: any = [];
  filters: any = {};
  ref: DynamicDialogRef;
  lokalizacje: any = [];

  constructor( private servService: ApiService, public dialogService: DialogService ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.filters.perPage = 10;

    this.cols = [
      { field: 'prodId', header: 'ID. P.' },
      { field: 'nazwa', header: 'Nazwa' },
      { field: 'kategoria', header: 'Kategoria' },
      { field: 'numerSeryjny', header: 'Numer Seryjny' },
      { field: 'lokalizacja', header: 'Lokalizacja' },
      { field: 'opiekun', header: 'Opiekun' },
      { field: '', header: 'Dostępny od' },
      { field: '', header: 'Dost.' }
    ];

    this.lokalizacje = [
      { id: '1', nazwa: 'Biuro' },
      { id: '2', nazwa: 'Magazyn' },
      { id: '3', nazwa: 'Studio' },
      { id: '4', nazwa: 'Serwis' },
      { id: '5', nazwa: 'Szafa nr 1' },
      { id: '6', nazwa: 'Szafa nr 2' },
      { id: '7', nazwa: 'Szafa nr 3' },
      { id: '8', nazwa: 'Szafa nr 4' }
    ];
  }

  ngOnInit(): void {
    this.getMarketingMag();
    this.getProfiles();
    this.getKategorie();
  }

  getProfiles(): void {
    this.servService.getProfils().subscribe((res) => {
      this.profiles = res;
    });
  }

  getMarketingMag(){
    this.servService.getMarketingMags().subscribe((res) => {
      this.magazyn = res;
    });
  }

  getKategorie() {
    this.servService.getCategoryNames().subscribe((res) => {
      this.kategorie = res;
    });
  }

  getKategoriaNazwa( id ) {
    const temp = this.kategorie.filter(x => x.id === id);
    if ( temp[0] !== undefined ) {
      return temp[0].nazwa;
    } else {
      return '';
    }
  }

  getProfilesNazwa( id ) {
    const temp = this.profiles.filter(x => x.id === id);
    if ( temp[0] !== undefined ) {
      return temp[0].imie + ' ' + temp[0].nazwisko;
    } else {
      return '';
    }
  }

  getLokalizacjaNazwa( id ) {
    const temp = this.lokalizacje.filter(x => x.id === id);
    if ( temp[0] !== undefined ) {
      return temp[0].nazwa;
    } else {
      return '';
    }
  }

  editRow(data) {
    if ( data === null ) {
      data = new MarketingMag();
    }
    this.ref = this.dialogService.open(EditMagComponent, {
      data: {
        obj: data
      },
      header: 'Edycja: ' + data.nazwa,
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((marketingMag: MarketingMag) => {
      if (marketingMag) {
        this.getMarketingMag();
      }
    });
  }

  log(val) {
    console.log(val);
  }
}
