import { ErrorData, ErrorService } from '@/app/core/error-handler/error.service';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateBlockDirective } from '@ngx-translate/core';

@Component({
  selector: 'app-error-card',
  imports: [MatCardModule, MatIconModule, MatButtonModule, TranslateBlockDirective],
  templateUrl: './error-card.html',
  styleUrl: './error-card.scss',
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
