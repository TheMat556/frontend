import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import credentials from "../assets/credentials.json";
import {lastValueFrom} from "rxjs";
import {RoomService} from "./room.service";

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private http: HttpClient, private roomServie: RoomService) {}

  loginIntoSpotify () {
    const response = this.http.get(
      credentials.baseUri + credentials.endpoints.spotify.login + "?roomIdentifier=" + this.roomServie.room.roomIdentifier,
      {withCredentials: true}
    )
    return lastValueFrom(response)
  }

  getCurrentSong(roomIdentifier: string) {
    const response = this.http.get(
      credentials.baseUri + credentials.endpoints.spotify.current_song + "?code=" + roomIdentifier,
      {withCredentials: true}
    )
    return lastValueFrom(response);
  }

  togglePlayingStatus(roomIdentifier: string) {
    const response = this.http.get(
      credentials.baseUri + credentials.endpoints.spotify.toggle_playing_status + "?code=" + roomIdentifier,
      {withCredentials: true}
    )
    return lastValueFrom(response);
  }

  skipSong(roomIdentifier: string) {
    const response = this.http.get(
      credentials.baseUri + credentials.endpoints.spotify.skip_song + "?code=" + roomIdentifier,
      {withCredentials: true}
    )
    return lastValueFrom(response);
  }

}
