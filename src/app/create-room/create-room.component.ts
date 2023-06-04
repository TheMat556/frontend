import { Component} from '@angular/core';
import {RoomService} from "../room.service";
import {Router} from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable, of, Subject} from "rxjs";

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
  loading$: Observable<boolean> = of(true);
  private loadingSubject: Subject<boolean> = new Subject<boolean>();

  ngOnInit() {
    this.loading$ = this.loadingSubject.asObservable();

    this.loading$.subscribe(value => {
      this.loading = value;
    });
  }

  constructor(private roomService: RoomService, private router: Router, public snackBar: MatSnackBar) {
  }

  async createRoomOnClick() {
    try {
      this.loadingSubject.next(true);
      await this.roomService.createRoom(this.guestCanPause, this.requiredVotesToSkip)

      if (this.roomService.room == null) {
        throw new Error();
      }

      this.router.navigateByUrl('/music-room/' + this.roomService.room.roomIdentifier)
    } catch (error) {
      this.loadingSubject.next(false);
      this.openSnackBar("Could not connect to the server.", "RETRY")
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
