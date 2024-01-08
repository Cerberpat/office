import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/api';
import {Profil} from '../../../../shared/profil';
import {Invoice} from '../../../../shared/Invoice';
import {ApiService} from '../../../../services/api.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {InvoiceService} from '../../../../services/invoice.service';
import {formatDate} from '@angular/common';
import {SetnrService} from '../../../../services/setnr.service';
import {Address} from '../../../../shared/Address';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.sass'],
  providers: [MessageService],
})
export class InvoiceFormComponent implements OnInit {
  logedUser: Profil;
  source: string;
  sourceId: number;
  invoice: Invoice;
  invoiceTemp: Invoice;
  saveDisplay: number = 0;
  validationErrors: {} = {};
  transportComp: {}[] = [];
  companies: any = [];
  paymentForms: {}[] = [];

  countries: any[] = [];
  typeList: {}[] = [
    {value: 'PRO', label: 'Proforma'},
    {value: 'PRO_ZAG', label: 'Proforma zagraniczna'},
    {value: 'FVAT', label: 'Faktura VAT'},
    {value: 'FVAT_ZAG', label: 'Faktura VAT zagraniczna'},
    {value: 'FVAT_PAR', label: 'Faktura + paragon'},
    {value: 'FVAT_ZAG_PAR', label: 'Faktura + paragon zagraniczna'}
  ];
  currency: {}[] = [
    {value: 'PLN', label: 'PLN - Polski złoty'},
    {value: 'USD', label: 'USD - Dolar amerykański'},
    {value: 'EUR', label: 'EUR - Euro'},
    {value: 'GBP', label: 'GBP - Brytyjski funt'},
    {value: 'JPY', label: 'JPY - Jen'},
    {value: 'SEK', label: 'SEK - Korona szwedzka'},
    {value: 'CZK', label: 'CZK - Korona czeska'}
  ];
  es: any = {
    firstDayOfWeek: 1,
    dayNames: [ 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela' ],
    dayNamesShort: [ 'nie', 'pod', 'wto', 'śro', 'czw', 'pią', 'sob' ],
    dayNamesMin: [ 'N', 'P', 'W', 'Ś', 'C', 'P', 'S' ],
    monthNames: [ 'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień' ],
    monthNamesShort: [ 'sty', 'lut', 'mar', 'kwi', 'murlopsaj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru' ],
    today: 'Hoy',
    locale: 'pl',
    clear: 'Borrar'
  };
  constructor(
    private invoiceService: InvoiceService,
    private servService: ApiService,
    private setnrService: SetnrService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private messageService: MessageService
  ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.invoice = this.config.data.obj;
    if( this.invoice.billingAddress==null ){
      this.invoice.billingAddress = new Address();
    }
    this.invoice.saleDate = new Date(this.invoice.saleDate);
    this.invoice.issueDate = new Date(this.invoice.issueDate);
    this.invoiceTemp = JSON.parse(JSON.stringify(this.config.data.obj));
    this.source = 'invoice';
    this.sourceId = this.invoice.id;
    if( this.invoice.id == 0 ){
      this.invoice.issuePlace = 'Kraków';
    }
  }

  ngOnInit(): void {
    this.getInvoice();
    this.getTransportComp();
    this.getCompanies();
    this.getPaymentForms();
    this.getCountries();
  }

  getInvoice(){
    if( this.invoice.id > 0 ){

    }
  }

  saveChanges(){
    if( this.invoice.id > 0 ){
      this.invoiceService.updateInvoice(this.invoice.id, this.invoice).subscribe((res) => {
        if ( res ) {
          this.invoiceTemp = Object.assign({}, this.invoice);
          this.messageService.add({severity:'success', summary: 'Success', detail:'Faktura została zaktualizowana.'});
          this.ref.close(res);
        }else {
          this.messageService.add({severity:'error', summary: 'Error', detail:'Błąd edycji.'});
        }
      });
    }else{
      this.invoiceService.createInvoices(this.invoice).subscribe((res) => {
        if ( res ) {
          this.invoice = res;
          this.invoiceTemp = Object.assign({}, this.invoice);
          this.messageService.add({severity:'success', summary: 'Success', detail:'Faktura została dodana.'});
          this.ref.close(res);
        }else {
          this.messageService.add({severity:'error', summary: 'Error', detail:'Błąd zapisu.'});
        }
      });
    }
  }

  getTransportComp(){
    this.servService.getConfigData({
      where: 'type="transportWholesellers" AND language="PL"',
      order: 'label ASC'
    }).subscribe((res) => {
      let temp: any[] = [];
      for (let i = 0; i < res.length; i++) {
        if( res[i]['label']!=undefined && res[i]['label']!=null ){
          temp.push({value: res[i]['value'], label: res[i]['label']});
        }else{
          console.log('companies: '+res[i]['value']+' - BRAK NAZWY');
        }
      }
      this.transportComp = [...this.transportComp, ...temp];
    });
  }

  getCompanies(){
    this.servService.getCompanies({}).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        if( res[i]['name']!=undefined && res[i]['name']!=null ){
          this.companies[i] = {value: Number(res[i].id), label: res[i].name};
        }else{
          console.log('companies: '+res[i]['id']+' - BRAK NAZWY');
        }
      }
    });
  }

  getPaymentForms(){
    this.servService.getConfigData({
      where: 'type="paymentForm" AND language="'+this.logedUser.language+'"',
      order: 'label ASC'
    }).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        if( res[i]['label']!=undefined && res[i]['label']!=null ){
          this.paymentForms[i] = {value: res[i]['value'], label: res[i]['label']};
        }else{
          console.log('paymentForms: '+res[i]['value']+' - BRAK NAZWY');
        }
      }
    });
  }
  getCountries(){
    this.servService.getKraje({}).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        if( res[i]['name']!=undefined && res[i]['name']!=null ){
          this.countries[i] = {value: res[i]['id'], label: res[i]['name']};
        }else{
          console.log('countries: '+res[i]['id']+' - BRAK NAZWY');
        }
      }
    });
  }
  formatData( data, format ){
    return formatDate(data, format, 'pl-PL');
  }
  validField( field=null ): boolean{

    if( JSON.stringify(this.invoice)!==JSON.stringify(this.invoiceTemp) ){
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

  log( data ){
    console.log(data);
  }
}
