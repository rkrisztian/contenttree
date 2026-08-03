import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { LanguageService } from './language.service';

@Component({
  selector: 'app-language-toggle',
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './language-toggle.html',
})
export class LanguageToggle {
  private readonly languageService = inject(LanguageService);

  protected readonly currentLanguage = this.languageService.currentLanguage;
  protected readonly availableLanguages = this.languageService.availableLanguages;
  protected readonly switchLanguage = this.languageService.switchLanguage;
}
