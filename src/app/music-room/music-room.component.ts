import {Component} from '@angular/core';
import {RoomService} from "../room.service";
import {Router} from "@angular/router";
import {SpotifyService} from "../spotify.service";
import {interval, Subscription} from "rxjs";
import {PageLoaderService} from "../page-loader.service";
import {SnackbarService} from "../snack-bar.service";
import {ModalService} from "../modal.service";

@Component({
  selector: 'app-music-room',
  templateUrl: './music-room.component.html',
  styleUrls: ['./music-room.component.css']
})
export class MusicRoomComponent {
  currentImgUrl: string = "";
  songTitle: string = "...";
  artist: string = "...";
  currentProgress: number = 0;
  songDuration: number = 100;
  playingStatus: boolean = true;
  neededVoteSkips: number = 0;
  currentVoteSkips: number = 0;

  subscription: Subscription | undefined;
  devices: any;

  constructor(public roomService: RoomService,
              private spotifyService: SpotifyService,
              private router: Router,
              private pageLoadingService: PageLoaderService,
              private snackBarService: SnackbarService,
              private modalService: ModalService
  ) {}

  async ngOnInit() {
    const roomIdentifier = this.router.url.split('/').pop();
    let response;
    //TODO: Could specify the error, so we differenciate between connection and server error

    try {
      this.pageLoadingService.showFullPageLoader();
      await this.roomService.fetchRoom(roomIdentifier!);

      if(this.roomService.room == null) {
        this.pageLoadingService.hideFullPageLoader();
        this.snackBarService.openSnackBar("This room does not exist or has been closed please try another room id.", "RETRY", () => {this.router.navigateByUrl('/join-room')})
        return;
      }

      const isRoomOwner = await this.roomService.checkRoomOwner(roomIdentifier!)

      if(isRoomOwner) {
        response = await this.spotifyService.loginIntoSpotify();

        if(response != null) {
          await this.openNewWindow(response.toString())
        }
      }

      this.pageLoadingService.hideFullPageLoader();
      this.subscribeCurrentSong();
    } catch(error) {
      this.pageLoadingService.hideFullPageLoader();
      this.snackBarService.openSnackBar("There seems to be a connection issue", "CONNECT", () => {
        window.location.reload();
      })
    }

  }

  subscribeCurrentSong() {
    this.subscription = interval(1000)
      .subscribe(() => {
        this.spotifyService.getCurrentSong(this.roomService.room.roomIdentifier).then((response: any) => {
          this.songTitle = response.title;
          this.artist = response.artist[0].name;
          this.currentImgUrl = response.image_url[0].url;
          this.currentProgress = response.time;
          this.songDuration = response.duration;
          this.playingStatus = response.is_playing;
          this.currentVoteSkips = response.currentVotesToSkip;
          this.neededVoteSkips = response.votesToSkip;
        }).catch(async (e) => {
          if (e.status == 426) {
            let devices: any = await this.spotifyService.getDevices();
            this.modalService.showModal(devices);
          }
        })
      });
  }

  togglePlayingStatus() {
    this.spotifyService.togglePlayingStatus(this.roomService.room.roomIdentifier).then(() => {
    })
  }

  async skipSong() {
    try {
      const response = await this.spotifyService.skipSong(this.roomService.room.roomIdentifier);
    } catch (error) {
      console.log(error)
    }
  }

  rollBackSong() {
    this.spotifyService.rollBackSong(this.roomService.room.roomIdentifier);
  }

  async leaveRoom() {
    this.subscription?.unsubscribe()
    if (await this.roomService.checkRoomOwner(this.roomService.room.roomIdentifier)) {
      await this.roomService.leaveRoom(this.roomService.room.roomIdentifier);
    }
    this.router.navigateByUrl("");
  }

  //TODO: Interface
  async getCurrentSong(roomIdentifier: string) {
      this.spotifyService.getCurrentSong(this.roomService.room.roomIdentifier).then((response: any) => {
        this.songTitle = response.title;
        this.artist = response.artist[0].name;
        this.currentImgUrl = response.image_url[0].url;
        this.currentProgress = response.time;
        this.songDuration = response.duration;
        this.playingStatus = response.is_playing;
        this.currentVoteSkips = response.currentVotesToSkip;
        this.neededVoteSkips = response.votesToSkip;
      }).catch(async (e) => {
        if (e.status == 426) {
          let devices: any = await this.spotifyService.getDevices();
          this.modalService.showModal(devices);
          this.modalService.hideModal();
        }
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
