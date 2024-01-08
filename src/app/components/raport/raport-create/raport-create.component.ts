import {Component, OnInit, OnChanges, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import {Raport} from '../../../shared/raport';
import {Profil} from '../../../shared/profil';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-raport-create',
  templateUrl: './raport-create.component.html',
  styleUrls: ['./raport-create.component.sass', '../../../app.component.sass']
})
export class RaportCreateComponent implements OnChanges {
  @Input() receivedCurrentDate: string;
  @Input() receivedEditId: number;
  @Output() sendCurrentDate = new EventEmitter<string>();
  maxDate = new Date();
  logedUser: Profil;

  @Input() raportDetails: Raport = new Raport();

  constructor(
    public restApi: ApiService,
    public router: Router
  ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    localStorage.removeItem('currDate');
  }

  ngOnChanges() {
    if ( this.receivedCurrentDate !== undefined && this.receivedCurrentDate !== null ) {
      this.raportDetails.dzien = new Date(this.receivedCurrentDate);
    }else{
      const tempDate = new Date();
      this.raportDetails.dzien = new Date(tempDate.setHours(tempDate.getHours() + 2));
    }
    if ( localStorage.getItem('currDate') !== undefined && localStorage.getItem('currDate') !== null ){
      this.raportDetails.dzien = new Date(localStorage.getItem('currDate'));
    }
    if ( this.receivedEditId > 0 ){
      this.getRecord( this.receivedEditId );
    }
  }

  addRaport() {
    this.raportDetails.dodal = this.logedUser.id;
    this.raportDetails.dzien = new Date(this.raportDetails.dzien.setHours(this.raportDetails.dzien.getHours() + 2));
    this.restApi.createRaport(this.raportDetails).subscribe((data: {}) => {
      this.reloadCurrentRoute();
    });
  }

  editRaport() {
    this.restApi.updateRaport(this.raportDetails.id, this.raportDetails).subscribe((data: {}) => {
      this.reloadCurrentRoute();
    });
  }

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  getRecord( id ) {
    return this.restApi.getRaport( id ).subscribe((data: Raport) => {
      this.raportDetails = data;
    });
  }

  sendDate() {
    localStorage.setItem('currDate', this.raportDetails.dzien.toString());
    // tslint:disable-next-line:max-line-length
    const data = this.raportDetails.dzien.getFullYear() + '-' + ('0' + (this.raportDetails.dzien.getMonth() + 1)).slice(-2) + '-' + ('0' + this.raportDetails.dzien.getDate()).slice(-2);
    this.sendCurrentDate.emit( data );
  }
}
