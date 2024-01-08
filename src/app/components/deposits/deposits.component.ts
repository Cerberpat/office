import { Component, OnInit } from '@angular/core';
import {MessageService, SortEvent} from 'primeng/api';
import {ConfirmationService} from 'primeng';
import {Profil} from '../../shared/profil';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Deposit} from '../../shared/Deposit';
import {DepositService} from '../../services/deposit.service';
import {DepositsSplitComponent} from './deposits-split/deposits-split.component';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-deposits',
  templateUrl: './deposits.component.html',
  styleUrls: ['./deposits.component.sass'],
  providers: [MessageService, ConfirmationService]
})
export class DepositsComponent implements OnInit {
  logedUser: Profil;
  ref: DynamicDialogRef;
  deposits: Deposit[] = [];
  cols: any = {};
  loading: boolean = false;
  filters: any = {
    first: 0,
    perPage: 50,
    count: 0,
    active: true,
    search: '',
    order: 'deliveryDate DESC',
  };

  constructor(public dialogService: DialogService, private messageService: MessageService, private confirmationService: ConfirmationService, private depositService: DepositService) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.cols = [
      { field: 'title', header: 'Tytuł wpłaty' },
      { field: 'wholesalerId', header: 'Hurtownik' },
      { field: 'invoiceId', header: 'Faktura' },
      { field: 'amount', header: 'Kwota' },
      { field: 'currency', header: 'Waluta' },
      { field: 'createdAt', header: 'Data dodania' },
    ];
  }

  ngOnInit(): void {
    this.getDeposits();
  }

  getDeposits(): void {
    this.loading = true;
    this.depositService.getList(
      {
        first: this.filters.first,
        perPage: this.filters.perPage,
        search: this.filters.search,
        active: this.filters.active,
        lang: this.logedUser.language,
        where: 'isActive=1',
        order: this.filters.order
      }
    ).subscribe((res) => {
      this.deposits = res;
      this.loading = false;
    });
  }
  openForm(data = new Deposit()) {
    let message = 'Edycja wpłaty: ';
    if( data.id == 0 ){
      message = 'Dodawanie wpłaty';
    }
    this.ref = this.dialogService.open(DepositsSplitComponent, {
      data: {
        obj: data
      },
      header: message + data.title + ' (ID: '+data.id+')',
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((ret) => {
      if (ret) {
        this.getDeposits();
      }
    });
    this.ref.onDestroy.subscribe((ret) => {
      this.getDeposits();
    });
  }
  paginate(event) {
    this.filters.first = event.first;
    this.filters.perPage = event.rows;
    this.getDeposits();
  }
  search(){
    if( this.filters.search.length > 2 || this.filters.search.length===0 ){
      this.getDeposits();
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
      this.getDeposits();
    }
  }
  formatData( data, format = null ){
    if( data == null ){
      return '';
    }
    if( format == null ){
      format = 'yyyy-MM-dd HH:mm:ss';
    }
    return formatDate(data, format, 'pl-PL')
  }
}
