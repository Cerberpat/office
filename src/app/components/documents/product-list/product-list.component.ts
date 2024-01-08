import {Component, Input, OnInit} from '@angular/core';
import {Profil} from '../../../shared/profil';
import {ApiService} from '../../../services/api.service';
import {SortEvent} from 'primeng/api';
import {TriggerService} from '../../../services/triggerService';
import {Observable, Subscription} from 'rxjs';
import {CategoryNames} from '../../../shared/CategoryNames';
import {OrderPositionService} from '../../../services/order-position.service';
import {OrderPosition} from '../../../shared/OrderPosition';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.sass']
})
export class ProductListComponent implements OnInit {
  @Input() wholesellersId: number;
  @Input() setNr: number;
  logedUser: Profil;
  OrderPositions: OrderPosition[];
  OrderPositionsClone: OrderPosition[];
  saveButton: boolean = false;
  colspan: number = 0;
  filters: any = {
    order: 'name ASC',
  };
  cols: {}[] = [
    {field: "name", header: "Nazwa"},
    {field: "categoryName", header: "Kategoria"},
    {field: "quantity", header: "Ilość"},
    {field: "price", header: "Cena netto"},
    {field: "priceNettoTotal", header: "Cena netto razem"},
    {field: "tax", header: "VAT"},
    {field: "priceBrutto", header: "Cena brutto"},
    {field: "priceBruttoTotal", header: "Cena brutto razem"},
    {field: "currency", header: "Waluta"}
  ];
  total: any = {
    quantity: 0,
    netto: 0,
    priceBrutto: 0,
    currency: '',
  };
  vatArray: any = [];
  categoryNames: CategoryNames[];
  private subscription: Subscription;

  constructor(
    private servService: ApiService,
    private orderPositionService: OrderPositionService,
    private triggerServ: TriggerService
  ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.categoryNames = JSON.parse(localStorage.getItem('CategoryNames'));

    this.colspan = this.cols.length + 1;
    this.subscription= this.triggerServ.getUpdate().subscribe(message => {
      if( message.source==='getDocumentItems' ){
        this.getOrderPositions();
      }
    });
  }

  ngOnInit(): void {
    var mypromise = new Promise((resolve, reject) => {
      resolve(this.getCategoriesNames());
    });
    mypromise.then((val) => this.getOrderPositions());
  }

  public getOrderPositions(){
    this.total = {
      quantity: 0,
      netto: 0,
      priceBrutto: 0,
    };
    this.orderPositionService.getList({
      setNr: this.setNr,
      lang: this.logedUser.language,
      order: 'name ASC'
    }).subscribe((res) => {
      this.OrderPositionsClone=[];
      for (let i = 0; i < res.length; i++) {
        res[i] = new OrderPosition(res[i]);
        res[i].priceNettoTotal = res[i].price * res[i].quantity;
        res[i].tax = Math.round(res[i].tax);
        res[i].priceBrutto = res[i].price * (1+(res[i].tax/100));
        res[i].priceBruttoTotal = (res[i].price * res[i].quantity) * (1+(res[i].tax/100));
        res[i].categoryObj = this.getCategoryNameObj( res[i].idCategory, this.logedUser.language );
        this.total.quantity = +this.total.quantity + +res[i].quantity;
        this.total.netto = +this.total.netto + +res[i].priceNettoTotal;
        this.total.priceBrutto = +this.total.priceBrutto + +res[i].priceBruttoTotal;
        this.total.currency = res[i].currency;
      }
      this.OrderPositions = res;
      this.OrderPositionsClone = JSON.parse(JSON.stringify(this.OrderPositions));
      this.saveButton=false;
    });
  }
  getDocumentItemsCloneData( id ){
    const temp: OrderPosition[] = this.OrderPositionsClone.filter(x => x.id === id );
    if( temp[0]!==undefined ){
      return temp[0];
    }else{
      console.log('brak item clone dla ID: '+id);
    }
  }
  getCategoriesNames(){
    this.servService.getCategoryNames().subscribe((res) => {
      this.categoryNames = [new CategoryNames()];
      for (let i = 0; i < res.length; i++) {
        let tempObj = new CategoryNames();
        tempObj.load(res[i]);
        res[i]=tempObj;
      }
      this.categoryNames = [...this.categoryNames, ...res];
    });
  }
  getCategoryName( id: number, lang: string ){
    const temp: CategoryNames[] = this.categoryNames.filter(x => x.id === id && x.language === lang);
    if( temp[0]!==undefined ){
      return temp[0].name;
    }else{
      console.log('brak kategorii dla ID: '+id+' lang: '+lang);
      return 'BRAK';
    }
  }
  getCategoryNameObj( id: number, lang: string ): CategoryNames{
    const temp: CategoryNames[] = this.categoryNames.filter(x => x.id == id && x.language == lang);
    if( temp[0]!==undefined ){
      let CatName: CategoryNames = new CategoryNames();
      CatName.load( temp[0] );
      return CatName;
    }else{
      console.log('brak kategorii dla ID: '+id+' lang: '+lang);
      return new CategoryNames();
    }
  }
  checkColor( data ){
    const item:any = this.getDocumentItemsCloneData( data.id );
    let ele = document.getElementById('item-'+data.id) as HTMLInputElement | null;
    if (ele !== undefined) {
      let eleRow = document.querySelector('.item-'+data.id) as HTMLElement | null;
      if( parseFloat(item.price) !== parseFloat(data.price) || item.tax !== data.tax ){
        eleRow.classList.add('item-pending');
        this.checkAll();
      }else{
        eleRow.classList.remove('item-pending');
        this.checkAll();
      }
    }
  }
  checkAll(){
    const list = document.getElementsByClassName('item-pending');
    if( list.length > 0 ){
      this.saveButton=true;
    }else{
      this.saveButton=false;
    }
  }
  saveChanges(){
    let updateList: OrderPosition[]=[];
    for (let i = 0; i < this.OrderPositions.length; i++ ) {
      const item:any = this.getDocumentItemsCloneData( this.OrderPositions[i].id );
      if( parseFloat(item.price) !== parseFloat(String(this.OrderPositions[i].price)) || item.tax !== this.OrderPositions[i].tax ){
        updateList.push(this.OrderPositions[i]);
      }
    }
    for (let i = 0; i < updateList.length; i++ ) {
      this.servService.updateDocumentItem(updateList[i].id, updateList[i]).subscribe((res) => {
        let eleRow = document.querySelector('.item-' + updateList[i].id) as HTMLElement | null;
        eleRow.classList.add('item-succes');
        if( i === (updateList.length-1) ){
          this.getOrderPositions();
        }
      });
    }
  }
  deleteItem( item: OrderPosition ){
    item.isActive=0;
    console.log(item);
    this.orderPositionService.update(item.id, item).subscribe((data: {}) => {
      this.getOrderPositions();
    });
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
  ngOnDestroy() {
    this.subscription.unsubscribe();
    console.log('ProductList-unsubscribe');
  }

  log( data ){
    console.log(data);
  }
}
