export class CategoryNames {
  id: number;
  language: string;
  name: string;
  changeDate: Date;
  active: number;

  constructor(){
    this.id = 0;
    this.language = '';
    this.name = '';
    this.changeDate = new Date();
    this.active = 1;
  }

  load( json ){
    for (var key in json) {
      if (this.hasOwnProperty(key)) {
        this[key] = json[key];
      }
    }
  }
}
