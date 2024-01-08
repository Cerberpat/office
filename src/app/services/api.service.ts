import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Profil } from '../shared/profil';
import { Raport } from '../shared/raport';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Md5 } from 'ts-md5/dist/md5';
import {Urlop} from '../shared/urlop';
import {Swieto} from '../shared/swieto';
import {MarketingProf} from '../shared/marketingProf';
import {Country} from '../shared/Country';
import {Adres} from '../shared/adres';
import {UrlopGodzinowy} from '../shared/urlopGodzinowy';
import {CategoryNames} from '../shared/CategoryNames';
import {MarketingMag} from '../shared/marketingMag';
import {SimpleData} from '../shared/simpleData';
import {MarketingWyp} from '../shared/marketingWyp';
import {MarketingWypPoz} from '../shared/marketingWypPoz';
import {Zadania} from '../shared/zadania';
import {Product} from '../shared/product';
import {ProductNames} from '../shared/productNames';
import {Column} from '../shared/Column';
import {ColumnChosen} from '../shared/ColumnChosen';
import {ConfigData} from '../shared/ConfigData';
import {Wholeseller} from '../shared/Wholeseller';
import {Company} from '../shared/Company';
import {CompressedData} from '../shared/CompressedData';
import {Order} from '../shared/Order';
import {Invoice} from '../shared/Invoice';
import {DocumentItem} from '../shared/DocumentItem';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  user: Profil;
  addParams: string;

  // Define API
  apiURL = 'https://office.next77.pl/RestApi';
  apiURL_2 = 'http://localhost:3000/';
  // apiURL = 'http://localhost/RestApi';

  constructor(private http: HttpClient) {
    this.user = JSON.parse(localStorage.getItem('LoggedInUser'));
  }

  /*========================================
    CRUD Methods for consuming RESTful API
  =========================================*/

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  private addParam: string;

  // CONFIG
  getConfigData(params): Observable<[ConfigData]> {
    this.addParams='';
    if( Object.keys(params).length>0 ){
      this.addParams='?';
      for (var key in params) {
        if( this.addParams!=='?' ){
          this.addParams = this.addParams+'&';
        }
        this.addParams = this.addParams+key+'='+params[key];
      }
    }
    return this.http.get<[ConfigData]>(this.apiURL + '/configData/read.php'+this.addParams)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // PROFILE
  /*getProfils( rok = '' ): Observable<[Profil]> {
    if ( rok !== '' ) {
      rok = '?rok=' + rok;
    }
    return this.http.get<[Profil]>(this.apiURL + '/Profils/read.php' + rok)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }*/
  getProfils( params = {} ): Observable<[Profil]> {
    this.addParams='';
    if( Object.keys(params).length>0 ){
      this.addParams='?';
      for (var key in params) {
        if( this.addParams!=='?' ){
          this.addParams = this.addParams+'&';
        }
        this.addParams = this.addParams+key+'='+params[key];
      }
    }
    return this.http.get<[Profil]>(this.apiURL + '/Profils/read.php' + this.addParams)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getProfil(id): Observable<Profil> {
    return this.http.get<Profil>(this.apiURL + '/Profils/read_one.php?id=' + id)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getProfilLogin(login, haslo): Observable<Profil> {
    const hash = Md5.hashStr(haslo);
    return this.http.get<Profil>(this.apiURL + '/Profils/read_login.php?login=' + login + '&haslo=' + hash )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  createProfil(profil): Observable<Profil> {
    return this.http.post<Profil>(this.apiURL + '/Profils/create.php', JSON.stringify(profil), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  updateProfil(id, profil, rok = ''): Observable<Profil> {
    if ( rok !== '' ) {
      rok = '&rok=' + rok;
    }
    // tslint:disable-next-line:max-line-length
    return this.http.put<Profil>(this.apiURL + '/Profils/update.php?user=' + this.user.id + '&id=' + id + rok, JSON.stringify(profil), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  updateProfilUrlopy(id, profil, rok = ''): Observable<Profil> {
    if ( rok !== '' ) {
      rok = '&rok=' + rok;
    }
    // tslint:disable-next-line:max-line-length
    return this.http.put<Profil>(this.apiURL + '/Profils/updateUrlopy.php?user=' + this.user.id + '&id=' + id + rok, JSON.stringify(profil), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  deleteProfil(id){
    return this.http.delete<Profil>(this.apiURL + '/Profils/delete.php?id=' + id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // RAPORTY
  getRaports( dataStart, dataStop, profile, fraza ): Observable<Raport> {
    this.addParam = '';
    if ( dataStart !== '' && dataStop !== '' ){
      this.addParam = '?dataStart=' + dataStart + '&dataStop=' + dataStop + profile + '&fraza=' + fraza;
    }
    if ( this.user.dostep.toString() !== '1' ){
      this.addParam = this.addParam + '&dodal=' + this.user.id;
    }
    return this.http.get<Raport>(this.apiURL + '/Raports/read.php' + this.addParam)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getRaport(id): Observable<Raport> {
    return this.http.get<Raport>(this.apiURL + '/Raports/read_one.php?id=' + id)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  createRaport(raport): Observable<Raport> {
    return this.http.post<Raport>(this.apiURL + '/Raports/create.php', raport, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  updateRaport(id, raport): Observable<Raport> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<Raport>(this.apiURL + '/Raports/update.php?user=' + this.user.id + '&id=' + id, JSON.stringify(raport), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  deleteRaport(id){
    return this.http.delete<Raport>(this.apiURL + '/Raports/delete.php?user=' + this.user.id + '&id=' + id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // URLOPY
  getUrlopy( get ): Observable<[Urlop]> {
    if ( get === undefined ) {
      get = '';
    }
    return this.http.get<[Urlop]>(this.apiURL + '/Urlopy/read.php' + get )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getUrlopyCalendar( get ): Observable<any> {
    if ( get === undefined ) {
      get = '';
    }
    return this.http.get<any>(this.apiURL + '/Urlopy/readCalendar.php' + get )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getUrlop(id): Observable<Urlop> {
    return this.http.get<Urlop>(this.apiURL + '/Urlopy/read_one.php?id=' + id)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  createUrlop(raport): Observable<Urlop> {
    return this.http.post<Urlop>(this.apiURL + '/Urlopy/create.php', raport, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  updateUrlop(id, urlop): Observable<Urlop> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<Urlop>(this.apiURL + '/Urlopy/update.php?user=' + this.user.id + '&id=' + id, JSON.stringify(urlop), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  deleteUrlop(id){
    return this.http.delete<Urlop>(this.apiURL + '/Urlopy/delete.php?id=' + id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getGodzinowe( get ): Observable<UrlopGodzinowy> {
    if ( get === undefined ) {
      get = '';
    }
    return this.http.get<UrlopGodzinowy>(this.apiURL + '/UrlopyGodziny/read.php' + get )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  createGodzinowy(obj): Observable<UrlopGodzinowy> {
    return this.http.post<UrlopGodzinowy>(this.apiURL + '/UrlopyGodziny/create.php', obj, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  updateGodzinowy(id, obj): Observable<UrlopGodzinowy> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<UrlopGodzinowy>(this.apiURL + '/UrlopyGodziny/update.php?user=' + this.user.id + '&id=' + id, JSON.stringify(obj), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }


  // ŚWIĘTA
  getSwieta(): Observable<Swieto> {
    return this.http.get<Swieto>(this.apiURL + '/Swieta/read.php' )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getSwieto(id): Observable<Swieto> {
    return this.http.get<Swieto>(this.apiURL + '/Swieta/read_one.php?id=' + id)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  createSwieto(swieto): Observable<Swieto> {
    return this.http.post<Swieto>(this.apiURL + '/Swieta/create.php', swieto, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  updateSwieto(id, swieto): Observable<Swieto> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<Swieto>(this.apiURL + '/Swieta/update.php?user=' + this.user.id + '&id=' + id, JSON.stringify(swieto), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  deleteSwieto(id){
    return this.http.delete<Swieto>(this.apiURL + '/Swieta/delete.php?user=' + this.user.id + '&id=' + id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // MARKETING PROFILE
  getMarketingProfs(): Observable<MarketingProf> {
    return this.http.get<MarketingProf>(this.apiURL + '/Marketing/prof/read.php')
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getMarketingProfsPagin( filters ){
    let addWhere = '';
    addWhere = this.checkAddWhere( addWhere, 'global', filters.global );
    addWhere = this.checkAddWhere( addWhere, 'page', filters.page );
    addWhere = this.checkAddWhere( addWhere, 'perPage', filters.perPage );
    console.log(filters);
    console.log(addWhere);
    return this.http.get<MarketingProf>(this.apiURL + '/Marketing/prof/read_paging.php' + addWhere)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getMarketingProf(id): Observable<MarketingProf> {
    return this.http.get<MarketingProf>(this.apiURL + '/Marketing/prof/read_one.php?id=' + id)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  createMarketingProf(profil): Observable<MarketingProf> {
    return this.http.post<MarketingProf>(this.apiURL + '/Marketing/prof/create.php', JSON.stringify(MarketingProf), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  updateMarketingProf(id, profil): Observable<MarketingProf> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<MarketingProf>(this.apiURL + '/Marketing/prof/update.php?user=' + this.user.id + '&id=' + id, JSON.stringify(profil), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  deleteMarketingProf(id){
    return this.http.delete<MarketingProf>(this.apiURL + '/Marketing/prof/delete.php?user=' + this.user.id + '&id=' + id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }


  // MARKETING MAGAZYN
  getMarketingMags(): Observable<MarketingMag> {
    return this.http.get<MarketingMag>(this.apiURL + '/Marketing/mag/read.php')
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getMarketingMagPagin(){
    return this.http.get<MarketingMag>(this.apiURL + '/Marketing/mag/read_paging.php')
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getMarketingMag(id): Observable<MarketingMag> {
    return this.http.get<MarketingMag>(this.apiURL + '/Marketing/mag/read_one.php?id=' + id)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  createMarketingMag(mag): Observable<MarketingMag> {
    return this.http.post<MarketingMag>(this.apiURL + '/Marketing/mag/create.php', JSON.stringify(mag), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  updateMarketingMag(id, data): Observable<MarketingMag> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<MarketingMag>(this.apiURL + '/Marketing/mag/update.php?user=' + this.user.id + '&id=' + id, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  deleteMarketingMag(id){
    return this.http.delete<MarketingMag>(this.apiURL + '/Marketing/mag/delete.php?user=' + this.user.id + '&id=' + id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // MARKETING WYPOZYCZENIA
  getMarketingWyps(): Observable<MarketingWyp> {
    return this.http.get<MarketingWyp>(this.apiURL + '/Marketing/wyp/read.php')
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getMarketingWypPagin(){
    return this.http.get<MarketingWyp>(this.apiURL + '/Marketing/wyp/read_paging.php')
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getMarketingWyp(id): Observable<MarketingWyp> {
    return this.http.get<MarketingWyp>(this.apiURL + '/Marketing/wyp/read_one.php?id=' + id)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  createMarketingWyp(data): Observable<MarketingWyp> {
    return this.http.post<MarketingWyp>(this.apiURL + '/Marketing/wyp/create.php', JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  updateMarketingWyp(id, data): Observable<MarketingWyp> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<MarketingWyp>(this.apiURL + '/Marketing/wyp/update.php?user=' + this.user.id + '&id=' + id, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  deleteMarketingWyp(id){
    return this.http.delete<MarketingWyp>(this.apiURL + '/Marketing/wyp/delete.php?user=' + this.user.id + '&id=' + id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // MARKETING WYPOZYCZENIA POZYCJE
  getMarketingWypPozs( id ): Observable<MarketingWypPoz> {
    return this.http.get<MarketingWypPoz>(this.apiURL + '/Marketing/wypPoz/read.php?id=' + id)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getMarketingWypPozPagin(){
    return this.http.get<MarketingWypPoz>(this.apiURL + '/Marketing/wypPoz/read_paging.php')
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getMarketingWypPoz(id): Observable<MarketingWypPoz> {
    return this.http.get<MarketingWypPoz>(this.apiURL + '/Marketing/wypPoz/read_one.php?id=' + id)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  createMarketingWypPoz(data): Observable<MarketingWypPoz> {
    return this.http.post<MarketingWypPoz>(this.apiURL + '/Marketing/wypPoz/create.php', JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  updateMarketingWypPoz(id, data): Observable<MarketingWypPoz> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<MarketingWypPoz>(this.apiURL + '/Marketing/wypPoz/update.php?user=' + this.user.id + '&id=' + id, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  deleteMarketingWypPoz(id){
    return this.http.delete<MarketingWypPoz>(this.apiURL + '/Marketing/wypPoz/delete.php?id=' + id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // KRAJE
  getKraje( params ): Observable<[Country]> {
    this.addParams='';
    if( Object.keys(params).length>0 ){
      this.addParams='?';
      for (var key in params) {
        if( this.addParams!=='?' ){
          this.addParams = this.addParams+'&';
        }
        this.addParams = this.addParams+key+'='+params[key];
      }
    }
    return this.http.get<[Country]>(
      this.apiURL + '/Kraje/read.php'+this.addParams
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  getKraj(id): Observable<Country> {
    return this.http.get<Country>(this.apiURL + '/Kraje/read_one.php?id=' + id)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // KATEGORIE
  getCategoryNames( lang = null ): Observable<[CategoryNames]> {
    let add = '';
    if ( lang !== null ) {
      add = '?lang='+lang;
    }else{
      add = '?lang=PL';
    }
    return this.http.get<[CategoryNames]>(this.apiURL + '/KategorieNazwa/read.php' + add )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getCategoryName(id): Observable<CategoryNames> {
    return this.http.get<CategoryNames>(this.apiURL + '/KategorieNazwa/read_one.php?id=' + id)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // ADRESY
  getAdresy(pochodzenie, pochodzenieId): Observable<Adres> {
    return this.http.get<Adres>(this.apiURL + '/Adresy/read.php?pochodzenie=' + pochodzenie + '&pochodzenieId=' + pochodzenieId)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getAdres(id): Observable<Adres> {
    return this.http.get<Adres>(this.apiURL + '/Adresy/read_one.php?id=' + id)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  createAdres(adres): Observable<Adres> {
    return this.http.post<Adres>(this.apiURL + '/Adresy/create.php', JSON.stringify(adres), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  updateAdres(id, adres): Observable<Adres> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<Adres>(this.apiURL + '/Adresy/update.php?user=' + this.user.id + '&id=' + id, JSON.stringify(adres), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // PLIKI
  getPliki(pochodzenie, pochodzenieId): Observable<any> {
    return this.http.get<any>(this.apiURL + '/Pliki/read.php?pochodzenie=' + pochodzenie + '&pochodzenieId=' + pochodzenieId)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  deletePliki(nazwa, pochodzenie, pochodzenieId): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<any>(this.apiURL + '/Pliki/delete.php?nazwa=' + nazwa + '&pochodzenie=' + pochodzenie + '&pochodzenieId=' + pochodzenieId, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Zadania
  getZadaniaSchedule(): Observable<Zadania> {
    return this.http.get<Zadania>(this.apiURL + '/Zadania/readSchedule.php')
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getZadania(get= ''): Observable<[Zadania]> {
    if ( get === undefined ) {
      get = '';
    }
    return this.http.get<[Zadania]>(this.apiURL + '/Zadania/read.php' + get)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getZadanie(id): Observable<Zadania> {
    return this.http.get<Zadania>(this.apiURL + '/Zadania/read_one.php?id=' + id)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  createZadania(zadanie): Observable<Zadania> {
    return this.http.post<Zadania>(this.apiURL + '/Zadania/create.php', JSON.stringify(zadanie), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  updateZadania(id, zadanie): Observable<Zadania> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<Zadania>(this.apiURL + '/Zadania/update.php?user=' + this.user.id + '&id=' + id, JSON.stringify(zadanie), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  updateSortowanie( lista ): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<any>(this.apiURL + '/Zadania/updateSortowanie.php', JSON.stringify(lista), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Produkty
  createProdukt(produkt): Observable<Product> {
    return this.http.post<Product>(
      this.apiURL + '/Produkt/create.php', JSON.stringify(produkt), this.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  updateProdukt(id, produkt): Observable<Product> {
    return this.http.put<Product>(
      this.apiURL + '/Produkt/update.php?id=' + id, JSON.stringify(produkt), this.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  getProdukty( params ): Observable<[Product]> {
    this.addParams='';
    if( Object.keys(params).length>0 ){
      this.addParams='?';
      for (var key in params) {
        if( this.addParams!=='?' ){
          this.addParams = this.addParams+'&';
        }
        this.addParams = this.addParams+key+'='+params[key];
      }
    }
    console.log(this.apiURL + '/Produkt/read.php'+this.addParams);
    return this.http.get<[Product]>(
      this.apiURL + '/Produkt/read.php'+this.addParams
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  getProduktOne(id): Observable<Product> {
    return this.http.get<Product>(
      this.apiURL + '/Produkt/read_one.php?id=' + id
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  createProduktyNazwy(obj): Observable<ProductNames> {
    return this.http.post<ProductNames>(
      this.apiURL + '/ProduktNazwy/create.php', JSON.stringify(obj), this.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  getProduktyNazwy(params): Observable<[ProductNames]> {
    this.addParams='';
    if( Object.keys(params).length>0 ){
      this.addParams='?';
      for (var key in params) {
        if( this.addParams!=='?' ){
          this.addParams = this.addParams+'&';
        }
        this.addParams = this.addParams+key+'='+params[key];
      }
    }
    return this.http.get<[ProductNames]>(
      this.apiURL + '/ProduktNazwy/read.php'+this.addParams
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  updateProduktyNazwy(id, productNames): Observable<ProductNames> {
    return this.http.put<ProductNames>(
      this.apiURL + '/ProduktNazwy/update.php?id=' + id, JSON.stringify(productNames), this.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Simple Data
  createSimpleData(simpleData): Observable<SimpleData> {
    return this.http.post<SimpleData>(
      this.apiURL + '/SimpleData/create.php', JSON.stringify(simpleData), this.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  updateSimpleData(id, simpleData): Observable<SimpleData> {
    return this.http.put<SimpleData>(
      this.apiURL + '/SimpleData/update.php?user=' + this.user.id + '&id=' + id, JSON.stringify(simpleData), this.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  getSimpleData(typ, pochodzenie, pochodzenieId): Observable<SimpleData> {
    return this.http.get<SimpleData>(
      this.apiURL + '/SimpleData/read.php?typ=' + typ + '&pochodzenie=' + pochodzenie + '&pochodzenieId=' + pochodzenieId
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  getSimpleDataOne(id): Observable<SimpleData> {
    return this.http.get<SimpleData>(
      this.apiURL + '/SimpleData/read_one.php?id=' + id
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  deleteSimpleData(id): Observable<SimpleData> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<SimpleData>(this.apiURL + '/SimpleData/delete.php?id=' + id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // COLUMNS
  getColumns( params ): Observable<[Column]> {
    this.addParams='';
    if( Object.keys(params).length>0 ){
      this.addParams='?';
      for (var key in params) {
        if( this.addParams!=='?' ){
          this.addParams = this.addParams+'&';
        }
        this.addParams = this.addParams+key+'='+params[key];
      }
    }
    return this.http.get<[Column]>(
      this.apiURL + '/Columns/read.php'+this.addParams
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  getColumnsChosen( params ): Observable<[ColumnChosen]> {
    this.addParams='';
    if( Object.keys(params).length>0 ){
      this.addParams='?';
      for (var key in params) {
        if( this.addParams!=='?' ){
          this.addParams = this.addParams+'&';
        }
        this.addParams = this.addParams+key+'='+params[key];
      }
    }
    return this.http.get<[ColumnChosen]>(
      this.apiURL + '/Columns/readChosen.php'+this.addParams
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  updateColumnsChosen( lista ): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<any>(this.apiURL + '/Columns/updateChosen.php', JSON.stringify(lista), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Wholesellers
  getWholesellers( params ): Observable<[Wholeseller]> {
    this.addParams='';
    if( Object.keys(params).length>0 ){
      this.addParams='?';
      for (var key in params) {
        if( this.addParams!=='?' ){
          this.addParams = this.addParams+'&';
        }
        this.addParams = this.addParams+key+'='+params[key];
      }
    }
    return this.http.get<[Wholeseller]>(
      this.apiURL + '/Wholesellers/read.php'+this.addParams
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  updateWholeseller(id, wholeseller): Observable<Wholeseller> {
    return this.http.put<Wholeseller>(
      this.apiURL + '/Wholesellers/update.php?id=' + id, JSON.stringify(wholeseller), this.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Orders
  getOrders( params ): Observable<[Order]> {
    this.addParams='';
    if( Object.keys(params).length>0 ){
      this.addParams='?';
      for (var key in params) {
        if( this.addParams!=='?' ){
          this.addParams = this.addParams+'&';
        }
        this.addParams = this.addParams+key+'='+params[key];
      }
    }
    return this.http.get<[Order]>(
      this.apiURL + '/Orders/read.php'+this.addParams
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  updateOrder(id, order): Observable<Order> {
    return this.http.put<Order>(
      this.apiURL + '/Orders/update.php?id=' + id, JSON.stringify(order), this.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Orders
  getDocumentItems( params ): Observable<[DocumentItem]> {
    this.addParams='';
    if( Object.keys(params).length>0 ){
      this.addParams='?';
      for (var key in params) {
        if( this.addParams!=='?' ){
          this.addParams = this.addParams+'&';
        }
        this.addParams = this.addParams+key+'='+params[key];
      }
    }
    return this.http.get<[DocumentItem]>(
      this.apiURL + '/DocumentItems/read.php'+this.addParams
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  updateDocumentItem(id, item): Observable<DocumentItem> {
    return this.http.put<DocumentItem>(
      this.apiURL + '/DocumentItems/update.php?id=' + id, JSON.stringify(item), this.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  createDocumentItem(documentItem): Observable<DocumentItem> {
    return this.http.post<DocumentItem>(
      this.apiURL + '/DocumentItems/create.php', JSON.stringify(documentItem), this.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Invoices
  getInvoices( params ): Observable<[Invoice]> {
    this.addParams='';
    if( Object.keys(params).length>0 ){
      this.addParams='?';
      for (var key in params) {
        if( this.addParams!=='?' ){
          this.addParams = this.addParams+'&';
        }
        this.addParams = this.addParams+key+'='+params[key];
      }
    }
    return this.http.get<[Invoice]>(
      this.apiURL + '/Invoice/read.php'+this.addParams
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  updateInvoice(id, invoice): Observable<Invoice> {
    return this.http.put<Invoice>(
      this.apiURL + '/Orders/update.php?id=' + id, JSON.stringify(invoice), this.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }


  // Companies
  getCompanies( params ): Observable<[Company]> {
    this.addParams='';
    if( Object.keys(params).length>0 ){
      this.addParams='?';
      for (var key in params) {
        if( this.addParams!=='?' ){
          this.addParams = this.addParams+'&';
        }
        this.addParams = this.addParams+key+'='+params[key];
      }
    }
    return this.http.get<[Company]>(
      this.apiURL + '/Companies/read.php'+this.addParams
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Compressed Data
  getCompressedData( params ): Observable<[CompressedData]> {
    this.addParams='';
    if( Object.keys(params).length>0 ){
      this.addParams='?';
      for (var key in params) {
        if( this.addParams!=='?' ){
          this.addParams = this.addParams+'&';
        }
        this.addParams = this.addParams+key+'='+params[key];
      }
    }
    return this.http.get<[CompressedData]>(
      this.apiURL + '/CompressedData/read.php'+this.addParams
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }


  // HELPERS
  checkAddWhere( addWhere, colName, colVal ) {
    if ( colVal !== undefined ) {
      if ( addWhere.length === 0 ) {
        addWhere = '?';
      } else {
        addWhere = addWhere + '&';
      }
      addWhere = addWhere + colName + '=' + colVal;
    }
    return addWhere;
  }

  // ERROR HANDLER
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
