import {Component, Input, OnInit} from '@angular/core';
import {GodzinyNadliczboweService} from '../../../services/godzinyNadliczbowe.service';
import {Profil} from '../../../shared/profil';
import {GodzinyNadliczbowe} from '../../../shared/GodzinyNadliczbowe';
import {ApiService} from '../../../services/api.service';
import {ConfirmationService} from 'primeng';

@Component({
  selector: 'app-godziny-nadliczbowe',
  templateUrl: './godziny-nadliczbowe.component.html',
  styleUrls: ['./godziny-nadliczbowe.component.sass']
})
export class GodzinyNadliczboweComponent implements OnInit {
  profileSelect: [{}];
  profiles: any = [];
  logedUser: Profil;
  godzinyNadliczbowe: [GodzinyNadliczbowe];
  newGodziny: any = new GodzinyNadliczbowe();
  displayDialog: boolean;
  dialogText = '';
  constructor(
    private servService: ApiService,
    private godzinyNadliczboweService: GodzinyNadliczboweService,
    private confirmationService: ConfirmationService,
  ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
  }

  ngOnInit(): void {
    this.getGodzinyNadliczbowe();
    this.getProfiles();
  }
  getGodzinyNadliczbowe(){
    this.godzinyNadliczboweService.getList({}).subscribe((res) => {
      if (res) {
        for (let i = 0; i < res.length; i++) {
          res[i] = new GodzinyNadliczbowe(res[i]);
        }
        this.godzinyNadliczbowe = res;
      }
    });
  }
  add(){
    this.newGodziny.dodal=this.logedUser.id;
    if( this.newGodziny.minut<1 ){
      this.dialogText = 'Ilość minut musi być większa niż 0.';
      this.displayDialog = true;
      return false;
    }
    if( this.newGodziny.wlasciciel<1 ){
      this.dialogText = 'Wybierz osobę.';
      this.displayDialog = true;
      return false;
    }
    let newGodzinyTemp = this.newGodziny;
    newGodzinyTemp.wlasciciel = newGodzinyTemp.wlasciciel.value;
    this.godzinyNadliczboweService.create(this.newGodziny).subscribe((data: {}) => {
      this.getGodzinyNadliczbowe();
      this.newGodziny = new GodzinyNadliczbowe();
    });
  }
  delete( rowData ){
    const mess = 'Potwierdzasz chęć usunięcia wpisu?';
    this.confirmationService.confirm({
      message: mess,
      header: 'Potwierdzenie akcji',
      icon: 'pi pi-info-circle',
      accept: () => {
        rowData.aktywnosc=0;
        this.godzinyNadliczboweService.update(rowData.id, rowData).subscribe((data: {}) => {
          this.getGodzinyNadliczbowe();
        });
      },
      reject: () => {
      }
    });
  }
  getProfiles(): void {
    this.servService.getProfils( {} ).subscribe((res) => {
      this.profiles = res;
      this.profileSelect = [{label: 'Wybierz osobę', value: 0}];
      for (const value of res) {
        this.profileSelect.push({
          label: value.nazwisko + ' ' + value.imie, value: value.id
        });
      }
    });
  }
  getWlascicielName( id ) {
    const pro = this.profiles.filter(x => x.id == id);
    if( pro[0]!==undefined ){
      return pro[0].nazwisko + ' ' +pro[0].imie;
    }else{
      return 'Brak';
    }
  }
}
