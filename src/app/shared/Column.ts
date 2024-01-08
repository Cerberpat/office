export class Column {
  id: number;
  columnsID: number;
  placer: string;
  field: string;
  object: string;
  header: string;
  sortable: number;
  comment: string;
  active: number;

  constructor(){
    this.id = 0;
    this.columnsID=0;
    this.placer = '';
    this.field = '';
    this.object = '';
    this.header = '';
    this.sortable = 0;
    this.comment = '';
    this.active = 1;
  }

  load( json ){
    for (var key in json) {
      if (this.hasOwnProperty(key)) {
        this[key] = json[key];
      }
    }
    this.columnsID = json.id;
  }
}
