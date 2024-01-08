import { Component, OnInit } from '@angular/core';
import {Profil} from '../../../shared/profil';
import {Shipping} from '../../../shared/Shipping';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ApiService} from '../../../services/api.service';
import {ShippingService} from '../../../services/shipping.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.sass'],
  providers: [MessageService],
})
export class ShippingFormComponent implements OnInit {
  logedUser: Profil;
  shipping: Shipping;
  shippingTemp: Shipping;
  source: string;
  sourceId: number;
  saveDisplay: number = 0;
  validationErrors: {} = {};
  companies: any = [];
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
    private shippingService: ShippingService,
    private servService: ApiService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private messageService: MessageService
  ) {
    this.saveDisplay = 0;
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.shipping = this.config.data.obj;
    this.shipping.companyId = Number(this.shipping.companyId);
    this.shipping.deliveryDate = new Date(this.shipping.deliveryDate);
    this.shippingTemp = JSON.parse(JSON.stringify(this.config.data.obj));
    this.source = 'shipping';
    this.sourceId = this.shipping.id;
  }

  ngOnInit(): void {
    this.getCompanies();
  }

  validField( field=null ): boolean{

    if( JSON.stringify(this.shipping)!==JSON.stringify(this.shippingTemp) ){
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

  getCompanies(){
    this.servService.getCompanies({}).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        this.companies[i] = {value: Number(res[i].id), label: res[i].name};
      }
    });
  }

  saveChanges( shipping ){
    if( shipping.id>0 ){
      this.shippingService.updateShipping(shipping.id, shipping).subscribe((res) => {
        if ( res ) {
          this.shippingTemp = Object.assign({}, this.shipping);
          this.messageService.add({severity:'success', summary: 'Success', detail:'Dostawa została zaktualizowana.'});
          this.ref.close(res);
        }else {
          this.messageService.add({severity:'error', summary: 'Error', detail:'Błąd podczas aktualizacji.'});
        }
      });
    }else{
      shipping.createdBy=this.logedUser.id;
      shipping.statusId=5;
      this.shippingService.createShipping(shipping).subscribe((res) => {
        if ( res ) {
          this.shipping.setData(res);
          this.shippingTemp = Object.assign({}, this.shipping);
          this.messageService.add({severity:'success', summary: 'Success', detail:'Dostawa została dodana.'});
        }else {
          this.messageService.add({severity:'error', summary: 'Error', detail:'Błąd podczas dodawania.'});
        }
      });
    }
  }

  log( data ){
    console.log(data);
  }
}
