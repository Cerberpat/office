import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Profil } from '../shared/profil';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {Router} from '@angular/router';
import {GodzinyNadliczbowe} from '../shared/GodzinyNadliczbowe';

@Injectable({
  providedIn: 'root'
})
export class GodzinyNadliczboweService {
  user: Profil;
  addParams: string;

  // Define API
  //apiURL = 'https://apioffice.next77.pl';
  apiURL = 'https://office.next77.pl/RestApi';


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

  // Orders
  getList( params ): Observable<[GodzinyNadliczbowe]> {
    return this.http.get<[GodzinyNadliczbowe]>(
      this.apiURL + '/GodzinyNadliczbowe/read.php',
      {
        params: params
      }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getOrder( id ): Observable<GodzinyNadliczbowe> {
    return this.http.get<GodzinyNadliczbowe>(
      this.apiURL + '/GodzinyNadliczbowe/read_one.php' + id
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  create(godzinyNadliczbowe): Observable<GodzinyNadliczbowe> {
    return this.http.post<GodzinyNadliczbowe>(
      this.apiURL + '/GodzinyNadliczbowe/create.php', JSON.stringify(godzinyNadliczbowe), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  update(id, godzinyNadliczbowe): Observable<GodzinyNadliczbowe> {
    return this.http.put<GodzinyNadliczbowe>(
      this.apiURL + '/GodzinyNadliczbowe/update.php?id=' + id, JSON.stringify(godzinyNadliczbowe), this.httpOptions
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
