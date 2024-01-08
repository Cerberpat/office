import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {ConfirmationService} from 'primeng';
import {Profil} from '../../shared/profil';

@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.sass']
})
export class MarketingComponent implements OnInit {
  logedUser: Profil;

  constructor( private servService: ApiService, private confirmationService: ConfirmationService ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
  }

  ngOnInit(): void {
  }

}
