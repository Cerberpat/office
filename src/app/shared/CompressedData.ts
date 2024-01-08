import {FLOAT} from 'html2canvas/dist/types/css/property-descriptors/float';

export class CompressedData {
  productID: number;
  categoryID: number;
  companyID: number;
  countryID: number;
  wholesalerID: number;
  dataType: string;
  currency: string;
  dateRange: string;
  dateValue: Date;
  valueQuantity: number;
  valueAmounts: FLOAT;
  updateDate: Date;

  constructor(){
    this.productID = 0;
    this.categoryID = 0;
    this.companyID = 0;
    this.countryID = 0;
    this.wholesalerID = 0;
    this.dataType = '';
    this.currency = '';
    this.dateRange = '';
    this.dateValue = new Date();
    this.valueQuantity = 0;
    this.valueAmounts = 0;
    this.updateDate= new Date();
  }

  load( json ){
    for (var key in json) {
      if (this.hasOwnProperty(key)) {
        this[key] = json[key];
      }
    }
  }
}
