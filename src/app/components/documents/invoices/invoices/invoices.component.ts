import { Component, OnInit } from '@angular/core';
import {ColumnChosen} from '../../../../shared/ColumnChosen';
import {Column} from '../../../../shared/Column';
import {ColumnEditorComponent} from '../../../column-editor/column-editor.component';
import {SortEvent} from 'primeng/api';
import {ApiService} from '../../../../services/api.service';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Profil} from '../../../../shared/profil';
import {Invoice} from '../../../../shared/Invoice';
import {InvoiceFormComponent} from '../invoice-form/invoice-form.component';
import {InvoiceService} from '../../../../services/invoice.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.sass'],
  providers: [DialogService]
})
export class InvoicesComponent implements OnInit {
  logedUser: Profil;
  cols: any;
  colsAll: any;
  ref: DynamicDialogRef;
  invoices: Invoice[];
  filters: any = {
    first: 0,
    perPage: 50,
    count: 0,
    active: true,
    search: '',
    order: 'name ASC',
  };

  constructor( private servService: ApiService, public dialogService: DialogService, public invoiceService: InvoiceService ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
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
    this.getCols();
    this.getColsAll();
    this.getInvoices();
  }
  getCols(){
    this.servService.getColumnsChosen(
      {
        where: 'user='+this.logedUser.id,
        placer: "documents-invoices"
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
      placer: "documents-invoices"}
    ).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        let tempObj = new Column();
        tempObj.load(res[i]);
        res[i]=tempObj;
      }
      this.colsAll = res;
    });
  }
  editcolumns() {
    this.ref = this.dialogService.open(ColumnEditorComponent, {
      data: {
        placer: 'documents-invoices',
        columns: this.colsAll,
        columnsChosen: this.cols
      },
      header: 'Wybór wyświetlanych kolumn: Dokumenty - Zamówienia',
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((ret) => {
      if (ret) {
        this.getCols();
      }
    });
  }
  paginate(event) {
    this.filters.first = event.first;
    this.filters.perPage = event.rows;
    this.getInvoices();
  }
  search(){
    if( this.filters.search.length > 2 || this.filters.search.length===0 ){
      this.getInvoices();
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
      this.getInvoices();
    }
  }
  getInvoices(){
    this.invoiceService.getInvoices({}).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        res[i] = new Invoice(res[i]);
      }
      this.invoices = res;
    });
  }

  openForm(data = new Invoice()) {
    this.ref = this.dialogService.open(InvoiceFormComponent, {
      data: {
        obj: data
      },
      header: 'Edycja faktury: ' + data.id + ' (ID:'+data.id+')',
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((ret) => {
      if (ret) {
        this.getInvoices();
      }
    });
    this.ref.onDestroy.subscribe((ret) => {
      this.getInvoices();
    });
  }
}
