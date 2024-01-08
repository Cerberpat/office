import { Component, OnInit } from '@angular/core';
import {Profil} from '../../../shared/profil';
import {ApiService} from '../../../services/api.service';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {EditProfComponent} from './edit-prof/edit-prof.component';
import {MarketingProf} from '../../../shared/marketingProf';

@Component({
  selector: 'app-marketing-prof',
  templateUrl: './marketing-prof.component.html',
  styleUrls: ['./marketing-prof.component.sass'],
  providers: [DialogService]
})
export class MarketingProfComponent implements OnInit {
  logedUser: Profil;
  profiles: any = [];
  countries: any = [];
  cols: any = [];
  filters: any = {};
  ref: DynamicDialogRef;

  constructor( private servService: ApiService, public dialogService: DialogService ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));

    this.cols = [
      { field: 'nazwa', header: 'Nazwa' },
      { field: 'adres', header: 'Adres' },
      { field: 'kodPocztowy', header: 'Kod pocztowy' },
      { field: 'miasto', header: 'Miasto' },
      { field: 'kraj', header: 'Kraj' },
      { field: 'nip', header: 'Nip' },
      { field: 'telefon', header: 'Telefon' },
      { field: 'mail', header: 'Mail' }
    ];
  }

  ngOnInit(): void {
    this.getMarketingProf();
    this.getCountries();
  }

  getMarketingProf(){
    this.servService.getMarketingProfs().subscribe((res) => {
      this.profiles = res;
    });
  }

  getCountries() {
    this.servService.getKraje({}).subscribe((res) => {
      this.countries = res;
    });
  }

  getKrajNazwa( data ) {
    data = JSON.parse(data);
    if ( data.id !== undefined ) {
      return data.nazwa;
    } else {
      const temp = this.countries.filter(x => x.id === data.toString());
      if ( temp[0] !== undefined ) {
        return temp[0].nazwa;
      } else {
        return '';
      }
    }
  }

  editRow(data) {
    this.ref = this.dialogService.open(EditProfComponent, {
      data: {
        obj: data
      },
      header: 'Edycja: ' + data.nazwa,
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((marketingProf: MarketingProf) => {
      if (marketingProf) {
        this.getMarketingProf();
      }
    });
  }

  log(val) {
    console.log(val);
  }
}
