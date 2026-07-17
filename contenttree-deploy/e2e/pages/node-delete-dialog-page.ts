import { expect, Page } from '@playwright/test';

export class NodeDeleteDialogPage {
  private readonly dialog = () => this.page.getByRole('dialog');
  private readonly deleteButton = () =>
    this.dialog().getByRole('button', { name: 'Delete', exact: true });

  constructor(private readonly page: Page) {}

  readonly deleteNode = async (expectedName: string) => {
    await expect(this.dialog()).toContainText(expectedName);
    await this.deleteButton().click();
    await expect(this.dialog()).not.toBeInViewport();
  };
}
