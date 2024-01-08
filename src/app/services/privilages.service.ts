import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Profil } from '../shared/profil';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {Router} from '@angular/router';
import {Privilage} from '../shared/Privilage';
import {PrivilageShema} from '../shared/PrivilageShema';
import {PrivilageShemaPosition} from '../shared/PrivilageShemaPosition';

@Injectable({
  providedIn: 'root'
})
export class PrivilagesService {
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

  // Shipping
  createPrivilage(privilage): Observable<Privilage> {
    return this.http.post<Privilage>(
        this.apiURL + '/privilages',
        JSON.stringify(privilage),
        this.httpOptions
      )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getPrivilages( params = {} ): Observable<[Privilage]> {
    return this.http.get<[Privilage]>(
      this.apiURL + '/privilages',
      {
        params: params
      }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  createPrivilageProfil(privilage): Observable<boolean> {
    return this.http.post<boolean>(
      this.apiURL + '/privilages-profils',
      JSON.stringify(privilage),
      this.httpOptions
    )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getPrivilagesProfil( params = {} ): Observable<[any]> {
    return this.http.get<[any]>(
      this.apiURL + '/privilages-profils',
      {
        params: params
      }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  deletePrivilageProfil( id: number ) {
    return this.http.delete<boolean>(this.apiURL + '/privilages-profils?id='+id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  createPrivilageShema(privilageShema): Observable<PrivilageShema> {
    return this.http.post<PrivilageShema>(
      this.apiURL + '/privilages-schema',
      JSON.stringify(privilageShema),
      this.httpOptions
    )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getPrivilagesShema( params = {} ): Observable<[PrivilageShema]> {
    return this.http.get<[PrivilageShema]>(
      this.apiURL + '/privilages-schema',
      {
        params: params
      }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  createPrivilageShemaPosition(privilageShemaPos): Observable<boolean> {
    return this.http.post<boolean>(
      this.apiURL + '/privilages-schema-positions',
      JSON.stringify(privilageShemaPos),
      this.httpOptions
    )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getPrivilagesShemaPositions( params = {} ): Observable<[PrivilageShemaPosition]> {
    return this.http.get<[PrivilageShemaPosition]>(
      this.apiURL + '/privilages-schema-positions',
      {
        params: params
      }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  deletePrivilageShemaPosition( id: number ) {
    return this.http.delete<boolean>(this.apiURL + '/privilages-schema-positions?id='+id, this.httpOptions)
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
