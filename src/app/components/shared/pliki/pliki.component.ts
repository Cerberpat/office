import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {ConfirmationService} from 'primeng';

@Component({
  selector: 'app-pliki',
  templateUrl: './pliki.component.html',
  styleUrls: ['./pliki.component.sass'],
  providers: [ConfirmationService]
})
export class PlikiComponent implements OnInit {
  @Input() source: string;
  @Input() sourceId: number;
  uploadedFiles: any[] = [];
  pliki = {
    images: [],
    files: []
  };
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  displayCustom: boolean;
  activeIndex = 0;

  constructor( private servService: ApiService, private confirmationService: ConfirmationService ) {
    this.pliki = {
      images: [],
      files: []
    };
  }

  ngOnInit(): void {
    this.getPliki();
  }

  getPliki() {
    this.servService.getPliki(this.source, this.sourceId).subscribe((res) => {
      this.pliki = res;
    });
  }

  onUpload(event) {
    for ( const file of event.files) {
      this.uploadedFiles.push(file);
      this.uploadedFiles = [];
      this.getPliki();
    }
  }

  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }

  deleteImage( file ) {
    this.confirmationService.confirm({
      message: 'Potwierdzasz operację usunięcia pliku?',
      header: 'Potwierdzenie akcji',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.servService.deletePliki(file, this.source, this.sourceId).subscribe((res) => {
          this.getPliki();
        });
      },
      reject: () => {
      }
    });
  }
}
