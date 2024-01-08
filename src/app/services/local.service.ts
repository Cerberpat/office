import { Injectable } from '@angular/core';
import {LocalStorageService} from 'angular-web-storage';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor(public local: LocalStorageService) { }

  endTime = 12;

  set( key: string, val: any) {
    this.local.set(key, val, this.endTime, 'h');
  }

  remove(key: string) {
    this.local.remove(key);
  }

  get(key: string) {
    return this.local.get(key);
  }

  clear() {
    this.local.clear();
  }
}
