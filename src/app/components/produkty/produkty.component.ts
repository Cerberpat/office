import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Product} from '../../shared/product';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ProductService} from '../../services/product.service';
import {Profil} from '../../shared/profil';
import {ProfilData} from '../../services/profil.data';
import {ColumnEditorComponent} from '../column-editor/column-editor.component';
import {ColumnChosen} from '../../shared/ColumnChosen';
import {CategoryNames} from '../../shared/CategoryNames';
import {Column} from '../../shared/Column';
import { SortEvent } from 'primeng/api';
import {ProduktyEditComponent} from './produkty-edit/produkty-edit.component';
import {ProductNames} from '../../shared/productNames';

@Component({
  selector: 'app-produkty',
  templateUrl: './produkty.component.html',
  styleUrls: ['./produkty.component.sass', './../../app.component.sass'],
  providers: [DialogService]
})
export class ProduktyComponent implements OnInit {
  logedUser: Profil;
  CategoryNames: CategoryNames[];
  ProfilData: ProfilData;
  ref: DynamicDialogRef;
  Produkty: Product[];
  filters: any = {
    first: 0,
    perPage: 50,
    count: 0,
    active: true,
    search: '',
    order: 'name ASC',
  };
  cols: any;
  colsAll: any;

  constructor( private servService: ApiService, private productService: ProductService, public dialogService: DialogService ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.ProfilData = new ProfilData(servService);
    this.filters = {
      first: 0,
      perPage: 50,
      count: 0,
      active: true,
      search: '',
      order: 'name ASC',
    };
    this.cols = [];
    this.colsAll = [];
  }

  ngOnInit(): void {
    this.getProdukty();
    this.getCols();
    this.getColsAll();
    this.getCategoriesNames();
  }

  getProdukty(): void {
    this.productService.getProdukty(
      {
        first: this.filters.first,
        perPage: this.filters.perPage,
        search: this.filters.search,
        active: this.filters.active,
        lang: this.logedUser.language,
        where: 'isActive=1',
        join: 'ProductNames',
        order: this.filters.order
      }
    ).subscribe((res) => {
      for (let i = 0; i < res['list'].length; i++) {
        res['list'][i]=new Product(res['list'][i]);
      }
      this.Produkty = res['list'];
      this.filters.count = res['count'];
    });
  }

  getCategoriesNames(){
    this.servService.getCategoryNames().subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        let tempObj = new CategoryNames();
        tempObj.load(res[i]);
        res[i]=tempObj;
      }
      this.CategoryNames = res;
    });
  }
  getCategoryName( id, lang ){
    const temp: CategoryNames[] = this.CategoryNames.filter(x => x.id === id && x.language === lang);
    if( temp[0]!==undefined ){
      return temp[0].name;
    }else{
      console.log('brak kategorii dla ID: '+id+' lang: '+lang);
      return 'BRAK';
    }
  }

  getCols(){
    this.servService.getColumnsChosen(
      {
        where: 'user='+this.logedUser.id,
        placer: "bazaProduktów-produkty"
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
      placer: "bazaProduktów-produkty"
    }).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        let tempObj = new Column();
        tempObj.load(res[i]);
        res[i]=tempObj;
      }
      this.colsAll = res;
    });
  }

  paginate(event) {
    this.filters.first = event.first;
    this.filters.perPage = event.rows;
    this.getProdukty();
  }

  search(){
    if( this.filters.search.length > 2 || this.filters.search.length===0 ){
      this.getProdukty();
    }
  }

  customSort(event: SortEvent) {
    let order = '';
    if (event.order > 0) {
      order = event.field + ' ASC';
    } else {
      order = event.field + ' DESC';
    }
    if( this.filters.order !== order ){
      this.filters.order=order;
      this.getProdukty();
    }
  }

  addRow(data = new Product()) {
    this.ref = this.dialogService.open(ProduktyEditComponent, {
      data: {
        obj: data,
        categories: this.CategoryNames
      },
      header: 'Dodawanie produktu',
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((ret) => {
      if (ret) {
        this.getProdukty();
      }
    });
    this.ref.onDestroy.subscribe((ret) => {
      this.getProdukty();
    });
  }

  editRow(data) {
    this.ref = this.dialogService.open(ProduktyEditComponent, {
      data: {
        obj: data,
        categories: this.CategoryNames
      },
      header: 'Edycja produktu: ' + data.name.name + ' (ID:'+data.id+')',
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((ret) => {
      if (ret) {
        this.getProdukty();
      }
    });
    this.ref.onDestroy.subscribe((ret) => {
      this.getProdukty();
    });
  }

  editcolumns() {
    this.ref = this.dialogService.open(ColumnEditorComponent, {
      data: {
        placer: 'bazaProduktów-produkty',
        columns: this.colsAll,
        columnsChosen: this.cols
      },
      header: 'Wybór wyświetlanych kolumn: Baza produktów - produkty',
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
}
