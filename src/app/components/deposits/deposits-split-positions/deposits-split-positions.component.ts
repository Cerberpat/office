import {Component, Input, OnInit} from '@angular/core';
import {Deposit} from '../../../shared/Deposit';
import {Profil} from '../../../shared/profil';
import {DepositSplit} from '../../../shared/DepositSplit';
import {DepositService} from '../../../services/deposit.service';
import {SortEvent} from 'primeng/api';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-deposits-split-positions',
  templateUrl: './deposits-split-positions.component.html',
  styleUrls: ['./deposits-split-positions.component.sass']
})
export class DepositsSplitPositionsComponent implements OnInit {
  @Input() deposit: Deposit;
  logedUser: Profil;
  depositSplit: DepositSplit[] = [];
  cloneDepositSplit: DepositSplit[];
  saveButton: boolean = false;
  cols: {field: string, header: string}[] = [
    {field: "invoiceId", header: "Faktura"},
    {field: "amount", header: "Kwota"},
    {field: "currency", header: "Waluta"},
    {field: "createdBy", header: "Dodał/a"},
    {field: "createdAt", header: "Dodano"},
  ];
  total: number = 0;
  diff: number = 0;

  constructor(private depositService: DepositService) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
  }

  ngOnInit(): void {
    this.loadTest();
  }
  loadTest(){
    for ( let i = 0; i < 5; i++ ) {
      let depositSplit = new DepositSplit({
        depositsId: this.deposit.id,
        invoiceId: i + 1,
        amount: Math.random() * 10,
        currency: 'PLN',
        isActive: true,
        createdBy: this.logedUser.id,
        createdAt: new Date()
      });
      this.total += depositSplit.amount;
      this.depositSplit[i] = depositSplit;
    }
    this.diff = this.deposit.amount - this.total;
  }
  deleteItem( item: DepositSplit ){

  }
  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order * result);
    });
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
