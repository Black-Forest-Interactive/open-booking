import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BackofficeRoutingModule} from './backoffice-routing.module';
import {BackofficeComponent} from './backoffice/backoffice.component';
import {MaterialModule} from "../material/material.module";
import {TranslateModule} from "@ngx-translate/core";
import {NgxEchartsModule} from "ngx-echarts";
import {ReactiveFormsModule} from "@angular/forms";
import {HomeModule} from "../home/home.module";


@NgModule({
  declarations: [
    BackofficeComponent
  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule,
    MaterialModule,
    TranslateModule,
    NgxEchartsModule,
    ReactiveFormsModule,
    HomeModule,
  ]
})
export class BackofficeModule { }
