import { Component } from '@angular/core';
import {PageLoaderService} from "../page-loader.service";
import {takeWhile} from "rxjs";

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.css']
})
export class PageLoaderComponent {
  constructor(private pageLoaderService: PageLoaderService) { }
  loading: boolean = false;
  message: string = "";


  private _subscribed: boolean = true;
  ngOnInit(): void {
    this.subscribe();
  }
  private subscribe() {
    this.pageLoaderService.state
      .pipe(takeWhile(() => this._subscribed))
      .subscribe(loading => {
        this.loading = loading;
      });
    this.pageLoaderService.message
      .pipe(takeWhile(() => this._subscribed))
      .subscribe(message => {
        if (!!message) {
          this.message = message;
        }
      });
  }
  ngOnDestroy() {
    this._subscribed = false;
  }
}
