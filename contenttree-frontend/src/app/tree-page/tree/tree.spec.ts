import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render } from 'vitest-browser-angular';
import { page } from 'vitest/browser';
import { it } from '../../../test-utils/msw-test';
import { TreeApiService } from '../../api/tree-api.service';
import { TreePage } from '../tree-page';
import { TreePageService } from '../tree-page.service';

describe('Tree', () => {
  let treePageService: TreePageService;

  beforeEach(async () => {
    const screen = await render(TreePage, {
      providers: [TreePageService, TreeApiService],
    });

    treePageService = screen.fixture.debugElement.injector.get(TreePageService);
  });

  it('can display nodes', async () => {
    for (const name of ['Root node', 'Child node', 'Grandchild node', 'Child node 2']) {
      await expect.element(page.getByRole('button', { name, exact: true })).toBeVisible();
    }

    expect(
      page
        .getByRole('button', { name: /^(Root node|Child node( 2)?|Grandchild node)$/, exact: true })
        .elements(),
    ).toMatchObject([
      expect.toHaveTextContent('Root node'),
      expect.toHaveTextContent('Child node'),
      expect.toHaveTextContent('Grandchild node'),
      expect.toHaveTextContent('Child node 2'),
    ]);
  });

  it('can select a node', async () => {
    await page.getByRole('button', { name: 'Grandchild node', exact: true }).click();

    // Found no simple way to check for text color change,
    // and the content is displayed by a separate component.
    expect(treePageService.selectedNode()).toMatchObject({ id: 4 });
  });

  it('can deselect a node', async () => {
    await page.getByRole('button', { name: 'Grandchild node', exact: true }).click();
    await page.getByRole('button', { name: 'Grandchild node', exact: true }).click();

    expect(treePageService.selectedNode()).toBeNull();
  });

  it('can move nodes', async () => {
    await page
      .getByRole('button', { name: 'Grandchild node', exact: true })
      .dropTo(page.getByRole('button', { name: 'Root node', exact: true }));
    await TestBed.inject(ApplicationRef).whenStable();

    for (const name of ['Root node', 'Child node', 'Grandchild node', 'Child node 2']) {
      await expect.element(page.getByRole('button', { name, exact: true })).toBeVisible();
    }

    expect(
      page
        .getByRole('button', { name: /^(Root node|Child node( 2)?|Grandchild node)$/, exact: true })
        .elements(),
    ).toMatchObject([
      expect.toHaveTextContent('Root node'),
      expect.toHaveTextContent('Child node'),
      expect.toHaveTextContent('Child node 2'),
      expect.toHaveTextContent('Grandchild node'),
    ]);
  });
});
