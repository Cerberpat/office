import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Profil } from '../shared/profil';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {Router} from '@angular/router';
import {Shipping} from '../shared/Shipping';
import {ShippingPosition} from '../shared/ShippingPosition';
import {ShippingStatus} from '../shared/ShippingStatus';
import {ShippingShelfPositions} from '../shared/ShippingShelfPositions';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
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
  createShipping(shipping): Observable<Shipping> {
    return this.http.post<Shipping>(
        this.apiURL + '/shipping',
        JSON.stringify(shipping),
        this.httpOptions
      )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getShippings( params ): Observable<[Shipping]> {
    return this.http.get<[Shipping]>(
      this.apiURL + '/shipping',
      {
        params: params
      }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getShipping( id ): Observable<Shipping> {
    return this.http.get<Shipping>(
      this.apiURL + '/shipping/' + id
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateShipping(id, shipping): Observable<Shipping> {
    return this.http.patch<Shipping>(
      this.apiURL + '/shipping/' + id,
      JSON.stringify(shipping),
      this.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Shipping positions
  createShippingPosition(shipping): Observable<ShippingPosition> {
    return this.http.post<ShippingPosition>(
      this.apiURL + '/shipping-positions',
      JSON.stringify(shipping),
      this.httpOptions
    )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getShippingsPositions( params ): Observable<[ShippingPosition]> {
    return this.http.get<[ShippingPosition]>(
      this.apiURL + '/shipping-positions',
      {
        params: params
      }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getShippingPosition( id ): Observable<ShippingPosition> {
    return this.http.get<ShippingPosition>(
      this.apiURL + '/shipping-positions/' + id
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateShippingPosition(id, shippingPosition): Observable<ShippingPosition> {
    return this.http.patch<ShippingPosition>(
      this.apiURL + '/shipping-positions/' + id,
      JSON.stringify(shippingPosition),
      this.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getShippingsStatus( params = {} ): Observable<[ShippingStatus]> {
    return this.http.get<[ShippingStatus]>(
      this.apiURL + '/shipping-status',
      {
        params: params
      }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  createShippingShelfPosition(shippingShelfPositions): Observable<ShippingShelfPositions> {
    return this.http.post<ShippingShelfPositions>(
      this.apiURL + '/shipping-shelf-positions',
      JSON.stringify(shippingShelfPositions),
      this.httpOptions
    )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getShippingsShelfPositions( params = {} ): Observable<[ShippingShelfPositions]> {
    return this.http.get<[ShippingShelfPositions]>(
      this.apiURL + '/shipping-shelf-positions',
      {
        params: params
      }
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
