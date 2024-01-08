import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/api';
import {ConfirmationService} from 'primeng';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {PrivilagesService} from '../../../services/privilages.service';
import {Profil} from '../../../shared/profil';
import {PrivilageShema} from '../../../shared/PrivilageShema';

@Component({
  selector: 'app-privilages-form',
  templateUrl: './privilages-form.component.html',
  styleUrls: ['./privilages-form.component.sass'],
  providers: [MessageService, ConfirmationService]
})
export class PrivilagesFormComponent implements OnInit {
  logedUser: Profil;
  profile: Profil;
  shema: any = new PrivilageShema();
  shemaList: PrivilageShema[] = [];
  privilages: any[];
  source: string;
  sourceId: number;
  cols = [
    { field: 'tab', header: 'Zakładka' },
    { field: 'specific', header: 'funkcja' },
    { field: 'description', header: 'Opis' },
  ];
  lastTab = '';

  constructor(public dialogService: DialogService, private privilagesService: PrivilagesService, public config: DynamicDialogConfig, public ref: DynamicDialogRef, private messageService: MessageService) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.profile = this.config.data.obj;
    this.source = 'privilages';
    this.sourceId = this.profile.id;
  }

  ngOnInit(): void {
    this.getPrivilages();
    this.getPrivilageShema();
  }
  getPrivilages(): void {
    this.privilagesService.getPrivilages( {} ).subscribe((res) => {
      this.privilages = res;
      if( this.profile.id > 0 ){
        this.loadProfilPriv();
      }
    });
  }
  getPrivilageShema(): void {
    this.privilagesService.getPrivilagesShema( {} ).subscribe((res) => {
      this.shemaList = res;
    });
  }
  showIfChanged( val ){
    if( this.lastTab !== val ){
      this.lastTab = val;
      return this.lastTab;
    }
    return '';
  }
  savePrivs(){
    if( this.profile.id > 0 ){
      let addPriv = this.privilages.filter(x => x.val === true);
      for (let i = 0; i < addPriv.length; i++) {
        addPriv[i]={privilagesId: addPriv[i].id, profilsId: this.profile.id}
      }
      this.privilagesService.deletePrivilageProfil(this.profile.id).subscribe((data: {}) => {
        this.privilagesService.createPrivilageProfil(addPriv).subscribe((data: {}) => {
          this.ref.close('priv');
        });
      });
    }
  }
  saveShemaPrivs(){
    if( this.shema.id != 0 ){
      this.shema.id = this.shema.id.id;
      let addPriv = this.privilages.filter(x => x.val === true);
      for (let i = 0; i < addPriv.length; i++) {
        addPriv[i]={privilagesId: addPriv[i].id, schemaId: this.shema.id}
        addPriv[i].val = false;
      }
      this.privilagesService.deletePrivilageShemaPosition(this.shema.id).subscribe((data: {}) => {
        this.privilagesService.createPrivilageShemaPosition(addPriv).subscribe((data: {}) => {
          this.ref.close('schema');
        });
      });
    }
  }
  saveShema(){
    if(this.shema.name.length < 3){
      this.messageService.add({severity:'error', summary: 'Error', detail:'Nazwa szablonu musi zawierać conajmniej 3 znaki.'});
    }
    this.privilagesService.createPrivilageShema(this.shema).subscribe((data: {}) => {
      this.messageService.add({severity:'success', summary: 'Success', detail:'Szablon został dodany.'});
      this.shema = new PrivilageShema();
      this.getPrivilageShema();
    });
  }
  loadShema(){
    for (let i = 0; i < this.privilages.length; i++) {
      this.privilages[i].val = false;
    }
    if( this.shema.id != null && this.shema.id.id > 0 ) {
      this.privilagesService.getPrivilagesShemaPositions({schemaId: this.shema.id.id}).subscribe((res) => {
        for (let i = 0; i < res.length; i++) {
          this.privilages.filter( x => x.id == res[i].privilagesId )[0].val = true;
        }
      });
    }else if(  this.profile.id > 0  ){
      this.loadProfilPriv();
    }
  }
  loadProfilPriv(){
    for (let i = 0; i < this.privilages.length; i++) {
      this.privilages[i].val = false;
    }
    if( this.profile.id > 0 ) {
      this.privilagesService.getPrivilagesProfil({profilsId: this.profile.id}).subscribe((res) => {
        for (let i = 0; i < res.length; i++) {
          this.privilages.filter( x => x.id == res[i].privilagesId )[0].val = true;
        }
      });
    }
  }
}
