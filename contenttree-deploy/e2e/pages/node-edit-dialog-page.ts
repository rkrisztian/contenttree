import { expect, Page } from '@playwright/test';

export class NodeEditDialogPage {
  private readonly dialog = () => this.page.getByRole('dialog');
  private readonly nameField = () =>
    this.dialog().getByRole('textbox', { name: 'Name', exact: true });
  private readonly contentField = () =>
    this.dialog().getByRole('textbox', { name: 'Content', exact: true });
  private readonly addButton = () =>
    this.dialog().getByRole('button', { name: 'Add Node', exact: true });
  private readonly editButton = () =>
    this.dialog().getByRole('button', { name: 'Edit Node', exact: true });

  constructor(private readonly page: Page) {}

  readonly addNode = async (name: string, content: string) => {
    await this.nameField().fill(name);
    await this.contentField().fill(content);
    await this.addButton().click();
    expect(this.dialog()).not.toBeInViewport();
  };

  readonly editNode = async (name: string, content: string) => {
    await this.nameField().fill(name);
    await this.contentField().fill(content);
    await this.editButton().click();
    expect(this.dialog()).not.toBeInViewport();
  };
}
