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

  forceDeviceToPlay(deviceId: string) {
    const response = this.http.get(
      credentials.baseUri + credentials.endpoints.spotify.forceDeviceToPlay + "?deviceId=" + deviceId,
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

  async rollBackSong(roomIdentifier: string) {
    const response = this.http.get(
      credentials.baseUri + credentials.endpoints.spotify.rollback_song + "?code=" + roomIdentifier,
      {withCredentials: true}
    )
    return await lastValueFrom(response);
  }

  //TODO: It would be better to pass the roomIdentifier
  searchSong(queryString: string) {
    const response = this.http.post(
      credentials.baseUri + credentials.endpoints.spotify.search_song,
      {
        'roomIdentifier': this.roomServie.room.roomIdentifier,
        'queryString': queryString
      },
      {withCredentials: true}
    )

    return lastValueFrom(response);
  }

  addTrackToPlackback(trackHref: string) {
    const response = this.http.post(
      credentials.baseUri + credentials.endpoints.spotify.add_track_to_playback,
      {
        'roomIdentifier': this.roomServie.room.roomIdentifier,
        'trackHref': trackHref,
      },
      {withCredentials: true}
    )

    return lastValueFrom(response)
  }
}
