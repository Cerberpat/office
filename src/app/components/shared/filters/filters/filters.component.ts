import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {formatDate} from '@angular/common';
import {TriggerService} from '../../../../services/triggerService';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.sass']
})
export class FiltersComponent implements OnInit {
  @Input() filtersList: any[];
  @Input() source: string;
  filters: [] = [];
  locale: any;
  showFilters: boolean = false;
  filtersClearing: any[] = [];

  constructor(
    private servService: ApiService,
    private triggerServ: TriggerService
  ) {
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
  }

  ngOnInit(): void {
    for (let i = 0; i < this.filtersList.length; i++) {
      this.filtersList[i].id = i;
      if( this.filtersList[i].type==='multiSelect' || this.filtersList[i].type==='select' ){
        this.filtersList[i].options = this.getData(this.filtersList[i].options);
      }
    }
  }

  refresh(){
    this.showFilters=false;
    let resp={
      where: '',
      search: ''
    };
    this.filtersClearing=[];
    for (let i = 0; i < this.filtersList.length; i++) {
      if( this.filtersList[i].value!==null && this.filtersList[i].value!==undefined && this.filtersList[i].value!=='' ){
        this.filtersClearing[this.filtersList[i].id] = this.filtersList[i];
        resp = this.getWhere( this.filtersList[i], resp );
      }
    }
    this.triggerServ.sendUpdate({source: this.source+'-filters', data: resp});
  }
  getWhere( filtr, resp ){
    switch (filtr.type) {
      case 'text':
        if( filtr.field==='search' ){
          resp.search += filtr.value;
        }else{
          resp.where += ' AND '+filtr.field+' LIKE "%'+filtr.value.replace(/ /g, '%')+'%"';
        }
        break;
      case 'select':
        resp.where += ' AND '+filtr.field+'="'+filtr.value+'"';
        break;
      case 'multiSelect':
        if( filtr.value.length > 0 ){
          let add=false;
          resp.where += ' AND '+filtr.field+' IN (';
          for (let i = 0; i < filtr.value.length; i++) {
            if( add ){
              resp.where += ',';
            }
            resp.where += '"'+filtr.value[i].id+'"';
            add=true;
          }
          resp.where += ')';
        }
        break;
      case 'date':
        if( filtr.format==='yy-mm' ){
          const lastDay = formatDate(new Date(filtr.value.getFullYear(), filtr.value.getMonth()+1, 0), 'dd', 'pl-PL');
          filtr.value = formatDate(filtr.value, 'yyyy-MM', 'pl-PL');
          resp.where += ' AND '+filtr.field+' BETWEEN "'+filtr.value+'-01" AND "'+filtr.value+'-'+lastDay+'"';
        }else{
          filtr.value = formatDate(filtr.value, 'yyyy-MM-dd', 'pl-PL')
          resp.where += ' AND '+filtr.field+' BETWEEN "'+filtr.value+'" AND "'+filtr.value+'"';
        }
        break;
      case 'number':
        resp.where += ' AND '+filtr.field+'='+filtr.value;
        break;
      default:
        console.log('Brak danych dla where');
        break;
    }
    return resp;
  }

  getData( name ){
    switch (name) {
      case 'countriesData':
        return this.getCountriesData();
      case 'companiesData':
        return this.getCompaniesData();
      case 'wholesellersData':
        return this.getWholesellersData();
      case 'paydData':
        return this.getPaydData();
      case 'statusData':
        return this.getStatusData();
      default:
        console.log('Brak danych filtra');
        return [];
    }
  }
  getCountriesData(){
    const data = JSON.parse(localStorage.getItem('countriesData'));
    if( Array.isArray(data) && data.length > 0 ){
      return data;
    }
    let temp: any = [];
    this.servService.getKraje({
      order: 'name ASC'
    }).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        temp[i] = {id: res[i].id, name: res[i].name};
      }
      localStorage.setItem('countriesData', JSON.stringify(temp));
      return temp;
    });
  }
  getCompaniesData(){
    const data = JSON.parse(localStorage.getItem('companiesData'));
    if( Array.isArray(data) && data.length > 0 ){
      return data;
    }
    let temp: any = [];
    this.servService.getCompanies({
      order: 'name ASC'
    }).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        temp[i] = {id: res[i].id, name: res[i].name};
      }
      localStorage.setItem('companiesData', JSON.stringify(temp));
      return temp;
    });
  }
  getWholesellersData(){
    const data = JSON.parse(localStorage.getItem('wholesellersData'));
    if( Array.isArray(data) && data.length > 0 ){
      return data;
    }
    let temp: any = [];
    this.servService.getWholesellers({
      order: 'name ASC'
    }).subscribe((res) => {
      for (let i = 0; i < res['list'].length; i++) {
        temp[i] = {id: res['list'][i].id, name: res['list'][i].name};
      }
      localStorage.setItem('wholesellersData', JSON.stringify(temp));
      return temp;
    });
  }
  getPaydData(){
    return [
      {id: 0, name: 'Nie opłacone'},
      {id: 1, name: 'Częściowo opłacone'},
      {id: 2, name: 'Opłacone'},
    ];
  }
  getStatusData(){
    return [
      {id: 0, name: ' - - - '},
      {id: 1, name: 'Status 1'},
      {id: 2, name: 'Status 2'},
    ];
  }
  toggleFilters(){
    if( this.showFilters ){
      this.showFilters=false;
    }else{
      this.showFilters=true;
    }
  }
  deleteFilter( rowData ){
    let temp: any = this.filtersList.filter(x => x.id === rowData.id  );
    temp[0].value=null;
    delete this.filtersClearing[temp[0].id];
    this.refresh();
  }
  getSelectValue( data ){
    const temp = this.getData(data.options);
    return temp.filter(x => x.id === data.value.id)[0].name;
  }
  log( data ){
    console.log(data);
  }
}
