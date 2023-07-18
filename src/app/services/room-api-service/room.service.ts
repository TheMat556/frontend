import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import credentials from "../../../assets/credentials.json";
import {lastValueFrom} from "rxjs";
import {createDefaultRoom, Room} from "../../interfaces/Room";
import {NoSuchRoomError} from "../../errors/NoSuchRoomError";

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  room: Room;

  constructor(private http: HttpClient)
  {
    this.room = createDefaultRoom();
  }

  async createRoom(guestCanPause: string, votesToSkip: number): Promise<void>
  {
    try
    {
      const requestBody = {
        "guestCanPause": guestCanPause,
        "votesToSkip": votesToSkip
      };

      this.room = await this.post(
        credentials.baseUri + credentials.endpoints.room.create,
        requestBody
      ) as Room;
    }
    catch (error)
    {
      throw new Error("Error occurred when fetching data from server");
    }
  }

  async fetchRoom(roomIdentifier: string): Promise<Object>
  {
    try
    {
      this.room = await this.get(
        credentials.baseUri + credentials.endpoints.room.get + `?roomIdentifier=${roomIdentifier}`
      ) as Room;

      return this.room;
    }
    catch (error: any)
    {
      //404 will be returned if the room is not found.
      if (error.status == 404)
      {
        throw new NoSuchRoomError("");
      }
      else
      {
        throw new Error();
      }
    }

  }

  async leaveRoom(roomIdentifier: string): Promise<Object>
  {
    try
    {
      return await this.get(
        credentials.baseUri + credentials.endpoints.room.leave_room + `?roomIdentifier=${roomIdentifier}`,
      )
    }
    catch (error: any)
    {
      if (error.status == 404)
      {
        throw new NoSuchRoomError("");
      }
      else
      {
        throw new Error();
      }
    }
  }

  async checkRoomOwner(roomIdentifier: string): Promise<Object>
  {
    try
    {
      return await this.get(
        credentials.baseUri + credentials.endpoints.room.check_room_owner + `?roomIdentifier=${roomIdentifier}`,
      )
    }
    catch (error: any)
    {
      if (error.status == 404)
      {
        throw new NoSuchRoomError("");
      }
      else
      {
        throw new Error();
      }
    }
  }

  async checkIfUserHasRoom() {
    try
    {
      return this.get(
        credentials.baseUri + credentials.endpoints.room.check_if_user_has_room
      );
    }
    catch (error)
    {
      if(error == 404)
      {
        throw new NoSuchRoomError("");
      }
      throw error;
    }
  }

  async get(url: string): Promise<Object>
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

}
