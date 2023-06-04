import {Component, ChangeDetectorRef} from '@angular/core';
import {RoomService} from "../room.service";
import {NavigationExtras, Router} from "@angular/router";
import {SpotifyService} from "../spotify.service";
import {BehaviorSubject, interval, Observable, of, repeat, Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-music-room',
  templateUrl: './music-room.component.html',
  styleUrls: ['./music-room.component.css']
})
export class MusicRoomComponent {
  nextImgUrl: string = "";
  currentImgUrl: string = "";
  prevImgUrl: string = "";
  songTitle: string = "...";
  artist: string = "...";
  currentProgress: number = 0;
  songDuration: number = 100;
  playingStatus: boolean = true;
  neededVoteSkips: number = 0;
  currentVoteSkips: number = 0;

  loading: boolean = true;
  subscription: Subscription | undefined;
  constructor(public roomService: RoomService, private spotifyService: SpotifyService, private router: Router, private cdr: ChangeDetectorRef, public snackBar: MatSnackBar) {
  }

  async ngOnInit() {
    const roomIdentifier = this.router.url.split('/').pop();
    //TODO: Could specify the error, so we differenciate between connection and server error
    try {
      await this.roomService.fetchRoom(roomIdentifier!);

      this.spotifyService.loginIntoSpotify().then((response: any): any => {
        if (response !== null) {
          return this.openNewWindow(response.toString());
        }
      }).then(() => {
        this.loading = false;
        this.cdr.detectChanges();

        this.subscription = interval(1000)
          .subscribe(() => {
            this.getCurrentSong(this.roomService.room.roomIdentifier)
          });
      })
    } catch(error) {
      this.openSnackBar("There seems to be a connection issue", "CONNECT")
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 100000,
    });

    this.snackBar._openedSnackBarRef?.onAction().subscribe(
      () => {
        window.location.reload();
      }
    )
  }

  togglePlayingStatus() {
    this.spotifyService.togglePlayingStatus(this.roomService.room.roomIdentifier).then(() => {
    })
  }

  skipSong() {
    this.spotifyService.skipSong(this.roomService.room.roomIdentifier);
  }

  leaveRoom() {
    this.subscription?.unsubscribe()
    this.roomService.leaveRoom(this.roomService.room.roomIdentifier).then(() => {

      this.router.navigateByUrl("");
    });
  }

  getCurrentSong(roomIdentifier: string) {
    this.spotifyService.getCurrentSong(this.roomService.room.roomIdentifier).then((response: any) => {
      this.songTitle = response.title;
      this.artist = response.artist[0].name;
      this.currentImgUrl = response.image_url[0].url;
      this.currentProgress = response.time;
      this.songDuration = response.duration;
      this.playingStatus = response.is_playing;
      this.currentVoteSkips = response.currentVotesToSkip;
      this.neededVoteSkips = response.votesToSkip;
    })
  }

  formatDuration(durationInMilliseconds: number): string {
    const totalSeconds = Math.floor(durationInMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  openNewWindow(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const newWindow = window.open(url);

      if (!newWindow) {
        reject(new Error('Failed to open new window'));
      }

      const checkClosed = setInterval(() => {
        if (newWindow!.closed) {
          clearInterval(checkClosed);
          resolve();
        }
      }, 1000);

      newWindow!.addEventListener('close', () => {
        clearInterval(checkClosed);
        resolve();
      });
    });
  }

}
