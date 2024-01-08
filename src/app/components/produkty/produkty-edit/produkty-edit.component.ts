import { Component, OnInit } from '@angular/core';
import {Profil} from '../../../shared/profil';
import {Product} from '../../../shared/product';
import {ApiService} from '../../../services/api.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ProductNames} from '../../../shared/productNames';
import { MessageService } from 'primeng/api';
import {ConfigData} from '../../../shared/ConfigData';
import validbarcode from "barcode-validator";

@Component({
  selector: 'app-produkty-edit',
  templateUrl: './produkty-edit.component.html',
  styleUrls: ['./produkty-edit.component.sass'],
  providers: [MessageService],
})
export class ProduktyEditComponent implements OnInit {
  logedUser: Profil;
  product: Product;
  product2: Product;
  takNie: any = [];
  diff: any = [];
  validationErrors: {} = {};
  validationErrorsTabs = {
    'Dane ogólne': 'dane-ogolne',
    'Ceny': 'ceny',
    'Nazwy': 'nazwy',
    'Stany/ilości': 'stany-ilosci',
    'Miary': 'miary',
    'Dodatkowe informacje': 'dodatkowe-informacje',
  }
  saveDisplay: number = 0;
  categories: any[] = [];
  marks: any[] = [];
  productNames1: ProductNames[] = [];
  productNames2: ProductNames[] = [];
  newShort: ProductNames = new ProductNames();
  newLong: ProductNames = new ProductNames();
  gtu: ConfigData[];
  languages: ConfigData[];
  clonedProductsNames: { [s: string]: ProductNames; } = {};

  constructor(
    private servService: ApiService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private messageService: MessageService
  ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.product = this.config.data.obj;
    this.product2 = JSON.parse(JSON.stringify(this.config.data.obj));
    this.categories = JSON.parse(JSON.stringify(this.config.data.categories));
    for(let i = 0; i< this.categories.length; i++) {
      this.categories[i] = {label: this.categories[i].name, value: this.categories[i].id};
    }
    this.diff = [];
    this.newShort.id=this.product.id;
    this.newShort.language='PL';
    this.newLong.id=this.product.id;
    this.newLong.language='PL';
    this.takNie = [
      { value: '0', label: 'NIE' },
      { value: '1', label: 'TAK' }
    ];
  }

  ngOnInit(): void {
    this.getProductNames(this.product.id);
    this.getGtu();
    this.getMarks();
    this.getLanguage();
  }

  getProductNames(id){
    this.servService.getProduktyNazwy({
      id: id,
      order: 'label ASC'
    }).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        let tempObj = new ProductNames();
        tempObj.load(res[i]);
        res[i]=tempObj;
      }
      this.productNames1 = res;
      this.productNames2 = res;
    });
  }

  getMarks(){
    this.servService.getConfigData({
      where: 'type="mark"',
      order: 'label ASC'
    }).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        res[i]=new ConfigData(res[i]);
      }
      this.marks = res;
    });
  }

  getGtu(){
    this.servService.getConfigData({
      where: 'type="gtu"',
      order: 'value ASC'
    }).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        res[i]=new ConfigData(res[i]);
      }
      this.gtu = res;
    });
  }

  getLanguage(){
    this.servService.getConfigData({
      where: 'type="language"',
      order: 'label ASC'
    }).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        res[i]=new ConfigData(res[i]);
      }
      this.languages = res;
    });
  }

  saveProduct(product: Product) {
    this.servService.updateProdukt(product.id, product).subscribe((res) => {

      if ( res ) {
        this.saveAllNames();
        this.product2 = Object.assign({}, this.product);
        this.messageService.add({severity:'success', summary: 'Success', detail:'Produkt został zaktualizowany.'});
        this.cleanColors();
        this.ref.close(res);
      }else {
        this.messageService.add({severity:'error', summary: 'Error', detail:'Błąd edycji produktu.'});
      }
    });
  }

  onRowEditInit(productNames: ProductNames) {
    this.clonedProductsNames[productNames.id] = productNames;
  }

  onRowEditSave(productNames: ProductNames) {
    this.servService.updateProduktyNazwy(productNames.id, productNames).subscribe((res) => {
      if (res) {
        delete this.clonedProductsNames[productNames.id];
        this.getProductNames(this.product.id);
        this.messageService.add({severity:'success', summary: 'Success', detail:'Nazwa została zmieniona.'});
      }else {
        this.messageService.add({severity:'error', summary: 'Error', detail:'Nie udało się zapisać nowej nazwy.'});
      }
    });
  }

  onRowEditCancel(productNames: ProductNames, index: number) {
    this.productNames2[index] = this.clonedProductsNames[productNames.id];
    delete this.clonedProductsNames[productNames.id];
  }

  getNazwa( lang ){
    const temp: ProductNames[] = this.productNames1.filter(x => x.language === lang);
    if( temp[0]!==undefined ){
      return temp[0].name;
    }else{
      return '';
    }
  }
  validProduct(): boolean {
    for (var key in this.product) {
      this.validField(key);
    }
    if( Object.keys(this.validationErrors).length === 0 ){
      return true;
    }else{
      return false;
    }
  }

  validField( field=null ): boolean{
    let ele = document.getElementById(field);
    if( this.product[field]!==undefined && ele!==undefined && ele!==null || field === 'nameshort' || field === 'namelong' ){
      const header = ele.closest('p-tabpanel');
      switch(field) {
        case 'barcode': {
          if( !validbarcode(this.product[field]) ){
            this.addErrorMessage({
              tab: this.validationErrorsTabs[header.getAttribute('header')],
              type: 'ean',
              field: field,
              message: '- Nieprawidłowy EAN.'
            });
          }else{
            this.removeErrorMessage({
              tab: this.validationErrorsTabs[header.getAttribute('header')],
              type: 'ean',
              field: field,
            });
          }
          break;
        }
        case 'maxOrder':
        case 'availabilityAlert':
        case 'availabilityWarning':
        case 'retailAlert':
        case 'collectiveQuantity': {
          if( this.product[field] === null ){
            this.product[field] = 0;
          }
          this.product[field] = parseInt(this.product[field]);
          if( !Number.isInteger(this.product[field]) ){
            this.addErrorMessage({
              tab: this.validationErrorsTabs[header.getAttribute('header')],
              type: 'integer',
              field: field,
              message: '- Wartość musi być liczbą całkowitą.'
            });
          }else{
            this.removeErrorMessage({
              tab: this.validationErrorsTabs[header.getAttribute('header')],
              type: 'integer',
              field: field,
            });
          }
          break;
        }
        case 'height':
        case 'width':
        case 'length':
        case 'collectivelyHeight':
        case 'collectivelyWidth':
        case 'collectivelyLength':
        case 'weight':
        case 'weightNetto':
        case 'collectivelyWeight': {
          if( this.product[field] === null ){
            this.product[field] = 0;
          }
          this.product[field] = parseFloat(this.product[field]).toFixed(2);
          if( !(typeof this.product[field] === "number" && isFinite(this.product[field]) && Math.floor(this.product[field]) === this.product[field]) ){
            this.addErrorMessage({
              tab: this.validationErrorsTabs[header.getAttribute('header')],
              type: 'float',
              field: field,
              message: '- Wartość musi być liczbą.'
            });
          }else{
            this.removeErrorMessage({
              tab: this.validationErrorsTabs[header.getAttribute('header')],
              type: 'float',
              field: field,
            });
          }
          break;
        }
        case 'nameshort':{
          if( this.newShort.name.length > 70 || this.newShort.name.length < 3 ){
            this.addErrorMessage({
              tab: this.validationErrorsTabs[header.getAttribute('header')],
              type: 'length',
              field: field,
              message: '- Maksymalna długość nazwy to 70 znaków, a minimalna 3.'
            });
          }else{
            this.removeErrorMessage({
              tab: this.validationErrorsTabs[header.getAttribute('header')],
              type: 'length',
              field: field,
            });
          }
          break;
        }
        case 'namelong': {
          if( this.newLong.name.length > 150 || this.newLong.name.length < 3 ){
            this.addErrorMessage({
              tab: this.validationErrorsTabs[header.getAttribute('header')],
              type: 'length',
              field: field,
              message: '- Maksymalna długość nazwy to 150 znaków, a minimalna 3.'
            });
          }else{
            this.removeErrorMessage({
              tab: this.validationErrorsTabs[header.getAttribute('header')],
              type: 'length',
              field: field,
            });
          }
          break;
        }
        case 'languageShort':
        case 'languagelong': {

          break;
        }
        default: {
          break;
        }
      }
    }

    if( JSON.stringify(this.product)!==JSON.stringify(this.product2) ){
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

  addErrorMessage( obj ){
    if( this.validationErrors[obj.tab] === undefined ){
      this.validationErrors[obj.tab]={};
    }
    if( this.validationErrors[obj.tab][obj.field] === undefined ){
      this.validationErrors[obj.tab][obj.field]={};
    }
    this.validationErrors[obj.tab][obj.field][obj.type] = obj.message;
    let ele = document.getElementById(obj.field);
    if (ele !== undefined) {
      if (ele.tagName === 'select') {
        if (!ele.className.includes('select-red')) {
          ele.className = ele.className + ' select-red';
        }
      } else {
        if (!ele.className.includes('input-red')) {
          ele.className = ele.className + ' input-red';
        }
      }
    }
  }

  removeErrorMessage( obj ){
    if( this.validationErrors[obj.tab] !== undefined && this.validationErrors[obj.tab][obj.field] !== undefined && this.validationErrors[obj.tab][obj.field][obj.type] !== undefined ){
      delete this.validationErrors[obj.tab][obj.field][obj.type];

      if( this.validationErrors[obj.tab][obj.field][obj.type]!==undefined && this.countProperties(this.validationErrors[obj.tab][obj.field][obj.type]) === 0 ){
        delete this.validationErrors[obj.tab][obj.field][obj.type];
      }
      if( this.validationErrors[obj.tab][obj.field]!==undefined && this.countProperties(this.validationErrors[obj.tab][obj.field]) === 0 ){
        delete this.validationErrors[obj.tab][obj.field];
        let ele = document.getElementById(obj.field);
        if (ele !== undefined) {
          if (ele.tagName === 'select') {
            if (ele.className.includes('select-red')) {
              ele.className = ele.className.replace(' select-red','');
            }
          } else {
            if (ele.className.includes('input-red')) {
              ele.className = ele.className.replace(' input-red','');
            }
          }
        }
      }
      if( this.validationErrors[obj.tab]!==undefined && this.countProperties(this.validationErrors[obj.tab]) === 0 ){
        delete this.validationErrors[obj.tab];
      }
    }
  }
  countProperties( obj ){
    let count=0;
    for (let i = 0; i < obj.length; i++) {
      count++;
    }
    return count;
  }

  getErrorMessage( field ){
    let ele = document.getElementById(field);
    const header = ele.closest('p-tabpanel');
    let message = '';
    if(
      this.validationErrors[this.validationErrorsTabs[header.getAttribute('header')]] !== undefined &&
      this.validationErrors[this.validationErrorsTabs[header.getAttribute('header')]][field] !== undefined
    ){
      let tempArray = this.validationErrors[this.validationErrorsTabs[header.getAttribute('header')]][field];
      for (var key in tempArray) {
        if( message!=='' ){
          message=message+'\n';
        }
        message=message+tempArray[key];
      }
    }
    return message;
  }

  cleanColors() {
    for (var key in this.product) {
      this.validField( key );
    }
  }

  saveAllNames(): void {
    for (let i = 0; i < this.productNames2.length; i++) {
      if( JSON.stringify(this.productNames1[i]) !== JSON.stringify(this.productNames2[i]) && this.productNames2[i].type.length>0 ){
        this.onRowEditSave(this.productNames2[i]);
      }
    }
  }

  addName( obj: ProductNames, type: string ){
    obj.type = type;
    this.servService.createProduktyNazwy(obj).subscribe((res) => {
      this.getProductNames(this.product.id);
    });
  }

  getLanguageByIso( iso ){
    if( this.languages!==undefined ) {
      const temp: ConfigData[] = this.languages.filter(x => x.value === iso);
      if (temp[0] !== undefined) {
        return temp[0].label;
      } else {
        return 'Brak języka dla ISO: ' + iso;
      }
    }
  }
  getProductNamesByType( type ){
    if( this.productNames2!==undefined ) {
      const temp: ProductNames[] = this.productNames2.filter(x => x.type === type);
      if (temp !== undefined && temp.length > 0) {
        return temp;
      } else {
        return [];
      }
    }
  }
  getLangagesLeft( type ){
    let temp: ProductNames[] = this.getProductNamesByType( type );
    if( temp!==undefined ){
      temp = temp.filter(x => x.type === type);
      if( temp!==undefined && this.languages!==undefined ){
        return this.languages.filter((o1) => !temp.some((o2) => o1.value === o2.language));
      }else {
        return [];
      }
    }
  }

  log(data){
    console.log(data);
  }
}
