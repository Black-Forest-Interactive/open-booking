import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {MaterialModule} from "./material/material.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {MAT_DATE_LOCALE} from "@angular/material/core";
import {registerLocaleData} from "@angular/common";
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthHttpInterceptor, AuthModule} from "@auth0/auth0-angular";
import {NgxEchartsModule} from "ngx-echarts";
import {HomeModule} from "./home/home.module";
import {HotToastModule} from '@ngneat/hot-toast';
import {QuillModule} from "ngx-quill";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AuthModule.forRoot({
      domain: 'hlltool.eu.auth0.com',
      clientId: 'VZgfRUy3OlWuwHABFEJtIkZSafG9qEMg',
      audience: 'OpenBooking API',
      httpInterceptor: {
        allowedList: [
          '/api/backend/*',
          {
            uri: 'api/backend/*'
          }
        ]
      }
    }),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    HomeModule,
    HotToastModule.forRoot({
      autoClose: true,
      position: 'bottom-right'
    }),
    QuillModule.forRoot()
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
    {provide: LOCALE_ID, useValue: 'de-DE'},
    {provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
