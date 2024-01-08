import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Profil } from '../shared/profil';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {Router} from '@angular/router';
import {Deposit} from '../shared/Deposit';
import {DepositSplit} from '../shared/DepositSplit';

@Injectable({
  providedIn: 'root'
})
export class DepositService {
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

  // Shipping
  create(data): Observable<Deposit> {
    return this.http.post<Deposit>(
        this.apiURL + '/deposits',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getList( params ): Observable<[Deposit]> {
    return this.http.get<[Deposit]>(
      this.apiURL + '/deposits',
      {
        params: params
      }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getOne( id ): Observable<Deposit> {
    return this.http.get<Deposit>(
      this.apiURL + '/deposits/' + id
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  update(id, data): Observable<Deposit> {
    return this.http.patch<Deposit>(
      this.apiURL + '/deposits/' + id,
      JSON.stringify(data),
      this.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Shipping positions
  createSplit(data): Observable<DepositSplit> {
    return this.http.post<DepositSplit>(
      this.apiURL + '/deposits-split',
      JSON.stringify(data),
      this.httpOptions
    )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getSplitList( params ): Observable<[DepositSplit]> {
    return this.http.get<[DepositSplit]>(
      this.apiURL + '/deposits-split',
      {
        params: params
      }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getSplitOne( id ): Observable<DepositSplit> {
    return this.http.get<DepositSplit>(
      this.apiURL + '/deposits-split/' + id
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateSplit(id, data): Observable<DepositSplit> {
    return this.http.patch<DepositSplit>(
      this.apiURL + '/deposits-split/' + id,
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
