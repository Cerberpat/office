import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Profil } from '../shared/profil';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {Router} from '@angular/router';
import {PaymentMethod} from '../shared/PaymentMethod';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {
  user: Profil;
  addParams: string;

  // Define API
  apiURL = 'https://apioffice.next77.pl';


  constructor(private http: HttpClient, private router: Router) {
    this.user = JSON.parse(localStorage.getItem('LoggedInUser'));
    if(window.location.host.includes('localhost')){
      this.apiURL = 'http://localhost:3000';
    }
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

  create(data): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(
      this.apiURL + '/payment-method',
      JSON.stringify(data),
      this.httpOptions
    )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Orders
  getList( params: any={} ): Observable<[PaymentMethod]> {
    return this.http.get<[PaymentMethod]>(
      this.apiURL + '/payment-method',
      {
        params: params
      }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getOne( id ): Observable<PaymentMethod> {
    return this.http.get<PaymentMethod>(
      this.apiURL + '/payment-method/' + id
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  update(id, data): Observable<PaymentMethod> {
    return this.http.patch<PaymentMethod>(
      this.apiURL + '/payment-method/' + id,
      JSON.stringify(data),
      this.httpOptions
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
