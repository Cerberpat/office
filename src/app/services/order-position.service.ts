import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Profil } from '../shared/profil';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {Order} from '../shared/Order';
import {OrderPosition} from '../shared/OrderPosition';
import {DocumentItem} from '../shared/DocumentItem';

@Injectable({
  providedIn: 'root'
})
export class OrderPositionService {
  user: Profil;
  addParams: string;

  // Define API
  apiURL = 'https://apioffice.next77.pl';

  constructor(private http: HttpClient) {
    this.user = JSON.parse(localStorage.getItem('LoggedInUser'));
    /*if(window.location.host.includes('localhost')){
      this.apiURL = 'http://localhost:3000';
    }*/
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

  create(orderPosition): Observable<OrderPosition> {
    return this.http.post<OrderPosition>(
      this.apiURL + '/order-positions', JSON.stringify(orderPosition), this.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getList( params ): Observable<[OrderPosition]> {
    return this.http.get<[OrderPosition]>(
      this.apiURL + '/order-positions/setNr/' + params.setNr
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getOne( id ): Observable<OrderPosition> {
    return this.http.get<OrderPosition>(
      this.apiURL + '/order-positions/' + id
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  update(id, order): Observable<OrderPosition> {
    return this.http.patch<OrderPosition>(
      this.apiURL + '/order-positions/' + id, JSON.stringify(order), this.httpOptions
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
