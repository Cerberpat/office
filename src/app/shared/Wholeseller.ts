import {Address} from './Address';
import {Profil} from './profil';

export class Wholeseller {
  id: number;
  login: string;
  password: string;
  registrationAddressId: number;
  registrationAddress: Address;
  name: string;
  address: string;
  zipCode: string;
  city: string;
  country: number;
  nip: string;
  comments: string;
  paymentFormId: number;
  paymentLater: number;
  invoiceTermBlock: number;
  paymentAlert: number;
  paymentTerm: number;
  transportCompany: number;
  distributor: number;
  currency: string;
  type: string;
  connected: number;
  panelPL: number;
  panelNext: number;
  panelEU: number;
  panelCY: number;
  mailingAgree: number;
  mailAuto: string;
  manager: number;
  managerObj: Profil;
  opinion: string;
  failedLogin: number;
  isActive: number;

  constructor( data=null ) {
    this.id = 0;
    this.login = '';
    this.password = '';
    this.registrationAddressId = 0;
    this.registrationAddress = new Address();
    this.name = '';
    this.address = '';
    this.zipCode = '';
    this.city = '';
    this.country = 0;
    this.nip = '';
    this.comments = '';
    this.paymentFormId = 0;
    this.paymentLater = 0;
    this.invoiceTermBlock = 0;
    this.paymentAlert = 0;
    this.paymentTerm = 0;
    this.transportCompany = 0;
    this.distributor = 0;
    this.currency = '';
    this.type = '';
    this.connected = 0;
    this.panelPL = 0;
    this.panelNext = 0;
    this.panelEU = 0;
    this.panelCY = 0;
    this.mailingAgree = 0;
    this.mailAuto = '';
    this.manager = 0;
    this.managerObj = null;
    this.opinion = '';
    this.failedLogin = 0;
    this.isActive = 1;

    if( data!==undefined && data!==null ){
      for (var key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
}
