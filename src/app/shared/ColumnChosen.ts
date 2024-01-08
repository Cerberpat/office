export class ColumnChosen {
  id: number;
  columnsID: number;
  placer: string;
  user: number;
  field: string;
  object: string;
  header: string;
  sortable: number;
  position: number;

  constructor(){
    this.id = 0;
    this.columnsID = 0;
    this.placer = '';
    this.user = 0;
    this.field = '';
    this.object = '';
    this.header = '';
    this.sortable = 0;
    this.position = 0;
  }

  load( json ){
    for (let key in json) {
      if (this.hasOwnProperty(key)) {
        this[key] = json[key];
      }
    }
  }
}
