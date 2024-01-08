import { Component, OnInit } from '@angular/core';
import {Profil} from '../../../../shared/profil';
import {ApiService} from '../../../../services/api.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app-passwors-reset',
  templateUrl: './passwors-reset.component.html',
  styleUrls: ['./passwors-reset.component.sass']
})
export class PassworsResetComponent implements OnInit {
  profil: Profil;
  reset = {
    pierwsze: '',
    drugie: ''
  };

  constructor(private servService: ApiService,
              public ref: DynamicDialogRef,
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.profil = this.config.data.obj;
  }

  zapisz(){
    if ( this.reset.pierwsze.length >= 8 && this.reset.pierwsze === this.reset.drugie ) {
      this.profil.haslo = this.reset.pierwsze;
      this.servService.updateProfil( this.profil.id, this.profil ).subscribe((res) => {
        this.ref.close(this.profil);
      });
    }
  }

  log( data ){
    console.log(data);
  }
}
