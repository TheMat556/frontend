import {Component} from '@angular/core';
import {SpotifyService} from "../services/spotify-api-service/spotify.service";
import {SnackbarService} from "../services/snack-bar-service/snack-bar.service";
import {Router} from "@angular/router";
import {NoSuchRoomError} from "../errors";

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.css']
})
export class SearchFieldComponent {
  focus: boolean = false;
  queryContent: string = "";
  queryResult: any = [];

  constructor
  (
    private spotifyService: SpotifyService,
    private snackBarService: SnackbarService,
    private router: Router,
  )
  {
  }

  ngOnInit()
  {
    document.addEventListener('click', (event) =>
    {
      const targetElement = event.target as HTMLElement;
      const componentElement = document.querySelector('.relative.w-96.max-w-lg.z-20');

      if (componentElement != null)
      {
        if (!componentElement.contains(targetElement))
        {
          this.focus = false;
        }
      }
    });
  }

  setFocus(focus: boolean)
  {
    this.focus = focus;
  }

  async searchSong(enteredText: any)
  {
    if (enteredText != "")
    {
      try
      {
        this.queryResult = await this.spotifyService.searchSong(enteredText);
      }
      catch (error)
      {
        this.snackBarService.openSnackBar("Room does not exist anymore or has been closed.", "HOME", () =>
        {
          this.router.navigateByUrl("");
        }, Number.MAX_VALUE);
        throw error;
      }
    }
  }

  async addTrackToPlayback(trackHref: string)
  {
    let response;
    try
    {
      response = await this.spotifyService.addTrackToPlayback(trackHref);
      if (response)
      {
        this.snackBarService.openSnackBar("Track was successfully added to the queue!", "", () =>
        {
        })
      }
      else
      {
        this.snackBarService.openSnackBar("There seems to be a problem, would you like to try it again?", "RETRY", () => this.addTrackToPlayback(trackHref))
      }
      this.focus = false;
    }
    catch (error)
    {
      if (error instanceof NoSuchRoomError)
      {
        this.snackBarService.openSnackBar("Room does not exist anymore or has been closed.", "HOME", () =>
        {
          this.router.navigateByUrl("");
        }, Number.MAX_VALUE);
      }
      else
      {
        this.snackBarService.openSnackBar("There seems to be a problem, would you like to try it again?", "RETRY", () => this.addTrackToPlayback(trackHref))
      }
    }
  }

}
