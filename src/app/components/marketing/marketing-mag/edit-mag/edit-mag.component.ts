import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {isNumeric} from 'rxjs/internal-compatibility';
import {Profil} from '../../../../shared/profil';

@Component({
  selector: 'app-edit-mag',
  templateUrl: './edit-mag.component.html',
  styleUrls: ['./edit-mag.component.sass']
})
export class EditMagComponent implements OnInit {
  logedUser: Profil;
  source: string;
  sourceId: number;
  iloscPoczatkowa: number;
  marketingMag: any;
  marketingMagTemp: any = [];
  firmy: any = [];
  profiles: any = [];
  kategorie: any = [];
  takNie: any = [];
  lokalizacje: any = [];
  display = false;
  dialogMessage = '';

  constructor(
    private servService: ApiService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.takNie = [
      { value: '0', label: 'NIE' },
      { value: '1', label: 'TAK' }
    ];
    this.lokalizacje = [
      { value: '1', label: 'Biuro' },
      { value: '2', label: 'Magazyn' },
      { value: '3', label: 'Studio' },
      { value: '4', label: 'Serwis' },
      { value: '5', label: 'Szafa nr 1' },
      { value: '6', label: 'Szafa nr 2' },
      { value: '7', label: 'Szafa nr 3' },
      { value: '8', label: 'Szafa nr 4' }
    ];
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
    this.marketingMag = this.config.data.obj;
    this.marketingMagTemp = [];
    this.marketingMagTemp.push( Object.assign({}, this.config.data.obj) );
    this.iloscPoczatkowa = this.config.data.obj.iloscPoczatkowa;
    this.source = 'wypozyczenia-prof';
    this.sourceId = this.marketingMag.id;
    this.getProfiles();
    this.getKategorie();
  }

  getProfiles(): void {
    this.servService.getProfils().subscribe((res) => {
      this.profiles = res;
      for (const value of this.profiles) {
        value.value = value.id;
        value.label = value.imie + ' ' + value.nazwisko;
      }
    });
  }

  getKategorie() {
    this.servService.getCategoryNames('PL').subscribe((res) => {
      this.kategorie = res;
      for (const value of this.kategorie) {
        value.value = value.id;
        value.label = value.name;
      }
    });
  }

  saveEdit() {
    this.marketingMag = this.marketingMagTemp[0];
    let addOk = true;
    this.dialogMessage = '';
    if ( this.marketingMag.firma === undefined || !isNumeric(this.marketingMag.firma) || this.marketingMag.firma === 0 ) {
      this.dialogMessage = this.dialogMessage + '- Należy wybrać firmę do której należy przedmiot.<br />';
      addOk = false;
    }
    if ( this.marketingMag.opiekun === undefined || !isNumeric(this.marketingMag.opiekun) || this.marketingMag.opiekun === 0 ) {
      this.dialogMessage = this.dialogMessage + '- Należy wybrać opiekuna.<br />';
      addOk = false;
    }
    if ( this.marketingMag.nazwa === undefined || this.marketingMag.nazwa.length < 3 ) {
      this.dialogMessage = this.dialogMessage + '- Nazwa musi zawierać co najmniej 3 znaki.<br />';
      addOk = false;
    }
    if ( this.marketingMag.kategoria === undefined || !isNumeric(this.marketingMag.kategoria) ) {
      this.dialogMessage = this.dialogMessage + '- Należy wybrać kategorię.<br />';
      addOk = false;
    }
    if ( this.marketingMag.lokalizacja === undefined || !isNumeric(this.marketingMag.lokalizacja) || this.marketingMag.lokalizacja === 0 ) {
      this.dialogMessage = this.dialogMessage + '- Należy wybrać lokalizację przedmiotu.<br />';
      addOk = false;
    }
    if ( addOk ) {
      this.marketingMag.dodal = this.logedUser.id;
      if ( this.marketingMag.id > 0 ) {
        this.servService.updateMarketingMag(this.marketingMag.id, this.marketingMag).subscribe((res) => {
          this.ref.close(this.marketingMag);
        });
      }else{
        this.servService.createMarketingMag(this.marketingMag).subscribe((res) => {
          this.ref.close(this.marketingMag);
        });
      }
    }else{
      this.display = true;
    }
  }

  cancelEdit() {
    this.ref.close(this.marketingMag);
  }
  closeDialog(){
    this.display = false;
  }

  log( data ) {
    console.log( data );
  }
}
