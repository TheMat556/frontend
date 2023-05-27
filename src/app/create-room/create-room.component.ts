import { Component } from '@angular/core';
import {RoomService} from "../room.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent {
  public guestCanPause: string = "true"
  public votesToSkip: number = 2;

  constructor(private roomService: RoomService, private router: Router) { }

  createRoomOnClick() {
    this.roomService.createRoom(this.guestCanPause, this.votesToSkip)
      .then((result: any) => {
        this.router.navigate(['/music-room/' + result.roomIdentifier])
      });
  }


}
