import { Component, OnInit } from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Urlop} from '../../../shared/urlop';
import {Profil} from '../../../shared/profil';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-print-urlop',
  templateUrl: './print-urlop.component.html',
  styleUrls: ['./print-urlop.component.sass']
})
export class PrintUrlopComponent implements OnInit {
  obj: Urlop;
  dni: number;
  wlasciciel: Profil;
  akceptowal: Profil;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.obj = this.config.data.obj;
    this.dni = this.config.data.dni;
    this.wlasciciel = this.config.data.wlasciciel;
    this.akceptowal = this.config.data.akceptowal;
    if ( this.obj.dodano > this.obj.start ) {
      this.obj.dodano = this.obj.start;
    }
  }

  print() {
    window.print();
  }
/*
  pdf() {
    const doc = new jsPDF({ orientation: 'p', format: 'a4' });
    console.log(document.getElementById('print-section').innerHTML);
    doc.fromHTML(document.getElementById('print-section').innerHTML, 1, 1, {
      elementHandlers() {
        return true;
      }
      // tslint:disable-next-line:only-arrow-functions
    }, function() {
      doc.save('test');
    });
  }*/

  /*public pdf(): void {
    const DATA = document.getElementById('print-section');

    html2canvas(DATA).then(canvas => {

      const fileWidth = 208;
      const fileHeight = canvas.height * fileWidth / canvas.width;

      const FILEURI = canvas.toDataURL('image/png');
      const PDF = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);

      PDF.save('angular-demo.pdf');
    });
  }*/
}
