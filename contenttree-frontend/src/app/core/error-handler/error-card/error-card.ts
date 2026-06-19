import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ErrorData, ErrorService } from '../error.service';

@Component({
  selector: 'app-error-card',
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './error-card.html',
  styleUrl: './error-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorCard {
  private readonly errorService = inject(ErrorService);

  readonly error = input.required<ErrorData>();
  readonly closeable = input<boolean>(true);
  readonly hasBorder = input<boolean>(true);

  protected readonly copyToClipboard = this.errorService.copyToClipboard;
  protected readonly hide = this.errorService.hideLatestError;
  protected readonly remove = this.errorService.remove;
}
