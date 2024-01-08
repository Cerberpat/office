import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Profil } from '../shared/profil';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {Router} from '@angular/router';
import {TransportCompany} from '../shared/TransportCompany';

@Injectable({
  providedIn: 'root'
})
export class TransportCompanyService {
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

  create(data): Observable<TransportCompany> {
    return this.http.post<TransportCompany>(
      this.apiURL + '/transport-company',
      JSON.stringify(data),
      this.httpOptions
    )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Orders
  getList( params: any={} ): Observable<[TransportCompany]> {
    return this.http.get<[TransportCompany]>(
      this.apiURL + '/transport-company',
      {
        params: params
      }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getOne( id ): Observable<TransportCompany> {
    return this.http.get<TransportCompany>(
      this.apiURL + '/transport-company/' + id
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  update(id, data): Observable<TransportCompany> {
    return this.http.patch<TransportCompany>(
      this.apiURL + '/transport-company/' + id,
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
