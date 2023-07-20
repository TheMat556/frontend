import { Injectable, ComponentRef, ComponentFactoryResolver, ApplicationRef, Injector } from '@angular/core';
import { OverlayComponent } from './overlay/overlay.component';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  private overlayContainerRef: ComponentRef<OverlayComponent> | null = null;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  openOverlay(content: any): void {
    if (!this.overlayContainerRef) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(OverlayComponent);
      this.overlayContainerRef = componentFactory.create(this.injector);
      this.appRef.attachView(this.overlayContainerRef.hostView);
      document.body.prepend(this.overlayContainerRef.location.nativeElement); // Prepend instead of append
    }

    this.overlayContainerRef.instance.content = content;
    this.overlayContainerRef.instance.isOpen = true;
  }
  closeOverlay(): void {
    if (this.overlayContainerRef) {
      this.overlayContainerRef.instance.isOpen = false;
    }
  }
}
