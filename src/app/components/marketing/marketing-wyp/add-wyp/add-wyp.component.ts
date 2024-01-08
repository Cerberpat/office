import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {MarketingWyp} from '../../../../shared/marketingWyp';
import {formatDate} from '@angular/common';
import {Profil} from '../../../../shared/profil';

@Component({
  selector: 'app-add-wyp',
  templateUrl: './add-wyp.component.html',
  styleUrls: ['./add-wyp.component.sass']
})
export class AddWypComponent implements OnInit {
  source: string;
  sourceId: number;
  marketingWyp: any;
  marketingWypTemp: any = [];
  firmy: any = [];
  odbiorcy: any = [];
  odbiorcySelect: any = [];
  locale: any;
  logedUser: Profil;

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
      {value: '', label: ''},
      {value: '1', label: 'Delta Hubert Adamczyk'},
      {value: '2', label: 'Q Media Renata Adamczyk'},
      {value: '3', label: 'Skyline Group s.r.o.'},
      {value: '4', label: 'Skyline Group s.r.o.'},
      {value: '5', label: 'FX Trading LTD'},
      {value: '7', label: 'next77.pl'}
    ];
  }

  ngOnInit(): void {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.marketingWypTemp = [];
    this.marketingWypTemp.push( new MarketingWyp() );
    this.source = 'wypozyczenia-wyp';

    this.odbiorcySelect = this.config.data.odbiorcy;
  }

  saveAdd( data ) {
    data.dataWypozyczenia = this.getRealDataBezCzasu( data.dataWypozyczenia );
    data.dataZwrotu = this.getRealDataBezCzasu( data.dataZwrotu );
    data.dodal = this.logedUser.id;
    console.log(data);
    this.servService.createMarketingWyp(data).subscribe((res) => {
      this.ref.close(data);
    });
  }

  cancelAdd() {
    this.ref.close(this.marketingWyp);
  }

  getRealDataBezCzasu( data ) {
    data = data.setMinutes( data.getMinutes() + (new Date().getTimezoneOffset()) );
    if ( formatDate(data, 'H', 'pl-PL') === '23' ) {
      data = new Date( data );
      data = data.setMinutes( data.getMinutes() + 60 );
    }
    return formatDate(data, 'yyyy-MM-dd', 'pl-PL');
  }

  log( cos ) {
    console.log(cos);
  }
}
