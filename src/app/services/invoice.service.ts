import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Profil } from '../shared/profil';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {Order} from '../shared/Order';
import {Router} from '@angular/router';
import {Invoice} from '../shared/Invoice';
import {Shipping} from '../shared/Shipping';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  user: Profil;
  addParams: string;

  // Define API
  apiURL = 'https://apioffice.next77.pl';


  constructor(private http: HttpClient, private router: Router) {
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

  createInvoices(invoice): Observable<Invoice> {
    return this.http.post<Invoice>(
      this.apiURL + '/invoices',
      JSON.stringify(invoice),
      this.httpOptions
    )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getInvoices( params ): Observable<[Invoice]> {
    return this.http.get<[Invoice]>(
      this.apiURL + '/invoices',
      {
        params: params
      }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getInvoice( id ): Observable<Invoice> {
    return this.http.get<Invoice>(
      this.apiURL + '/invoices/' + id
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateInvoice(id, invoice): Observable<Invoice> {
    return this.http.patch<Invoice>(
      this.apiURL + '/invoices/' + id,
      JSON.stringify(invoice),
      this.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteInvoice( id: number ) {
    return this.http.delete<boolean>(this.apiURL + '/invoices?id='+id, this.httpOptions)
      .pipe(
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
