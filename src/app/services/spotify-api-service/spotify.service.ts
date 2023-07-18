import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import credentials from "../../../assets/credentials.json";
import {lastValueFrom} from "rxjs";
import {RoomService} from "../room-api-service/room.service";
import {AlreadyAuthenticated} from "../../errors/AlreadyAuthenticated";
import {NoLoginRequired} from "../../errors/NoLoginRequired";
import {NoSuchRoomError} from "../../errors/NoSuchRoomError";
import {NoDeviceRunningError} from "../../errors/NoDeviceRunningError";
import {SongDetails} from "../../interfaces/SongDetails";
import {CantTogglePlayingStateError} from "../../errors/CantTogglePlayingStateError";
import {NotAuthenticatedError} from "../../errors/NotAuthenticatedError";
import {AlreadyVotedError} from "../../errors/AlreadyVotedError";
import {CantSkipSongError} from "../../errors/CantSkipSongError";
import {OnlyHostPrivilegeError} from "../../errors/OnlyHostPrivilegeError";

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  //TODO rewrite try / catch

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
        throw new AlreadyAuthenticated("");
      }
      else if (error.status == 406)
      {
        throw new NoLoginRequired("");
      }
      else if (error.status == 404)
      {
        throw new NoSuchRoomError("");
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
      if (error.status == 403)
      {
        throw new NoDeviceRunningError("");
      }
      else if (error.status == 404)
      {
        throw new NoSuchRoomError("");
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
        throw new CantTogglePlayingStateError("");
      }
      else if (error.status == 404)
      {
        throw new NotAuthenticatedError("");
      }
      else if (error.status == 403)
      {
        throw new NoSuchRoomError("");
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
        throw new AlreadyVotedError("");
      }
      else if (error.status == 500)
      {
        throw new CantSkipSongError("");
      }
      else if (error.status == 404)
      {
        throw new NoSuchRoomError("");
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
        throw new OnlyHostPrivilegeError("");
      }
      else if (error.status == 500)
      {
        throw new CantSkipSongError("");
      }
      else if (error.status == 404)
      {
        throw new NoSuchRoomError("");
      }
      throw error;
    }
  }

  searchSong(queryString: string)
  {
    const response = this.http.post(
      credentials.baseUri + credentials.endpoints.spotify.search_song,
      {
        'roomIdentifier': this.roomService.room.roomIdentifier,
        'queryString': queryString
      },
      {withCredentials: true}
    )

    return lastValueFrom(response);
  }

  addTrackToPlackback(trackHref: string)
  {
    const response = this.http.post(
      credentials.baseUri + credentials.endpoints.spotify.add_track_to_playback,
      {
        'roomIdentifier': this.roomService.room.roomIdentifier,
        'trackHref': trackHref,
      },
      {withCredentials: true}
    )

    return lastValueFrom(response)
  }
}
