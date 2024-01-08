import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Profil } from '../shared/profil';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {Order} from '../shared/Order';
import {Router} from '@angular/router';
import {PrivilageShema} from '../shared/PrivilageShema';
import {OrderStatus} from '../shared/OrderStatus';
import {Wholeseller} from '../shared/Wholeseller';

@Injectable({
  providedIn: 'root'
})
export class WholesellerService {
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

  create(data): Observable<Wholeseller> {
    return this.http.post<Wholeseller>(
      this.apiURL + '/wholeseller',
      JSON.stringify(data),
      this.httpOptions
    )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Orders
  get( params ): Observable<[Wholeseller]> {
    for (const property in params) {
      if( typeof params[property] === 'object' && params[property] !== null ){
        params[property] = JSON.stringify(params[property]);
      }
    }
    return this.http.get<[Wholeseller]>(
      this.apiURL + '/wholeseller',
      {
        params: params,
      }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getOne( id ): Observable<Wholeseller> {
    return this.http.get<Wholeseller>(
      this.apiURL + '/wholeseller/' + id
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  update(id, data): Observable<Wholeseller> {
    return this.http.patch<Wholeseller>(
      this.apiURL + '/wholeseller/' + id,
      JSON.stringify(data),
      this.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  delete( id: number ) {
    return this.http.delete<boolean>(
      this.apiURL + '/wholeseller/'+id,
      this.httpOptions)
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
