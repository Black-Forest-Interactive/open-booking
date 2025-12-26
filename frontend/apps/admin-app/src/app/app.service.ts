import {computed, effect, Injectable, resource, Signal} from "@angular/core";
import {map} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {toSignal} from "@angular/core/rxjs-interop";
import {SettingsService} from "@open-booking/portal";
import {toPromise} from "@open-booking/shared";
import {Title} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  languages = [
    {key: 'en', text: 'LANG.English'},
    {key: 'de', text: 'LANG.German'},
  ]

  lang: Signal<string>
  isHandset: Signal<boolean>

  private titleResource = resource({
    loader: (param) => {
      return toPromise(this.settingsService.getTitle())
    }
  })

  title = computed(() => this.titleResource.value()?.text ?? '')


  constructor(
    private translate: TranslateService,
    private settingsService: SettingsService,
    private pageTitle: Title,
    private breakpointObserver: BreakpointObserver,
  ) {
    translate.setFallbackLang('en')
    this.lang = toSignal(translate.onLangChange.pipe(
        map(event => event.lang)
      ),
      {initialValue: this.translate.getCurrentLang()}
    )

    this.isHandset = toSignal(
      this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(result => result.matches),
      ),
      {initialValue: false}
    )

    effect(() => this.pageTitle.setTitle(this.title()))

  }

  setLanguage(language: string) {
    this.translate.use(language)
  }

}
