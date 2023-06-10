import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

import credentials from "../assets/credentials.json";
import {catchError, lastValueFrom, throwError} from "rxjs";
import {RoomService} from "./room.service";

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  //TODO rewrite try / catch

  constructor(private http: HttpClient, private roomServie: RoomService) {
  }

  loginIntoSpotify() {
    const response = this.http.get(
      credentials.baseUri + credentials.endpoints.spotify.login + "?roomIdentifier=" + this.roomServie.room.roomIdentifier,
      {withCredentials: true}
    )
    return lastValueFrom(response)
  }

  getCurrentSong(roomIdentifier: string) {
    try {
      const response = this.http.get(
        credentials.baseUri + credentials.endpoints.spotify.current_song + "?code=" + roomIdentifier,
        {withCredentials: true}
      ).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error)
        })
      )

      return lastValueFrom(response);
    } catch (error) {
      console.log("!!")
      throw error
    }
  }

  getDevices() {

    const response = this.http.get(
      credentials.baseUri + credentials.endpoints.spotify.get_devices,
      {withCredentials: true}
    ).pipe(
      catchError((error) => {
        return throwError(error);
      })
    )

    return lastValueFrom(response);
  }

  forceDeviceToPlay(deviceId: any) {
    const response = this.http.post(
      credentials.baseUri + credentials.endpoints.spotify.forceDeviceToPlay,
      {deviceId},
      {withCredentials: true}
    )
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
