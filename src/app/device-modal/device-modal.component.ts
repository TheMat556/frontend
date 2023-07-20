import {Component, Input} from '@angular/core';
import {SpotifyService} from "../services/spotify-api-service/spotify.service";
import {OverlayService} from "../overlay.service";
import {SnackbarService} from "../services/snack-bar-service/snack-bar.service";

@Component({
  selector: 'app-device-modal',
  templateUrl: './device-modal.component.html',
  styleUrls: ['./device-modal.component.css']
})
export class DeviceModalComponent {
  @Input() devices: any;

  //devices: any;
  constructor
  (
    private spotifyService: SpotifyService,
    private overlayService: OverlayService,
    private snackBarService: SnackbarService,
  )
  {
  }

  async forceDeviceToPlay(deviceId: string)
  {
    try
    {
      await this.spotifyService.forceDeviceToPlay(deviceId);
      this.overlayService.closeOverlay();
    }
    catch (error)
    {
      this.snackBarService.openSnackBar("Unspecified error occurred.", "RETRY", () =>
      {
        this.forceDeviceToPlay(deviceId);
      });
      throw error;
    }
  }
}
