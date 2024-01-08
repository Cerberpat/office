import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {Profil} from '../../../../shared/profil';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';
import {Wholeseller} from '../../../../shared/Wholeseller';
import {Address} from '../../../../shared/Address';
import {WholesellerService} from '../../../../services/wholeseller.service';

@Component({
  selector: 'app-form-wholesalers',
  templateUrl: './form-wholesalers.component.html',
  styleUrls: ['./form-wholesalers.component.sass'],
  providers: [MessageService],
})
export class FormWholesalersComponent implements OnInit {
  logedUser: Profil;
  wholeseller: Wholeseller;
  wholesellerTemp: Wholeseller;
  source: string;
  sourceId: number;
  taknieOptions: {}[];
  profiles: {}[];
  countries: {}[];
  exchange: {}[];
  paymentForms: {}[];
  transportComp: {}[];
  validationErrors: {} = {};
  saveDisplay: number = 0;

  constructor(
    private wholesellerService: WholesellerService,
    private servService: ApiService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private messageService: MessageService
  ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.wholeseller = this.config.data.obj;
    if( this.wholeseller.registrationAddress == null ){
      this.wholeseller.registrationAddress = new Address();
    }
    this.wholesellerTemp = JSON.parse(JSON.stringify(this.config.data.obj));
    this.source = 'wholeseller';
    this.sourceId = this.wholeseller.id;

    this.taknieOptions=[
      {value: '1', label: 'TAK'},
      {value: '0', label: 'NIE'}
    ];
    this.exchange=[
      {value: '', label: ' - - - '},
    ];
    this.countries=[
      {value: '', label: ' - - - '},
    ];
    this.paymentForms=[
      {value: '', label: ' - - - '},
    ];
    this.transportComp=[
      {value: '', label: ' - - - '},
    ];
    this.profiles=[
      {value: '', label: ' - - - '},
    ];
  }

  ngOnInit(): void {
    this.getProfiles();
    this.getCountries();
    this.getCurrency();
    this.getPaymentForms();
    this.getTransportComp();
  }

  getProfiles(){
    this.servService.getProfils().subscribe((res) => {
      let temp: any[] = [];
      for (let i = 0; i < res.length; i++) {
        temp.push({value: res[i]['id'], label: res[i]['nazwisko']+' '+res[i]['imie']});
      }
      this.profiles = [...this.profiles, ...temp];
    });
  }

  validField( field=null ): boolean{

    if( JSON.stringify(this.wholeseller)!==JSON.stringify(this.wholesellerTemp) ){
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

  getCountries(){
    this.servService.getKraje({}).subscribe((res) => {
      let temp: any[] = [];
      for (let i = 0; i < res.length; i++) {
        temp.push({value: res[i]['id'], label: res[i]['name']});
      }
      this.countries = [...this.countries, ...temp];
    });
  }

  getCurrency(){
    this.servService.getConfigData({
      where: 'type="currency"',
      order: 'label ASC'
    }).subscribe((res) => {
      let temp: any[] = [];
      for (let i = 0; i < res.length; i++) {
        temp.push({value: res[i]['value'], label: res[i]['value']});
      }
      this.exchange = [...this.exchange, ...temp];
    });
  }

  getPaymentForms(){
    this.servService.getConfigData({
      where: 'type="paymentForm" AND language="'+this.logedUser.language+'"',
      order: 'label ASC'
    }).subscribe((res) => {
      let temp: any[] = [];
      for (let i = 0; i < res.length; i++) {
        temp.push({value: res[i]['value'], label: res[i]['label']});
      }
      this.paymentForms = [...this.paymentForms, ...temp];
    });
  }

  getTransportComp(){
    this.servService.getConfigData({
      where: 'type="transportWholesellers" AND language="PL"',
      order: 'label ASC'
    }).subscribe((res) => {
      let temp: any[] = [];
      for (let i = 0; i < res.length; i++) {
        temp.push({value: res[i]['value'], label: res[i]['label']});
      }
      this.transportComp = [...this.transportComp, ...temp];
    });
  }

  saveChanges(){
    if( this.wholeseller.id>0 ){
      this.wholesellerService.update(this.wholeseller.id, this.wholeseller).subscribe((res) => {
        if ( res ) {
          this.wholesellerTemp = Object.assign({}, this.wholeseller);
          this.messageService.add({severity:'success', summary: 'Success', detail:'Klient został zaktualizowany.'});
          this.cleanColors();
          this.ref.close(res);
        }else {
          this.messageService.add({severity:'error', summary: 'Error', detail:'Błąd edycji klienta.'});
        }
      });
    }else{
      this.wholesellerService.create(this.wholeseller).subscribe((res) => {
        if ( res ) {
          this.wholeseller = res;
          this.wholesellerTemp = Object.assign({}, this.wholeseller);
          this.messageService.add({severity:'success', summary: 'Success', detail:'Klient został dodany.'});
          this.cleanColors();
          this.ref.close(res);
        }else {
          this.messageService.add({severity:'error', summary: 'Error', detail:'Błąd dodawania klienta.'});
        }
      });
    }
  }
  cleanColors() {
    for (var key in this.wholeseller) {
      this.validField( key );
    }
  }

  getErrorMessage( field ){
    let ele = document.getElementById(field);
    const header = ele.closest('p-tabpanel');
    let message = '';

    return message;
  }
}
