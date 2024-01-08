export class ProductNames {
  id: number;
  language: string;
  type: string;
  name: string;
  changeDate: Date;
  Active: number;

  constructor() {
    this.id = 0;
    this.language = '';
    this.type = '';
    this.name = '';
    this.changeDate = new Date();
    this.Active = 1;
  }

  load( json ){
    for (var key in json) {
      if (this.hasOwnProperty(key)) {
        this[key] = json[key];
      }
    }
  }
}
