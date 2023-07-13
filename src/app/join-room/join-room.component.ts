import { Component } from '@angular/core';
import {RoomService} from "../room.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {SnackbarService} from "../snack-bar.service";

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.css']
})
export class JoinRoomComponent {
  roomIdentifier: string = "";

  constructor(private roomService: RoomService, private snackbarService: SnackbarService, private router: Router) {
  }

  async joinRoom() {
    let response;
    if (this.roomIdentifier.length != 5) {
      this.snackbarService.openSnackBar("RoomId must at least be 5 characters!", "RETRY", () => this.joinRoom())
      return;
    }

    try {
      response = await this.roomService.fetchRoom(this.roomIdentifier);

      if(response != null) {
        this.router.navigateByUrl("/music-room/" + this.roomService.room.roomIdentifier);
      } else {
        this.snackbarService.openSnackBar("This room seems not to exist, please check your input.", "RETRY", () => this.joinRoom())
      }

    } catch(error) {
      console.log(error)
      this.snackbarService.openSnackBar("Some error occured.", "RETRY", () => this.joinRoom())
    }
  }

}
