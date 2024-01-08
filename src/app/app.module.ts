import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MenuComponent } from './components/menu/menu.component';
import { HomeComponent } from './components/home/home.component';
import { RaportComponent } from './components/raport/raport.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ButtonModule} from 'primeng/button';
import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import { UrlopyComponent } from './components/urlopy/urlopy.component';
import { HttpClientModule } from '@angular/common/http';
import { RaportCreateComponent } from './components/raport/raport-create/raport-create.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SpinnerModule} from 'primeng/spinner';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { RaportListaComponent } from './components/raport/raport-lista/raport-lista.component';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import {AuthGuard} from './helpers/auth.guard';
import {AuthService} from './helpers/auth.service';
import {ConstantsService} from './services/constants.service';
import { FullCalendarModule } from 'primeng/fullcalendar';
import {
  DialogModule,
  DropdownModule,
  FieldsetModule, FileUploadModule, InputNumberModule, InputSwitchModule, InputTextModule, LightboxModule,
  MenubarModule,
  MultiSelectModule, OverlayPanelModule,
  PaginatorModule, PanelModule,
  SliderModule
} from 'primeng';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {GalleriaModule} from 'primeng/galleria';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {ListboxModule} from 'primeng/listbox';
import { MarketingComponent } from './components/marketing/marketing.component';
import { MarketingWypComponent } from './components/marketing/marketing-wyp/marketing-wyp.component';
import { MarketingMagComponent } from './components/marketing/marketing-mag/marketing-mag.component';
import { MarketingProfComponent } from './components/marketing/marketing-prof/marketing-prof.component';
import { EditProfComponent } from './components/marketing/marketing-prof/edit-prof/edit-prof.component';
import { DodatkowyAdresComponent } from './components/shared/dodatkowy-adres/dodatkowy-adres.component';
import { PlikiComponent } from './components/shared/pliki/pliki.component';
import { ProfileComponent } from './components/administracja/profile/profile.component';
import { UstawieniaComponent } from './components/administracja/ustawienia/ustawienia.component';
import { PrzelozeniComponent } from './components/administracja/ustawienia/przelozeni/przelozeni.component';
import { SwietaComponent } from './components/administracja/ustawienia/swieta/swieta.component';
import { GodzinoweComponent } from './components/urlopy/godzinowe/godzinowe.component';
import { IloscDniComponent } from './components/urlopy/ilosc-dni/ilosc-dni.component';
import { EditMagComponent } from './components/marketing/marketing-mag/edit-mag/edit-mag.component';
import { HistoriaComponent } from './components/shared/historia/historia.component';
import { ZmianyIlosciComponent } from './components/shared/zmiany-ilosci/zmiany-ilosci.component';
import { EditWypComponent } from './components/marketing/marketing-wyp/edit-wyp/edit-wyp.component';
import { WypPozComponent } from './components/marketing/marketing-wyp/wyp-poz/wyp-poz.component';
import { AddWypComponent } from './components/marketing/marketing-wyp/add-wyp/add-wyp.component';
import { ZadaniaComponent } from './components/zadania/zadania.component';
import {NgxTimeSchedulerModule} from 'ngx-time-scheduler';
import { FormZadanieComponent } from './components/zadania/form-zadanie/form-zadanie.component';
import { TooltipModule } from 'primeng/tooltip';
import { PrintUrlopComponent } from './components/urlopy/print-urlop/print-urlop.component';
import {NgxPrintModule} from 'ngx-print';
import { PassworsResetComponent } from './components/administracja/profile/passwors-reset/passwors-reset.component';
import { ProfilfFormComponent } from './components/administracja/profile/profilf-form/profilf-form.component';
import { ProduktyComponent } from './components/produkty/produkty.component';
import { ColumnEditorComponent } from './components/column-editor/column-editor.component';
import {PickListModule} from 'primeng/picklist';
import { ProduktyEditComponent } from './components/produkty/produkty-edit/produkty-edit.component';
import { StatystykiComponent } from './components/administracja/statystyki/statystyki.component';
import { WholesalersComponent } from './components/customers-database/wholesalers/wholesalers.component';
import { FormWholesalersComponent } from './components/customers-database/wholesalers/form-wholesalers/form-wholesalers.component';
import { OrdersComponent } from './components/documents/orders/orders/orders.component';
import { OrderFormComponent } from './components/documents/orders/order-form/order-form.component';
import { InvoicesComponent } from './components/documents/invoices/invoices/invoices.component';
import { InvoiceFormComponent } from './components/documents/invoices/invoice-form/invoice-form.component';
import { ProductSuggestComponent } from './components/documents/product-suggest/product-suggest.component';
import { ProductListComponent } from './components/documents/product-list/product-list.component';
import { FiltersComponent } from './components/shared/filters/filters/filters.component';
import {ShippingComponent} from './components/shipping/shipping.component';
import {DialogService} from 'primeng/dynamicdialog';
import { ShippingFormComponent } from './components/shipping/shipping-form/shipping-form.component';
import { ShippingSplitComponent } from './components/shipping/shipping-split/shipping-split.component';
import { GodzinyNadliczboweComponent } from './components/urlopy/godziny-nadliczbowe/godziny-nadliczbowe.component';
import { ShippingPositionsComponent } from './components/shipping/shipping-positions/shipping-positions.component';
import { ShippingArchiveComponent } from './components/shipping/shipping-archive/shipping-archive.component';
import {PrivilagesComponent} from './components/privilages/privilages.component';
import { PrivilagesFormComponent } from './components/privilages/privilages-form/privilages-form.component';
import { DepositsComponent } from './components/deposits/deposits.component';
import { DepositsSplitComponent } from './components/deposits/deposits-split/deposits-split.component';
import { DepositsSplitPositionsComponent } from './components/deposits/deposits-split-positions/deposits-split-positions.component';
import { DocumentLinksComponent } from './components/shared/document-links/document-links.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    HomeComponent,
    RaportComponent,
    LoginComponent,
    UrlopyComponent,
    RaportCreateComponent,
    RaportListaComponent,
    MarketingComponent,
    MarketingWypComponent,
    MarketingMagComponent,
    MarketingProfComponent,
    EditProfComponent,
    DodatkowyAdresComponent,
    PlikiComponent,
    ProfileComponent,
    UstawieniaComponent,
    PrzelozeniComponent,
    SwietaComponent,
    GodzinoweComponent,
    IloscDniComponent,
    EditMagComponent,
    HistoriaComponent,
    ZmianyIlosciComponent,
    EditWypComponent,
    WypPozComponent,
    AddWypComponent,
    ZadaniaComponent,
    FormZadanieComponent,
    PrintUrlopComponent,
    PassworsResetComponent,
    ProfilfFormComponent,
    ProduktyComponent,
    ColumnEditorComponent,
    ProduktyEditComponent,
    StatystykiComponent,
    WholesalersComponent,
    FormWholesalersComponent,
    OrdersComponent,
    OrderFormComponent,
    InvoicesComponent,
    InvoiceFormComponent,
    ProductSuggestComponent,
    ProductListComponent,
    FiltersComponent,
    ShippingComponent,
    ShippingFormComponent,
    ShippingSplitComponent,
    GodzinyNadliczboweComponent,
    ShippingPositionsComponent,
    ShippingArchiveComponent,
    PrivilagesComponent,
    PrivilagesFormComponent,
    DepositsComponent,
    DepositsSplitComponent,
    DepositsSplitPositionsComponent,
    DocumentLinksComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ButtonModule,
    TabMenuModule,
    TabViewModule,
    HttpClientModule,
    FormsModule,
    SpinnerModule,
    InputTextareaModule,
    CalendarModule,
    TableModule,
    ToastModule,
    ReactiveFormsModule,
    FullCalendarModule,
    SliderModule,
    MultiSelectModule,
    DropdownModule,
    FieldsetModule,
    ConfirmDialogModule,
    DialogModule,
    ListboxModule,
    MenubarModule,
    PaginatorModule,
    InputTextModule,
    FileUploadModule,
    PanelModule,
    LightboxModule,
    GalleriaModule,
    OverlayPanelModule,
    InputNumberModule,
    NgxTimeSchedulerModule,
    TooltipModule,
    NgxPrintModule,
    PickListModule,
    ProgressSpinnerModule,
    InputSwitchModule,
  ],
  providers: [AuthService, AuthGuard, DialogService, ConstantsService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule {}
