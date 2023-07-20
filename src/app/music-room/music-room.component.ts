import {Component, TemplateRef, ViewChild} from '@angular/core';
import {RoomService} from "../services/room-api-service/room.service";
import {Router} from "@angular/router";
import {SpotifyService} from "../services/spotify-api-service/spotify.service";
import {interval, Subscription} from "rxjs";
import {SnackbarService} from "../services/snack-bar-service/snack-bar.service";
import {createDefaultSongDetails, SongDetails} from "../interfaces/SongDetails";
import * as Errors from "../errors";
import {OverlayService} from "../overlay.service";

@Component({
  selector: 'app-music-room',
  templateUrl: './music-room.component.html',
  styleUrls: ['./music-room.component.css']
})
export class MusicRoomComponent {
  songDetails: SongDetails;
  subscription: Subscription | undefined;
  devices: any;

  @ViewChild('loadingSpinner', { static: true }) loadingSpinner!: TemplateRef<any>;
  @ViewChild('deviceModal', { static: true }) deviceModal!: TemplateRef<any>;


  constructor
  (
    public roomService: RoomService,
    private spotifyService: SpotifyService,
    private router: Router,
    private snackBarService: SnackbarService,
    private overlayService: OverlayService
  )
  {
    this.songDetails = createDefaultSongDetails();
  }

  async ngOnInit()
  {
    const roomIdentifier = this.router.url.split('/').pop();
    try
    {
      this.overlayService.openOverlay(this.loadingSpinner);

      await this.handleFetchRoom(roomIdentifier!);
      await this.handleSpotifyLogin(roomIdentifier!);

      this.overlayService.closeOverlay();
      this.subscribeCurrentSong();
    }
    catch (error)
    {
      this.overlayService.closeOverlay();
    }

  }

  subscribeCurrentSong()
  {
    this.subscription = interval(1000)
      .subscribe(() =>
      {
        this.spotifyService.getCurrentSong(this.roomService.room.roomIdentifier).then((response: SongDetails) =>
        {
          this.songDetails = response;
        }).catch(async (error) =>
        {
          if (error instanceof Errors.NoSuchRoomError)
          {
            this.subscription?.unsubscribe();
            this.snackBarService.openSnackBar("Room does not exist anymore or has been closed.", "HOME", () =>
            {
              this.router.navigateByUrl("");
            }, Number.MAX_VALUE);
          }
          else if (error instanceof Errors.NoDeviceRunningError)
          {
            this.devices = await this.spotifyService.getDevices();
            this.overlayService.openOverlay(this.deviceModal);
          }

          throw error;
        })
      });
  }

  async handleFetchRoom(roomIdentifier: string)
  {
    try
    {
      await this.roomService.fetchRoom(roomIdentifier);
    }
    catch (error)
    {
      if (error instanceof Errors.NoSuchRoomError)
      {
        this.snackBarService.openSnackBar("This room does not exist or has been closed please try another room id.", "RETRY", () =>
        {
          this.router.navigateByUrl('/join-room')
        });
      }
      else
      {
        this.snackBarService.openSnackBar("Error occured.", "RETRY", () =>
        {
          window.location.reload();
        })
      }

      throw error;
    }
  }

  async handleSpotifyLogin(roomIdentifier: string)
  {
    try
    {
      const isRoomOwner = await this.roomService.checkRoomOwner(roomIdentifier)

      if (isRoomOwner)
      {
        const response = await this.spotifyService.loginIntoSpotify();

        if (response != null)
        {
          await this.openNewWindow(response.toString())
        }
      }
    }
    catch (error: any)
    {
      if (error instanceof Errors.NoSuchRoomError)
      {
        this.snackBarService.openSnackBar("Room does not exist", "RETRY", () =>
        {
          window.location.reload();
        })
      }
      else if (error instanceof Errors.AlreadyAuthenticated)
      {
        this.snackBarService.openSnackBar("You are already authenticated", "RETRY", () =>
        {
        })
      }
      else if (error instanceof Errors.BlockedPopupError)
      {
        this.snackBarService.openSnackBar("Your browser is blocking popups. Please allow popups and refresh the window after updating the settings.", "REFRESH", () => {
          window.location.reload()
        }, Number.MAX_VALUE)
      }
      else
      {
        this.snackBarService.openSnackBar("Unspecified error occurred", "RETRY", () =>
        {
          window.location.reload();
        })
      }

      throw error;
    }

  }

  async togglePlayingStatus()
  {
    try
    {
      await this.spotifyService.togglePlayingStatus(this.roomService.room.roomIdentifier);
    }
    catch (error)
    {
      if (error instanceof Errors.CantTogglePlayingStateError)
      {
        this.snackBarService.openSnackBar("Host is not authenticated anymore.", "RETRY", () =>
        {
          this.togglePlayingStatus();
        });
      }
      else if (error instanceof Errors.NotAuthenticatedError)
      {
        this.snackBarService.openSnackBar("Host is not authenticated anymore.", "", () =>
        {
        });
      }
      else if (error instanceof Errors.NoSuchRoomError)
      {
        this.snackBarService.openSnackBar("Room does not exist anymore or has been closed.", "HOME", () =>
        {
          this.router.navigateByUrl("");
        }, Number.MAX_VALUE);
      }
      throw error;
    }
  }

  async skipSong()
  {
    try
    {
      const response: any = await this.spotifyService.skipSong(this.roomService.room.roomIdentifier);

      if (response.message == "voted")
      {
        this.snackBarService.openSnackBar("Successfully voted for a skip!", "", () =>
        {
        });
      }
      else if (response.message == "skipped")
      {
        this.snackBarService.openSnackBar("Song has been skipped successfully!", "", () =>
        {
        });
      }
    }
    catch (error)
    {
      if (error instanceof Errors.AlreadyVotedError)
      {
        this.snackBarService.openSnackBar("You can only vote once per song!", "", () =>
        {
        });
      }
      else if (error instanceof Errors.CantSkipSongError)
      {
        this.snackBarService.openSnackBar("Cant skip song currently.", "RETRY", () =>
        {
          this.skipSong();
        });
      }
      else if (error instanceof Errors.NoSuchRoomError)
      {
        this.snackBarService.openSnackBar("The room does not exist anymore or has been closed.", "HOME", () =>
        {
          this.router.navigateByUrl("");
        });
      }
      throw error;
    }
  }

  async rollBackSong()
  {
    try
    {
      const response: any = await this.spotifyService.rollBackSong(this.roomService.room.roomIdentifier);

      if (response.message == "rollback")
      {
        this.snackBarService.openSnackBar("Successfully rolled back!", "", () =>
        {
        })
      }
    }
    catch (error)
    {
      if (error instanceof Errors.OnlyHostPrivilegeError)
      {
        this.snackBarService.openSnackBar("Currently only the host can rollback songs.", "", () =>
        {
        })
      }
      else if (error instanceof Errors.CantSkipSongError)
      {
        this.snackBarService.openSnackBar("Currently only the host can rollback songs.", "", () =>
        {
          this.rollBackSong();
        })
      }
      else if (error instanceof Errors.NoSuchRoomError)
      {
        this.snackBarService.openSnackBar("The room does not exist anymore or has been closed.", "HOME", () =>
        {
          this.router.navigateByUrl("");
        });
      }
      throw error;
    }
  }

  async leaveRoom()
  {
    try
    {
      this.subscription?.unsubscribe()
      if (await this.roomService.checkRoomOwner(this.roomService.room.roomIdentifier))
      {
        await this.roomService.leaveRoom(this.roomService.room.roomIdentifier);
      }
      this.router.navigateByUrl("");
    }
    catch (error)
    {
      if (error instanceof Errors.NoSuchRoomError)
      {
        this.snackBarService.openSnackBar("The room does not exist anymore or has been closed.", "HOME", () =>
        {
          this.router.navigateByUrl("");
        });
      }

      throw error;
    }

  }

  formatDuration(durationInMilliseconds: number): string
  {
    const totalSeconds = Math.floor(durationInMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  openNewWindow(url: string): Promise<void>
  {
    return new Promise((resolve, reject) =>
    {
      const newWindow = window.open(url);

      if (newWindow == null)
      {
        reject(new Errors.BlockedPopupError(""));
      }

      const checkClosed = setInterval(() =>
      {
        if (newWindow!.closed)
        {
          clearInterval(checkClosed);
          resolve();
        }
      }, 1000);

      newWindow!.addEventListener('close', () =>
      {
        clearInterval(checkClosed);
        resolve();
      });
    });
  }

}
