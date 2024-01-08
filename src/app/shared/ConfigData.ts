export class ConfigData {
  id: number;
  type: string;
  label: string;
  value: string;

  constructor( data = null ){
    this.id = 0;
    this.type = '';
    this.label = '';
    this.value = '';

    if( data!==undefined && data!==null ){
      for (var key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
}
