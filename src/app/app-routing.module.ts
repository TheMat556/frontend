import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CreateRoomComponent} from "./create-room/create-room.component";
import {LandingPageComponent} from "./landing-page/landing-page.component";
import {JoinRoomComponent} from "./join-room/join-room.component";
import {MusicRoomComponent} from "./music-room/music-room.component";

const routes: Routes = [
  { path: '', component: LandingPageComponent},
  { path: 'create-room', component: CreateRoomComponent },
  { path: 'join-room', component: JoinRoomComponent },
  { path: 'music-room', component: MusicRoomComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
