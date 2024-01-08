import { Component, OnInit } from '@angular/core';
import {Profil} from '../../../shared/profil';
import {ApiService} from '../../../services/api.service';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {MarketingWyp} from '../../../shared/marketingWyp';
import {EditWypComponent} from './edit-wyp/edit-wyp.component';
import {AddWypComponent} from './add-wyp/add-wyp.component';

@Component({
  selector: 'app-marketing-wyp',
  templateUrl: './marketing-wyp.component.html',
  styleUrls: ['./marketing-wyp.component.sass'],
  providers: [DialogService]
})
export class MarketingWypComponent implements OnInit {
  logedUser: Profil;
  wypozyczenia: any = [];
  wypozyczeniaProf: any = [];
  profiles: any = [];
  cols: any = [];
  odbiorcySelect: any = [{value: '', label: ''}];
  filters: any = {};
  ref: DynamicDialogRef;

  constructor( private servService: ApiService, public dialogService: DialogService ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.filters.perPage = 10;

    this.cols = [
      { field: 'odbiorca', header: 'Odbiorca' },
      { field: 'dataWypozyczenia', header: 'Data wypożyczenia' },
      { field: 'dataZwrotu', header: 'Data zwrotu' },
      { field: 'dodal', header: 'Dodał/a' },
    ];
  }

  ngOnInit(): void {
    this.getMarketingWyp();
    this.getMarketingProf();
    this.getProfiles();
  }

  getMarketingWyp(){
    this.servService.getMarketingWyps().subscribe((res) => {
      this.wypozyczenia = res;
    });
  }

  getMarketingProf(){
    this.servService.getMarketingProfs().subscribe((res) => {
      this.wypozyczeniaProf = res;
      for ( const value of this.wypozyczeniaProf ) {
        this.odbiorcySelect[this.odbiorcySelect.length] = {
          value: value.id, label: value.nazwa
        };
      }
    });
  }

  getProfiles(): void {
    this.servService.getProfils().subscribe((res) => {
      this.profiles = res;
    });
  }

  getMarketingProfNazwa( id ) {
    const temp = this.wypozyczeniaProf.filter(x => x.id === id);
    if ( temp[0] !== undefined ) {
      return temp[0].nazwa;
    } else {
      return '-';
    }
  }

  getProfileNazwa( id ) {
    const temp = this.profiles.filter(x => x.id === id);
    if ( temp[0] !== undefined ) {
      return temp[0].imie + ' ' + temp[0].nazwisko;
    } else {
      return '';
    }
  }

  editRow(data) {
    this.ref = this.dialogService.open(EditWypComponent, {
      data: {
        obj: data,
        odbiorcy: this.odbiorcySelect
      },
      header: 'Edycja: ' + data.odbiorca,
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((marketingWyp: MarketingWyp) => {
      if (marketingWyp) {
        this.getMarketingWyp();
      }
    });
  }

  addRow() {
    this.ref = this.dialogService.open(AddWypComponent, {
      data: {
        obj: new MarketingWyp(),
        odbiorcy: this.odbiorcySelect
      },
      header: 'Dodawanie wypożyczenia',
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((marketingWyp: MarketingWyp) => {
      if (marketingWyp) {
        this.editRow(marketingWyp);
      }
    });
  }

  log(cos){
    console.log(cos);
  }
}
