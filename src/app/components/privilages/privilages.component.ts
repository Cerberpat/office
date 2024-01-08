import { Component, OnInit } from '@angular/core';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ApiService} from '../../services/api.service';
import {MessageService, SortEvent} from 'primeng/api';
import {ConfirmationService} from 'primeng';
import {Profil} from '../../shared/profil';
import {PrivilagesService} from '../../services/privilages.service';
import {Privilage} from '../../shared/Privilage';
import {PrivilagesFormComponent} from './privilages-form/privilages-form.component';

@Component({
  selector: 'app-privilages',
  templateUrl: './privilages.component.html',
  styleUrls: ['./privilages.component.sass'],
  providers: [MessageService, ConfirmationService]
})
export class PrivilagesComponent implements OnInit {
  logedUser: Profil;
  ref: DynamicDialogRef;
  loading: boolean = false;
  profiles: Profil[];
  privilages: Privilage[];
  filters: any = {
    first: 0,
    perPage: 50,
    count: 0,
    active: true,
    search: '',
    order: 'nazwisko ASC',
  };
  cols = [
    { field: 'imie', header: 'Imię' },
    { field: 'nazwisko', header: 'Nazwisko' },
  ];

  constructor(public dialogService: DialogService, private servService: ApiService, private privilagesService: PrivilagesService, private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
  }

  ngOnInit(): void {
    this.getProfiles();
  }
  getProfiles(): void {
    this.loading = true;
    this.servService.getProfils( {} ).subscribe((res) => {
      this.profiles = res;
      this.loading = false;
    });
  }
  getPrivilages(): void {
    this.privilagesService.getPrivilages( {} ).subscribe((res) => {
      this.privilages = res;
    });
  }
  paginate(event) {
    this.filters.first = event.first;
    this.filters.perPage = event.rows;
    this.getProfiles();
  }
  search(){
    if( this.filters.search.length > 2 || this.filters.search.length===0 ){
      this.getProfiles();
    }
  }
  customSort(event: SortEvent) {
    let order:string = '';
    if (event.order > 0) {
      order = event.field + ' ASC';
    } else {
      order = event.field + ' DESC';
    }
    if( this.filters.order !== order ){
      this.filters.order=order;
      this.getProfiles();
    }
  }

  openForm(data = new Profil()) {
    let heder='';
    if( data.id > 0 ){
      heder = 'Edycja uprawnień dla: ' + data.nazwisko + ' ' + data.imie + ' (ID: '+data.id+')';
    }else{
      heder = 'Dodawanie szablonu uprawnień';
    }
    this.ref = this.dialogService.open(PrivilagesFormComponent, {
      data: {
        obj: data
      },
      header: heder,
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((ret) => {
      if (ret) {
        if( ret=='priv' ){
          this.messageService.add({severity:'success', summary: 'Success', detail:'Uprawnienia zostały zapisane.'});
        }
        if( ret=='schema' ){
          this.messageService.add({severity:'success', summary: 'Success', detail:'Szablon został zapisany.'});
        }
      }
    });
    this.ref.onDestroy.subscribe((ret) => {
      this.getProfiles();
    });
  }
}
