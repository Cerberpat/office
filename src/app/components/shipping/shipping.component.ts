import { Component, OnInit } from '@angular/core';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ShippingService} from '../../services/shipping.service';
import {Shipping} from '../../shared/Shipping';
import {Profil} from '../../shared/profil';
import {MessageService, SortEvent} from 'primeng/api';
import {ShippingFormComponent} from './shipping-form/shipping-form.component';
import {ShippingSplitComponent} from './shipping-split/shipping-split.component';
import {formatDate} from '@angular/common';
import {ApiService} from '../../services/api.service';
import {ConfirmationService} from 'primeng';
import {ShippingArchiveComponent} from './shipping-archive/shipping-archive.component';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.sass'],
  providers: [MessageService, ConfirmationService]
})
export class ShippingComponent implements OnInit {
  logedUser: Profil;
  ref: DynamicDialogRef;
  shippings: Shipping[];
  companies: any = [];
  shippingStatus: any = [];
  loading: boolean = false;
  cols: any = {};
  filters: any = {
    first: 0,
    perPage: 50,
    count: 0,
    active: true,
    search: '',
    order: 'deliveryDate DESC',
  };
  constructor(private shippingService: ShippingService, public dialogService: DialogService, private servService: ApiService, private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.logedUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    this.cols = [
      { field: 'title', header: 'Nazwa' },
      { field: 'companyId', header: 'Firma' },
      { field: 'statusId', header: 'Status' },
      { field: 'deliveryDate', header: 'Data dostawy' },
    ];
  }

  ngOnInit(): void {
    this.getShippings();
    this.getCompanies();
    this.getShippingStatus();
  }

  getShippings(): void {
    this.loading = true;
    this.shippingService.getShippings(
      {
        first: this.filters.first,
        perPage: this.filters.perPage,
        search: this.filters.search,
        active: this.filters.active,
        lang: this.logedUser.language,
        where: 'isActive=1',
        order: this.filters.order
      }
    ).subscribe((res) => {
      this.shippings = res;
      this.loading = false;
    });
  }
  paginate(event) {
    this.filters.first = event.first;
    this.filters.perPage = event.rows;
    this.getShippings();
  }
  search(){
    if( this.filters.search.length > 2 || this.filters.search.length===0 ){
      this.getShippings();
    }
  }
  customSort(event: SortEvent) {
    let order:string = '';
    if (event.order > 0) {
      order = event.field + ' ASC';
    } else {
      order = event.field + ' DESC';
    }
    if( this.filters.order !== order ){
      this.filters.order=order;
      this.getShippings();
    }
  }

  openForm(data = new Shipping()) {
    this.ref = this.dialogService.open(ShippingFormComponent, {
      data: {
        obj: data
      },
      header: 'Edycja dostawy: ' + data.title + ' (ID: '+data.id+')',
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((ret) => {
      if (ret) {
        this.getShippings();
      }
    });
    this.ref.onDestroy.subscribe((ret) => {
      this.getShippings();
    });
  }

  split(data = new Shipping()) {
    this.ref = this.dialogService.open(ShippingSplitComponent, {
      data: {
        obj: data
      },
      header: 'Dzielenie dostawy: ' + data.title + ' (ID: '+data.id+')',
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((ret) => {
      if (ret) {
        this.getShippings();
      }
    });
    this.ref.onDestroy.subscribe((ret) => {
      this.getShippings();
    });
  }
  changeStatus( obj, newStatus ) {
    this.confirmationService.confirm({
      message: 'Potwierdź zmianę statusu dostawy.',
      header: 'Potwierdzenie akcji',
      icon: 'pi pi-info-circle',
      accept: () => {
        obj.statusId=newStatus;
        this.shippingService.updateShipping(obj.id, obj).subscribe((res) => {
          if ( res ) {
            this.messageService.add({severity:'success', summary: 'Success', detail:'Dostawa została zaktualizowana.'});
          }else {
            this.messageService.add({severity:'error', summary: 'Error', detail:'Błąd podczas aktualizacji.'});
          }
        });
        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'Record deleted'}];
      },
      reject: () => {
        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }
  archiveDelivery( obj ){
    this.ref = this.dialogService.open(ShippingArchiveComponent, {
      data: {
        obj: obj
      },
      header: 'Archiwizacja dostawy: ' + obj.title + ' (ID: '+obj.id+')',
      width: '96%',
      height: '90%',
    });

    this.ref.onClose.subscribe((ret) => {
      this.getShippings();
      this.messageService.add({severity:'success', summary: 'Success', detail:'Dostawa została zarchiwizowana pomyślnie.'});
    });
    this.ref.onDestroy.subscribe((ret) => {
      this.getShippings();
    });
  }
  getCompanies(){
    this.servService.getCompanies({}).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        this.companies[i] = {value: Number(res[i].id), label: res[i].name};
      }
    });
  }
  getShippingStatus(): void {
    this.shippingService.getShippingsStatus(
      {
        where: 'isActive=1',
      }
    ).subscribe((res) => {
      this.shippingStatus = res;
    });
  }
  printFormatedDate( date ){
    return formatDate(date, 'yyyy-MM-dd', 'pl-PL');
  }
  printCompany( id ){
    const comp = this.companies.filter(x => x.value == id )[0];
    if( comp!==undefined ){
      return comp.label;
    }
  }
  printStatus( id ){
    const status =  this.shippingStatus.filter(x => x.id == id )[0];
    if( status!==undefined ){
      return status.name;
    }
  }
}
