import {Component, Input, OnInit} from '@angular/core';
import {Shipping} from '../../../shared/Shipping';
import {CategoryNames} from '../../../shared/CategoryNames';
import {ApiService} from '../../../services/api.service';
import {MessageService, SortEvent} from 'primeng/api';
import {Profil} from '../../../shared/profil';
import {Product} from '../../../shared/product';
import {ShippingService} from '../../../services/shipping.service';
import {ShippingPosition} from '../../../shared/ShippingPosition';
import {ConfirmationService} from 'primeng';

@Component({
  selector: 'app-shipping-positions',
  templateUrl: './shipping-positions.component.html',
  styleUrls: ['./shipping-positions.component.sass'],
  providers: [ConfirmationService, MessageService]
})
export class ShippingPositionsComponent implements OnInit {
  @Input() shipping: Shipping;
  logedUser: Profil;
  Produkty: any[];
  shippingItems: ShippingPosition[];
  CategoryNames: CategoryNames[];
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
    {field: "id", header: "ID Prod."},
    {field: "name", header: "Nazwa"},
    {field: "categoryName", header: "Kategoria"},
    //{field: "price", header: "Cena"},
    {field: "stock", header: "Obecny stan"},
  ];
  colsPos = [
    {field: "productId", header: "ID Prod."},
    {field: "name", header: "Nazwa"},
    {field: "categoryName", header: "Kategoria"},
    {field: "orderedQuantity", header: "Dodano"},
  ];

  constructor(
    private servService: ApiService,
    private shippingService: ShippingService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
  }

  ngOnInit(): void {
    this.getProdukty();
    this.getCategoriesNames();
  }

  getProdukty(): void {
    let whereAdd = '';
    if( typeof this.filters.category === 'object' && this.filters.category.id>0 ){
      whereAdd += ' AND categoryId='+this.filters.category.id;
    }
    this.servService.getProdukty(
      {
        first: this.filters.first,
        perPage: this.filters.perPage,
        search: this.filters.search,
        active: this.filters.active,
        lang: this.logedUser.language,
        where: 'isActive=1'+whereAdd,
        join: 'ProductNames',
        order: this.filters.order
      }
    ).subscribe((res) => {
      for (let i = 0; i < res['list'].length; i++) {
        res['list'][i] = new Product(res['list'][i]);
        res['list'][i].addQuantity = 0;
      }
      this.Produkty = res['list'];
      this.filters.count = res['count'];
      this.getShippingItems();
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
      for (let i = 0; i < res.length; i++) {
        const addList = this.Produkty.filter(x => x.id == res[i].productId );
        if( addList[0] !== undefined ){
          addList[0].addQuantity = res[i].orderedQuantity;
          addList[0].orderedQuantity = res[i].orderedQuantity;
        }
      }
      this.shippingItems = res;
    });
  }
  addItems() {
    const addList = this.Produkty.filter(x => parseInt(x.addQuantity)>0 || parseInt(x.addQuantity)==0 && parseInt(x.orderedQuantity)>0 );
    for (let i = 0; i < addList.length; i++) {
      const sp = this.shippingItems.filter(x => x.productId == addList[i].id );
      let position = new ShippingPosition();
      position.shippingId = this.shipping.id;
      position.productId = addList[i].id;
      position.name = addList[i].name;
      position.orderedQuantity = addList[i].addQuantity;
      position.createdBy = this.logedUser.id;
      if( sp.length > 0 && sp[0].productId > 0 ){
        if( addList[i].addQuantity == 0 ){
          sp[0].isActive = false;
        }else{
          sp[0].orderedQuantity = addList[i].addQuantity;
        }
        position.id = sp[0].id;
        this.shippingService.updateShippingPosition(sp[0].id, position).subscribe((res) => {
          if(res){
            addList[i].addQuantity = 0;
            this.getShippingItems();
          }
        });
      }else{
        this.shippingService.createShippingPosition(position).subscribe((res) => {
          addList[i].addQuantity = 0;
          this.getShippingItems();
        });
      }
    }
    this.messageService.add({severity:'success', summary: 'Success', detail:'Pozycje zostały dodane.'});
  }

  deletePosition(obj){
    this.confirmationService.confirm({
      message: 'Potwierdź usunioęcie pozycji.',
      header: 'Potwierdzenie akcji',
      icon: 'pi pi-info-circle',
      accept: () => {
        obj.isActive = false;
        this.shippingService.updateShippingPosition(obj.id, obj).subscribe((res) => {
          this.getShippingItems()
        });
      },
      reject: () => {
      }
    });
  }
  paginate(event) {
    this.filters.first = event.first;
    this.filters.perPage = event.rows;
    this.getProdukty();
  }

  search( skipIf=false ){
    if( this.filters.search.length > 2 || this.filters.search.length===0 || skipIf ){
      this.getProdukty();
    }
  }
  customSort(event: SortEvent) {
    let order = '';
    if (event.order > 0) {
      order = event.field + ' ASC';
    } else {
      order = event.field + ' DESC';
    }
    if( this.filters.order !== order ){
      this.filters.order=order;
      this.getProdukty();
    }
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
    const prod: Product = this.Produkty.filter(x => x.id === id)[0];
    if( prod!=undefined ){
      const temp: CategoryNames[] = this.CategoryNames.filter(x => x.id === prod.categoryId && x.language === this.logedUser.language);
      if( temp[0]!==undefined ){
        return temp[0].name;
      }else{
        console.log('brak kategorii dla ID: '+id);
        return 'BRAK';
      }
    }
  }
  log( data ){
    console.log(data);
  }
}
