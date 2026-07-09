import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render } from 'vitest-browser-angular';
import { page } from 'vitest/browser';
import { it } from '../../../test-utils/msw-ct';
import { TreeApiService } from '../../api/tree-api.service';
import { TreePage } from '../tree-page';
import { TreePageService } from '../tree-page.service';

describe('Tree', () => {
  const grandChildNode = page.getByRole('button', { name: 'Grandchild node', exact: true });

  beforeEach(async () => {
    await render(TreePage, {
      providers: [TreePageService, TreeApiService],
    });
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
    await grandChildNode.click();

    await expect.element(grandChildNode).toHaveAttribute('aria-selected', 'true');
  });

  it('can deselect a node', async () => {
    await grandChildNode.click();
    await grandChildNode.click();

    await expect.element(grandChildNode).not.toHaveAttribute('aria-selected', 'true');
  });

  it('can move nodes', async () => {
    await grandChildNode.dropTo(page.getByRole('button', { name: 'Root node', exact: true }));
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
