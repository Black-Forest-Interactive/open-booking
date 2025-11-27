import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CacheRoutingModule} from './cache-routing.module';
import {CacheBoardComponent} from './cache-board/cache-board.component';
import {MaterialModule} from "../../material/material.module";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    CacheBoardComponent
  ],
  imports: [
    CommonModule,
    CacheRoutingModule,
    MaterialModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CacheModule {
}
