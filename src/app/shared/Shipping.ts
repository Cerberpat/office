import {ShippingPosition} from './ShippingPosition';

export class Shipping {
  id: number;
  statusId: number;
  deliveryDate: Date;
  acceptDatetime: Date;
  companyId: number;
  fromWarehouse: number;
  toWarehouse: number;
  title: string;
  orderId: number;
  invoiceId: number;
  comment: string;
  note: string;
  noteAddBy: number;
  notecreatedAt: Date;
  isActive: boolean;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
  positions: ShippingPosition[];

  constructor( data = null ) {
    this.id = 0;
    this.statusId = 0;
    this.deliveryDate = new Date();
    this.acceptDatetime = new Date();
    this.fromWarehouse = 0;
    this.toWarehouse = 0;
    this.title = '';
    this.orderId = 0;
    this.invoiceId = 0;
    this.comment = '';
    this.note = '';
    this.noteAddBy = 0;
    this.notecreatedAt = new Date();
    this.isActive = true;
    this.createdBy = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.positions = [];

    if( data!==undefined && data!==null ){
      for (var key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }

  setData( data = null ){
    if( data!==undefined && data!==null ){
      for (var key in data) {
        if (this.hasOwnProperty(key)) {
          if(this[key] instanceof Date){
            this[key] = new Date(data[key]);
          }else{
            this[key] = data[key];
          }
        }
      }
    }
  }
}
