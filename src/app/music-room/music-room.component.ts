import { Component } from '@angular/core';
import {RoomService} from "../room.service";
import {NavigationExtras, Router} from "@angular/router";
import {SpotifyService} from "../spotify.service";

@Component({
  selector: 'app-music-room',
  templateUrl: './music-room.component.html',
  styleUrls: ['./music-room.component.css']
})
export class MusicRoomComponent {

  constructor(private roomService: RoomService, private spotifyService: SpotifyService,private router: Router) {}

  ngOnInit() {
    const roomIdentifier = this.router.url.split('/').pop()
    this.roomService.fetchRoom(roomIdentifier!).then((result: any) => {
      if(result !== null)
      {
        this.spotifyService.loginIntoSpotify().then((response) => {
          //window.open(response.toString())
          //TODO: UI should load until the authentication process is finished

        })
      }
    })
  }

}
