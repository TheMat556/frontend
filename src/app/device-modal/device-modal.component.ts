import { Component } from '@angular/core';
import {PageLoaderService} from "../page-loader.service";
import {takeWhile} from "rxjs";
import {ModalService} from "../modal.service";
import {SpotifyService} from "../spotify.service";

@Component({
  selector: 'app-device-modal',
  templateUrl: './device-modal.component.html',
  styleUrls: ['./device-modal.component.css']
})
export class DeviceModalComponent {
  constructor(private modalService: ModalService, private spotifyService: SpotifyService) { }
  show: boolean = false;
  devices: any;


  private _subscribed: boolean = true;
  ngOnInit(): void {
    this.subscribe();
  }
  private subscribe() {
    this.modalService.state
      .pipe(takeWhile(() => this._subscribed))
      .subscribe(show => {
        this.show = show;
      });
    this.modalService.devices
      .pipe(takeWhile(() => this._subscribed))
      .subscribe(devices => {
        if (!!devices) {
          this.devices = devices;
        }
      });
  }

  async forceDeviceToPlay(deviceId: string) {
    var tst = await this.spotifyService.forceDeviceToPlay(deviceId);
    console.log(tst)
    this.modalService.hideModal();
  }

  ngOnDestroy() {
    this._subscribed = false;
  }
}
