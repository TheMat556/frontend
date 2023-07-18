import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  private show$: Subject<boolean> = new BehaviorSubject(false);
  private devices$: Subject<any> = new BehaviorSubject([]);

  showModal(devices: any){
    this.devices$.next(devices)
    this.show$.next(true)
  }

  hideModal() {
    this.show$.next(false)
    this.devices$.next([])
  }

  get state() {
    return this.show$.asObservable();
  }

  get devices() {
    return this.devices$.asObservable();
  }

  setDevices(value: []){
    this.devices$.next(value);
  }
}
