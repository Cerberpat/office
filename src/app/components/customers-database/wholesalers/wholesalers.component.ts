import { Component, OnInit } from '@angular/core';
import {ColumnChosen} from '../../../shared/ColumnChosen';
import {Column} from '../../../shared/Column';
import {ApiService} from '../../../services/api.service';
import {Profil} from '../../../shared/profil';
import {Wholeseller} from '../../../shared/Wholeseller';
import {SortEvent} from 'primeng/api';
import {ColumnEditorComponent} from '../../column-editor/column-editor.component';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {FormWholesalersComponent} from './form-wholesalers/form-wholesalers.component';
import {WholesellerService} from '../../../services/wholeseller.service';

@Component({
  selector: 'app-wholesalers',
  templateUrl: './wholesalers.component.html',
  styleUrls: ['./wholesalers.component.sass'],
  providers: [DialogService]
})
export class WholesalersComponent implements OnInit {
  logedUser: Profil;
  cols: any;
  colsAll: any;
  ref: DynamicDialogRef;
  wholesellers: Wholeseller[];
  filters: any = {
    first: 0,
    perPage: 50,
    count: 0,
    active: true,
    search: '',
    order: {name: 'ASC'},
  };

  constructor( private wholesellerService: WholesellerService, private servService: ApiService, public dialogService: DialogService ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.filters = {
      first: 0,
      perPage: 50,
      count: 0,
      active: true,
      search: '',
      order: {name: 'ASC'},
    };
    this.cols = [];
    this.colsAll = [];
  }

  ngOnInit(): void {
    this.getCols();
    this.getColsAll();
    this.getWholesellers();
  }

  getCols(){
    this.servService.getColumnsChosen(
      {
        where: 'user='+this.logedUser.id,
        placer: "bazaKlientów-hurtowi"
      }
    ).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        let tempObj = new ColumnChosen();
        tempObj.load(res[i]);
        res[i]=tempObj;
      }
      this.cols = res;
    });
  }
  getColsAll(){
    this.servService.getColumns({
      placer: "bazaKlientów-hurtowi"}
    ).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        let tempObj = new Column();
        tempObj.load(res[i]);
        res[i]=tempObj;
      }
      this.colsAll = res;
    });
  }
  getWholesellers(){
    this.wholesellerService.get({
      first: this.filters.first,
      perPage: this.filters.perPage,
      search: this.filters.search,
      active: this.filters.active,
      where: {isActive: 1},
      order: this.filters.order
    }).subscribe((res) => {
      this.wholesellers = res['list'];
      this.filters.count = res['count'];
    });
  }

  openForm(data = new Wholeseller()) {
    this.ref = this.dialogService.open(FormWholesalersComponent, {
      data: {
        obj: data
      },
      header: 'Edycja hurtownika: ' + data.name + ' (ID:'+data.id+')',
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((ret) => {
      if (ret) {
        this.getWholesellers();
      }
    });
    this.ref.onDestroy.subscribe((ret) => {
      this.getWholesellers();
    });
  }

  editcolumns() {
    this.ref = this.dialogService.open(ColumnEditorComponent, {
      data: {
        placer: 'bazaKlientów-hurtowi',
        columns: this.colsAll,
        columnsChosen: this.cols
      },
      header: 'Wybór wyświetlanych kolumn: Baza klientów - hurtownicy',
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((ret) => {
      if (ret) {
        this.getCols();
      }
    });
  }

  log( data ){
    console.log(data);
  }
  paginate(event) {
    this.filters.first = event.first;
    this.filters.perPage = event.rows;
    this.getWholesellers();
  }
  search(){
    if( this.filters.search.length > 2 || this.filters.search.length===0 ){
      this.getWholesellers();
    }
  }
  customSort(event: SortEvent) {
    let order: {} = {};
    if (event.order > 0) {
      order[event.field] = 'ASC';
    } else {
      order[event.field] = ' DESC';
    }
    if( this.filters.order !== order ){
      this.filters.order=order;
      this.getWholesellers();
    }
  }
}
