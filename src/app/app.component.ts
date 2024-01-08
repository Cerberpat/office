import {Component, OnChanges} from '@angular/core';
import {AuthService} from './helpers/auth.service';
import localePl from '@angular/common/locales/pl';
import {registerLocaleData} from '@angular/common';
registerLocaleData(localePl, 'pl-PL');

// @ts-ignore
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnChanges {
  title = 'zadania';
  token: string;

  constructor(private authService: AuthService){
    this.token = authService.getToken();
  }

  ngOnChanges() {
  }

  log( data ){
    console.log('token: '+data);
  }
}
