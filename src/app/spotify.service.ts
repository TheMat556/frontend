import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import credentials from "../assets/credentials.json";
import {lastValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private http: HttpClient) {}

  loginIntoSpotify () {
    const response = this.http.get(
      credentials.baseUri + credentials.endpoints.spotify.login)
    return lastValueFrom(response)
  }
}
