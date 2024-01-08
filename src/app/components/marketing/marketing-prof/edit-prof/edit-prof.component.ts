import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {ApiService} from '../../../../services/api.service';
import {MarketingProf} from '../../../../shared/marketingProf';

@Component({
  selector: 'app-edit-prof',
  templateUrl: './edit-prof.component.html',
  styleUrls: ['./edit-prof.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class EditProfComponent implements OnInit {
  source: string;
  sourceId: number;
  profil: MarketingProf = new MarketingProf();
  profilTemp: any = [];
  countries: any = [];
  countriesSelect: any = [];

  constructor( private servService: ApiService, public ref: DynamicDialogRef, public config: DynamicDialogConfig ) { }

  ngOnInit() {
    this.getCountries();
    // this.profil = this.config.data.obj;
    // this.profilTemp = Object.assign({}, this.config.data.obj);
    this.getProfile();
    this.source = 'wypozyczenia-prof';
    this.sourceId = this.profil.id;
  }

  getProfile() {
    this.servService.getMarketingProf( this.config.data.obj.id ).subscribe((res) => {
      this.profil = res;
      this.profil.kraj = JSON.parse( String(this.profil.kraj) );
      this.profilTemp = this.profil;
    });
  }

  getCountries() {
    this.servService.getKraje({}).subscribe((res) => {
      this.countries = res;
    });
  }

  getKraj( id ) {
    this.servService.getKraj(id).subscribe((res) => {
      return res;
    });
  }

  saveEdit() {
    this.profilTemp.kraj = JSON.stringify(this.profilTemp.kraj);
    this.servService.updateMarketingProf(this.profilTemp.id, this.profilTemp).subscribe((res) => {
      this.ref.close(this.profil);
    });
  }

  cancelEdit() {
    this.ref.close(this.profil);
  }

  log( val ) {
    console.log(val);
  }
}
