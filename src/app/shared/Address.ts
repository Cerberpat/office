import {Country} from './Country';

export class Address {
  id: number;
  name: string;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
  zipCode: string;
  city: string;
  countryId: number;
  country: Country;
  countryName: string;
  email: string;
  phone: string;
  nip: string;
  wholesalerId: number;
  isOwn: boolean;
  isActive: boolean;

  constructor( data = null ) {
    this.id = 0;
    this.name = '';
    this.street = '';
    this.buildingNumber = '';
    this.apartmentNumber = '';
    this.zipCode = '';
    this.city = '';
    this.countryId = 0;
    this.country = new Country();
    this.countryName = '';
    this.email = '';
    this.phone = '';
    this.nip = '';
    this.wholesalerId = 0;
    this.isOwn = true;
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
