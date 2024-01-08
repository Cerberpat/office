import {Component, Input, OnInit} from '@angular/core';
import {Profil} from '../../../shared/profil';
import {ApiService} from '../../../services/api.service';
import {SimpleData} from '../../../shared/simpleData';
import {ConfirmationService} from 'primeng';

@Component({
  selector: 'app-historia',
  templateUrl: './historia.component.html',
  styleUrls: ['./historia.component.sass'],
  providers: [ConfirmationService]
})
export class HistoriaComponent implements OnInit {
  @Input() source: string;
  @Input() sourceId: number;
  logedUser: Profil;
  profiles: any = [];
  filters: any = {};
  cols: any = [];
  historia: any = [];
  cloneHistoria: any = [];
  historiaTemp: any = [];
  newRekord: SimpleData = new SimpleData();

  constructor( private servService: ApiService, private confirmationService: ConfirmationService ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.filters.perPage = 10;

    this.cols = [
      { field: 'wartosc', header: 'Treść' },
      { field: 'dodal', header: 'Dodał/a' },
      { field: 'czasDodania', header: 'Dodano' }
    ];
    this.historia = [];
  }

  ngOnInit(): void {
    this.getHistoria();
    this.getProfiles();
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

  getHistoria() {
    this.servService.getSimpleData('historia', this.source, this.sourceId).subscribe((res) => {
      this.historia = res;
    });
  }

  addRekord() {
    this.newRekord.dodal = this.logedUser.id;
    this.newRekord.pochodzenie = this.source;
    this.newRekord.pochodzenieId = this.sourceId;
    this.newRekord.typ = 'historia';
    this.servService.createSimpleData(this.newRekord).subscribe((res) => {
      this.getHistoria();
      this.newRekord = new SimpleData();
    });
  }

  onRowEditInit(simpleData: SimpleData) {
    this.cloneHistoria[simpleData.id] = {...simpleData};
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
            delete this.cloneHistoria[simpleData.id];
            this.getHistoria();
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
        delete this.cloneHistoria[simpleData.id];
        this.getHistoria();
      });
    } else {
      alert('error');
    }
  }
  onRowEditCancel(simpleData: SimpleData, index: number) {
    this.historia[index] = this.cloneHistoria[simpleData.id];
    delete this.cloneHistoria[simpleData.id];
  }
}
