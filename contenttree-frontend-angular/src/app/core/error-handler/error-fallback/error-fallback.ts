import { Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateBlockDirective } from '@ngx-translate/core';

@Component({
  selector: 'app-error-fallback',
  imports: [MatIconModule, MatButtonModule, TranslateBlockDirective],
  templateUrl: './error-fallback.html',
  styleUrl: './error-fallback.scss',
})
export class ErrorFallback {
  readonly reload = output<void>();
}
