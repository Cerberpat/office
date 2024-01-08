import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Profil} from '../shared/profil';

@Injectable({
  providedIn: 'root'
})
export class ProfilData {
  profilsTime: Date;
  profils: Profil[];

  constructor(private servService: ApiService) {
    this.loadProfil();
    this.profilsTime = new Date();
  }

  loadProfil(): void {
    this.servService.getProfils().subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        let tempObj = new Profil();
        for (var key in res[i]) {
          if (tempObj.hasOwnProperty(key)) {
            tempObj[key] = res[i][key];
          }
        }
        res[i]=tempObj;
      }
      this.profils = res;
    });
  }

  refreshProfils(){
    if( this.profilsTime.getTime() < new Date().getTime()-(1000 * 60 * 15) ){
      this.loadProfil();
      this.profilsTime = new Date();
    }
  }

  getProfilsObjs(){
    this.refreshProfils();
    return this.profils;
  }
  getProfilObj( id ){
    this.refreshProfils();
    return this.profils.filter(x => x.id === id);
  }
  getProfilName( id ){
    this.refreshProfils();
    const temp: Profil[] = this.profils.filter(x => x.id === id);
    if( temp[0] !== undefined ){
      return temp[0].nazwisko + ' ' + temp[0].imie;
    }
  }
}
