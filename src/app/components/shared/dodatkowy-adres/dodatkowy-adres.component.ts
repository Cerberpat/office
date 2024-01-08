import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Profil} from '../../../shared/profil';
import {Adres} from '../../../shared/adres';
import {ConfirmationService} from 'primeng';

@Component({
  selector: 'app-dodatkowy-adres',
  templateUrl: './dodatkowy-adres.component.html',
  styleUrls: ['./dodatkowy-adres.component.sass'],
  providers: [ConfirmationService]
})
export class DodatkowyAdresComponent implements OnInit {
  @Input() source: string;
  @Input() sourceId: number;
  logedUser: Profil;
  adresy: any = [];
  clonedAdresy: { [s: string]: Adres; } = {};
  countries: any = [];
  cols: any = [];
  filters: any = {};
  add: Adres = new Adres();
  typy: any = [
    {label: 'Ogólny', value: '1'},
    {label: 'Prywatny', value: '2'},
    {label: 'Handlowcy', value: '3'},
    {label: 'Księgowość', value: '4'},
    {label: 'Serwis', value: '5'},
    {label: 'Logistyka', value: '6'},
  ];

  constructor( private servService: ApiService, private confirmationService: ConfirmationService ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.filters.perPage = 10;

    this.cols = [
      { field: 'typ', header: 'Typ' },
      { field: 'nazwa', header: 'Nazwa/Osoba' },
      { field: 'ulica', header: 'Ulica' },
      { field: 'nrLokalu', header: 'Nr. lokalu' },
      { field: 'kodPocztowy', header: 'Kod pocztowy' },
      { field: 'miasto', header: 'Miasto' },
      { field: 'kraj', header: 'Kraj' },
      { field: 'telefon', header: 'Telefon' },
      { field: 'mail', header: 'Mail' }
    ];
    this.adresy = [];
  }

  ngOnInit(): void {
    this.getCountries();
    this.getAdresy();
  }

  getAdresy() {
    this.servService.getAdresy(this.source, this.sourceId).subscribe((res) => {
      this.adresy = res;
    });
  }

  getCountries() {
    this.servService.getKraje({}).subscribe((res) => {
      // @ts-ignore
      for (const value of res) {
        this.countries.push({
          label: value.name, value: value.id
        });
      }
    });
  }

  getTypName( type ){
    const temp = this.typy.filter(x => x.value === type);
    return temp[0].label;
  }

  getKrajNazwa( id ) {
    const temp = this.countries.filter(x => x.value === id);
    if ( temp[0] !== undefined ) {
      return temp[0].label;
    } else {
      return '';
    }
  }

  onRowEditInit(adres: Adres) {
    this.clonedAdresy[adres.id] = {...adres};
  }

  onRowEditSave(adres: Adres) {
    if (adres.id > 0) {
      delete this.clonedAdresy[adres.id];
      this.servService.updateAdres( adres.id, adres ).subscribe((data: {}) => {
        delete this.clonedAdresy[adres.id];
        this.getAdresy();
      });
      // this.messageService.add({severity:'success', summary: 'Success', detail:'Car is updated'});
    }
    else {
      // this.messageService.add({severity:'error', summary: 'Error', detail:'Year is required'});
    }
  }
  onRowEditCancel(adres: Adres, index: number) {
    this.adresy[index] = this.clonedAdresy[adres.id];
    delete this.clonedAdresy[adres.id];
  }
  onRowDelete(adres: Adres) {
    if (adres.id > 0) {
      const mess = 'Potwierdzasz chęć usunięcia rekordu?';
      this.confirmationService.confirm({
        message: mess,
        header: 'Potwierdzenie akcji',
        icon: 'pi pi-info-circle',
        accept: () => {
          adres.aktywnosc = 0;
          this.servService.updateAdres( adres.id, adres ).subscribe((data: {}) => {
            delete this.clonedAdresy[adres.id];
            this.getAdresy();
          });
        },
        reject: () => {
        }
      });
    } else {
      alert('error');
    }
  }
  addNewAdres() {
    if ( this.add.typ !== undefined && this.add.nazwa.length > 0 ) {
      this.add.pochodzenie = this.source;
      this.add.pochodzenieId = this.sourceId;
      this.add.aktywnosc = 1;
      this.servService.createAdres(this.add).subscribe((data: {}) => {
        this.getAdresy();
      });
    }
  }
}
