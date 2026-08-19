import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateBlockDirective } from '@ngx-translate/core';
import { AppConfigService } from '../app-config.service';
import { PluralTranslatePipe } from '../core/i18n/plural-translate.pipe';

@Component({
  selector: 'app-privacy-policy-page',
  imports: [MatCardModule, TranslateBlockDirective, PluralTranslatePipe],
  templateUrl: './privacy-policy-page.html',
  styleUrls: ['./privacy-policy-page.scss'],
})
export class PrivacyPolicyPage {
  private readonly appConfigService = inject(AppConfigService);

  readonly company = this.appConfigService.company;
}
