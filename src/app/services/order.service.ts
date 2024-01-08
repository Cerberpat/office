import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Profil } from '../shared/profil';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {Order} from '../shared/Order';
import {Router} from '@angular/router';
import {PrivilageShema} from '../shared/PrivilageShema';
import {OrderStatus} from '../shared/OrderStatus';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
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

  createOrder(data): Observable<Order> {
    return this.http.post<Order>(
      this.apiURL + '/order',
      JSON.stringify(data),
      this.httpOptions
    )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Orders
  getOrders( params ): Observable<[Order]> {
    return this.http.get<[Order]>(
      this.apiURL + '/order',
      {
        params: params
      }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getOrder( id ): Observable<Order> {
    return this.http.get<Order>(
      this.apiURL + '/order/' + id
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  getOrderBySetNr( setNr ): Observable<Order> {
    return this.http.get<Order>(
      this.apiURL + '/order/setnr/' + setNr
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateOrder(id, order): Observable<Order> {
    return this.http.patch<Order>(
      this.apiURL + '/order/' + id,
      JSON.stringify(order),
      this.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Orders Status

  createOrderStatuses(privilageShema): Observable<PrivilageShema> {
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

  getOrderStatuses( params ): Observable<[OrderStatus]> {
    return this.http.get<[OrderStatus]>(
      this.apiURL + '/order-status',
      {
        params: params
      }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getOrderStatus( id ): Observable<OrderStatus> {
    return this.http.get<OrderStatus>(
      this.apiURL + '/order-status/' + id
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateOrderStatus(id, orderStatus): Observable<OrderStatus> {
    return this.http.put<OrderStatus>(
      this.apiURL + '/order-status', JSON.stringify(orderStatus), this.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteOrderStatus( id: number ) {
    return this.http.delete<boolean>(this.apiURL + '/order-status/'+id, this.httpOptions)
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
