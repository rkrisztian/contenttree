import { ElementRef, Service, signal } from '@angular/core';

@Service({ autoProvided: false })
export class TreeScrollService {
  readonly containerElementRef = signal<ElementRef<HTMLElement> | null>(null);

  private readonly scrollPosition = signal<[number, number] | null>(null);

  readonly saveScrollPosition = () => {
    if (this.containerElementRef()) {
      this.scrollPosition.set([
        this.containerElementRef()!.nativeElement.scrollLeft,
        this.containerElementRef()!.nativeElement.scrollTop,
      ]);
    }
  };

  readonly restoreScrollPosition = () => {
    if (this.containerElementRef() && this.scrollPosition()) {
      this.containerElementRef()!.nativeElement.scrollLeft = this.scrollPosition()![0];
      this.containerElementRef()!.nativeElement.scrollTop = this.scrollPosition()![1];
    }
  };
}
