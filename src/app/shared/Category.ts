export class Category {
  id: number;
  guarantee: number;
  changeDate: Date;
  visible: number;
  active: number;

  constructor(){
    this.id = 0;
    this.guarantee = 0;
    this.changeDate = new Date();
    this.visible = 1;
    this.active = 1;
  }
}
