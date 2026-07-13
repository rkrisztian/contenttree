import { expect, Page } from '@playwright/test';

export class TreePage {
  private readonly addNodeButton = () =>
    this.page.getByRole('button', { name: 'Add new node', exact: true });
  private readonly editNodeButton = () =>
    this.page.getByRole('button', { name: 'Edit selected node', exact: true });
  private readonly deleteNodeButton = () =>
    this.page.getByRole('button', { name: 'Delete selected node', exact: true });
  private readonly searchField = () =>
    this.page.getByRole('searchbox', { name: 'Search nodes', exact: true });
  private readonly clearSearchButton = () =>
    this.page.getByRole('button', { name: 'Clear search', exact: true });
  private readonly node = (name: string) => this.page.getByRole('treeitem', { name, exact: true });
  private readonly foundNode = (name: string) => this.node(`${name} matched`);
  private readonly toggleButton = (name: string) =>
    this.page.getByRole('button', { name: `Toggle ${name}}` });
  private readonly content = (content: string) => this.page.getByText(content, { exact: true });
  private readonly dialog = () => this.page.getByRole('dialog');
  private readonly loadingTreeIndicator = () => this.page.getByText('Loading tree...');

  constructor(private readonly page: Page) {}

  readonly goto = async () => {
    await this.page.goto('/');
  };

  readonly openAddNodeDialog = async () => {
    await this.addNodeButton().click();
    await expect(this.dialog()).toBeVisible();
  };

  readonly openEditNodeDialog = async () => {
    await this.editNodeButton().click();
    await expect(this.dialog()).toBeVisible();
  };

  readonly openDeleteNodeDialog = async () => {
    await this.deleteNodeButton().click();
    await expect(this.dialog()).toBeVisible();
  };

  readonly searchAndExpectMatch = async (text: string, name: string) => {
    await this.searchField().fill('search text');
    await expect(this.foundNode(name)).toBeVisible();
  };

  readonly clearSearchAndExpectNoMatch = async (name: string) => {
    await this.clearSearchButton().click();
    await expect(this.node(name)).toBeVisible();
  };

  readonly selectNodeAndExpectContent = async (name: string, expectedContent: string) => {
    await this.node(name).click();
    await expect(this.content(expectedContent)).toBeVisible();
  };

  readonly moveLeafNodeAndExpectParentIsLeaf = async (
    name: string,
    newParent: string,
    oldParent: string,
  ) => {
    await this.node(name).dragTo(this.node(newParent));
    await expect(this.loadingTreeIndicator()).not.toBeInViewport();
    await expect(this.toggleButton(oldParent)).not.toBeInViewport();
  };

  readonly expectSelectedNodeAndContentExists = async (name: string, expectedContent: string) => {
    await expect.soft(this.node(name)).toBeVisible();
    await expect.soft(this.content(expectedContent)).toBeVisible();
  };

  readonly expectNodeDoesNotExist = async (name: string) => {
    await expect(this.loadingTreeIndicator()).not.toBeInViewport();
    await expect(this.node(name)).not.toBeInViewport();
  };
}
