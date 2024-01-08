import {Component, OnChanges, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import {ApiService} from '../../../services/api.service';
import {Profil} from '../../../shared/profil';

@Component({
  selector: 'app-raport-lista',
  templateUrl: './raport-lista.component.html',
  styleUrls: ['./raport-lista.component.sass'],
})

export class RaportListaComponent implements OnChanges {
  @Input() receivedCurrentDate: string;
  @Output() sendEditId = new EventEmitter<number>();
  Records: any = [];
  Users: any = [];
  logedUser: Profil;

  constructor(
    public restApi: ApiService,
    public router: Router
  ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
  }

  ngOnChanges() {
    if ( localStorage.getItem('currDate') !== undefined && localStorage.getItem('currDate') !== null ){
      this.receivedCurrentDate = localStorage.getItem('currDate');
    } else {
      const tempDate = new Date();
      const dataDate = new Date(tempDate.setHours(tempDate.getHours() + 2));
      // tslint:disable-next-line:max-line-length
      this.receivedCurrentDate = dataDate.getFullYear() + '-' + ('0' + (dataDate.getMonth() + 1)).slice(-2) + '-' + ('0' + dataDate.getDate()).slice(-2);
    }
    this.loadList( this.receivedCurrentDate );
  }

  // Get Raport list
  loadList( currentData: string ) {
    if ( currentData.toString().length > 10 ){
      const dataDate = new Date( currentData );
      currentData = dataDate.getFullYear() + '-' + ('0' + (dataDate.getMonth() + 1)).slice(-2) + '-' + ('0' + dataDate.getDate()).slice(-2);
    }
    // @ts-ignore
    return this.restApi.getRaports( currentData ).subscribe((data: {}) => {
      this.Records = data;
      this.loadUsersList();
    });
  }

  // Get Raport list
  loadUsersList() {
    return this.restApi.getProfils().subscribe((data: {}) => {
      this.Users = data;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.Users.length; i++) {
        if ( this.logedUser.dostep.toString() === '1' || this.Users[i].id === this.logedUser.id ) {
          this.Users[i].records = this.Records.filter(x => x.dodal === this.Users[i].id);
          this.Users[i].hours = 0;
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < this.Users[i].records.length; j++) {
            this.Users[i].hours += Number(this.Users[i].records[j].iloscGodzin);
          }
        }
      }
    });
  }

  // Delete Raport
  deleteRaport(id) {
    if (window.confirm('Are you sure, you want to delete?')){
      this.restApi.deleteRaport(id).subscribe(data => {
        this.loadList( this.receivedCurrentDate );
      });
    }
  }

  // edit Raport
  editRaport(id) {
    this.sendEditId.emit( id );
  }

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  toggleClass( e, className: string ) {

  }
}
