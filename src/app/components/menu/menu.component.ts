import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AuthService} from '../../helpers/auth.service';
import {Profil} from '../../shared/profil';
import {ConfigData} from '../../shared/ConfigData';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass', './../../app.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {
  items: MenuItem[];
  activeItem: MenuItem;
  token: string;
  user: Profil;
  logedUser: Profil;
  tabs: any[];

  constructor(
    private authService: AuthService,
    private servService: ApiService
  ) {
    this.token = authService.getToken();
    this.user = JSON.parse(localStorage.getItem('user'));
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
  }

  ngOnInit(): void {
    this.getTabs();
    this.items = [
      {label: 'Home', icon: 'pi pi-fw pi-home', routerLink: 'home'},
      {label: 'Raporty', icon: 'pi pi-fw pi-file', routerLink: 'raporty'},
      {label: 'Urlop', icon: 'pi pi-fw pi-calendar', routerLink: 'urlopy'},
      {label: 'Marketing', icon: 'pi pi-fw pi-tag', items: [
          {label: 'Wypożyczenia', icon: 'pi pi-fw pi-tag', routerLink: 'marketing-wyp'},
          {label: 'Magazyn', icon: 'pi pi-fw pi-list', routerLink: 'marketing-mag'},
          {label: 'Współpraca', icon: 'pi pi-fw pi-user', routerLink: 'marketing-prof'},
        ]
      },
      {label: 'Dokumenty', icon: 'pi pi-folder-open', items: [
          {label: 'Zamówienia', icon: 'pi pi-shopping-cart', items: this.tabs},
          {label: 'Faktury', icon: 'pi pi-file', items: [
            {label: 'Proformy', icon: 'pi pi-file', routerLink: 'invoices', fragment: 'tab=pro'},
            {label: 'VAT', icon: 'pi pi-file', routerLink: 'invoices', fragment: 'tab=vat'},
            {label: 'Korekty', icon: 'pi pi-file', routerLink: 'invoices', fragment: 'tab=kor'},
          ]},
        ]
      },
      {label: 'Baza produktów', icon: 'pi pi-bars', items: [
          {label: 'Produkty', icon: 'pi pi-th-large', routerLink: 'produkty'},
          {label: 'Dostawy', icon: 'pi pi-truck', routerLink: 'shipping'},
        ]
      },
      {label: 'Baza klientów', icon: 'pi pi-users', items: [
          {label: 'Hurtowi', icon: 'pi pi-id-card', routerLink: 'wholesaler'},
          {label: 'Wpłaty', icon: 'pi pi-money-bill', routerLink: 'deposits'},
        ]
      },
      //{label: 'Zadania', icon: 'pi pi-bars', routerLink: 'zadania'}
    ];
    if ( this.logedUser.dostep.toString() === '1' ) {
      this.items.push(
        {label: 'Administracja', icon: 'pi pi-fw pi-tag', items: [
          {label: 'Profile', icon: 'pi pi-users', routerLink: 'profile'},
          {label: 'Uprawnienia', icon: 'pi pi-user-edit', routerLink: 'privilages'},
          {label: 'Ustawienia', icon: 'pi pi-sliders-h', routerLink: 'ustawienia'},
          {label: 'Statystyki', icon: 'pi pi-chart-line', routerLink: 'statystyki'}
        ]}
      );
    }
    this.items.push(
      {label: 'LogOut: ' + this.token, icon: 'margin-my pi pi-minus-circle', command: () => this.logout()}
    );
    this.activeItem = this.items[0];
  }
  
  getTabs(){
    this.tabs=[];
    this.servService.getConfigData({
      where: 'type="orderTab" AND language="'+this.logedUser.language+'"',
      order: 'value ASC'
    }).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        let temp: any = new ConfigData(res[i]);
        temp.label = JSON.parse(temp.label);
        this.tabs.push({
          label: temp.label.name,
          icon: temp.label.icon,
          routerLink: 'orders',
          fragment: 'tab='+temp.value
        });
      }
    });
  }

  logout(){
    this.authService.logout();
  }
}
