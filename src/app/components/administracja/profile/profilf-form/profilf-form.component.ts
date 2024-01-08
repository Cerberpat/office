import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Profil} from '../../../../shared/profil';
import {isNumeric} from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-profilf-form-wholesalers',
  templateUrl: './profilf-form.component.html',
  styleUrls: ['./profilf-form.component.sass']
})
export class ProfilfFormComponent implements OnInit {
  profil: Profil;
  aktywnySelOpt = [];
  dostepSelOpt = [];
  dialogMessage = '';
  display = false;

  constructor(private servService: ApiService,
              public ref: DynamicDialogRef,
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.profil = this.config.data.obj;
    if ( this.profil.id === undefined || this.profil.id > 0 ) {
      this.profil.aktywnosc = 1;

      this.profil.dostep = 0;
    }
    this.aktywnySelOpt = [
      {label: 'TAK', value: '1'},
      {label: 'NIE', value: '0'}
    ];
    this.dostepSelOpt = [
      {label: 'Użytkownik', value: '0'},
      {label: 'Admin', value: '1'}
    ];
  }

  zapisz(){
    let addOk = true;
    this.dialogMessage = '';
    if ( this.profil.login === undefined || this.profil.login.length < 8 ) {
      this.dialogMessage = this.dialogMessage + '- Login musi zawiuerać conajmniej 8 znaków.<br />';
      addOk = false;
    }
    if ( this.profil.haslo === undefined || this.profil.haslo.length < 8 ) {
      this.dialogMessage = this.dialogMessage + '- Hasło musi zawiuerać conajmniej 8 znaków.<br />';
      addOk = false;
    }
    if ( this.profil.mail.length > 0 && !this.profil.mail.match(/[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9A-Z](?:[a-z0-9A-Z]*[a-z0-9A-Z])?\.)+[a-z0-9A-Z](?:[a-z0-9A-Z]*[a-z0-9A-Z])?/) ) {
      this.dialogMessage = this.dialogMessage + '- Błędny mail.<br />';
      addOk = false;
    }
    if ( this.profil.imie === undefined || this.profil.imie.length < 1 ) {

      this.dialogMessage = this.dialogMessage + '- Podaj imię.<br />';
      addOk = false;
    }
    if ( this.profil.nazwisko === undefined || this.profil.nazwisko.length < 1 ) {
      this.dialogMessage = this.dialogMessage + '- Podaj nazwisko.<br />';
      addOk = false;
    }
    if ( addOk ) {
      if ( this.profil.id > 0 ) {
        this.servService.updateProfil(this.profil.id, this.profil).subscribe((res) => {
          this.ref.close(this.profil);
        });
      }else{
        this.servService.createProfil(this.profil).subscribe((res) => {
          this.ref.close(this.profil);
        });
      }
    }else{
      this.display = true;
    }
  }
  closeDialog(){
    this.display = false;
  }
}
