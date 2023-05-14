import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";

import credentials from "../assets/credentials.json";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  async createRoom(guestCanPause: string, votesToSkip: number): Promise<any> {
    try {
      const response = await this.http.post(
        credentials.baseUri + credentials.endpoints.room.basic + credentials.endpoints.room.create,
        {
          "guestCanPause": guestCanPause,
          "votesToSkip": votesToSkip
        }
      ).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }
}
