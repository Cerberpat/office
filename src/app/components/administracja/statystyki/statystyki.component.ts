import { Component, OnInit } from '@angular/core';
import { CategoryNames } from 'src/app/shared/CategoryNames';
import {Profil} from '../../../shared/profil';
import {ApiService} from '../../../services/api.service';
import {ProductNames} from '../../../shared/productNames';
import {Country} from '../../../shared/Country';
import {Wholeseller} from '../../../shared/Wholeseller';
import {Company} from '../../../shared/Company';
import {CompressedData} from '../../../shared/CompressedData';
import {formatDate} from '@angular/common';
import * as FileSaver from 'file-saver';
import {ConfigData} from '../../../shared/ConfigData';


@Component({
  selector: 'app-statystyki',
  templateUrl: './statystyki.component.html',
  styleUrls: ['./statystyki.component.sass']
})

export class StatystykiComponent implements OnInit {
  logedUser: Profil;
  categoryNames: CategoryNames[];
  wholesellers: Wholeseller[];
  profiles: any[];
  productNames: ProductNames[];
  countries: Country[];
  companies: Company[];
  printData: CompressedData[];
  clearData: any;
  loading: boolean;
  params: {
    company: {
      id: string,
      name: string
    },
    dateStart: Date,
    dateStop: Date,
    osx: {
      value: string,
      label: string
    },
    osx2: {
      value: string,
      label: string
    },
    osy: {
      value: string,
      label: string
    },
    addx: any,
    addx2: any,
    addy: any,
    osxSort: string,
    osx2Sort: string,
    osySort: string,
    direction: string,
    printValue: {
      value: number,
      label: string
    },
    empty: {
      value: number,
      label: string
    },
    exchange: {
      value: number,
      label: string
    },
    language: {
      value: string,
      label: string
    },
  };
  osAdd: {
    x: number,
    x2: number,
    y: number
  };
  addOpt: {
    x: {}[],
    x2: {}[],
    y: {}[],
  }
  locale: any;
  direction: {}[];
  printValue: {}[];
  dataOptions: {}[];
  optionsX: {}[];
  optionsX2: {}[];
  optionsY: {}[];
  cols: any[];
  printExchange: any[];
  exportColumns: any[];
  selectedProducts: any[];
  empty: {}[];
  exchange: {}[];
  languages: {}[];

  constructor( private servService: ApiService ) {
    this.printData=[];
  }

  ngOnInit(): void {
    this.getCompanies();
    this.getCategoriesNames();
    this.getWholesellers();
    this.getProductNames();
    this.getCountries();
    this.getCurrency();
    this.getProfiles();

    this.loading=false;
    this.printData=[];
    this.params = {
      company: {
        id: '2',
        name: 'Qmedia'
      },
      dateStart: new Date(),
      dateStop: new Date(),
      osx: {
        value: '',
        label: ''
      },
      osx2: {
        value: '',
        label: ''
      },
      osy: {
        value: '',
        label: ''
      },
      addx: '',
      addx2: '',
      addy: '',
      osxSort: 'ASC',
      osx2Sort: 'ASC',
      osySort: 'ASC',
      direction: 'ASC',
      printValue: {value: 1, label: 'ilość'},
      empty: {value: 1, label: 'Tylko z wartościami'},
      exchange: {value: 1, label: 'Pozostaw oryginalne'},
      language: {value: 'PL', label: 'Polski'},
    };
    this.osAdd = {
      x: 0,
      x2: 0,
      y: 0
    }
    this.addOpt = {
      x: [],
      x2: [],
      y: [],
    }
    this.params.dateStart = new Date(this.params.dateStart.getFullYear(), this.params.dateStart.getMonth(), 1);
    this.params.dateStop = new Date(this.params.dateStop.getFullYear(), this.params.dateStop.getMonth(), this.params.dateStop.getDate());

    this.locale = {
      firstDayOfWeek: 1,
      dayNames: [ 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela' ],
      dayNamesShort: [ 'nie', 'pod', 'wto', 'śro', 'czw', 'pią', 'sob' ],
      dayNamesMin: [ 'N', 'P', 'W', 'Ś', 'C', 'P', 'S' ],
      monthNames: [ 'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień' ],
      monthNamesShort: [ 'sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru' ],
      today: 'Hoy',
      clear: 'Borrar'
    };
    this.direction=[
      {value: 'ASC', label: 'Rosnąco'},
      {value: 'DESC', label: 'malejąco'}
    ];
    this.languages=[
      {value: 'PL', label: 'Polski'},
      {value: 'EN', label: 'Angielski'}
    ];
    this.empty=[
      {value: '1', label: 'Tylko z wartościami'},
      {value: '2', label: 'Uzupełnij wszystkie'},
      {value: '3', label: 'Uzupełnij oś X'},
      {value: '4', label: 'Uzupełnij oś Y'},
    ];
    this.exchange=[
      {value: '1', label: 'Pozostaw oryginalne'},
    ];
    this.printValue=[
      {value: 1, label: 'ilość'},
      {value: 2, label: 'kwota'},
    ];
    this.dataOptions=[
      {value: '', label: ' - - - '},
      {value: 'productID', label: 'Produkt'},
      {value: 'categoryID', label: 'Kategoria'},
      {value: 'companyID', label: 'Firma'},
      {value: 'countryID', label: 'Kraj'},
      {value: 'wholesalerID', label: 'Hurtownik'},
      {value: 'managerID', label: 'Opiekun'},
      {value: 'days', label: 'Dni'},
      {value: 'months', label: 'Miesiące'},
      {value: 'years', label: 'Lata'}
    ];
    this.cols = [];
    this.refreshOptions();
  }

  refreshOptions(){
    // @ts-ignore
    this.optionsX = this.dataOptions.filter(x => x.value !== this.params.osx2.value && x.value !== this.params.osy.value || x.value==='');
    this.checkAddOptions('osx', 'x');
    // @ts-ignore
    this.optionsX2 = this.dataOptions.filter(x => x.value !== this.params.osx.value && x.value !== this.params.osy.value || x.value==='');
    this.checkAddOptions('osx2', 'x2');
    // @ts-ignore
    this.optionsY = this.dataOptions.filter(x => x.value !== this.params.osx.value && x.value !== this.params.osx2.value || x.value==='');
    this.checkAddOptions('osy', 'y');
    // @ts-ignore
    this.sort = this.dataOptions.filter(x => x.value === this.params.osx.value || x.value === this.params.osx2.value || x.value === this.params.osy.value);
  }

  checkAddOptions( val, opt ){
    let tempSwitch = this.osAdd[opt];
    if( this.params[val].value==='productID' ){
      this.osAdd[opt] = 2;
      this.addOpt[opt] = [];
    }else if( this.params[val].value==='categoryID' || this.params[val].value==='companyID' || this.params[val].value==='countryID' || this.params[val].value==='wholesalerID' || this.params[val].value==='managerID' ){
      this.osAdd[opt] = 1;
      switch (this.params[val].value) {
        case 'categoryID':
          this.addOpt[opt] = this.categoryNames;
          break;
        case 'companyID':
          this.addOpt[opt] = this.companies;
          break;
        case 'countryID':
          this.addOpt[opt] = this.countries;
          break;
        case 'wholesalerID':
          this.addOpt[opt] = this.wholesellers;
          break;
        case 'managerID':
          this.addOpt[opt] = this.profiles;
          break;
        default:
          this.addOpt[opt] = [];
          break;
      }
    }else{
      this.osAdd[opt] = 0;
    }
    if( tempSwitch!==this.osAdd[opt] ){
      this.params['add'+opt]='';
    }
  }

  getData(){
    if( !this.loading ){
      this.loading=true;
      this.servService.getCompressedData({
        company: this.params.company.id,
        dateStart: formatDate(this.params.dateStart, 'yyyy-MM-dd', 'pl-PL'),
        dateStop: formatDate(this.params.dateStop, 'yyyy-MM-dd', 'pl-PL'),
        x: this.params.osx.value,
        x2: this.params.osx2.value,
        y: this.params.osy.value,
        xAdd: JSON.stringify(this.params.addx),
        x2Add: JSON.stringify(this.params.addx2),
        yAdd: JSON.stringify(this.params.addy),
        sortx: this.params.osxSort,
        sortx2: this.params.osx2Sort,
        sorty: this.params.osySort,
        printValue: this.params.printValue.value,
        empty: this.params.empty.value,
        exchange: this.params.exchange.value,
        lang: this.params.language.value
      }).subscribe((res) => {
        const temp=res;
        this.printData=temp['data'];console.log(this.printData);
        this.cols=temp['cols'];
        this.printExchange=Object.keys(temp['exchange']).map(key => ({type: key, value: temp['exchange'][key]}));
        this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
        this.loading=false;
      });
    }
  }

  getWholesellers(){
    this.servService.getWholesellers({
      order: 'name ASC'
    }).subscribe((res) => {
      for (let i = 0; i < res['list'].length; i++) {
        res['list'][i] = new Wholeseller(res['list'][i]);
      }
      this.wholesellers = res['list'];
    });
  }

  getCurrency(){
    this.servService.getConfigData({
      where: 'type="currency"',
      order: 'label ASC'
    }).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        res[i]=new ConfigData(res[i]);
      }
      this.exchange = [...this.exchange, ... res];
    });
  }

  getCategoriesNames(){
    this.servService.getCategoryNames('PL').subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        let tempObj = new CategoryNames();
        tempObj.load(res[i]);
        res[i]=tempObj;
      }
      this.categoryNames = res;
    });
  }

  getProductNames(){
    this.servService.getProduktyNazwy({
      where: 'language="PL"',
      order: 'label ASC'
    }).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        let tempObj = new ProductNames();
        tempObj.load(res[i]);
        res[i]=tempObj;
      }
      this.productNames = res;
    });
  }

  getCountries(){
    this.servService.getKraje({}).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        res[i]=new Country(res[i]);
      }
      this.countries = res;
    });
  }

  getCompanies(){
    this.servService.getCompanies({}).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        let tempObj = new Company();
        tempObj.load(res[i]);
        res[i]=tempObj;
      }
      // @ts-ignore
      this.companies = [...[{id: 0, name: ' - - - '}], ...res];
    });
  }

  getProfiles(){
    this.servService.getProfils().subscribe((res) => {
      let temp: any[] = [];
      for (let i = 0; i < res.length; i++) {
        temp.push({id: res[i]['id'], name: res[i]['nazwisko']+' '+res[i]['imie']});
      }
      this.profiles = [...[{id: 0, name: ' - - - '}], ...temp];
    });
  }
/*
  exportPdf() {
    const doc = new jsPDF('p', 'mm', 'a4');
    autoTable(this.exportColumns, this.printData );
    doc.save('primengTable.pdf');
  }*/

  exportExcel() {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.printData);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'primengTable');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
