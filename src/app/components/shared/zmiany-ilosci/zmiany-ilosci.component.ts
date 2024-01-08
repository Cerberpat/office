import {Component, Input, OnInit} from '@angular/core';
import {Profil} from '../../../shared/profil';
import {SimpleData} from '../../../shared/simpleData';
import {ConfirmationService} from 'primeng';
import {ApiService} from '../../../services/api.service';
import {MarketingMag} from '../../../shared/marketingMag';

@Component({
  selector: 'app-zmiany-ilosci',
  templateUrl: './zmiany-ilosci.component.html',
  styleUrls: ['./zmiany-ilosci.component.sass'],
  providers: [ConfirmationService]
})
export class ZmianyIlosciComponent implements OnInit {
  @Input() source: string;
  @Input() sourceId: number;
  @Input() iloscPoczatkowa: number;
  logedUser: Profil;
  profiles: any = [];
  filters: any = {};
  cols: any = [];
  ilosci: any = [];
  sumaIlosci = 0;
  cloneIlosc: any = [];
  newRekord: SimpleData = new SimpleData();

  constructor( private servService: ApiService, private confirmationService: ConfirmationService ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.filters.perPage = 10;

    this.cols = [
      { field: 'wartosc', header: 'Ilość' },
      { field: 'dodal', header: 'Dodał/a' },
      { field: 'czasDodania', header: 'Dodano' }
    ];
  }

  ngOnInit(): void {
    this.getIlosci();
    this.getProfiles();
    console.log('Zmiany ilości Loaded.');
  }

  getProfiles(): void {
    this.servService.getProfils().subscribe((res) => {
      this.profiles = res;
    });
  }

  getProfilNazwa( id ) {
    const temp = this.profiles.filter(x => x.id === id);
    if ( temp[0] !== undefined ) {
      return temp[0].imie + ' ' + temp[0].nazwisko;
    } else {
      return '';
    }
  }

  getIlosci() {
    this.servService.getSimpleData('ilosci', this.source, this.sourceId).subscribe((res) => {
      this.ilosci = res;
      for (const value of this.ilosci) {
        this.sumaIlosci += parseFloat(value.wartosc);
      }
    });
  }

  addRekord() {
    this.newRekord.dodal = this.logedUser.id;
    this.newRekord.pochodzenie = this.source;
    this.newRekord.pochodzenieId = this.sourceId;
    this.newRekord.typ = 'ilosci';
    this.servService.createSimpleData(this.newRekord).subscribe((res) => {
      this.getIlosci();
    });
  }

  onRowEditInit(simpleData: SimpleData) {
    this.cloneIlosc[simpleData.id] = {...simpleData};
  }
  onRowDelete(simpleData: SimpleData) {
    if (simpleData.id > 0) {
      const mess = 'Potwierdzasz chęć usunięcia rekordu?';
      this.confirmationService.confirm({
        message: mess,
        header: 'Potwierdzenie akcji',
        icon: 'pi pi-info-circle',
        accept: () => {
          simpleData.aktywnosc = 0;
          this.servService.updateSimpleData( simpleData.id, simpleData ).subscribe((data: {}) => {
            delete this.cloneIlosc[simpleData.id];
            this.getIlosci();
          });
        },
        reject: () => {
        }
      });
    } else {
      alert('error');
    }
  }
  onRowEditSave(simpleData: SimpleData) {
    if (simpleData.id > 0) {
      this.servService.updateSimpleData( simpleData.id, simpleData ).subscribe((data: {}) => {
        delete this.cloneIlosc[simpleData.id];
        this.getIlosci();
      });
    } else {
      alert('error');
    }
  }
  onRowEditCancel(simpleData: SimpleData, index: number) {
    this.ilosci[index] = this.cloneIlosc[simpleData.id];
    delete this.cloneIlosc[simpleData.id];
  }
}
