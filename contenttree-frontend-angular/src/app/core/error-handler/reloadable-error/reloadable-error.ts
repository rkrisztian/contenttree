import { Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateBlockDirective } from '@ngx-translate/core';

@Component({
  selector: 'app-reloadable-error',
  imports: [MatIconModule, MatButtonModule, TranslateBlockDirective],
  templateUrl: './reloadable-error.html',
  styleUrl: './reloadable-error.scss',
})
export class ReloadableError {
  readonly reload = output();
}
