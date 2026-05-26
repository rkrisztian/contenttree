import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ErrorService } from '../error.service';

@Component({
  selector: 'app-error-overlay',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './error-overlay.html',
  styleUrl: './error-overlay.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorOverlay {
  protected readonly errorService = inject(ErrorService);

  protected readonly errorData = this.errorService.errorData;
}
