import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';
import {Profil} from '../../../../shared/profil';
import {Order} from '../../../../shared/Order';
import {SetnrService} from '../../../../services/setnr.service';
import {OrderService} from '../../../../services/order.service';
import {formatDate} from '@angular/common';
import {Wholeseller} from '../../../../shared/Wholeseller';
import {WholesellerService} from '../../../../services/wholeseller.service';
import {PaymentMethodService} from '../../../../services/paymentMethod.service';
import {TransportCompanyService} from '../../../../services/transportCompany.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.sass'],
  providers: [MessageService],
})
export class OrderFormComponent implements OnInit {
  logedUser: Profil;
  order: Order;
  orderStatuses: any = {};
  warehouseStatuses: any = {};
  orderTemp: Order;
  source: string;
  sourceId: number;
  saveDisplay: number = 0;
  validationErrors: {} = {};
  wholesellers: any[];
  //wholesellersTemp: Wholeseller[];
  countries: any[] = [];
  paymentForms: {
    id: number,
    name: string
  }[];
  transportComp: {
    id: number,
    name: string
  }[];
  takNie: {}[];

  constructor(
    private servService: ApiService,
    private wholesellerService: WholesellerService,
    private paymentMethodService: PaymentMethodService,
    private transportCompanyService: TransportCompanyService,
    private orderService: OrderService,
    private setnrService: SetnrService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private messageService: MessageService
  ) {
    this.saveDisplay = 0;
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.order = this.config.data.obj;
    this.orderTemp = JSON.parse(JSON.stringify(this.config.data.obj));
    this.source = 'order';
    this.sourceId = this.order.id;

    this.takNie=[
      {value: 0, label: 'NIE'},
      {value: 1, label: 'TAK'}
    ];
  }

  ngOnInit(): void {
    this.getWholesellers();
    this.getPaymentForms();
    this.getTransportComp();
    this.getOrderStatuses();
    this.getCountries();
  }

  async saveChanges() {
    if( this.order.orderStatusId==3 ){
      this.order.warehouseStatusId=8;
    }
    this.order.paymentMethodId=Number(this.order.paymentMethod.id);
    this.order.orderStatusId=Number(this.order.orderStatus.id);
    this.order.transportCompanyId=Number(this.order.transportCompany.id);
    this.order.wholesalerId=Number(this.order.wholesaler.id);
    if( this.order.id > 0 ){
      this.orderService.updateOrder(this.order.id, this.order).subscribe((res) => {
        if (res) {
          this.order = res;
          this.orderTemp = Object.assign({}, this.order);
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Zamówienie zostało zaktualizowane.'});
          this.ref.close(res);
        } else {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Błąd edycji profilu.'});
        }
      });
    }else{
      this.orderService.createOrder(this.order).subscribe((res) => {
        if (res) {
          this.order = res;
          this.order.createdBy = this.logedUser.id;
          this.orderTemp = Object.assign({}, this.order);
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Zamówienie zostało dodane.'});
          this.ref.close(res);
        } else {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Błąd dodawania zamówienia.'});
        }
      });
    }
  }
  async getNextSetNr(): Promise<number> {
    let setNr=0;
    await this.setnrService.getSetNrNextNr().subscribe((res) => {
      setNr = Number(res);
    });
    return setNr;
  }
  cleanColors() {
    for (var key in this.order) {
      this.validField( key );
    }
  }
  validField( field=null ): boolean{
    if( JSON.stringify(this.order)!==JSON.stringify(this.orderTemp) ){
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
    if( ele != null ){
      const header = ele.closest('p-tabpanel');
    }
    let message = '';

    return message;
  }

  getWholesellers(){
    this.wholesellers=[{
      id: 0,
      name: ' - - - '
    }];
    this.wholesellerService.get({
      where: 'wholesellers.isActive=1',
      order: 'registrationAddress.name ASC'
    }).subscribe((res) => {
      /*this.wholesellersTemp = [...res['list']];
      for (let i = 0; i < res['list'].length; i++) {
        res['list'][i]={
          id: res['list'][i].id,
          name: res['list'][i].name
        };
      }*/
      this.wholesellers = [...this.wholesellers, ...res['list']];
      this.order.wholesaler = this.wholesellers.filter( x => x.id == this.order.wholesalerId)[0];
    });
  }

  copyWholesellrAdres(){
    this.order.wholesalerId=Number(this.order.wholesaler.id);
    const whoseller = this.wholesellers.filter( x => x.id == this.order.wholesalerId)[0];
    if( whoseller!=null ){
      this.order.billingAddressId = whoseller.registrationAddressId;
      this.order.billingAddress = whoseller.registrationAddress;
      this.order.shippingAddressId = whoseller.registrationAddressId;
      this.order.shippingAddress = whoseller.registrationAddress;
    }
  }

  getOrderStatuses(){
    this.orderService.getOrderStatuses({
      where: 'isActive=1',
      order: 'name ASC'
    }).subscribe((res) => {
      let temp: any = {office: [], warehouse: []};
      for (let i = 0; i < res.length; i++) {
        if( res[i]['id'] != 1 ){
          temp[res[i].type].push(res[i]);
        }
      }
      this.orderStatuses = temp['office'];
      this.warehouseStatuses = temp['warehouse'];
    });
  }
  /*getOrderStatuses(){
    this.orderService.getOrderStatuses({
      where: 'isActive=1',
      order: 'name ASC'
    }).subscribe((res) => {
      let temp: any = {office: [], warehouse: []};
      for (let i = 0; i < res.length; i++) {
        //temp[res[i].type].push(new OrderStatus(res[i]));
        if( res[i]['id'] != 1 ){
          //temp[res[i].type].push({value: res[i]['id'], label: res[i]['name']});
          temp[res[i].type].push(res[i]);
        }
      }
      this.orderStatuses = temp;
      this.order.orderStatus = this.orderStatuses['office'].filter( x => x.id == this.order.orderStatusId)[0];
    });
  }*/

  getPaymentForms(){
    this.paymentForms=[{
      id: 0,
      name: ' - - - '
    }];
    this.paymentMethodService.getList().subscribe((res) => {
      this.paymentForms = [...this.paymentForms, ...res];
    });
  }
  /*getPaymentForms(){
    this.paymentForms=[{
      id: 0,
      name: ' - - - '
    }];
    this.servService.getConfigData({
      where: 'type="paymentForm" AND language="'+this.logedUser.language+'"',
      order: 'label ASC'
    }).subscribe((res) => {
      let temp: any[] = [];
      for (let i = 0; i < res.length; i++) {
        if( res[i]['label']!=undefined && res[i]['label']!=null ){
          temp.push({id: res[i]['value'], name: res[i]['label']});
        }else{
          console.log('Brak label dla metody płatności.');
        }
      }
      this.paymentForms = [...this.paymentForms, ...temp];
      this.order.paymentMethod = this.paymentForms.filter( x => x.id == this.order.paymentMethodId)[0];
      localStorage.setItem('paymentForms', JSON.stringify(this.paymentForms));
    });
  }*/

  getTransportComp(){
    this.transportComp=[{
      id: 0,
      name: ' - - - '
    }];
    this.transportCompanyService.getList().subscribe((res) => {
      this.transportComp = [...this.transportComp, ...res];
    });
  }
  /*getTransportComp(){
    this.transportComp=[{
      id: 0,
      name: ' - - - '
    }];
    this.servService.getConfigData({
      where: 'type="transportWholesellers" AND language="PL"',
      order: 'label ASC'
    }).subscribe((res) => {
      let temp: any[] = [];
      for (let i = 0; i < res.length; i++) {
        if( res[i]['label']!=undefined && res[i]['label']!=null ){
          temp.push({id: res[i]['value'], name: res[i]['label']});
        }else{
          console.log('Brak label dla metody transportWholesellers.');
        }
      }
      this.transportComp = [...this.transportComp, ...temp];
      this.order.transportCompany = this.transportComp.filter( x => x.id == this.order.transportCompanyId)[0];
    });
  }*/

  getCountries(){
    this.servService.getKraje({}).subscribe((res) => {
      let temp: any[] = [];
      for (let i = 0; i < res.length; i++) {
        temp.push({value: Number(res[i]['id']), label: res[i]['name']});
      }
      this.countries = temp;
    });
  }

  getStatus( type: string, id: number ){
    const ret: any = {};
    if( type=='office' ){
      const ret = this.orderStatuses.filter( x => x.value == id )[0];
    }else{
      const ret = this.warehouseStatuses.filter( x => x.value == id )[0];
    }
    if( ret!=undefined && ret[0]!=undefined ){
      return ret[0].label;
    }
    return '';
  }

  formatData( data, format ){
    if( data == null ){
      return '';
    }
    return formatDate(data, format, 'pl-PL')
  }

  log( data ){
    console.log(data);
  }
}
