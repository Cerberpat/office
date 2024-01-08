import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import {ApiService} from '../../services/api.service';
import {Zadania} from '../../shared/zadania';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {MarketingWyp} from '../../shared/marketingWyp';
import {FormZadanieComponent} from './form-zadanie/form-zadanie.component';
import {formatDate} from '@angular/common';
import {Profil} from '../../shared/profil';
import {ConfirmationService} from 'primeng';

@Component({
  selector: 'app-zadania',
  templateUrl: './zadania.component.html',
  styleUrls: ['./zadania.component.sass', './../../app.component.sass']
})
export class ZadaniaComponent implements OnInit {
  logedUser: Profil;
  temp: any = [];
  zadania: any = [];
  zadaniaDoAkceptacji: any = [];
  zadaniaZamkniete: any = [];
  es: any;
  text: any = new Text();
  cols: any;
  maxDate: any;
  ref: DynamicDialogRef;
  display = false;
  dialogMessage = '';
  selectedProfiles: any = [];
  selectedProfilesTemp: any = [];
  zakonczone: any = {};
  typyZakonczone: any = {};

  constructor( private servService: ApiService,
               public dialogService: DialogService,
               private confirmationService: ConfirmationService) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.maxDate = new Date();
    this.zakonczone = {
      profil: [{id: Number(this.logedUser.id), name: this.logedUser.nazwisko + ' ' + this.logedUser.imie}],
      typ: {id: 1, name: 'Wykonane'},
      dataStart: new Date(),
      dataStop: new Date()
    };
    this.getProfiles();
    this.getZadaniaSchedule();
    this.getZadaniaOczekujace();
    this.getZadaniaDoAkceptacji();
    this.getZadaniaZamkniete();
    this.odswiezZakonczone();
    this.selectedProfiles = [{id: Number(this.logedUser.id), name: this.logedUser.nazwisko + ' ' + this.logedUser.imie}];
    this.typyZakonczone = [
      {id: 1, name: 'Wykonane'},
      {id: 2, name: 'Pod opieką'}
    ];
  }

  ngOnInit(): void {
    this.text = {
      NextButton: 'Naprzód',
      PrevButton: 'Wstecz',
      TodayButton: 'Dzisiaj',
      GotoButton: 'Idź do',
    };

    this.es = moment.locale('pl');

    this.cols = [
      { field: 'nazwa', header: 'Nazwa' },
      { field: 'opis', header: 'Opis' },
      { field: 'status', header: 'Status' }
    ];
  }

  getProfiles(): void {
    this.servService.getProfils().subscribe((res) => {
      this.temp = res;
    });
  }
  getZadaniaSchedule(): void {
    this.servService.getZadaniaSchedule().subscribe((res) => {
      this.temp = res;
      for (const value of this.temp) {
        value.start = moment(new Date(value.start));
        value.end = moment(new Date(value.end));
      }
    });
  }
  getZadaniaOczekujace(): void {
    let wykonawca = '';
    this.zadania.oczekujace = [];
    this.zadania.realizowane = [];
    this.zadania.zakonczone = [];
    if ( this.selectedProfiles.length === 0 ) {
      wykonawca = '&wykonawca=' + this.logedUser.id;
    }else if (this.selectedProfiles.length > 0 ){
      let add = false;
      for (const value of this.selectedProfiles) {
        if ( add ){
          wykonawca = wykonawca + '|' + value.id;
        }else{
          wykonawca = '&wykonawca=' + value.id;
        }
        add = true;
      }
    }
    this.servService.getZadania('?statusStop=2' + wykonawca ).subscribe((res) => {
      this.temp = res;
      for (const value of this.temp) {
        if ( value.czasOdczytania === '0000-00-00 00:00:00' ) {
          value.czasOdczytania = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'pl-PL');
          // this.servService.updateZadania(value.id, value).subscribe((res2) => {});
        }
        switch (value.status) {
          case '0': {
            this.zadania.oczekujace[this.zadania.oczekujace.length] = value;
            break;
          }
          case '1': {
            this.zadania.realizowane[this.zadania.realizowane.length] = value;
            break;
          }
          case '2': {
            this.zadania.zakonczone[this.zadania.zakonczone.length] = value;
            break;
          }
        }
      }
    });
  }
  getZadaniaDoAkceptacji(): void {
    this.servService.getZadania('?statusStop=2&zatwierdzajacy=' + this.logedUser.id ).subscribe((res) => {
      this.zadaniaDoAkceptacji = res;
    });
  }
  getZadaniaZamkniete(): void {
    this.servService.getZadania('?statusStart=4&statusStop=4' ).subscribe((res) => {
      this.zadaniaZamkniete = res;
    });
  }

  setStatus(zadanie, newStatus){
    let updateOk = true;
    if ( newStatus === 1 && zadanie.status.toString() === '0' ){
      zadanie.czasRozpoczecia = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'pl-PL');
    }
    if ( newStatus === 2 && zadanie.status.toString() === '1' ){
      zadanie.czasZakonczenia = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'pl-PL');
    }
    if ( newStatus === 2 && zadanie.czasTrwania === '0' ){
      updateOk = false;
      this.dialogMessage = 'Należy wcześniej uzupełnić czas wykonania zadania.\n';
      this.display = true;
    }
    zadanie.status = newStatus;
    if ( updateOk ){
      this.servService.updateZadania(zadanie.id, zadanie).subscribe((res) => {
        this.getZadaniaOczekujace();
        this.getZadaniaDoAkceptacji();
      });
    }
  }

  getWlascicielName(id){
    return 'uzupełnić';
  }
  cofnijZakonczony( zadanie, newStatus ){
    this.confirmationService.confirm({
      message: 'Czy chcesz cofnąć zakończone zadanie do realizacji?',
      accept: () => {
        this.setStatus(zadanie, newStatus);
      }
    });
  }

  usunZadanie( zadanie ){
    this.confirmationService.confirm({
      message: 'Czy na pewno chcesz usunąć to zadanie?',
      accept: () => {
        zadanie.aktywnosc = 0;
        this.servService.updateZadania(zadanie.id, zadanie).subscribe((res) => {
          this.getZadaniaOczekujace();
          this.getZadaniaDoAkceptacji();
        });
      }
    });
  }

  acceptZadania( data ){
    data.zatwierdzil = this.logedUser.id;
    data.czasZatwierdzenia = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'pl-PL');
    data.status = 3;
    this.servService.updateZadania(data.id, data).subscribe((res) => {
      this.getZadaniaOczekujace();
      this.getZadaniaDoAkceptacji();
    });
  }

  addDialog(){
    this.ref = this.dialogService.open(FormZadanieComponent, {
      data: {
        obj: new MarketingWyp(),
      },
      header: 'Dodawanie zadania',
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((zadanie: Zadania) => {
      if (zadanie) {
        this.getZadaniaOczekujace();
        this.getZadaniaDoAkceptacji();
      }
    });
  }
  editDialog( data ){
    this.ref = this.dialogService.open(FormZadanieComponent, {
      data: {
        obj: data,
      },
      header: 'Edycja zadania: ' + data.nazwa,
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((zadanie: Zadania) => {
      if (zadanie) {
        this.getZadaniaOczekujace();
      }
    });
  }
  closeDialog(){
    this.display = false;
  }
  getCzas( minut ){
    return String(Math.floor(minut / 60)).padStart(2, '0') + ':' + String(minut % 60).padStart(2, '0');
  }
  odswiez(){
    this.getZadaniaOczekujace();
    this.selectedProfilesTemp = this.selectedProfiles;
  }
  odswiezZakonczone(){
    this.zakonczone.dataStart = formatDate(this.zakonczone.dataStart, 'yyyy-MM-dd', 'pl-PL');
    this.zakonczone.dataStop = formatDate(this.zakonczone.dataStop, 'yyyy-MM-dd', 'pl-PL');

    let wykonawca = '';
    let zatwierdzajacy = '';
    if ( this.zakonczone.profil.length === 0 ) {
      if ( this.zakonczone.typ.id === 1 ) {
        wykonawca = '&wykonawca=' + this.logedUser.id;
      } else if ( this.zakonczone.typ.id === 2 ) {
        zatwierdzajacy = '&zatwierdzajacy=' + this.logedUser.id;
      }
    }else if (this.zakonczone.profil.length > 0 ){
      let add = false;
      for (const value of this.zakonczone.profil) {
        if ( add ){
          wykonawca = wykonawca + '|' + value.id;
          zatwierdzajacy = zatwierdzajacy + '|' + value.id;
        }else{
          if ( this.zakonczone.typ.id === 1 ) {
            wykonawca = '&wykonawca=' + value.id;
          } else if ( this.zakonczone.typ.id === 2 ) {
            zatwierdzajacy = '&zatwierdzajacy=' + value.id;
          }
        }
        add = true;
      }
    }
    if ( this.logedUser.dostep.toString() === '0' ) {
      wykonawca = wykonawca + zatwierdzajacy + '&zatwierdzajacy=' + this.logedUser.id;
    }

    this.servService.getZadania('?statusStart=3&statusStop=3&zatwierdzilStart=0&czasZatwierdzeniaStart=' + this.zakonczone.dataStart + '&czasZatwierdzeniaStop=' + this.zakonczone.dataStop + wykonawca + zatwierdzajacy ).subscribe((res) => {
      this.zadaniaZamkniete = res;
    });
  }
  zapiszKolejnosc( statusNazwa ){
    const data = [];
    if ( this.zadania[statusNazwa] !== undefined ){
      let nr = 1;
      for (const value of this.zadania[statusNazwa]) {
        data.push({ [value.id] : nr });
        nr++;
      }
    }
    if ( data.length > 0 ){
      this.servService.updateSortowanie(data).subscribe((res) => {
      });
    }
  }
  log(cos){
    console.log(cos);
  }
}
