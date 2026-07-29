import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render } from 'vitest-browser-angular';
import { page } from 'vitest/browser';
import { TreeScrollService } from './tree-scroll.service';

@Component({
  selector: 'app-dummy-selector',
  template: `
    <section aria-label="Scrollable container" #scrollableContainer>
      @if (showContents()) {
        @for (number of numbers; track number) {
          <span>Test number {{ number }}</span>
          <br />
        }
      }
    </section>
  `,
  styles: `
    section {
      font-size: 16px;
      line-height: 16px;
      height: 500px;
      max-height: 500px;
      overflow: auto;
    }
  `,
})
class TestScrollableContainer {
  readonly scrollableContainer = viewChild.required<ElementRef<HTMLElement>>('scrollableContainer');
  readonly showContents = signal<boolean>(true);
  readonly numbers = Array.from({ length: 1000 / 16 + 1 }, (_, i) => i);
}

describe('TreeScrollService', () => {
  let service: TreeScrollService;
  let componentInstance: TestScrollableContainer;

  beforeEach(async () => {
    const screen = await render(TestScrollableContainer, {
      providers: [TreeScrollService],
    });

    service = TestBed.inject(TreeScrollService);
    componentInstance = screen.fixture.componentInstance as TestScrollableContainer;
  });

  it('should save and restore the current scroll position', async () => {
    service.containerElementRef.set(componentInstance.scrollableContainer());

    await expect
      .element(page.getByRole('region', { name: 'Scrollable container', exact: true }))
      .toMatchObject({ scrollTop: 0 });

    await page.getByText('Test number 1', { exact: true }).wheel({ delta: { y: 500 } });

    await expect
      .element(page.getByRole('region', { name: 'Scrollable container', exact: true }))
      .toMatchObject({ scrollTop: expect.toSatisfy((value) => value >= 500) });

    service.saveScrollPosition();
    componentInstance.showContents.set(false);
    await expect.element(page.getByText('Test number 1', { exact: true })).not.toBeInTheDocument();
    componentInstance.showContents.set(true);
    await expect.element(page.getByText('Test number 1', { exact: true })).toBeInTheDocument();
    service.restoreScrollPosition();

    await expect
      .element(page.getByRole('region', { name: 'Scrollable container', exact: true }))
      .toMatchObject({ scrollTop: expect.toSatisfy((value) => value >= 500) });
  });
});
