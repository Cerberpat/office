import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CategoryNames } from '../shared/CategoryNames';
import { Profil } from '../shared/profil';
import {ApiService} from './api.service';
import {ConfigData} from '../shared/ConfigData';
import {Country} from '../shared/Country';

export class ConfigService {
  user: Profil;
  CategoryNames: CategoryNames[];
  paymentForms: ConfigData[];
  countries: Country[];

  constructor( private servService: ApiService ) {
    this.user = JSON.parse(localStorage.getItem('LoggedInUser'));
  }

  getCategoriesNames(){
    if( JSON.parse(localStorage.getItem('CategoryNames')).length > 0 ) {
      return JSON.parse(localStorage.getItem('CategoryNames'));
    }else{
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
  }

  getPaymentForms(){
    if( JSON.parse(localStorage.getItem('paymentForms')).length > 0 ) {
      return JSON.parse(localStorage.getItem('paymentForms'));
    }else {
      this.servService.getConfigData({
        where: 'type="paymentForm" AND language="' + this.user.language + '"',
        order: 'label ASC'
      }).subscribe((res) => {
        for (let i = 0; i < res.length; i++) {
          res[i] = new ConfigData(res[i]);
        }
        this.paymentForms = res;
        localStorage.setItem('paymentForms', JSON.stringify(this.CategoryNames));
      });
    }
  }

  getCountries(){
    if( JSON.parse(localStorage.getItem('countries')).length > 0 ) {
      return JSON.parse(localStorage.getItem('countries'));
    }else {
      this.servService.getKraje({}).subscribe((res) => {
        for (let i = 0; i < res.length; i++) {
          res[i] = new Country(res[i]);
        }
        this.countries = res;
        localStorage.setItem('countries', JSON.stringify(this.CategoryNames));
      });
    }
  }
}
