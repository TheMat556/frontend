import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {CreateRoomComponent} from "./create-room/create-room.component";
import { JoinRoomComponent } from './join-room/join-room.component';
import { MusicRoomComponent } from './music-room/music-room.component';
import {FormsModule} from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { DeviceModalComponent } from './device-modal/device-modal.component';
import { SearchFieldComponent } from './search-field/search-field.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    CreateRoomComponent,
    JoinRoomComponent,
    MusicRoomComponent,
    PageLoaderComponent,
    DeviceModalComponent,
    SearchFieldComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatSnackBarModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
