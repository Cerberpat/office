import { Component, OnInit, Input } from '@angular/core';
import {Profil} from '../../shared/profil';
import {ApiService} from '../../services/api.service';
import {Router} from '@angular/router';
import {formatDate} from '@angular/common';
import {Section} from 'ngx-time-scheduler';

@Component({
  selector: 'app-raport',
  templateUrl: './raport.component.html',
  styleUrls: ['./raport.component.sass', '../../app.component.sass']
})
export class RaportComponent implements OnInit {
  Records: any = [];
  Users: any = [];
  UsersPrint: any = [];
  logedUser: Profil;
  selectedProfiles: any;
  maxDate: Date = new Date();
  startDate: Date = new Date();
  stopDate: Date = new Date();
  add: any = {
    id: 0,
    dzien: formatDate(new Date(), 'yyyy-MM-dd', 'pl-PL'),
    opis: '',
    iloscGodzin: 0,
    dodal: 0
  };
  profileSelect: Section[];
  fraza = '';

  constructor(
    public restApi: ApiService,
    public router: Router
  ){
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.selectedProfiles = [{id: Number(this.logedUser.id), name: this.logedUser.nazwisko + ' ' + this.logedUser.imie}];
  }

  ngOnInit(): void {
    this.loadUsersList();
    this.loadList();
  }

  odswiez() {
    if ( this.selectedProfiles.length === 0 ) {
      this.selectedProfiles = [{id: Number(this.logedUser.id), name: this.logedUser.nazwisko + ' ' + this.logedUser.imie}];
    }
    this.loadUsersList();
    this.loadList();
  }

  loadList() {
    let listaProfili = '';
    if ( this.selectedProfiles.length === 0 ) {
      listaProfili = '&listaProfili=' + this.logedUser.id;
    }else if (this.selectedProfiles.length > 0 ){
      let add = false;
      for (const value of this.selectedProfiles) {
        if ( add ){
          listaProfili = listaProfili + '|' + value.id;
        }else{
          listaProfili = '&listaProfili=' + value.id;
        }
        add = true;
      }
    }
    return this.restApi.getRaports(
        formatDate(this.startDate, 'yyyy-MM-dd', 'pl-PL'),
        formatDate(this.stopDate, 'yyyy-MM-dd', 'pl-PL'),
        listaProfili,
        this.fraza
    ).subscribe((data: {}) => {
      this.Records = data;
      this.loadUsersList();
    });
  }

  loadUsersList() {
    return this.restApi.getProfils().subscribe((data: {}) => {
      this.Users = data;
      this.profileSelect = [];
      this.UsersPrint = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.Users.length; i++) {
        this.profileSelect.push({
          id: Number(this.Users[i].id), name: this.Users[i].nazwisko + ' ' + this.Users[i].imie
        });
        if ( this.logedUser.dostep.toString() === '1' || this.Users[i].id === this.logedUser.id ) {
          this.Users[i].records = this.Records.filter(x => x.dodal === this.Users[i].id);
          this.Users[i].hours = 0;
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < this.Users[i].records.length; j++) {
            this.Users[i].hours += Number(this.Users[i].records[j].iloscGodzin);
          }
        }
        if ( this.selectedProfiles.filter(x => x.id === Number(this.Users[i].id)).length > 0 ) {
          this.UsersPrint.push(this.Users[i]);
        }
      }
    });
  }

  addRaport() {
    this.add.dodal = this.logedUser.id;
    this.add.dzien = formatDate(this.add.dzien, 'yyyy-MM-dd', 'pl-PL');
    if ( this.add.id > 0 ) {
      this.restApi.updateRaport(this.add.id, this.add).subscribe((data: {}) => {
        this.odswiez();
      });
    }else{
      this.restApi.createRaport(this.add).subscribe((data: {}) => {
        this.odswiez();
      });
    }
    this.add = {
      id: 0,
      dzien: formatDate(new Date(), 'yyyy-MM-dd', 'pl-PL'),
      opis: '',
      iloscGodzin: 0,
      dodal: 0
    };
  }

  editRaport( id ) {
    this.restApi.getRaport( id ).subscribe((data: {}) => {
      this.add = data;
    });
  }

  deleteRaport(id) {
    if (window.confirm('Are you sure, you want to delete?')){
      this.restApi.deleteRaport(id).subscribe(data => {
        this.loadList();
      });
    }
  }

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
