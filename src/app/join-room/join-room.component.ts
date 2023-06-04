import { Component } from '@angular/core';
import {RoomService} from "../room.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.css']
})
export class JoinRoomComponent {
  roomIdentifier: string = "";

  constructor(private roomService: RoomService, private snackBar: MatSnackBar, private router: Router) {
  }

  async joinRoom() {
    let response;
    if (this.roomIdentifier.length != 5) {
      this.openSnackBar("RoomID must have 5 characters!", "RETRY")
    }

    try {
      response = await this.roomService.fetchRoom(this.roomIdentifier);

      if(response != null) {
        this.router.navigateByUrl("/music-room");
      }

    } catch(error) {
      this.openSnackBar("RoomID must have 5 characters!", "RETRY")
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });

    this.snackBar._openedSnackBarRef?.onAction().subscribe(
      () => {
        this.joinRoom();
      }
    )
  }
}
