import { Injectable } from '@angular/core';
import {Category} from '../shared/Category';
import {ApiService} from './api.service';
import {CategoryNames} from '../shared/CategoryNames';

@Injectable({
  providedIn: 'root'
})
export class CategoryData {
  categoriesTime: Date;
  CategoryNamesTime: Date;
  categories: Category[];
  CategoryNames: CategoryNames[];

  constructor(private servService: ApiService) {
    this.loadCategoryNames();
    this.CategoryNamesTime=new Date();
  }

  loadCategoryNames(): void {
    this.servService.getCategoryNames().subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        let tempObj = new CategoryNames();
        tempObj.load(res[i]);
        res[i]=tempObj;
      }
      this.CategoryNames = res;
    });
  }

  refreshCategoryNames(){
    if( this.CategoryNamesTime.getTime() < new Date().getTime()-(1000 * 60 * 15) ){
      this.loadCategoryNames();
    }
  }

  getCategoryNameObjs( lang=null ){
    this.refreshCategoryNames();
    if( lang!==null ){
      return this.CategoryNames.filter(x => x.language === lang);
    }else{
      return this.CategoryNames;
    }
  }
  getCategoryNameObj( id, lang ){
    this.refreshCategoryNames();
    if( lang!==null ){
      return this.CategoryNames.filter(x => x.id === id && x.language === lang);
    }else{
      return this.CategoryNames.filter(x => x.id === id);
    }
  }
  getCategoryName( id, lang ){
    this.refreshCategoryNames();
    const temp: CategoryNames[] = this.CategoryNames.filter(x => x.id === id && x.language === lang);
    if( temp[0]!==undefined ){
      return temp[0].name;
    }else{
      console.log('brak kategorii dla ID: '+id+' lang: '+lang);
      return 'BRAK';
    }
  }
}
