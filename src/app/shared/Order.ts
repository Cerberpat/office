import {Address} from './Address';
import {Wholeseller} from './Wholeseller';
import {OrderStatus} from './OrderStatus';
import {Company} from './Company';
import {Profil} from './profil';

export class Order {
  id: number;
  setNr: number;
  name: string;
  company: number;
  companyObj: Company;
  wholesalerId: number;
  wholesaler: Wholeseller;
  shop: number;
  externalId: number;
  purchaseTime: Date;
  shippedOn: Date;
  billingAddressId: number;
  shippingAddressId: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethodId: number;
  paymentMethod: {id: number};
  shippingComment: string;
  trackingNumber: string;
  transportCompanyId: number;
  transportCompany: {id: number, name: string};
  discountPercentage: number;
  discountAmount: number;
  transactionId: number;
  comment: string;
  commentCompany: string;
  cerebroId: number;
  cerebroStatus: string;
  cerebroInvoiceLink: string;
  cerebroComments: string;
  missingProductsQuantity: number;
  orderStatusId: number;
  orderStatus: OrderStatus;
  warehouseStatusId: number;
  warehouseStatus: OrderStatus;
  isDropshipping: number;
  createdBy: number;
  createdByObj: Profil;
  acceptedByOfficeAt: Date;
  isActive: number;
  createdAt: Date;
  updatedAt: Date;

  constructor( data = null ) {
    this.id = 0;
    this.setNr = 0;
    this.company = 0;
    this.companyObj = null;
    this.wholesalerId = 0;
    this.wholesaler = null;
    this.shop = 0;
    this.externalId = 0;
    this.purchaseTime = new Date();
    this.shippedOn = null;
    this.name = '';
    this.billingAddressId = 0;
    this.shippingAddressId = 0;
    this.billingAddress = new Address();
    this.shippingAddress = new Address();
    this.shippingComment = '';
    this.comment = '';
    this.commentCompany = '';
    this.paymentMethodId = 0;
    this.paymentMethod = null;
    this.trackingNumber = '';
    this.transportCompanyId = 0;
    this.transportCompany = null;
    this.discountPercentage = 0;
    this.discountAmount = 0;
    this.transactionId = 0;
    this.orderStatusId = 2;
    this.orderStatus = null;
    this.warehouseStatusId = 0;
    this.warehouseStatus = null;
    this.isDropshipping = 0;
    this.cerebroId = 0;
    this.cerebroStatus = '';
    this.cerebroInvoiceLink = '';
    this.cerebroComments = '';
    this.missingProductsQuantity = 0;
    this.createdBy = 0;
    this.createdByObj =null;
    this.acceptedByOfficeAt = null;
    this.isActive = 1;
    this.createdAt = null;
    this.updatedAt = null;

    if( data!==undefined && data!==null ){
      for (var key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
}
