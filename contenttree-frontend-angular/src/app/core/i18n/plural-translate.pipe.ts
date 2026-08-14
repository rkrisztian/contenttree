import { inject, Pipe, PipeTransform, untracked } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * i18next-like support for pluralization, implemented because
 * {@link https://github.com/lephyrus/ngx-translate-messageformat-compiler MessageFormat Compiler}
 * requires allowing `unsafe-eval` for the `script-src` Content Security Policy (CSP), which is
 * a compromise in security.
 */
@Pipe({
  name: 'pluralTranslate',
  pure: false,
})
export class PluralTranslatePipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  transform(keyPrefix: string, params?: Record<string, unknown>): string {
    const count = params?.['count'] as number | undefined;

    if (count == null) {
      return keyPrefix;
    }

    return untracked(
      this.translate.translate(count === 1 ? `${keyPrefix}_one` : `${keyPrefix}_other`, params),
    );
  }
}
