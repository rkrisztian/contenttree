import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeToggleService } from './theme-toggle.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './theme-toggle.html',
})
export class ThemeToggle {
  private readonly themeToggleService = inject(ThemeToggleService);

  protected mode = this.themeToggleService.mode;

  protected changeMode = () => {
    this.themeToggleService.changeMode();
  };
}
