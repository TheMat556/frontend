import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";

import credentials from "../assets/credentials.json";
import {lastValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  room: any;

  constructor(private http: HttpClient) { }

  async createRoom(guestCanPause: string, votesToSkip: number): Promise<void> {
    try {
      const response = this.http.post(
        credentials.baseUri + credentials.endpoints.room.create,
        {
          "guestCanPause": guestCanPause,
          "votesToSkip": votesToSkip
        }, {withCredentials: true}
      );
      this.room = await lastValueFrom(response);
    } catch (error) {
      throw new Error();
    }
  }

  async fetchRoom(roomIdentifier: string): Promise<void> {
    try {
      const response = this.http.get(
        credentials.baseUri + credentials.endpoints.room.get + `?roomIdentifier=${roomIdentifier}`,
        {withCredentials: true}
      );
      this.room = await lastValueFrom(response);
    } catch (error) {
      throw new Error();
    }

  }

  async leaveRoom(roomIdentifier: string): Promise<void> {
    try {
      const response = this.http.get(
        credentials.baseUri + credentials.endpoints.room.leave_room + `?roomIdentifier=${roomIdentifier}`,
        {withCredentials: true}
      );
      console.log(lastValueFrom(response));
    } catch (error) {
      throw new Error();
    }
  }

}
