import {Address} from './Address';

export class Invoice {
  id: number;
  setNr: number;
  companyId: number;
  companyName: string;
  wholesalerId: number;
  seria: string;
  shortNumber: number;
  orderNumber: string;
  number: string;
  issuePlace: string;
  issueDate: Date;
  saleDate: Date;
  paymentTerm: number;
  paymentForm: number;
  currency: number;
  billingAddressId: number;
  billingAddress: Address;
  received: string;
  paid: number;
  type: string;
  sendDate: Date;
  trackingNumber: string;
  transportCompany: number;
  comment: string;
  fiskalRepresentative: string;
  mailPdf: number;
  pdfLink: string;
  createdBy: number;
  createdAt: Date;
  isActive: boolean;

  constructor( data = null ) {
    this.id = 0;
    this.setNr = 0;
    this.companyId = 0;
    this.companyName = '';
    this.wholesalerId = 0;
    this.seria = '';
    this.shortNumber = 0;
    this.orderNumber = '';
    this.number = '';
    this.issuePlace = '';
    this.issueDate = new Date();
    this.saleDate = new Date();
    this.paymentTerm = 0;
    this.paymentForm = 0;
    this.currency = 0;
    this.billingAddressId = 0;
    this.billingAddress = new Address();
    this.received = '';
    this.paid = 0;
    this.type = '';
    this.sendDate = new Date();
    this.trackingNumber = '';
    this.transportCompany = 0;
    this.comment = '';
    this.fiskalRepresentative = '';
    this.mailPdf = 0;
    this.pdfLink = '';
    this.createdBy = 0;
    this.createdAt = new Date();
    this.isActive = true;

    if( data!==undefined && data!==null ){
      for (var key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
}
