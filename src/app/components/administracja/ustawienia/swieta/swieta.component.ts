import { Component, OnInit } from '@angular/core';
import {Profil} from '../../../../shared/profil';
import {ApiService} from '../../../../services/api.service';
import {Swieto} from '../../../../shared/swieto';
import {ConfirmationService} from 'primeng';

@Component({
  selector: 'app-swieta',
  templateUrl: './swieta.component.html',
  styleUrls: ['./swieta.component.sass', './../../../../app.component.sass'],
  providers: [ConfirmationService]
})
export class SwietaComponent implements OnInit {
  logedUser: Profil;
  swieta: any = [];
  colsSwieta: any[];
  addSwietoObj: Swieto = new Swieto();
  clonedSwieta: any = [];
  swietaDates = [];
  swietaText = [];
  perPage = 10;
  es: any;

  constructor( private servService: ApiService, private confirmationService: ConfirmationService ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));

    this.colsSwieta = [
      { field: 'data', header: 'Data' },
      { field: 'nazwa', header: 'Nazwa' }
    ];

    this.es = {
      firstDayOfWeek: 1,
      dayNames: [ 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela' ],
      dayNamesShort: [ 'nie', 'pod', 'wto', 'śro', 'czw', 'pią', 'sob' ],
      dayNamesMin: [ 'N', 'P', 'W', 'Ś', 'C', 'P', 'S' ],
      monthNames: [ 'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień' ],
      monthNamesShort: [ 'sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru' ],
      today: 'Hoy',
      clear: 'Borrar'
    };
  }

  ngOnInit(): void {
    this.getSwieta();
  }

  onRowEditInitSwieto(swieto: Swieto) {
    this.clonedSwieta[swieto.id] = {...swieto};
  }
  onRowEditSaveSwieto(swieto: Swieto) {
    if (swieto.id > 0) {
      swieto.data = new Date(swieto.data);
      swieto.data.setMinutes(swieto.data.getMinutes() + 120);
      this.servService.updateSwieto( swieto.id, swieto ).subscribe((data: {}) => {
        delete this.clonedSwieta[swieto.id];
        this.getSwieta();
      });
    } else {
      alert('error');
    }
  }
  onRowEditCancelSwieto(swieto: Swieto, index: number) {
    this.swieta[index] = this.clonedSwieta[swieto.id];
    delete this.clonedSwieta[swieto.id];
  }

  getSwieta(): void {
    this.servService.getSwieta().subscribe((res) => {
      this.swieta = res;
      for (const value of this.swieta) {
        this.swietaDates.push(new Date(value.data));
        this.swietaText.push(value.data);
      }
    });
  }
  addSwieto() {
    if ( this.addSwietoObj.nazwa.length > 0 && this.addSwietoObj.data !== undefined ) {
      this.addSwietoObj.data.setMinutes( this.addSwietoObj.data.getMinutes() + 120);
      this.servService.createSwieto(this.addSwietoObj).subscribe((data: {}) => {
        this.getSwieta();
        this.addSwietoObj = new Swieto();
      });
    }
  }

  deleteSwieto(data) {
    if ( data.id > 0 ) {
      this.confirmationService.confirm({
        message: 'Potwierdzasz usunięcie święta?',
        header: 'Potwierdzenie akcji',
        icon: 'pi pi-info-circle',
        accept: () => {
          // tslint:disable-next-line:no-shadowed-variable
          this.servService.deleteSwieto(data.id).subscribe((data: {}) => {
            this.getSwieta();
          });
          // this.msgs = [{severity:'info', summary:'Confirmed', detail:'Record deleted'}];
        },
        reject: () => {
          // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
      });
    }
  }
}
