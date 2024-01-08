import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Profil} from '../../shared/profil';
import {Urlop} from '../../shared/urlop';
import {formatDate} from '@angular/common';
import Moment from 'moment-business-days';
import {ConfirmationService} from 'primeng';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {UrlopGodzinowy} from '../../shared/urlopGodzinowy';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {PrintUrlopComponent} from './print-urlop/print-urlop.component';
import {isNumeric} from 'rxjs/internal-compatibility';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-kalendarz',
  templateUrl: './urlopy.component.html',
  styleUrls: ['./urlopy.component.sass', './../../app.component.sass'],
  providers: [DialogService, ConfirmationService]
})
export class UrlopyComponent implements OnInit {
  profiles: any = [];
  profilesTemp: any = [];
  przelozonyTemp: any = [];
  urlops: any = [];
  urlopsTemp: any = [];
  urlopsCalendar: any = [];
  acceptation: any = [];
  cols: any[];
  colsSwieta: any[];
  colsPrzelozony: any[];
  exportColumns: any[];
  clonedProfiles: { [s: string]: Profil; } = {};
  logedUser: Profil;
  rowGroupMetadata: any;
  blockWeekends: boolean = true;
  showCalendarTime: boolean = false;
  urlopTypes = [
    {name: 'Wypoczynkowy', type: 'D', code: 'wyp', column: 'urlop'},
    {name: 'Rol. godzin nadliczbowych', type: 'H', code: 'rozg', column: 'urlop_rozg'},
    {name: 'Na żądanie', type: 'D', code: 'nz', column: 'urlop_nz'},
    {name: 'L4', type: 'D', code: 'l4'},
    {name: 'Wyższa konieczność', type: 'H', code: 'wkon', column: 'urlop_wkon'},
    {name: 'Opiekuńczy', type: 'D', code: 'opie', column: 'urlop_opie'},
    {name: 'Opieka nad dzieckiem chorym', type: 'D', code: 'odc'},
    {name: 'Bezpłatny', type: 'D', code: 'bez'},
    {name: 'urlop ojcowski', type: 'D', code: 'ojc', column: 'urlop_ojc'},
    {name: 'Urlop okolicznościowy', type: 'D', code: 'oko'},
    {name: 'Odbiór dnia wolnego za święto', type: 'D', code: 'urlop_swie', column: 'urlop_swie'},
    {name: 'Opieka nad dzieckiem zdrowym', type: 'H', code: 'odz', column: 'urlop_odz'},
    {name: 'Praca zdalna okazjonalna', type: 'D', code: 'zdal', column: 'urlop_zdal'},
    // niewidoczne
    {name: 'Rozliczenie godzin', type: 'D', code: 'godz'},
  ];
  urlopTypesSelect = [
    {name: 'Wypoczynkowy', type: 'D', code: 'wyp', column: 'urlop'},
    {name: 'Rol. godzin nadliczbowych', type: 'H', code: 'rozg', column: 'urlop_rozg'},
    {name: 'Na żądanie', type: 'D', code: 'nz', column: 'urlop_nz'},
    {name: 'L4', type: 'D', code: 'l4'},
    {name: 'Wyższa konieczność', type: 'H', code: 'wkon', column: 'urlop_wkon'},
    {name: 'Opiekuńczy', type: 'D', code: 'opie', column: 'urlop_nz'},
    {name: 'Opieka nad dzieckiem chorym', type: 'D', code: 'odc'},
    {name: 'Bezpłatny', type: 'D', code: 'bez'},
    {name: 'urlop ojcowski', type: 'D', code: 'ojc'},
    {name: 'Urlop okolicznościowy', type: 'D', code: 'oko'},
    {name: 'Odbiór dnia wolnego za święto', type: 'D', code: 'urlop_swie', column: 'urlop_swie'},
    {name: 'Opieka nad dzieckiem zdrowym', type: 'H', code: 'odz', column: 'urlop_odz'},
    {name: 'Praca zdalna okazjonalna', type: 'D', code: 'zdal', column: 'urlop_zdal'},
  ];
  lata = [];
  rok: { code: string; name: string };
  addUrlopData: Urlop = new Urlop();
  perPage = 10;
  profileSelectOptions = [{label: 'Select', value: null}];
  raport = {start: new Date(), stop: new Date(), profil: []};
  profileSelected = 0;
  es: any;
  swieta: any = [];
  clonedSwieta: any = [];
  swietaDates = [];
  swietaText = [];
  displayDialog: boolean;
  dialogText = '';
  events: any;
  options: any;
  clonedGodz: { [s: string]: UrlopGodzinowy; } = {};
  godzTemp: any = [];
  addGodzinowe: UrlopGodzinowy = new UrlopGodzinowy();
  godzinowe: any = [];
  godzSum = 0;
  ref: DynamicDialogRef;

  constructor(
    private servService: ApiService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService
  ) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.raport.profil.push(this.logedUser.id);
    for( let i = (new Date().getFullYear()+1) ; i>=2020 ; i-- ){
      this.lata.push({name: String(i), code: String(i)});
    }
  }

  ngOnInit() {
    this.rok = {name: String(new Date().getFullYear()), code: String(new Date().getFullYear())};
    this.profileSelected = this.logedUser.id;
    this.getProfiles();
    this.getUrlops();
    this.getUrlopsCalendar();
    this.getAcceptation();
    this.getSwieta();
    this.getGodzinowe();

    this.es = {
      firstDayOfWeek: 1,
      dayNames: [ 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela' ],
      dayNamesShort: [ 'nie', 'pod', 'wto', 'śro', 'czw', 'pią', 'sob' ],
      dayNamesMin: [ 'N', 'P', 'W', 'Ś', 'C', 'P', 'S' ],
      monthNames: [ 'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień' ],
      monthNamesShort: [ 'sty', 'lut', 'mar', 'kwi', 'murlopsaj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru' ],
      today: 'Hoy',
      clear: 'Borrar'
    };

    this.cols = [
      { field: 'imie', header: 'Imie' },
      { field: 'nazwisko', header: 'Nazwisko' },
      { field: 'urlop', header: 'Wypoczynkowy' },
      { field: 'urlop_nz', header: 'Na żądanie' },
      { field: 'urlop_odz', header: 'Opieka nad dzieckiem zdrowym' },
      { field: 'urlop_zal', header: 'Z poprzedniego roku' },
      { field: 'urlop_swie', header: 'Odbiór dnia za święto' },
      { field: 'urlop_wkon', header: 'Wyższej konieczności' },
      { field: 'urlop_opie', header: 'Opiekuńczy' },
      { field: 'urlop_ojc', header: 'Urlop ojcowski' },
      { field: 'urlop_zdal', header: 'Praca zdalna okazjonalna' },
      { field: 'urlop_rozg', header: 'Pozostałe nadgodziny' },
    ];
    this.colsSwieta = [
      { field: 'data', header: 'Data' },
      { field: 'nazwa', header: 'Nazwa' }
    ];
    this.colsPrzelozony = [
      { field: 'imie', header: 'Imie' },
      { field: 'nazwisko', header: 'Nazwisko' },
      { field: 'przelozony', header: 'Przełożeni' }
    ];

    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      defaultDate: new Date(),
      header: {
        // left: 'dayGridMonth,timeGridWeek,timeGridDay',
        left: '',
        center: 'title',
        right: 'today prevYear,prev,next,nextYear'
      },
      contentHeight: 600,
      nowIndicator: false,
      locale: 'pl',
      firstDay: 1,
      editable: false
    };

    Moment.updateLocale('us', {
      holidays: this.swietaText,
      holidayFormat: 'YYYY-MM-DD'
    });
  }

  exportPdf() {
    /*import('jspdf').then(jsPDF => {
      import('jspdf-autotable').then(x => {
        const doc = new jsPDF.default('p', 'mm', 'a4');
        doc.autoTable( this.exportColumns, this.profiles );
        doc.save('primengTable.pdf');
      });
    });*/
    const doc = new jsPDF('p', 'mm', 'a4');
    autoTable(this.exportColumns, this.profiles );
    doc.save('primengTable.pdf');
  }

  exportExcel() {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.profiles);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'primengTable');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.default(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

  onRowEditInit(profil: Profil) {
    this.clonedProfiles[profil.id] = {...profil};
  }

  onRowEditSave(profil: Profil) {
    if (profil.id > 0) {
      this.servService.updateProfilUrlopy( profil.id, profil, this.rok.code ).subscribe((data: {}) => {
        delete this.clonedProfiles[profil.id];
        this.getProfiles();
      });
    } else {
      alert('error');
    }
  }

  onRowEditCancel(profil: Profil, index: number) {
    this.profilesTemp[index] = this.clonedProfiles[profil.id];
    delete this.clonedProfiles[profil.id];
  }
  onRowEditInitPrzelozony(profil: Profil) {
    this.przelozonyTemp[profil.id] = {...profil};
  }
  onRowEditSavePrzelozony(profil: Profil) {
    if (profil.id > 0) {
      profil.przelozony = JSON.stringify(profil.przelozony);
      this.servService.updateProfil( profil.id, profil, this.rok.code ).subscribe((data: {}) => {
        delete this.przelozonyTemp[profil.id];
        this.getProfiles();
      });
    } else {
      alert('error');
    }
  }

  checkPrzelozony( wlasciciel ) {
    const pro = this.profiles.filter(x => x.id === wlasciciel);
    // tslint:disable-next-line:prefer-for-of
    for ( let i = 0; i < pro[0].przelozony.length; i++ ) {
      if ( pro[0].przelozony[i].value === this.logedUser.id ){
        return true;
      }
    }
    return false;
  }
  akceptacjaPrzelozony() {
    // tslint:disable-next-line:prefer-for-of
    for ( let i = 0; i < this.profiles.length; i++ ) {
      // tslint:disable-next-line:prefer-for-of
      for ( let ii = 0; ii < this.profiles[i].przelozony.length; ii++ ) {
        if ( this.profiles[i].przelozony[ii].value === this.logedUser.id ){
          return true;
        }
      }
    }
    return false;
  }

  onSort() {
    this.updateRowGroupMetaData();
  }

  addUrlop() {
    let addUrlopDataTemp = Object.assign({}, this.addUrlopData);
    addUrlopDataTemp.wlasciciel = this.profileSelected;
    // @ts-ignore
    addUrlopDataTemp.type = this.addUrlopData.type.code;
    //addUrlopDataTemp.start.setMinutes( this.addUrlopData.start.getMinutes() + 120);
    //addUrlopDataTemp.stop.setMinutes( this.addUrlopData.stop.getMinutes() + 120);

    const type = this.getUrlopTyp(addUrlopDataTemp.type);

    addUrlopDataTemp.start = this.dataTimezoneAdded(addUrlopDataTemp.start, type);
    addUrlopDataTemp.stop = this.dataTimezoneAdded(addUrlopDataTemp.stop, type);
    if( type=='H' ){
      addUrlopDataTemp.min = this.roznicaCzas( this.addUrlopData.start, this.addUrlopData.stop );
    }
    if ( this.urlopMozliwy(addUrlopDataTemp) ){
      addUrlopDataTemp.start = formatDate(addUrlopDataTemp.start, 'yyyy-MM-dd H:mm:ss', 'pl-PL');
      addUrlopDataTemp.stop = formatDate(addUrlopDataTemp.stop, 'yyyy-MM-dd H:mm:ss', 'pl-PL');
      this.servService.createUrlop(addUrlopDataTemp).subscribe((data: {}) => {
        this.getUrlops();
        this.getUrlopsCalendar();
        this.getGodzinowe();
      });
    }
  }

  dataTimezoneAdded( data, format='H' ){
    if( format=='H' ){
      return new Date(formatDate(data, 'yyyy-MM-dd H:mm:ss', 'pl-PL'));
    }else{
      return new Date(formatDate(data, 'yyyy-MM-dd', 'pl-PL')+' 00:00:00');
    }
  }

  roznicaCzas( start, stop ){
    let needDays = this.getWorkingDays( start, stop );
    const roznicaCzas = Math.floor(((Moment(formatDate(stop, 'H:mm:ss', 'pl-PL'), 'HH:mm').diff(Moment(formatDate(start, 'H:mm:ss', 'pl-PL'), 'HH:mm')))/1000)/60);
    return ((needDays-1)*8*60) + roznicaCzas;
  }

  urlopMozliwy( addUrlopDataTemp ): boolean{
    const type = this.getUrlopTyp(addUrlopDataTemp.type);
    const haveDaye = this.getDiffUrlop(addUrlopDataTemp.type);
    let needDays = this.getWorkingDays( addUrlopDataTemp.start, addUrlopDataTemp.stop );

    // Za mało dostępnych dni
    if( type=='H' ){
      //needDays = needDays-1;
      const roznicaCzas = Math.floor(((Moment(formatDate(addUrlopDataTemp.stop, 'H:mm:ss', 'pl-PL'), 'HH:mm').diff(Moment(formatDate(addUrlopDataTemp.start, 'H:mm:ss', 'pl-PL'), 'HH:mm')))/1000)/60);
      needDays = ((needDays-1)*8*60) + roznicaCzas;
      if( haveDaye == '-' || haveDaye < needDays ){
        this.dialogText = 'Próbujesz wykorzystać ' + this.minToText( needDays ) + ', lecz posiadasz ' + this.minToText( haveDaye ) + '.';
        this.displayDialog = true;
        return false;
      }
    }else{
      if( (haveDaye == '-' || haveDaye < needDays) && addUrlopDataTemp.type!='l4' && addUrlopDataTemp.type!='oko' && addUrlopDataTemp.type!='odc' && addUrlopDataTemp.type!='bez' ){
        this.dialogText = 'Próbujesz wykorzystać ' + needDays + ' dni, lecz posiadasz ' + haveDaye + ' dni.';
        this.displayDialog = true;
        return false;
      }
    }
    // źle wybrane daty
    if( addUrlopDataTemp.start > addUrlopDataTemp.stop ){
      this.dialogText = 'Data rozpoczęcia urlopu musi być wcześniejsza, niż data jego zakończenia.';
      this.displayDialog = true;
      return false;
    }
    // nakładanie się urlopów
    let overlap = false;
    let tempUrlop: any;
    for (const value of this.urlops) {
      value.start = this.dataTimezoneAdded(value.start);
      value.stop = this.dataTimezoneAdded(value.stop);
      if (
        value.odrzucono.toString() === '0'
        &&
        this.dateOverlap( new Date(value.start), new Date(value.stop), addUrlopDataTemp.start, addUrlopDataTemp.stop )
      ){
        overlap = true;
        tempUrlop = value;
      }
    }
    if ( overlap ) {
      if(type=='H'){
        this.dialogText = 'Posiadasz już urlop ("' + this.getUrlopName(tempUrlop.type) + '") w terminie od ' + formatDate(tempUrlop.start, 'yyyy-MM-dd H:mm:ss', 'pl-PL') + ' do ' + formatDate(tempUrlop.stop, 'yyyy-MM-dd H:mm:ss', 'pl-PL') + ', który pokrywa się z aktualnie dodawanym.';
      }else{
        this.dialogText = 'Posiadasz już urlop ("' + this.getUrlopName(tempUrlop.type) + '") w terminie od ' + formatDate(tempUrlop.start, 'yyyy-MM-dd', 'pl-PL') + ' do ' + formatDate(tempUrlop.stop, 'yyyy-MM-dd', 'pl-PL') + ', który pokrywa się z aktualnie dodawanym.';
      }
      this.displayDialog = true;
      return false;
    }
    return true;
  }

  getProfiles(): void {
    this.servService.getProfils( {rok: this.rok.code} ).subscribe((res) => {
      this.profiles = res;
      this.profilesTemp = res;
      this.profileSelectOptions = [];
      for (const value of this.profiles) {
        this.profileSelectOptions.push({
          label: value.nazwisko + ' ' + value.imie, value: value.id
        });
        if ( value.przelozony !== '' ) {
          value.przelozony = JSON.parse(value.przelozony);
        }
      }
    });
  }

  getUrlops(): void {
    let addRok = '';
    if (this.rok.code.length === 4) {
      addRok = '&rok=' + this.rok.code;
    }
    this.servService.getUrlopy( '?wlasciciel=' + this.profileSelected + addRok ).subscribe((res) => {
      if (res) {
        for (let i = 0; i < res.length; i++) {
          const data = res[i];
          res[i].typeTemp = data.type;
          if ( data.type === 'godz' || data.type === 'nz' ) {
            res[i].type = 'wyp';
          }
        }
      }
      res.sort((a, b) => {
        if (a.start < b.start) {
          return -1;
        }
        if (a.start > b.start) {
          return 1;
        }
        return 0;
      });
      res.sort((a, b) => {
        if (a.type < b.type) {
          return -1;
        }
        if (a.type > b.type) {
          return 1;
        }
        return 0;
      });
      this.urlops = res;
      this.urlopsTemp = res;
      this.updateRowGroupMetaData();
    });
  }

  getGodzinowe(): void {
    let addRok = '';
    if (this.rok.code.length === 4) {
      addRok = '&rok=' + this.rok.code;
    }
    this.servService.getGodzinowe( '?wlasciciel=' + this.profileSelected + addRok ).subscribe((res) => {
      this.godzinowe = res;
      this.godzSum = 0;
      for (const value of this.godzinowe) {
        this.godzSum += parseFloat(value.iloscGodzin);
      }
    });
  }

  getUrlopsCalendar(): void {
    this.servService.getUrlopyCalendar('?odrzucono=0').subscribe((res) => {
      this.urlopsCalendar = res;
      for (let i = 0; i < this.urlopsCalendar.length; i++) {
        const typ = this.getUrlopTyp( this.urlopsCalendar[i].type );
        //this.urlopsCalendar[i].stop = new Date( this.urlopsCalendar[i].stop );
        //this.urlopsCalendar[i].stop.setMinutes( this.urlopsCalendar[i].stop.getMinutes() + 1440);
        //this.urlopsCalendar[i].end = this.getRealDataBezCzasu(this.urlopsCalendar[i].stop);
        this.urlopsCalendar[i].end = formatDate(new Date( this.urlopsCalendar[i].stop ), 'yyyy-MM-dd', 'pl-PL');
        this.urlopsCalendar[i].title = this.getWlascicielName(this.urlopsCalendar[i].wlasciciel) + this.addCzasTitle( typ, this.urlopsCalendar[i]);
        this.urlopsCalendar[i].allDay = true;
        if ( this.urlopsCalendar[i].akceptacja > 0 ) {
          if( typ=='H'){
            this.urlopsCalendar[i].color = '#c3f158';
          }else{
            this.urlopsCalendar[i].color = '#34a835';
          }
        }
        if ( this.urlopsCalendar[i].type === 'l4' ) {
          this.urlopsCalendar[i].color = '#66cccc';
        }
      }
    });
  }

  addCzasTitle( typ, obj){
    if( typ!=='H' ){
      return '';
    }
    let ret = '';
    if( formatDate(obj.start, 'H', 'pl-PL')!='0' && formatDate(obj.stop, 'H', 'pl-PL')=='0' ){
      ret += ' ' + formatDate(obj.start, 'H:mm', 'pl-PL') + ' -> ';
    }
    if( formatDate(obj.start, 'H', 'pl-PL')=='0' && formatDate(obj.stop, 'H', 'pl-PL')!='0' ){
      ret += ' <-' + formatDate(obj.stop, 'H:mm', 'pl-PL');
    }
    if( formatDate(obj.start, 'H', 'pl-PL')!='0' && formatDate(obj.stop, 'H', 'pl-PL')!='0' ){
      ret += ' ' + formatDate(obj.start, 'H:mm', 'pl-PL') + ' - ' + formatDate(obj.stop, 'H:mm', 'pl-PL');
    }
    return ret;
  }

  getAcceptation(): void {
    this.servService.getUrlopy( '?odrzucono=0&akceptacja=0' ).subscribe((res) => {
      this.acceptation = res;
    });
  }

  getSwieta(): void {
    this.servService.getSwieta().subscribe((res) => {
      this.swieta = res;
      for (const value of this.swieta) {
        this.swietaDates.push(new Date(value.data));
        this.swietaText.push(value.data);
      }
    });
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    // const temp = this.urlops.filter( x => x.odrzucono === '0' );
    if (this.urlops) {
      for (let i = 0; i < this.urlops.length; i++) {
        const rowData = this.urlops[i];
        const type = rowData.type;
        if (i === 0) {
          this.rowGroupMetadata[type] = { index: 0, size: 1 };
        }
        else {
          const previousRowData = this.urlops[i - 1];
          const previousRowGroup = previousRowData.type;
          if (type === previousRowGroup) {
            this.rowGroupMetadata[type].size++;
          } else {
            this.rowGroupMetadata[type] = {index: i, size: 1};
          }
        }
      }
    }
  }

  getRealData( data ) {
    data = data.setMinutes( data.getMinutes() + (new Date().getTimezoneOffset()) );
    return formatDate(data, 'yyyy-MM-dd H:mm:ss', 'pl-PL');
  }
  getRealDataBezCzasu( data ) {
    data = data.setMinutes( data.getMinutes() + (new Date().getTimezoneOffset()) );
    if ( formatDate(data, 'H', 'pl-PL') === '23' ) {
      data = new Date( data );
      data = data.setMinutes( data.getMinutes() + 60 );
    }
    return formatDate(data, 'yyyy-MM-dd', 'pl-PL');
  }

  getUrlopName( code ) {
    const temp = this.urlopTypes.filter(x => x.code === code);
    if( temp[0].name!==undefined ){
      return temp[0].name;
    }else{
      console.log(code);
      return 'Brak';
    }
  }

  getWorkingDays( date1, date2 ) {
    let countDays = Moment(date1, 'YYYY-MM-DD').businessDiff(Moment(date2, 'YYYY-MM-DD'));
    countDays = countDays + 1;
    return countDays;
  }

  getWorkingDaysPrint( date1, date2, code ) {
    const type = this.getUrlopTyp(code);
    let days = this.getWorkingDays( date1, date2 );
    if( type=='H' ){
      const roznicaCzas = Math.floor(((Moment(formatDate(date2, 'HH:mm', 'pl-PL'), 'HH:mm').diff(Moment(formatDate(date1, 'HH:mm', 'pl-PL'), 'HH:mm')))/1000)/60);
      days = ((days-1)*8*60) + roznicaCzas;
    }else{
      days = (days*8*60);
    }
    return this.minToText( days );
  }

  getGivenUrlop( code ): any {
    const type = this.getUrlopTyp(code);
    let count = 0;
    const temp = this.urlopTypes.filter(x => x.code === code);
    const proftemp = this.profiles.filter(x => x.id === this.profileSelected);

    if ( temp[0].column !== undefined ) {
      count = count + parseInt(proftemp[0][temp[0].column]);
    }
    if ( code.toString() === 'wyp' && parseInt(proftemp[0].urlop_zal) > 0 ) {
      count += parseInt(proftemp[0].urlop_zal);
    }
    if ( count === 0 ) {
      return '-';
    }
    if( type=='H' ){
      if( code=='rozg' ){
        return count;
      }else{
        return (count*8*60);
      }
    }else{
      return count;
    }
  }

  getGivenUrlopPrint( code ): any {
    const type = this.getUrlopTyp(code);
    let ret = this.getGivenUrlop(code);
    if( type=='H' ){
      return this.minToText( ret );
    }else{
      return ret + ' dni';
    }
  }

  getUsedUrlop( code ) {
    const type = this.getUrlopTyp(code);
    let count = 0;
    const temp = this.urlops.filter( x => x.type === code && x.odrzucono === '0' && x.wlasciciel === this.profileSelected );
    for (const value of temp) {
      if( type=='H' ){
        const days= this.getWorkingDays(value.start, value.stop);
        let ret = ( (Moment(value.stop, 'YYYY-MM-DD HH:mm').diff(Moment(value.start, 'YYYY-MM-DD HH:mm')) ) / 1000) / 60;
        count += (Math.round(ret) - ((days-1)*16*60));
      }else{
        count += this.getWorkingDays(value.start, value.stop);
      }
    }
    return count;
  }

  getUsedUrlopPrint( code ) {
    const type = this.getUrlopTyp(code);
    let ret = this.getUsedUrlop(code);
    if( type=='H' ){
      return this.minToText( ret );
    }else{
      if( code == 'wyp' && this.minusGodzinowy()>0 ){
        return ret + ' dni +' + this.minusGodzinowy() + ' (nieobecności godz.)';
      }else{
        return ret + ' dni';
      }
    }
  }

  minToText( min ){
    if( min=='-' || min==0 ){
      return 0;
    }
    let text='';
    const dni = Math.floor(min / (60 * 8));
    min = min - (dni * 8 * 60);
    const godzin = Math.floor(min / 60);
    min = min - (godzin * 60);
    if( dni>0 ){
      text+=dni + ' dni ';
    }
    if( godzin>0 ){
      text+=godzin + ' godzin ';
    }
    if( min>0 ){
      text+=min + ' minut';
    }
    return text;
  }

  getDiffUrlop( code ) {
    let diff;
    if ( this.getGivenUrlop( code ) > 0 ) {
      if( this.getUrlopTyp(code) == 'H' && code!='rozg' ){
        diff = this.getGivenUrlop( code ) - this.getUsedUrlop( code );
      }
      if( this.getUrlopTyp(code) == 'H' && code=='rozg' ){
        diff = this.getGivenUrlop( code );
      }
      if( this.getUrlopTyp(code) != 'H' ){
        diff = this.getGivenUrlop( code );
      }
      if ( code === 'wyp' ) {
        const diffAdd = this.getUsedUrlop( code );
        diff = diff - diffAdd;
        const diffAdd2 = this.getUsedUrlop( 'nz' );
        diff = diff - diffAdd2;
        const diffAdd3 = this.getUsedUrlop( 'godz' );
        diff = diff - diffAdd3;
        if ( this.brakujaceGodzinowy() > 0 ) {
          diff = diff - this.minusGodzinowy();
        }
      }
      if ( code === 'nz' ) {
        let diffcheck: any;
        diffcheck = this.getGivenUrlop('wyp') - this.getUsedUrlop('wyp');
        if ( diff > diffcheck ) {
          diff = diffcheck;
        }
      }
      if ( code === 'urlop_swie' ) {
        let diffcheck: any;
        diffcheck = this.getGivenUrlop('urlop_swie') - this.getUsedUrlop('urlop_swie');
        if ( diff > diffcheck ) {
          diff = diffcheck;
        }
      }
      if ( code === 'wkon' || code === 'odz' ) {
        let diffcheck: any;
        diffcheck = (this.getGivenUrlop('rozg') * 8 * 60) - this.getUsedUrlop('rozg');
        if ( diff > diffcheck ) {
          diff = diffcheck;
        }
      }
    }else{
      diff = '-';
    }
    return diff;
  }

  getDiffUrlopPrint( code ){
    const type = this.getUrlopTyp(code);
    let diff = this.getDiffUrlop(code);
    if( diff=='-' ){
      return diff;
    }
    if( type=='H' ){
      return this.minToText( diff );
    }else{
      return diff + ' dni';
    }
  }

  getProfileOptions() {
    for (const value of this.profiles) {
      this.profileSelectOptions.push({
        label: value.imie + ' ' + value.nazwisko, value: value.id
      });
    }
  }

  setAcceptation( data, poziom, val ) {
    let mess = '';
    if ( val.toString() === '1' ) {
      mess = 'Potwierdzasz akceptację wniosku?';
    } else {
      mess = 'Potwierdzasz odrzucenie wniosku?';
    }
    this.confirmationService.confirm({
      message: mess,
      header: 'Potwierdzenie akcji',
      icon: 'pi pi-info-circle',
      accept: () => {
        if ( poziom === 1 ) {
          if (val.toString() === '1') {
            data.akceptacjaPrze = this.logedUser.id;
          } else {
            data.odrzuconoPrze = this.logedUser.id;
          }
          data.zaakceptowalPrze = this.getRealData( new Date() );
        } else {
          if (val.toString() === '1') {
            data.akceptacja = this.logedUser.id;
          } else {
            data.odrzucono = this.logedUser.id;
          }
          data.zaakceptowano = this.getRealData( new Date() );
        }
        this.servService.updateUrlop(data.id, data).subscribe((res) => {
          this.getUrlops();
          this.getUrlopsCalendar();
          this.getAcceptation();
        });
        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'Record deleted'}];
      },
      reject: () => {
        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }

  removeUrlop( data ) {
    const mess = 'Potwierdzasz odrzucenie wniosku?';
    this.confirmationService.confirm({
      message: mess,
      header: 'Potwierdzenie akcji',
      icon: 'pi pi-info-circle',
      accept: () => {
        data.zaakceptowano = this.getRealData( new Date() );
        data.akceptacja = 0;
        data.odrzucono = this.logedUser.id;
        this.servService.updateUrlop(data.id, data).subscribe((res) => {
          this.getUrlops();
          this.getUrlopsCalendar();
          this.getAcceptation();
        });
        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'Record deleted'}];
      },
      reject: () => {
        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }

  deleteUrlop( data ) {
    const mess = 'Potwierdzasz chęć usunięcia wniosku?';
    this.confirmationService.confirm({
      message: mess,
      header: 'Potwierdzenie akcji',
      icon: 'pi pi-info-circle',
      accept: () => {
        data.zaakceptowano = this.getRealData( new Date() );
        data.aktywnosc = 0;
        data.odrzucono = this.logedUser.id;
        this.servService.updateUrlop(data.id, data).subscribe((res) => {
          this.getUrlops();
          this.getUrlopsCalendar();
          this.getAcceptation();
        });
      },
      reject: () => {
      }
    });
  }

  getWlascicielName( id ) {
    const pro = this.profiles.filter(x => x.id === id);
    if( pro[0]!==undefined && pro[0].nazwisko!==undefined ){
      return pro[0].nazwisko + ' ' + pro[0].imie;
    }else{
      return 'Brak';
    }
  }
  getProfilById( id ) {
    const pro = this.profiles.filter(x => x.id === id);
    return pro[0];
  }

  reloadSumtable() {
    this.getUrlops();
    this.getGodzinowe();
  }

  reloadZmianaRoku() {
    this.getUrlops();
    this.getGodzinowe();
    this.getProfiles();
  }

  public dateOverlap(startA, endA, startB, endB) {
    const A = startA.getTime();
    const B = endA.getTime();
    const C = startB.getTime();
    const D = endB.getTime();
    return (
      (A == null || D == null || A <= D)
      && (C == null || B == null || C <= B)
      && (A == null || B == null || A <= B)
      && (C == null || D == null || C <= D)
    );
  }

  onRowEditInitGodz(urlopGodzinowy: UrlopGodzinowy) {
    this.clonedGodz[urlopGodzinowy.id] = {...urlopGodzinowy};
  }
  onRowDeleteGodz(urlopGodzinowy: UrlopGodzinowy) {
    if (urlopGodzinowy.id > 0) {
      const mess = 'Potwierdzasz chęć usunięcia godzin?';
      this.confirmationService.confirm({
        message: mess,
        header: 'Potwierdzenie akcji',
        icon: 'pi pi-info-circle',
        accept: () => {
          urlopGodzinowy.aktywnosc = 0;
          this.servService.updateGodzinowy( urlopGodzinowy.id, urlopGodzinowy ).subscribe((data: {}) => {
            delete this.clonedGodz[urlopGodzinowy.id];
            this.getGodzinowe();
          });
        },
        reject: () => {
        }
      });
    } else {
      alert('error');
    }
  }
  onRowEditSaveGodz(urlopGodzinowy: UrlopGodzinowy) {
    if (urlopGodzinowy.id > 0) {
      this.servService.updateGodzinowy( urlopGodzinowy.id, urlopGodzinowy ).subscribe((data: {}) => {
        delete this.clonedGodz[urlopGodzinowy.id];
        this.getGodzinowe();
      });
    } else {
      alert('error');
    }
  }
  onRowEditCancelGodz(urlopGodzinowy: UrlopGodzinowy, index: number) {
    this.godzTemp[index] = this.clonedGodz[urlopGodzinowy.id];
    delete this.clonedGodz[urlopGodzinowy.id];
  }
  addGodzinowy() {
    this.addGodzinowe.data.setMinutes( this.addGodzinowe.data.getMinutes() + 120);
    this.addGodzinowe.wlasciciel = this.logedUser.id;

    if ( this.checkGodzinyDziennie( this.addGodzinowe.data ) < 8 ) {
      this.servService.createGodzinowy(this.addGodzinowe).subscribe((data: {}) => {
        this.getGodzinowe();
      });
    } else {
      this.dialogText = 'Próbujesz dodać nieobecność godzinową powyżej 8 godzin w ciągu dnia.';
      this.displayDialog = true;
    }
  }
  brakujaceGodzinowy() {
    const dniTemp = this.getUsedUrlop('godz') * 8;
    return this.godzSum - dniTemp;
  }
  minusGodzinowy() {
    const tempGodz = this.brakujaceGodzinowy() / 8;
    return parseFloat( Math.ceil(tempGodz).toFixed(2) );
  }
  checkGodzinyDziennie( data ) {
    data = new Date(data);
    data = this.getRealDataBezCzasu( data );
    let licznik = 0;
    const godzTemp = this.godzinowe.filter(x => x.data === data);
    for (const value of godzTemp) {
      licznik += parseFloat(value.iloscGodzin);
    }
    return licznik;
  }

  log( cos) {
    console.log(cos);
  }
  urlopToPdfDialog( data ){
    this.ref = this.dialogService.open(PrintUrlopComponent, {
      data: {
        obj: data,
        wlasciciel: this.getProfilById( data.wlasciciel ),
        akceptowal: this.getProfilById( data.akceptacja ),
        dni: this.getWorkingDays( data.start, data.stop )
      },
      styleClass: 'doNotPrint',
      header: 'Wniosek urlopowy',
      width: '1240px',
      height: '50vh',
    });

    this.ref.onClose.subscribe(() => {
    });
  }

  printZakres( row ){
    const type = this.getUrlopTyp(row.type);
    if(type=='H'){
      return formatDate(row.start, 'yyyy-MM-dd H:mm', 'pl-PL') + ' - ' + formatDate(row.stop, 'yyyy-MM-dd H:mm', 'pl-PL');
    }else{
      return formatDate(row.start, 'yyyy-MM-dd', 'pl-PL') + ' - ' + formatDate(row.stop, 'yyyy-MM-dd', 'pl-PL');
    }
  }

  getUrlopTyp( code ){
    return this.urlopTypes.filter(x => x.code === code)[0].type;
  }

  setCallendarSettings(){
    const temp: any = this.addUrlopData.type;
    const type = this.getUrlopTyp(temp.code);
    if( temp.code == 'l4' ){
      this.blockWeekends = false;
    }else{
      this.blockWeekends = true;
    }
    if( type == 'H' ){
      this.showCalendarTime = true;
    }else{
      this.showCalendarTime = false;
    }
  }
  urlopRaportToExcel(){
    let daty = '';
    if ( this.raport.start ) {
      daty = '&start=' + formatDate(this.raport.start, 'yyyy-MM-dd', 'pl-PL') + '&stop=' + formatDate(this.raport.stop, 'yyyy-MM-dd', 'pl-PL');
    }
    this.servService.getUrlopy( '?wlasciciel=' + this.raport.profil + daty ).subscribe((res) => {
      let data = [];
      if (res) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < res.length; i++) {
          if (res[i].type === 'godz' || res[i].type === 'nz') {
            res[i].type = 'wyp';
          }
          if ( isNumeric(res[i].wlasciciel) && res[i].wlasciciel > 0 && isNumeric(res[i].akceptacja) && res[i].akceptacja > 0 ) {
            data.push({
              wlasciciel: this.getWlascicielName(res[i].wlasciciel),
              akceptacja: this.getWlascicielName(res[i].akceptacja),
              typ: res[i].type,
              start: res[i].start,
              stop: res[i].stop,
              wykorzystano: this.getWorkingDays(res[i].start, res[i].stop)
            });
          }
        }
      }
      data.sort((a, b) => {
        if (a.type < b.type) {
          return -1;
        }
        if (a.type > b.type) {
          return 1;
        }
        return 0;
      });
      import('xlsx').then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, 'raport_urlop');
      });
    });
  }
}
