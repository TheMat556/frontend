import {ChangeDetectorRef, Component} from '@angular/core';
import {RoomService} from "../room.service";
import { Router } from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent {
  public guestCanPause: string = "true"
  public requiredVotesToSkip: number = 2;

  public error: boolean = false;
  public errorMessage: string = "";

  loading: boolean = false;

  constructor(private roomService: RoomService, private router: Router, public snackBar: MatSnackBar, private cdr: ChangeDetectorRef) { }

  async createRoomOnClick() {
    try {
      this.loading = true
      await this.roomService.createRoom(this.guestCanPause, this.requiredVotesToSkip)

      if(this.roomService.room == null)
      {
        throw new Error();
      }

      this.router.navigateByUrl('/music-room/' + this.roomService.room.roomIdentifier)
    } catch (error) {
      this.loading = false
      this.openSnackBar("Could not connect to the server.", "RETRY")
      this.cdr.detectChanges()
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });

    this.snackBar._openedSnackBarRef?.onAction().subscribe(
      () => {
        this.createRoomOnClick();
      }
    )
  }


}
