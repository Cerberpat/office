import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Profil } from '../shared/profil';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {Order} from '../shared/Order';
import {Router} from '@angular/router';
import {SetNr} from '../shared/SetNr';
import {Shipping} from '../shared/Shipping';

@Injectable({
  providedIn: 'root'
})
export class SetnrService {
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

  // Orders
  getSetNrNextNr(): Observable<number> {
    return this.http.get<number>(
      this.apiURL + '/set-nr',
      {}
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getSetNr( id ): Observable<SetNr> {
    return this.http.get<SetNr>(
      this.apiURL + '/set-nr/' + id
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateSetNr(id, setNr): Observable<SetNr> {
    return this.http.patch<SetNr>(
      this.apiURL + '/set-nr/' + id,
      JSON.stringify(setNr),
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
