import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-edit-wyp',
  templateUrl: './edit-wyp.component.html',
  styleUrls: ['./edit-wyp.component.sass']
})
export class EditWypComponent implements OnInit {
  source: string;
  sourceId: number;
  marketingWyp: any;
  marketingWypTemp: any = [];
  firmy: any = [];
  odbiorcy: any = [];
  odbiorcySelect: any = [];
  locale: any;

  constructor(
    private servService: ApiService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.locale = {
      firstDayOfWeek: 1,
      dayNames: [ 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela' ],
      dayNamesShort: [ 'nie', 'pod', 'wto', 'śro', 'czw', 'pią', 'sob' ],
      dayNamesMin: [ 'N', 'P', 'W', 'Ś', 'C', 'P', 'S' ],
      monthNames: [ 'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień' ],
      monthNamesShort: [ 'sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru' ],
      today: 'Hoy',
      clear: 'Borrar'
    };

    this.firmy = [
      {value: '1', label: 'Delta Hubert Adamczyk'},
      {value: '2', label: 'Q Media Renata Adamczyk'},
      {value: '3', label: 'Skyline Group s.r.o.'},
      {value: '4', label: 'Skyline Group s.r.o.'},
      {value: '5', label: 'FX Trading LTD'},
      {value: '7', label: 'next77.pl'}
    ];
  }

  ngOnInit(): void {
    this.marketingWyp = this.config.data.obj;
    this.marketingWypTemp = [];
    this.marketingWypTemp.push( Object.assign({}, this.config.data.obj) );
    this.source = 'wypozyczenia-wyp';
    this.sourceId = this.marketingWyp.id;

    this.odbiorcySelect = this.config.data.odbiorcy;
  }

  saveEdit() {
    this.marketingWypTemp.kraj = JSON.stringify(this.marketingWypTemp.kraj);
    this.servService.updateMarketingProf(this.marketingWypTemp.id, this.marketingWypTemp).subscribe((res) => {
      this.ref.close(this.marketingWyp);
    });
  }

  cancelEdit() {
    this.ref.close(this.marketingWyp);
  }

  log( cos ) {
    console.log(cos);
  }
}
