import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Zadania} from '../../../shared/zadania';
import {Profil} from '../../../shared/profil';
import {formatDate} from '@angular/common';
import {isNumeric} from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-form-wholesalers-zadanie',
  templateUrl: './form-zadanie.component.html',
  styleUrls: ['./form-zadanie.component.sass']
})
export class FormZadanieComponent implements OnInit {
  logedUser: Profil;
  source: string;
  sourceId: number;
  zadanie: Zadania;
  zadanieTemp: any = [];
  profile: any = [];
  temp: any = [];
  czasTrwania: any = {godziny: 0, minuty: 0};
  szacowanyCzas: any = {godziny: 0, minuty: 0};
  display = false;
  dialogMessage = '';

  constructor(
    private servService: ApiService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
  }

  ngOnInit(): void {
    this.profile = this.config.data.profile;
    this.zadanie = this.config.data.obj;
    this.zadanieTemp = Object.assign({}, this.config.data.obj);
    if ( this.zadanieTemp.czasTrwania !== undefined ){
      this.czasTrwania.godziny = Math.floor(this.zadanieTemp.czasTrwania / 60);
      this.czasTrwania.minuty = this.zadanieTemp.czasTrwania % 60;
    }
    if ( this.zadanieTemp.szacowanyCzas !== undefined ){
      this.szacowanyCzas.godziny = Math.floor(this.zadanieTemp.szacowanyCzas / 60);
      this.szacowanyCzas.minuty = this.zadanieTemp.szacowanyCzas % 60;
    }
    this.source = 'wypozyczenia-wyp';
    this.sourceId = this.zadanie.id;
    this.zadanieTemp.wykonawca = this.getProfilById( this.zadanieTemp.wykonawca );
    if ( this.zadanieTemp.id > 0 ) {
      this.zadanieTemp.zatwierdzajacy = this.getProfilById( this.zadanieTemp.zatwierdzajacy );
    }else{
      this.zadanieTemp.zatwierdzajacy = this.getProfilById( this.logedUser.id );
    }
    if ( this.zadanieTemp.deadline === '0000-00-00' ) {
      this.zadanieTemp.deadline = '';
    }
    // this.getProfiles();
  }

  /* getProfiles(): void {
    this.servService.getProfils().subscribe((res) => {
      this.temp = res;
      this.profile = [{id: '', name: 'Wybierz osobę...'}];
      for (const value of this.temp) {
        this.profile.push({
          id: Number(value.id), name: value.imie + ' ' + value.nazwisko
        });
      }
    });
  } */

  saveadd() {
    let addOk = true;
    this.dialogMessage = '';
    this.zadanieTemp.dodal = this.logedUser.id;
    console.log(this.zadanieTemp);
    if ( this.zadanieTemp.wykonawca === undefined ) {
      addOk = false;
      this.dialogMessage = this.dialogMessage + '- Należy wybrać osobę mającą wykonać zadanie.<br />';
    }else{
      // @ts-ignore
      this.zadanieTemp.wykonawca = this.zadanieTemp.wykonawca.id;
    }
    if ( this.zadanieTemp.zatwierdzajacy === undefined ) {
      addOk = false;
      this.dialogMessage = this.dialogMessage + '- Należy wybrać osobę opiekującą się zadaniem.<br />';
    }else{
      // @ts-ignore
      this.zadanieTemp.zatwierdzajacy = this.zadanieTemp.zatwierdzajacy.id;
    }
    if ( this.zadanieTemp.nazwa === undefined || this.zadanieTemp.nazwa === '' ) {
      addOk = false;
      this.dialogMessage = this.dialogMessage + '- Należy wpisać nazwę zadania.<br />';
    }
    this.zadanieTemp.szacowanyCzas = (this.szacowanyCzas.godziny * 60) + this.szacowanyCzas.minuty;
    this.zadanieTemp.deadline = this.getRealDataBezCzasu(this.zadanieTemp.deadline);
    if ( addOk ) {
      this.servService.createZadania(this.zadanieTemp).subscribe((res) => {
        this.ref.close(this.zadanieTemp);
      });
    }else{
      this.zadanieTemp.wykonawca = this.getProfilById( this.zadanieTemp.wykonawca );
      this.zadanieTemp.zatwierdzajacy = this.getProfilById( this.zadanieTemp.zatwierdzajacy );
      this.display = true;
    }
  }

  saveEdit() {
    let addOk = true;
    this.dialogMessage = '';
    if ( !isNumeric(this.zadanieTemp.wykonawca.id) ) {
      addOk = false;
      this.dialogMessage = this.dialogMessage + '- Należy wybrać osobę mającą wykonać zadanie.<br />';
    }else{
      // @ts-ignore
      this.zadanieTemp.wykonawca = this.zadanieTemp.wykonawca.id;
    }
    if ( !isNumeric(this.zadanieTemp.zatwierdzajacy.id) ) {
      addOk = false;
      this.dialogMessage = this.dialogMessage + '- Należy wybrać osobę opiekującą się zadaniem.<br />';
    }else{
      // @ts-ignore
      this.zadanieTemp.zatwierdzajacy = this.zadanieTemp.zatwierdzajacy.id;
    }
    if ( this.zadanieTemp.nazwa === undefined || this.zadanieTemp.nazwa === '' ) {
      addOk = false;
      this.dialogMessage = this.dialogMessage + '- Należy wpisać nazwę zadania.<br />';
    }
    this.zadanieTemp.czasTrwania = (this.czasTrwania.godziny * 60) + this.czasTrwania.minuty;
    this.zadanieTemp.szacowanyCzas = (this.szacowanyCzas.godziny * 60) + this.szacowanyCzas.minuty;
    this.zadanieTemp.deadline = this.getRealDataBezCzasu(this.zadanieTemp.deadline);
    console.log(this.zadanieTemp);
    if ( addOk ) {
      this.servService.updateZadania( this.zadanieTemp.id, this.zadanieTemp ).subscribe((res) => {
        this.ref.close(this.zadanieTemp);
      });
    }else{
      this.zadanieTemp.wykonawca = this.getProfilById( this.zadanieTemp.wykonawca );
      this.zadanieTemp.zatwierdzajacy = this.getProfilById( this.zadanieTemp.zatwierdzajacy );
      this.display = true;
    }
  }

  cancelEdit() {
    this.ref.close(this.zadanie);
  }

  getProfilById( id ) {
    const ret = this.profile.filter(x => x.id === Number(id));
    return ret[0];
  }
  nazwaUseraById( id ) {
    const ret = this.profile.filter(x => x.id === Number(id));
    if ( ret[0] !== undefined ){
      return ret[0].name;
    }else{
      return '';
    }
  }
  closeDialog(){
    this.display = false;
  }
  getRealDataBezCzasu( data ) {
    if ( Object.prototype.toString.call(data) === '[object Date]' ) {
      data = data.setMinutes( data.getMinutes() + (new Date().getTimezoneOffset()) );
      if ( formatDate(data, 'H', 'pl-PL') === '23' ) {
        data = new Date( data );
        data = data.setMinutes( data.getMinutes() + 60 );
      }
      return formatDate(data, 'yyyy-MM-dd', 'pl-PL');
    }
    return data;
  }

  log( cos ){
    console.log(cos);
  }
}
