import { Component, OnInit } from '@angular/core';
import {Profil} from '../../../shared/profil';
import {Deposit} from '../../../shared/Deposit';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';
import {DepositService} from '../../../services/deposit.service';
import {ApiService} from '../../../services/api.service';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-deposits-split',
  templateUrl: './deposits-split.component.html',
  styleUrls: ['./deposits-split.component.sass'],
  providers: [MessageService],
})
export class DepositsSplitComponent implements OnInit {
  logedUser: Profil;
  deposit: Deposit;
  depositTemp: Deposit;
  source: string;
  sourceId: number;
  saveDisplay: number = 0;
  validationErrors: {} = {};
  currency: {}[] = [
    {value: 'PLN', label: 'PLN - Polski złoty'},
    {value: 'USD', label: 'USD - Dolar amerykański'},
    {value: 'EUR', label: 'EUR - Euro'},
    {value: 'GBP', label: 'GBP - Brytyjski funt'},
    {value: 'JPY', label: 'JPY - Jen'},
    {value: 'SEK', label: 'SEK - Korona szwedzka'},
    {value: 'CZK', label: 'CZK - Korona czeska'}
  ];
  wholesellers: any[];

  constructor(
    private servService: ApiService,
    private depositService: DepositService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private messageService: MessageService
  ) {
    this.saveDisplay = 0;
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.deposit = this.config.data.obj;
    this.depositTemp = JSON.parse(JSON.stringify(this.config.data.obj));
    this.source = 'deposit';
    this.sourceId = this.deposit.id;
  }

  ngOnInit(): void {
    this.getWholesellers();
  }
  getWholesellers(){
    this.wholesellers=[{
      value: 0,
      label: ' - - - '
    }];
    this.servService.getWholesellers({
      where: 'active=1',
      order: 'name ASC'
    }).subscribe((res) => {
      for (let i = 0; i < res['list'].length; i++) {
        res['list'][i]={
          value: res['list'][i].id,
          label: res['list'][i].name
        };
      }
      this.wholesellers = [...this.wholesellers, ...res['list']];
    });
  }

  saveChanges( deposit ){
    if( deposit.id>0 ){
      this.depositService.update(this.deposit.id, deposit).subscribe((res) => {
        if ( res ) {
          this.depositTemp = Object.assign({}, this.deposit);
          this.messageService.add({severity:'success', summary: 'Success', detail:'Wpłąta została zaktualizowana.'});
          this.ref.close(res);
        }else {
          this.messageService.add({severity:'error', summary: 'Error', detail:'Błąd podczas aktualizacji.'});
        }
      });
    }else{
      deposit.createdBy=this.logedUser.id;
      this.depositService.create(deposit).subscribe((res) => {
        if ( res ) {
          this.deposit = new Deposit(res);
          this.depositTemp = Object.assign({}, this.deposit);
          this.messageService.add({severity:'success', summary: 'Success', detail:'Wpłąta została dodana.'});
        }else {
          this.messageService.add({severity:'error', summary: 'Error', detail:'Błąd podczas dodawania.'});
        }
      });
    }
  }

  log( data ){
    console.log(data);
  }

  validField( field=null ): boolean{

    if( JSON.stringify(this.deposit)!==JSON.stringify(this.depositTemp) ){
      if( Object.keys(this.validationErrors).length === 0 ){
        this.saveDisplay=1;
      }else{
        this.saveDisplay=2;
      }
    }else{
      this.saveDisplay=0;
    }
    if( this.validationErrors[field]===undefined ){
      return true;
    }else{
      return false;
    }
  }

  getErrorMessage( field ){
    let ele = document.getElementById(field);
    const header = ele.closest('p-tabpanel');
    let message = '';

    return message;
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
