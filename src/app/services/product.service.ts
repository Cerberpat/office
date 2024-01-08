import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Profil } from '../shared/profil';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {Product} from '../shared/product';
import {ProductNames} from '../shared/productNames';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  user: Profil;
  addParams: string;

  // Define API
  apiURL = 'https://office.next77.pl/RestApi';

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
      this.apiURL + '/Produkt/update.php?user=' + this.user.id + '&id=' + id, JSON.stringify(produkt), this.httpOptions
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

  getProduktyNazwy(): Observable<[ProductNames]> {
    return this.http.get<[ProductNames]>(
      this.apiURL + '/ProduktNazwy/read.php'
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
