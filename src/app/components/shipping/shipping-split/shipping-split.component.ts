import { Component, OnInit } from '@angular/core';
import {ShippingService} from '../../../services/shipping.service';
import {Profil} from '../../../shared/profil';
import {Shipping} from '../../../shared/Shipping';
import {MessageService} from 'primeng/api';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ApiService} from '../../../services/api.service';

@Component({
  selector: 'app-shipping-split',
  templateUrl: './shipping-split.component.html',
  styleUrls: ['./shipping-split.component.sass'],
  providers: [MessageService],
})
export class ShippingSplitComponent implements OnInit {
  logedUser: Profil;
  shipping: Shipping;
  shippingTemp: Shipping;
  source: string;
  sourceId: number;
  saveDisplay: number = 0;
  companies: any = [];
  shippingItems: any[];
  shippings: any[] = [];
  shippingsSellect: any[] = [];
  validationErrors: {} = {};
  shippingMergeId: number;
  shippingItemsJoin: any[] = [];
  colsPos = [
    {field: "productId", header: "ID Prod."},
    {field: "name", header: "Nazwa"},
    {field: "categoryName", header: "Kategoria"},
    {field: "orderedQuantity", header: "W dostawie"},
  ];
  es: any = {
    firstDayOfWeek: 1,
    dayNames: [ 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela' ],
    dayNamesShort: [ 'nie', 'pod', 'wto', 'śro', 'czw', 'pią', 'sob' ],
    dayNamesMin: [ 'N', 'P', 'W', 'Ś', 'C', 'P', 'S' ],
    monthNames: [ 'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień' ],
    monthNamesShort: [ 'sty', 'lut', 'mar', 'kwi', 'murlopsaj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru' ],
    today: 'Hoy',
    clear: 'Borrar'
  };

  constructor(
    private servService: ApiService,
    private shippingService: ShippingService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private messageService: MessageService
  ) {
    this.saveDisplay = 0;
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.shipping = this.config.data.obj;
    this.shipping.deliveryDate = new Date(this.shipping.deliveryDate);
    this.shippingTemp = JSON.parse(JSON.stringify(this.config.data.obj));
    this.source = 'shipping-split';
    this.sourceId = this.shipping.id;
  }

  ngOnInit(): void {
    this.getCompanies();
    this.getShippingItems();
    this.getShippings();
  }
  getCompanies(){
    this.servService.getCompanies({}).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        this.companies[i] = {value: Number(res[i].id), label: res[i].name};
      }
    });
  }
  getShippingItems(){
    this.shippingService.getShippingsPositions({
      shippingId: this.shipping.id,
      where: ' AND orderedQuantity>0',
      lang: this.logedUser.language,
      orderColumn: 'name',
      orderDir: 'ASC'
    }).subscribe((res) => {
      this.shippingItems = res;
      for (let i = 0; i < this.shippingItems.length; i++) {
        this.shippingItems[i].splitQuantity = 0;
      }
    });
  }
  getShippingItemsJoin(){
    this.shippingService.getShippingsPositions({
      shippingId: this.shippingMergeId,
      where: ' AND orderedQuantity>0',
      lang: this.logedUser.language,
      orderColumn: 'name',
      orderDir: 'ASC'
    }).subscribe((res) => {
      this.shippingItemsJoin = res;
      this.validField();
    });
  }
  splitShipping(){
    this.shipping.id = 0;
    this.shippingService.createShipping(this.shipping).subscribe((res) => {
      if ( res ) {
        let chengedRows = this.shippingItems.filter(x => parseInt(x.splitQuantity)>0);
        for (let i = 0; i < chengedRows.length; i++) {
          let addTemp={...chengedRows[i]};
          addTemp.orderedQuantity = chengedRows[i].splitQuantity;
          addTemp.id = 0;
          addTemp.shippingId = res.id;
          delete addTemp.splitQuantity;
          let updateTemp={...chengedRows[i]};
          updateTemp.orderedQuantity = (updateTemp.orderedQuantity - chengedRows[i].splitQuantity);
          delete updateTemp.splitQuantity;
          this.shippingService.createShippingPosition(addTemp).subscribe((res) => {
            if ( res ) {
              this.shippingService.updateShippingPosition(updateTemp.id, updateTemp).subscribe((res) => {
                if ( res ) {

                }else {

                }
              });
            }else {

            }
          });
        }
        this.shippingTemp = Object.assign({}, this.shipping);
        this.messageService.add({severity:'success', summary: 'Success', detail:'Dostawa została podzielona.'});
        this.ref.close(res);
      }else {
        this.messageService.add({severity:'error', summary: 'Error', detail:'Błąd podczas dzielenia dostawy.'});
      }
    });
  }
  joinShipping(){
    for (let i = 0; i < this.shippingItemsJoin.length; i++) {
      let productExist = this.shippingItems.filter(x => x.productId == this.shippingItemsJoin[i].productId);
      if( productExist.length>0 ){
        productExist[0].orderedQuantity += this.shippingItemsJoin[i].orderedQuantity;
        this.shippingService.updateShippingPosition(productExist[0].id, productExist[0]).subscribe((res) => {
          if ( res ) {

          }else {

          }
        });
      }else{
        this.shippingItemsJoin[i].shippingId = this.shipping.id;
        this.shippingService.createShippingPosition(this.shippingItemsJoin[i]).subscribe((res) => {
          if ( res ) {

          }else {

          }
        });
      }
    }
    let deleteShipping = this.shippings.filter(x => x.id == this.shippingMergeId);
    deleteShipping[0].isActive = false;
    this.shippingService.updateShipping(deleteShipping[0].id, deleteShipping[0]).subscribe((res) => {
      if ( res ) {
        this.ref.close(res);
      }else {

      }
    });
  }
  getShippings(): void {
    this.shippingService.getShippings(
      {
        lang: this.logedUser.language,
        where: 'isActive=1 AND statusId='+this.shipping.statusId,
      }
    ).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        this.shippingsSellect.push({label: res[i].title + ' (ID: ' + res[i].id + ')', value: res[i].id});
      }
      this.shippings = res;
    });
  }
  validField( field=null ): boolean{

    if( this.shippingMergeId>0 || this.shippingItems.filter(x => parseInt(x.splitQuantity)>0).length>0 ){
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
}
