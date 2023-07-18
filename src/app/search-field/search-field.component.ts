import {Component} from '@angular/core';
import {SpotifyService} from "../services/spotify-api-service/spotify.service";
import {SnackbarService} from "../services/snack-bar-service/snack-bar.service";

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.css']
})
export class SearchFieldComponent {
  focus: boolean = false;
  queryContent: string = "";
  queryResult: any = [];

  constructor(private spotifyService: SpotifyService, private snackBarService: SnackbarService) {}

  ngOnInit() {
    document.addEventListener('click', (event) => {
      const targetElement = event.target as HTMLElement;
      //TODO: Not that clean
      const componentElement = document.querySelector('.relative.w-96.max-w-lg.z-20');

      if(componentElement != null) {
        if (!componentElement.contains(targetElement)) {
          this.focus = false;
        }
      }
    });
  }

  setFocus(focus: boolean) {
    this.focus = focus;
  }

  async searchSong(event: any) {
    if (event != ""){
      this.queryResult = await this.spotifyService.searchSong(event);
    }
  }

  async addTrackToPlayback(trackHref: string) {
    const response = await this.spotifyService.addTrackToPlackback(trackHref);
    if(response) {
      this.snackBarService.openSnackBar("Track was successfully added to the queue!", "", () => {})
    } else {
      this.snackBarService.openSnackBar("There seems to be a problem, would you like to try it again?", "RETRY", () => this.addTrackToPlayback(trackHref))
    }
    this.focus = false;
  }

}
