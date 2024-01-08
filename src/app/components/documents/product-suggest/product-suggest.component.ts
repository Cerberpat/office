import {Component, Input, OnInit} from '@angular/core';
import {Profil} from '../../../shared/profil';
import {Product} from '../../../shared/product';
import {CategoryNames} from '../../../shared/CategoryNames';
import {ApiService} from '../../../services/api.service';
import {MessageService, SortEvent} from 'primeng/api';
import {Order} from '../../../shared/Order';
import {TriggerService} from '../../../services/triggerService';
import {OrderPositionService} from '../../../services/order-position.service';
import {OrderPosition} from '../../../shared/OrderPosition';
import {OrderService} from '../../../services/order.service';

@Component({
  selector: 'app-product-suggest',
  templateUrl: './product-suggest.component.html',
  styleUrls: ['./product-suggest.component.sass']
})
export class ProductSuggestComponent implements OnInit {
  @Input() company: number;
  @Input() wholesellersId: number;
  @Input() setNr: number;
  logedUser: Profil;
  Produkty: any[];
  orderPositions: OrderPosition[];
  order: Order;
  CategoryNames: CategoryNames[];
  filters = {
    first: 0,
    perPage: 50,
    count: 0,
    category: {
      id: null
    },
    active: true,
    search: '',
    order: 'name ASC',
  };
  cols: {}[] = [
    {field: "id", header: "ID Prod."},
    {field: "name", header: "Nazwa"},
    {field: "categoryName", header: "Kategoria"},
    {field: "price", header: "Cena"},
    {field: "stock", header: "Stan"}
  ];
  addList:any[]=[];

  constructor(
    private servService: ApiService,
    private messageService: MessageService,
    private orderPositionService: OrderPositionService,
    private orderService: OrderService,
    private triggerServ: TriggerService
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
        res['list'][i].quantityOld=0;
        res['list'][i].quantityNew=0;
      }
      this.Produkty = res['list'];
      this.filters.count = res['count'];
      this.getOrderPositions();
    });
  }
  getProductData( id ): Product{
    const temp = this.Produkty.filter(x => x.id === id.toString() || x.id === id );
    if( temp[0]!==undefined ){
      return temp[0];
    }else{
      console.log('Brak produktu dla ID: '+id);
    }
  }
  getProductOnList( id ): boolean{
    const temp = this.Produkty.filter(x => x.id === id.toString() || x.id === id );
    if( temp[0]!==undefined ){
      return true;
    }else{
      return false;
    }
  }
  setProductQuantity( id, quantity ){
    const temp:any = this.Produkty.filter(x => x.id === id.toString() || x.id === id );
    if( temp[0]!==undefined && this.getProductOnList( id ) ){
      temp[0].quantityOld = quantity;
      temp[0].quantityNew = quantity;
    }else{
      //console.log('Brak produktu dla ID (setProductQuantity): '+id);
    }
  }

  getCategoriesNames(){
    this.servService.getCategoryNames().subscribe((res) => {
      this.CategoryNames = [new CategoryNames()];
      for (let i = 0; i < res.length; i++) {
        let tempObj = new CategoryNames();
        tempObj.load(res[i]);
        res[i]=tempObj;
      }
      this.CategoryNames = [...this.CategoryNames, ...res]
    });
  }
  getCategoryName( id, lang ){
    const temp: CategoryNames[] = this.CategoryNames.filter(x => x.id === id && x.language === lang);
    if( temp[0]!==undefined ){
      return temp[0].name;
    }else{
      console.log('brak kategorii dla ID: '+id+' lang: '+lang);
      return 'BRAK';
    }
  }

  getOrderPositions(){
    this.orderPositionService.getList({
      where: 'isActive=1',
      setNr: this.setNr,
      lang: this.logedUser.language,
      order: 'name ASC'
    }).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        res[i] = new OrderPosition(res[i]);
        this.setProductQuantity( res[i].idProduct, res[i].quantity );
      }
      this.orderPositions = res;
    });
  }
  getOrderPositionByProductId( id ): OrderPosition{
    const temp: OrderPosition[] = this.orderPositions.filter(x => x.idProduct === id );
    if( temp[0]!==undefined ){
      return temp[0];
    }else{
      console.log('Brak Pozycji dla ID: '+id);
    }
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

  addItems(){
    this.addList = this.Produkty.filter(x => parseInt(x.quantityOld)!==parseInt(x.quantityNew) );
    this.addItem( this.addList );
  }
  addItem( list ) {
    if( list.length > 0 ){
      const firstItem = list.splice(0, 1)[0];

      if( firstItem!==undefined ) {
        if (parseInt(firstItem.quantityOld) > 0) {
          let deleteItem: OrderPosition = this.getOrderPositionByProductId(firstItem.id);
          deleteItem.isActive = 0;
          this.orderPositionService.update(deleteItem.id, deleteItem).subscribe((res) => {
            firstItem.quantityOld = 0;
            if (parseInt(firstItem.quantityNew) === 0) {
              let eleRow = document.querySelector('.item-' + firstItem.id) as HTMLElement | null;
              eleRow.classList.add('item-succes');
              this.addItem( list );
            }
          });
        }
        if (parseInt(firstItem.quantityNew) > 0) {
          let temp = new OrderPosition();
          temp.setNr = this.setNr;
          temp.idOrderCompany = this.company;
          temp.idProduct = firstItem.id;
          temp.idCategory = firstItem.categoryId;
          temp.name = firstItem.name;
          temp.quantity = firstItem.quantityNew;
          temp.price = 1;
          temp.tax = 1;
          temp.currency = 'PLN';
          temp.exchange = 1;
          temp.picking = 0;
          temp.packing = 0;
          temp.warehouseAction = 1;
          temp.addBy = this.logedUser.id;
          temp.isActive = 1;
          this.orderPositionService.create(temp).subscribe((data: {}) => {
            let eleRow = document.querySelector('.item-' + firstItem.id) as HTMLElement | null;
            eleRow.classList.add('item-succes');
            this.addItem( list );
          });
        }
      }
    }else{
      this.messageService.add({severity:'success', summary:'Dodawanie produktów', detail:'Zakończone powodzeniem.'});
      this.getProdukty();
      this.triggerServ.sendUpdate({source: 'getDocumentItems'});
    }
  }

  checkColor( id ){
    const prod:any = this.getProductData( id );
    let ele = document.getElementById('item-'+id) as HTMLInputElement | null;
    if (ele !== undefined) {
      let eleRow = document.querySelector('.item-'+id) as HTMLElement | null;
      if( parseInt(prod.quantityOld)!==parseInt(prod.quantityNew) ){
        eleRow.classList.add('item-pending');
      }else{
        eleRow.classList.remove('item-pending');
      }
    }
  }
  removeColorByClass( className ){
    const items = document.getElementsByClassName( className ) as HTMLCollectionOf<HTMLElement>;
    const arr = Array.from(items);
    arr.forEach(item => {
      item.classList.remove(className);
    });
  }
  log( data ){
    console.log(data);
  }
}
