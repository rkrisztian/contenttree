import { ElementRef, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TreeScrollService {
  readonly containerElementRef = signal<ElementRef<HTMLElement> | null>(null);

  private readonly scrollPosition = signal<[number, number] | null>(null);

  readonly saveScrollPosition = () => {
    if (this.containerElementRef()) {
      this.scrollPosition.set([
        // @ts-expect-error: Already checked for null
        this.containerElementRef().nativeElement.scrollLeft,
        // @ts-expect-error: Already checked for null
        this.containerElementRef().nativeElement.scrollTop,
      ]);
    }
  };

  readonly restoreScrollPosition = () => {
    if (this.containerElementRef() && this.scrollPosition()) {
      // @ts-expect-error: Already checked for null
      this.containerElementRef().nativeElement.scrollLeft = this.scrollPosition()[0];
      // @ts-expect-error: Already checked for null
      this.containerElementRef().nativeElement.scrollTop = this.scrollPosition()[1];
    }
  };
}
