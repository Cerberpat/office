import { Component, OnInit } from '@angular/core';
import {Profil} from '../../shared/profil';
import {ApiService} from '../../services/api.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Column} from '../../shared/Column';
import {ColumnChosen} from '../../shared/ColumnChosen';

@Component({
  selector: 'app-column-editor',
  templateUrl: './column-editor.component.html',
  styleUrls: ['./column-editor.component.sass']
})
export class ColumnEditorComponent implements OnInit {
  logedUser: Profil;
  placer: string;
  list1: Column[];
  list2: Column[];
  list2Temp: Column[];
  saveDisplay: number = 0;

  constructor(
    private servService: ApiService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    //console.log(Object.assign({}, this.config.data.columns));
    this.placer = this.config.data.placer;
    this.list1 = this.config.data.columns;
    this.list2 = this.config.data.columnsChosen;
    this.list2Temp = JSON.parse(JSON.stringify(this.config.data.columnsChosen));
  }

  ngOnInit(): void {
    this.list1 = this.list1.filter((o1) => !this.list2.some((o2) => o1.field === o2.field));
  }

  saveColumns(){
    //if( this.list2.length > 0 ){
      let list: ColumnChosen[] = [];
      for (let i = 0; i < this.list2.length; i++) {
        list[i]=new ColumnChosen();
        list[i].load(this.list2[i]);
        list[i].user = this.logedUser.id;
        list[i].columnsID = this.list2[i].columnsID;
        list[i].position = i+1;
      }
      let data = {
        placer: this.placer,
        user: this.logedUser.id,
        list: list
      }
      this.servService.updateColumnsChosen(data).subscribe((res) => {
        this.ref.close(res);
      });
    //}
  }

  checkZapisz(){
    if( JSON.stringify(this.list2)!==JSON.stringify(this.list2Temp) ){
      this.saveDisplay=1;
    }else{
      this.saveDisplay=0;
    }
  }
}
