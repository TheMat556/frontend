import {Component} from '@angular/core';
import {RoomService} from "../services/room-api-service/room.service";
import {Router} from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";
import {PageLoaderService} from "../services/page-loader-service/page-loader.service";
import {SnackbarService} from "../services/snack-bar-service/snack-bar.service";
import {Room} from "../interfaces/Room";
import {NoSuchRoomError} from "../errors/NoSuchRoomError";

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent {
  public guestCanPause: string = "true"
  public requiredVotesToSkip: number = 2;
  public buttonText = "Create";

  constructor
  (
    private snackBarService: SnackbarService,
    private roomService: RoomService,
    private router: Router,
    private pageLoaderService: PageLoaderService,
    public snackBar: MatSnackBar
  )
  {
  }

  async ngOnInit()
  {
    try
    {
      const response: Room = await this.roomService.checkIfUserHasRoom() as Room;

      this.buttonText = "Update";
      this.requiredVotesToSkip = response.votesToSkip;
      this.guestCanPause = String(response.guestCanPause);
    }
    catch (error)
    {
      if (error instanceof NoSuchRoomError)
      {
        this.buttonText = "Create";
        return;
      }
    }
  }

  async createRoomOnClick()
  {
    try
    {
      this.pageLoaderService.showFullPageLoader("Loading")
      await this.roomService.createRoom(this.guestCanPause, this.requiredVotesToSkip)

      await this.router.navigateByUrl('/music-room/' + this.roomService.room.roomIdentifier)
      this.pageLoaderService.hideFullPageLoader()
    }
    catch (error)
    {
      this.pageLoaderService.hideFullPageLoader()
      this.snackBarService.openSnackBar("Could not connect to the server.", "RETRY", () =>
      {
        this.createRoomOnClick();
      });
    }
  }


}
