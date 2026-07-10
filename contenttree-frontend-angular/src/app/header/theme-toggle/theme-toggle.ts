import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeToggleService } from './theme-toggle.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './theme-toggle.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  private readonly themeToggleService = inject(ThemeToggleService);

  protected mode = this.themeToggleService.mode;

  protected changeMode = () => {
    this.themeToggleService.changeMode();
  };
}
