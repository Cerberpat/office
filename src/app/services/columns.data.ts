import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Column} from '../shared/Column';
import {ColumnChosen} from '../shared/ColumnChosen';

@Injectable({
  providedIn: 'root'
})
export class ColumnsData {
  ColumnsTime: Date;
  Columns: Column[];
  ColumnsChosenTime: Date;
  ColumnsChosen: ColumnChosen[];

  constructor(private servService: ApiService) {
    this.ColumnsTime = new Date();
    this.ColumnsTime.setTime(0);
    this.ColumnsChosenTime = new Date();
    this.ColumnsChosenTime.setTime(0);
  }

  /*loadColumns( placer ): void {
    this.servService.getColumns({where: 'active=1 AND placer="' + placer + '"'}).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        let tempObj = new Column();
        tempObj.load(res[i]);
        res[i]=tempObj;
      }
      this.Columns = res;
      this.ColumnsTime = new Date();
    });
  }

  refreshColumns( placer ){
    if( this.ColumnsTime.getTime() < new Date().getTime()-(1000 * 60 * 15) ){
      this.loadColumns( placer );
    }
  }*/

  getColumns( placer: string ){
    if( this.ColumnsTime.getTime() < new Date().getTime()-(1000 * 60 * 15) ){
      this.servService.getColumns({where: 'active=1 AND placer="' + placer + '"'}).subscribe((res) => {
        for (let i = 0; i < res.length; i++) {
          let tempObj = new Column();
          tempObj.load(res[i]);
          res[i]=tempObj;
        }
        this.Columns = res;
        this.ColumnsTime = new Date();
        return this.Columns;
      });
    }else{
      return this.Columns;
    }
  }

  getColumnsChosen( placer: string, user: number ){
    if( this.ColumnsChosenTime.getTime() < new Date().getTime()-(1000 * 60 * 15) ){
      this.servService.getColumnsChosen({where: 'user='+user+' AND placer="' + placer + '"'}).subscribe((res) => {
        for (let i = 0; i < res.length; i++) {
          let tempObj = new ColumnChosen();
          tempObj.load(res[i]);
          res[i]=tempObj;
        }
        this.ColumnsChosen = res;
        this.ColumnsChosenTime = new Date();
        return this.ColumnsChosen;
      });
    }else{
      return this.ColumnsChosen;
    }
  }

  updateColumnsChosen( list: ColumnChosen[], user: number, placer: string ){
    let data = {
      placer: placer,
      user: user,
      list: list
    }
    this.servService.updateColumnsChosen(data).subscribe((res) => {
      return res;
    });
  }
}
