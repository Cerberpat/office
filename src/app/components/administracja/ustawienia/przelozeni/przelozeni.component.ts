import { Component, OnInit } from '@angular/core';
import {Profil} from '../../../../shared/profil';
import {ApiService} from '../../../../services/api.service';

@Component({
  selector: 'app-przelozeni',
  templateUrl: './przelozeni.component.html',
  styleUrls: ['./przelozeni.component.sass']
})
export class PrzelozeniComponent implements OnInit {
  logedUser: Profil;
  profiles: any = [];
  profilesTemp: any = [];
  profileSelectOptions = [{label: 'Select', value: null}];
  przelozonyTemp: any = [];
  colsPrzelozony: any[];
  perPage = 10;

  constructor( private servService: ApiService ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));

    this.colsPrzelozony = [
      { field: 'imie', header: 'Imie' },
      { field: 'nazwisko', header: 'Nazwisko' },
      { field: 'przelozony', header: 'Przełożeni' }
    ];
  }

  ngOnInit(): void {
    this.getProfiles();
  }

  getProfiles(): void {
    this.servService.getProfils({where: 'aktywnosc=1'}).subscribe((res) => {
      this.profiles = res;
      this.profilesTemp = res;
      this.profileSelectOptions = [];
      for (const value of this.profiles) {
        this.profileSelectOptions.push({
          label: value.imie + ' ' + value.nazwisko, value: value.id
        });
        if ( value.przelozony !== '' ) {
          value.przelozony = JSON.parse(value.przelozony);
        }
      }
    });
  }

  onRowEditInitPrzelozony(profil: Profil) {
    this.przelozonyTemp[profil.id] = {...profil};
  }
  onRowEditSavePrzelozony(profil: Profil) {
    if (profil.id > 0) {
      profil.przelozony = JSON.stringify(profil.przelozony);
      this.servService.updateProfil( profil.id, profil ).subscribe((data: {}) => {
        delete this.przelozonyTemp[profil.id];
        this.getProfiles();
      });
    } else {
      alert('error');
    }
  }
  onRowEditCancelPrzelozony(profil: Profil, index: number) {
    this.profiles[index] = this.przelozonyTemp[profil.id];
    delete this.przelozonyTemp[profil.id];
  }

  checkPrzelozony( wlasciciel ) {
    const pro = this.profiles.filter(x => x.id === wlasciciel);
    for ( let i = 0; i < pro[0].przelozony.length; i++ ) {
      if ( pro[0].przelozony[i].value === this.logedUser.id ){
        return true;
      }
    }
    return false;
  }
  akceptacjaPrzelozony() {
    for ( let i = 0; i < this.profiles.length; i++ ) {
      for ( let ii = 0; ii < this.profiles[i].przelozony.length; ii++ ) {
        if ( this.profiles[i].przelozony[ii].value === this.logedUser.id ){
          return true;
        }
      }
    }
    return false;
  }

  log(cos) {
    console.log(cos);
  }
}
