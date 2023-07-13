import { Component} from '@angular/core';
import {RoomService} from "../room.service";
import {Router} from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";
import {PageLoaderService} from "../page-loader.service";
import {SnackbarService} from "../snack-bar.service";
import {delay} from "rxjs";

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent {
  public guestCanPause: string = "true"
  public requiredVotesToSkip: number = 2;

  constructor(private snackBarService: SnackbarService, private roomService: RoomService, private router: Router, private pageLoaderService: PageLoaderService, public snackBar: MatSnackBar) { }


  async createRoomOnClick() {
    try {
      this.pageLoaderService.showFullPageLoader("Loading")
      await this.roomService.createRoom(this.guestCanPause, this.requiredVotesToSkip)

      console.log(this.roomService.room)

      if (this.roomService.room == null) {
        throw new Error();
      }

      await this.router.navigateByUrl('/music-room/' + this.roomService.room.roomIdentifier)
      this.pageLoaderService.hideFullPageLoader()
    } catch (error) {
      console.log(error)
      this.pageLoaderService.hideFullPageLoader()
      this.snackBarService.openSnackBar("Could not connect to the server.", "RETRY", () => {
        this.createRoomOnClick();
      });
    }
  }


}
