import { Component } from '@angular/core';
import {RoomService} from "../room.service";

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent {
  public guestCanPause: string = "true"
  public votesToSkip: number = 2;

  constructor(private roomService: RoomService) { }

  createRoomOnClick() {
    this.roomService.createRoom(this.guestCanPause, this.votesToSkip)
      .then((result: any) => console.log(result));
  }


}
