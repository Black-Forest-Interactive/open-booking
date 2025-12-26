import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import {provideRouter} from '@angular/router';
import {appRoutes} from './app.routes';
import {provideLuxonDateAdapter} from "@angular/material-luxon-adapter";
import {MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideTranslateService} from "@ngx-translate/core";
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";
import {provideToastConfig} from "./hot-toast.config";
import {provideEChartsConfig} from "./echarts.config";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideKeycloakAngular} from "./keycloak.config";
import {provideQuill} from "./quill.config";
import {includeBearerTokenInterceptor} from "keycloak-angular";
import {registerLocaleData} from "@angular/common";
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';

registerLocaleData(localeDe, 'de-DE', localeDeExtra)

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideLuxonDateAdapter(),
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
    {provide: LOCALE_ID, useValue: 'de-DE'},
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    provideToastConfig(),
    provideKeycloakAngular(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideHttpClient(withInterceptors([
      includeBearerTokenInterceptor
    ])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json'
      }),
      fallbackLang: 'de',
      lang: 'en'
    }),
    provideEChartsConfig(),
    provideQuill(),
    provideRouter(appRoutes),
  ],
};
