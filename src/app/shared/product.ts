export class Product {
  id: number;
  categoryId: number;
  markId: number;
  addDate: Date;
  addBy: number;
  lastChangeDate: Date;
  availabilityAlert: number;
  availabilityWarning: number;
  retailAlert: number;
  maxOrder: number;
  barcode: string;
  comment: string;
  packaging: number;
  height: number;
  width: number;
  length: number;
  collectivelyHeight: number;
  collectivelyWidth: number;
  collectivelyLength: number;
  weight: number;
  weightNetto: number;
  collectivelyWeight: number;
  collectiveQuantity: number;
  serialNo: string;

  serialQuantity: number;
  deliveryOff: number;
  newShippings: number;
  gtu: string;
  cerebroSku: string;
  bom: number;
  dubel: number;
  isArchive: number;
  visible: number;
  isActive: number;
  name: string;
  categoryName: string;

  constructor( data=null ) {
    this.id = 0;
    this.categoryId = 0;
    this.markId = 0;
    this.addDate = new Date();
    this.addBy = 0;
    this.lastChangeDate = new Date();
    this.availabilityAlert = 0;
    this.availabilityWarning = 0;
    this.retailAlert = 0;
    this.maxOrder = 0;
    this.barcode = '';
    this.comment = '';
    this.packaging = 0;
    this.height = 0;
    this.width = 0;
    this.length = 0;
    this.collectivelyHeight = 0;
    this.collectivelyWidth = 0;
    this.collectivelyLength = 0;
    this.weight = 0;
    this.weightNetto = 0;
    this.collectivelyWeight = 0;
    this.collectiveQuantity = 0;
    this.serialNo = '';
    this.serialQuantity = 0;
    this.deliveryOff = 0;
    this.newShippings = 0;
    this.gtu = '';
    this.cerebroSku = '';
    this.bom = 0;
    this.dubel = 0;
    this.isArchive = 0;
    this.visible = 0;
    this.isActive = 0;
    this.name = '';
    this.categoryName = '';

    if( data!==undefined && data!==null ){
      for (var key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
}
