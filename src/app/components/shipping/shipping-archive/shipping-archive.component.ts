import { Component, OnInit } from '@angular/core';
import {Profil} from '../../../shared/profil';
import {Shipping} from '../../../shared/Shipping';
import {MessageService, SortEvent} from 'primeng/api';
import {ShippingService} from '../../../services/shipping.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ShippingPosition} from '../../../shared/ShippingPosition';
import {formatDate} from '@angular/common';
import {ApiService} from '../../../services/api.service';
import { CategoryNames } from 'src/app/shared/CategoryNames';
import {ConfirmationService} from 'primeng';
import {ShippingShelfPositions} from '../../../shared/ShippingShelfPositions';
import {StockService} from '../../../services/stock.service';
import {StockLog} from '../../../shared/StockLog';

@Component({
  selector: 'app-shipping-archive',
  templateUrl: './shipping-archive.component.html',
  styleUrls: ['./shipping-archive.component.sass'],
  providers: [MessageService, ConfirmationService]
})
export class ShippingArchiveComponent implements OnInit {
  logedUser: Profil;
  shipping: Shipping;
  shippingTemp: Shipping;
  shippingItems: ShippingPosition[];
  shippingShelfPositions: ShippingShelfPositions[];
  companies: any = [];
  CategoryNames: CategoryNames[];
  source: string;
  sourceId: number;
  logsList: StockLog[] = [];
  filters: any = {
    first: 0,
    perPage: 50,
    count: 0,
    category: 0,
    active: true,
    search: '',
    order: 'name ASC',
  };
  cols = [
    {field: "productId", header: "ID Prod."},
    {field: "name", header: "Nazwa"},
    {field: "categoryName", header: "Kategoria"},
    {field: "orderedQuantity", header: "Zamówiono"},
    {field: "confirmedQuantity", header: "Przyszło"},
  ];

  constructor(
    private shippingService: ShippingService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private messageService: MessageService,
    private servService: ApiService,
    private confirmationService: ConfirmationService,
    private stockService: StockService
  ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.shipping = this.config.data.obj;
    this.shipping.companyId = Number(this.shipping.companyId);
    this.shipping.deliveryDate = new Date(this.shipping.deliveryDate);
    this.shippingTemp = JSON.parse(JSON.stringify(this.config.data.obj));
    this.source = 'shipping';
    this.sourceId = this.shipping.id;
  }

  ngOnInit(): void {
    this.getShippingItems();
    this.getCompanies();
    this.getCategoriesNames();
    this.getShippingShelfPositions();
  }
  getShippingItems(){
    this.shippingService.getShippingsPositions({
      shippingId: this.shipping.id,
      where: ' AND isActive=1',
      lang: this.logedUser.language,
      orderColumn: 'name',
      orderDir: 'ASC'
    }).subscribe((res) => {
      this.shippingItems = res;
    });
  }
  getShippingShelfPositions(){
    this.shippingService.getShippingsShelfPositions({
      where: 'isActive=1 AND shippingId='+this.shipping.id,
    }).subscribe((res) => {
      this.shippingShelfPositions = res;
    });
  }
  archiveShipping(){
    this.confirmationService.confirm({
      message: 'Potwierdź archiwizację dostawy, ta operacja jest nieodwracalna!',
      header: 'Potwierdzenie akcji',
      icon: 'pi pi-info-circle',
      accept: () => {
        for (let i = 0; i < this.shippingShelfPositions.length; i++) {
          this.logsList.push(new StockLog({
            source: this.source,
            sourceID: this.sourceId,
            productId: this.getProductIdByPosition(this.shippingShelfPositions[i].positionId),
            shelfId: this.shippingShelfPositions[i].shelfId,
            company: this.shipping.companyId,
            quantity: this.shippingShelfPositions[i].quantity,
            addBy: this.logedUser.id
          }));
        }
        this.stockService.createStockLog(this.logsList).subscribe((res) => {
          this.shipping.statusId=4;
          this.shippingService.updateShipping(this.shipping.id, this.shipping).subscribe((res2) => {
            if ( res2 ) {
              this.ref.close();
            }else {
              this.messageService.add({severity:'error', summary: 'Error', detail:'Błąd podczas archiwizacji.'});
            }
          });
        });
      },
      reject: () => {
      }
    });
  }
  getCompanies(){
    this.servService.getCompanies({}).subscribe((res) => {
      this.companies=res;
    });
  }
  getProductIdByPosition( positionId ){
    const pos = this.shippingItems.filter(x => x.id == positionId )[0];
    if( pos!==undefined ){
      return pos.productId;
    }
  }
  printFormatedDate( date ){
    return formatDate(date, 'yyyy-MM-dd H:mm', 'pl-PL');
  }
  printCompany( id ){
    const comp = this.companies.filter(x => x.id == id )[0];
    if( comp!==undefined ){
      return comp.name;
    }
  }
  getAllertColor( obj ){
    if( obj.orderedQuantity != obj.confirmedQuantity ){
      return '#ffa000';
    }
    return '#107d11';
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
  getCategoryName( id ){
    const temp: CategoryNames[] = this.CategoryNames.filter(x => x.id === id && x.language === this.logedUser.language);
    if( temp[0]!==undefined ){
      return temp[0].name;
    }else{
      console.log('brak kategorii dla ID: '+id);
      return 'BRAK';
    }
  }
}
