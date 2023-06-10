import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PageLoaderService {

  constructor() { }

  private loading$: Subject<boolean> = new BehaviorSubject(false);
  private message$: Subject<string> = new BehaviorSubject("");

  showFullPageLoader(message: string = ""){
    this.loading$.next(true)
    this.message$.next(message)
  }

  hideFullPageLoader() {
    this.loading$.next(false)
    this.message$.next("")
  }

  get state() {
    return this.loading$.asObservable();
  }

  get message() {
    return this.message$.asObservable();
  }

  setMessage(value: string){
    this.message$.next(value);
  }

}
