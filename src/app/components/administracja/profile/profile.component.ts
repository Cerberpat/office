import { Component, OnInit } from '@angular/core';
import {Profil} from '../../../shared/profil';
import {ApiService} from '../../../services/api.service';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {PassworsResetComponent} from './passwors-reset/passwors-reset.component';
import {ProfilfFormComponent} from './profilf-form/profilf-form.component';
import {ConfirmationService} from 'primeng';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
  providers: [DialogService, ConfirmationService]
})
export class ProfileComponent implements OnInit {
  logedUser: Profil;
  profiles: any = [];
  selectedProfiles: any = [];
  profileSelectOptions = [{label: 'Select', value: null}];
  cols: any = [];
  filters: any = {};
  ref: DynamicDialogRef;

  constructor(
    private servService: ApiService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService
  ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
  }

  ngOnInit(): void {
    this.getProfiles();
    this.filters.perPage = 20;
    this.selectedProfiles = [{id: Number(this.logedUser.id), name: this.logedUser.nazwisko + ' ' + this.logedUser.imie}];
    this.cols = [
      { field: 'nazwisko', header: 'Nazwisko' },
      { field: 'imie', header: 'Imię' },
      { field: 'dataZwrotu', header: 'Data zwrotu' },
      { field: 'dodal', header: 'Dodał/a' },
    ];
  }

  getProfiles(): void {
    this.servService.getProfils({
      where: 'aktywnosc=1'
    }).subscribe((res) => {
      this.profiles = res;
    });
  }

  getProfileNazwa( id ) {
    const temp = this.profiles.filter(x => x.id === id);
    if ( temp[0] !== undefined ) {
      return temp[0].imie + ' ' + temp[0].nazwisko;
    } else {
      return '';
    }
  }

  editRow(data) {
    this.ref = this.dialogService.open(ProfilfFormComponent, {
      data: {
        obj: data,
      },
      header: 'Edycja: ' + data.nazwisko + ' ' + data.imie,
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((profil: Profil) => {
      if (profil) {
      }
    });
  }

  addRow() {
    this.ref = this.dialogService.open(ProfilfFormComponent, {
      data: {
        obj: new Profil(),
      },
      header: 'Dodawanie profilu',
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((profil: Profil) => {
      if (profil) {
      }
    });
  }

  resetHasla(data) {
    this.ref = this.dialogService.open(PassworsResetComponent, {
      data: {
        obj: data,
      },
      header: 'Zmiana hasła',
      width: '25%',
      height: '90%',
    });

    this.ref.onClose.subscribe((profil: Profil) => {
      if (profil) {
      }
    });
  }
}
