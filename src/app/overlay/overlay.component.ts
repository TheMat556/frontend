// overlay.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent {
  @Input() isOpen: boolean = false;
  @Input() content: any;

  closeOverlay(): void {
    this.isOpen = false;
  }
}
