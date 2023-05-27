import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";

import credentials from "../assets/credentials.json";
import {lastValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  async createRoom(guestCanPause: string, votesToSkip: number): Promise<any> {
    try {
      const response = this.http.post(
        credentials.baseUri + credentials.endpoints.room.create,
        {
          "guestCanPause": guestCanPause,
          "votesToSkip": votesToSkip
        }
      );
      return lastValueFrom(response);
    } catch (error) {
      throw error;
      return null;
    }
  }

  async fetchRoom(roomIdentifier: string): Promise<any> {
    try {
      const response = this.http.get(
        credentials.baseUri + credentials.endpoints.room.get + `?roomIdentifier=${roomIdentifier}`,
      );
      return lastValueFrom(response)
    } catch (error) {
      throw error;
      return null;
    }
  }
}
