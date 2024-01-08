import {Component, Input, OnInit} from '@angular/core';
import {ConfirmationService} from 'primeng';

@Component({
  selector: 'app-document-links',
  templateUrl: './document-links.component.html',
  styleUrls: ['./document-links.component.sass'],
  providers: [ConfirmationService]
})
export class DocumentLinksComponent implements OnInit {
  @Input() setNr: number;

  constructor() { }

  ngOnInit(): void {
  }

}
