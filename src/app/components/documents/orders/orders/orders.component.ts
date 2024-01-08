import { Component, OnInit } from '@angular/core';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Profil} from '../../../../shared/profil';
import {ApiService} from '../../../../services/api.service';
import {Order} from '../../../../shared/Order';
import {ColumnChosen} from '../../../../shared/ColumnChosen';
import {Column} from '../../../../shared/Column';
import {ColumnEditorComponent} from '../../../column-editor/column-editor.component';
import {SortEvent} from 'primeng/api';
import {OrderFormComponent} from '../order-form/order-form.component';
import {Country} from '../../../../shared/Country';
import {ConfigData} from '../../../../shared/ConfigData';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {TriggerService} from '../../../../services/triggerService';
import {OrderService} from '../../../../services/order.service';
import {Address} from '../../../../shared/Address';
import { CategoryNames } from 'src/app/shared/CategoryNames';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.sass'],
  providers: [DialogService]
})
export class OrdersComponent implements OnInit {
  logedUser: Profil;
  tab: string = '';
  tabObj: any = {};
  cols: any;
  colsAll: any;
  ref: DynamicDialogRef;
  orders: Order[];
  profiles: Profil[];
  countries: Country[];
  paymentForms: ConfigData[];
  CategoryNames: CategoryNames[];
  filtersList: any = [];
  filters: any = {
    first: 0,
    perPage: 50,
    count: 0,
    active: true,
    search: '',
    order: 'shop_order.id DESC',
  };
  source: string = 'order-index';
  private subscription: Subscription;
  filtersData: any = {};
  loading: boolean = false;

  constructor( private servService: ApiService,
               private orderService: OrderService,
               public dialogService: DialogService,
               private route: ActivatedRoute,
               private triggerServ: TriggerService ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.orders = [];
    this.cols = [];
    this.colsAll = [];
    this.profiles = [];
    this.subscription= this.triggerServ.getUpdate().subscribe(message => {
      if( message.source===this.source+'-filters' ){
        this.filtersData = message.data;
        this.getOrders();
      }
    });
  }

  ngOnInit(): void {
    //this.getOrders();
    this.getCols();
    this.getColsAll();
    this.getProfiles();
    this.getPaymentForms();
    this.getCountries();
    this.getCategoriesNames();

    this.route.fragment.subscribe({
      next: value => {
        if (value === null) {
          throw new Error('not implemented');
        }
        const tab = new URLSearchParams(value).get('tab')
        if( this.tab !== tab || this.tab==='' ){
          this.tab = tab;
          this.getTab();
        }
      }
    });
    this.filtersList = [
      //{type: 'text',label: 'Produkt', field: 'productName'},
      //{type: 'text',label: 'Nr. seryjny', field: 'serialNumber'},
      {type: 'multiSelect',label: 'Firma', field: 'company', options: 'companiesData', optionLabel: 'name', optionValue: 'id'},
      {type: 'multiSelect',label: 'Hurtownik', field: 'buyer', options: 'wholesellersData', optionLabel: 'name', optionValue: 'id'},
      {type: 'date',label: 'Miesiąc zam.', field: 'purchaseTime', format: 'yy-mm'},
      //{type: 'multiSelect',label: 'Opłacone', field: 'paydOrder', options: 'paydData', optionLabel: 'name', optionValue: 'id'},
      //{type: 'multiSelect',label: 'Status', field: 'status', options: 'statusData', optionLabel: 'name', optionValue: 'id'},
    ];
  }

  getCols(){
    this.servService.getColumnsChosen(
      {
        where: 'user='+this.logedUser.id,
        placer: "documents-orders"
      }
    ).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        let tempObj = new ColumnChosen();
        tempObj.load(res[i]);
        res[i]=tempObj;
      }
      this.cols = res;
    });
  }
  getColsAll(){
    this.servService.getColumns({
      placer: "documents-orders"}
    ).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        let tempObj = new Column();
        tempObj.load(res[i]);
        res[i]=tempObj;
      }
      this.colsAll = res;
    });
  }
  editcolumns() {
    this.ref = this.dialogService.open(ColumnEditorComponent, {
      data: {
        placer: 'documents-orders',
        columns: this.colsAll,
        columnsChosen: this.cols
      },
      header: 'Wybór wyświetlanych kolumn: Dokumenty - Zamówienia',
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((ret) => {
      if (ret) {
        this.getCols();
      }
    });
  }
  paginate(event) {
    this.filters.first = event.first;
    this.filters.perPage = event.rows;
    this.getOrders();
  }//dupa
  search(){
    if( this.filters.search.length > 2 || this.filters.search.length===0 ){
      this.getOrders();
    }
  }
  customSort(event: SortEvent) {
    let order:any = '';
    if (event.order > 0) {
      order = event.field + ' ASC';
    } else {
      order = event.field + ' DESC';
    }
    if( String(this.filters.order) !== String(order) ){
      this.filters.order=order;
      this.getOrders();
    }
  }
  getOrders(){
    if( !this.loading && this.tabObj && this.tabObj.label!=undefined ) {
      this.loading = true;
      let search = this.filters.search;

      let where = 'shop_order.isActive=1 AND shop IN('+ this.tabObj.label.shops+')';
      if (this.filtersData.search !== null && this.filtersData.search !== undefined && this.filtersData.search.length > 0) {
        search = this.filtersData.search;
      }
      if (this.filtersData.where !== null && this.filtersData.where !== undefined && this.filtersData.where.length > 0) {
        where += this.filtersData.where;
      }
      this.orderService.getOrders({
        first: this.filters.first,
        perPage: this.filters.perPage,
        search: search,
        where: where,
        lang: this.logedUser.language,
        order: this.filters.order
      }).subscribe((res) => {
        for (let i = 0; i < res['list'].length; i++) {
          if( res['list'][i]['billingAddress'] == null ){
            res['list'][i]['billingAddress'] = new Address();
          }
          if( res['list'][i]['shippingAddress'] == null ){
            res['list'][i]['shippingAddress'] = new Address();
          }
          /*res[i] = new Order(res['list'][i]);
          res[i].shippingAddress = new Address(res['list'][i].shippingAddress);
          res[i].billingAddress = new Address(res['list'][i].billingAddress);
          res[i].shippingAddressCountry = new Country(res['list'][i].shippingAddressCountry);
          res[i].billingAddressCountry = new Country(res['list'][i].billingAddressCountry);*/
        }
        this.orders = res['list'];
        this.filters.count = res['count'];
        this.loading = false;
      });
    }
  }

  getSupervisor( id ){
    if( id>0 && this.profiles!==undefined && this.profiles!==null && this.profiles.length>0 ){
      const temp = this.profiles.filter(x => x.id === id);
      if( temp[0].id!==undefined && temp[0].id!==null ){
        return temp[0].imie+ ' ' +temp[0].nazwisko;
      }else{
        return '';
      }
    }else{
      return '';
    }
  }
  getProfiles(){
    this.servService.getProfils().subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        res[i] = new Profil(res[i]);
      }
      this.profiles = res;
    });
  }
  getCountryName( id ){
    const temp = this.countries.filter(x => x.id === id && x.language === this.logedUser.language);
    if( temp[0]!==undefined ){
      return temp[0].name;
    }else{
      console.log('brak kategorii dla ID: '+id+' lang: '+this.logedUser.language);
      return 'BRAK';
    }
  }
  getCountries(){
    this.servService.getKraje({}).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        res[i] = new Country(res[i]);
      }
      this.countries = res;
      localStorage.setItem('countries', JSON.stringify(this.countries));
    });
  }
  getPaymentFormsName( id ){
    const temp = this.paymentForms.filter(x => x.value == id);
    if( temp[0]!==undefined ){
      return temp[0].label;
    }else{
      console.log('brak formy płatności dla ID: '+id);
      return 'BRAK';
    }
  }
  getTab(){
    this.servService.getConfigData({
      where: 'type="orderTab" AND value="'+this.tab+'" AND language="'+this.logedUser.language+'"',
      order: 'id ASC'
    }).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        let temp: any = new ConfigData(res[i]);
        temp.label = JSON.parse(temp.label);
        this.tabObj = temp;
      }
      this.getOrders();
    });
  }
  getPaymentForms(){
    this.servService.getConfigData({
      where: 'type="paymentForm" AND language="' + this.logedUser.language + '"',
      order: 'label ASC'
    }).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        res[i] = new ConfigData(res[i]);
      }
      this.paymentForms = res;
      localStorage.setItem('paymentForms', JSON.stringify(this.paymentForms));
    });
  }
  getCategoriesNames(){
    this.servService.getCategoryNames().subscribe((res) => {
      this.CategoryNames = [new CategoryNames()];
      for (let i = 0; i < res.length; i++) {
        let tempObj = new CategoryNames();
        tempObj.load(res[i]);
        res[i] = tempObj;
      }
      this.CategoryNames = [...this.CategoryNames, ...res];
      localStorage.setItem('CategoryNames', JSON.stringify(this.CategoryNames));
    });
  }

  openForm(data = new Order()) {
    data.shop = this.tabObj.value;
    data.company = this.tabObj.value;
    this.ref = this.dialogService.open(OrderFormComponent, {
      data: {
        obj: data,
      },
      header: 'Edycja zamówienia: ' + data.name + ' (ID: '+data.id+')',
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((ret) => {
      if (ret) {
        this.getOrders();
      }
    });
    this.ref.onDestroy.subscribe((ret) => {
      this.getOrders();
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    console.log(this.source+'-unsubscribe');
  }
  log( data ){
    console.log(data);
  }
}
