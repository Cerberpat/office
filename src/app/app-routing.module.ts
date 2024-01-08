import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {RaportComponent} from './components/raport/raport.component';
import {UrlopyComponent} from './components/urlopy/urlopy.component';
import {LoginComponent} from './components/login/login.component';
import {AuthGuard} from './helpers/auth.guard';
import {MarketingComponent} from './components/marketing/marketing.component';
import {MarketingWypComponent} from './components/marketing/marketing-wyp/marketing-wyp.component';
import {MarketingMagComponent} from './components/marketing/marketing-mag/marketing-mag.component';
import {MarketingProfComponent} from './components/marketing/marketing-prof/marketing-prof.component';
import {ProfileComponent} from './components/administracja/profile/profile.component';
import {UstawieniaComponent} from './components/administracja/ustawienia/ustawienia.component';
import {ZadaniaComponent} from './components/zadania/zadania.component';
import {ProduktyComponent} from './components/produkty/produkty.component';
import {StatystykiComponent} from './components/administracja/statystyki/statystyki.component';
import {WholesalersComponent} from './components/customers-database/wholesalers/wholesalers.component';
import {OrdersComponent} from './components/documents/orders/orders/orders.component';
import {InvoicesComponent} from './components/documents/invoices/invoices/invoices.component';
import {ShippingComponent} from './components/shipping/shipping.component';
import {PrivilagesComponent} from './components/privilages/privilages.component';
import {DepositsComponent} from './components/deposits/deposits.component';


const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'raporty', component: RaportComponent, canActivate: [AuthGuard] },
  { path: 'urlopy', component: UrlopyComponent, canActivate: [AuthGuard] },
  { path: 'marketing', component: MarketingComponent, canActivate: [AuthGuard] },
  { path: 'marketing-wyp', component: MarketingWypComponent, canActivate: [AuthGuard] },
  { path: 'marketing-mag', component: MarketingMagComponent, canActivate: [AuthGuard] },
  { path: 'marketing-prof', component: MarketingProfComponent, canActivate: [AuthGuard] },
  { path: 'produkty', component: ProduktyComponent, canActivate: [AuthGuard] },
  { path: 'shipping', component: ShippingComponent, canActivate: [AuthGuard] },
  { path: 'zadania', component: ZadaniaComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'privilages', component: PrivilagesComponent, canActivate: [AuthGuard] },
  { path: 'ustawienia', component: UstawieniaComponent, canActivate: [AuthGuard] },
  { path: 'statystyki', component: StatystykiComponent, canActivate: [AuthGuard] },
  { path: 'wholesaler', component: WholesalersComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'invoices', component: InvoicesComponent, canActivate: [AuthGuard] },
  { path: 'deposits', component: DepositsComponent, canActivate: [AuthGuard] },
  { path: 'home', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
