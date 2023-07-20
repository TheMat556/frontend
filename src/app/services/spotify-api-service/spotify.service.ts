import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import credentials from "../../../assets/credentials.json";
import {lastValueFrom} from "rxjs";
import {RoomService} from "../room-api-service/room.service";
import {SongDetails} from "../../interfaces/SongDetails";
import * as Errors from "../../errors";

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private http: HttpClient, private roomService: RoomService)
  {
  }

  async get(url: string)
  {
    return await lastValueFrom(this.http
      .get(
        url,
        {withCredentials: true}
      ));
  }

  async post(url: string, body: object): Promise<Object>
  {
    return await lastValueFrom(this.http
      .post(
        url,
        body,
        {withCredentials: true}
      ));
  }

  async loginIntoSpotify(): Promise<Object>
  {
    try
    {
      return await this.get(credentials.baseUri + credentials.endpoints.spotify.login + "?roomIdentifier=" + this.roomService.room.roomIdentifier);
    }
    catch (error: any)
    {
      if (error.status == 201)
      {
        throw new Errors.AlreadyAuthenticated("");
      }
      else if (error.status == 406)
      {
        throw new Errors.NoLoginRequired("");
      }
      else if (error.status == 404)
      {
        throw new Errors.NoSuchRoomError("");
      }
      else
      {
        throw new Error("There seems to be a connection issue.");
      }

    }
  }

  async getCurrentSong(roomIdentifier: string): Promise<SongDetails>
  {
    try
    {
      return await this.get(
        credentials.baseUri + credentials.endpoints.spotify.current_song + "?code=" + roomIdentifier,
      ) as SongDetails;
    }
    catch (error: any)
    {
      if (error.status == 426)
      {
        throw new Errors.NoDeviceRunningError("");
      }
      else if (error.status == 404)
      {
        throw new Errors.NoSuchRoomError("");
      }

      throw error;
    }
  }

  async getDevices()
  {
    try
    {
      return await this.get(
        credentials.baseUri + credentials.endpoints.spotify.get_devices,
      )
    }
    catch (error)
    {
      throw error;
    }
  }

  async forceDeviceToPlay(deviceId: string)
  {
    try
    {
      return await this.get(
        credentials.baseUri + credentials.endpoints.spotify.forceDeviceToPlay + "?deviceId=" + deviceId,
      )
    }
    catch (error)
    {
      throw error;
    }
  }

  async togglePlayingStatus(roomIdentifier: string)
  {
    try
    {
      return await this.get(
        credentials.baseUri + credentials.endpoints.spotify.toggle_playing_status + "?code=" + roomIdentifier,
      )
    }
    catch (error: any)
    {
      if (error.status == 500)
      {
        throw new Errors.CantTogglePlayingStateError("");
      }
      else if (error.status == 404)
      {
        throw new Errors.NotAuthenticatedError("");
      }
      else if (error.status == 403)
      {
        throw new Errors.NoSuchRoomError("");
      }

      throw error;
    }
  }

  async skipSong(roomIdentifier: string)
  {
    try
    {
      return await this.get(
        credentials.baseUri + credentials.endpoints.spotify.skip_song + "?code=" + roomIdentifier,
      );
    }
    catch (error: any)
    {
      if (error.status == 406)
      {
        throw new Errors.AlreadyVotedError("");
      }
      else if (error.status == 500)
      {
        throw new Errors.CantSkipSongError("");
      }
      else if (error.status == 404)
      {
        throw new Errors.NoSuchRoomError("");
      }
      throw error;
    }

  }

  async rollBackSong(roomIdentifier: string)
  {
    try
    {
      return await this.get(
        credentials.baseUri + credentials.endpoints.spotify.rollback_song + "?code=" + roomIdentifier,
      );
    }
    catch (error: any)
    {
      if (error.status == 403)
      {
        throw new Errors.OnlyHostPrivilegeError("");
      }
      else if (error.status == 500)
      {
        throw new Errors.CantSkipSongError("");
      }
      else if (error.status == 404)
      {
        throw new Errors.NoSuchRoomError("");
      }
      throw error;
    }
  }

  async searchSong(queryString: string)
  {
    try
    {
      const requestBody = {
        'roomIdentifier': this.roomService.room.roomIdentifier,
        'queryString': queryString
      };

      return await this.post(
        credentials.baseUri + credentials.endpoints.spotify.search_song,
        requestBody
      );
    }
    catch (error: any)
    {
      if(error.status == 404) {
        throw new Errors.NoSuchRoomError("");
      }

      throw error;
    }

  }

  async addTrackToPlayback(trackHref: string)
  {
    try
    {
      const requestBody = {
        'roomIdentifier': this.roomService.room.roomIdentifier,
        'trackHref': trackHref,
      };

      return await this.post(
        credentials.baseUri + credentials.endpoints.spotify.add_track_to_playback,
        requestBody
      );
    }
    catch (error)
    {
      if (error == 404 )
      {
        throw new Errors.NoSuchRoomError("");
      }

      throw error;
    }
  }
}
