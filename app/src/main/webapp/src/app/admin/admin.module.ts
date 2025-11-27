import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminRoutingModule} from './admin-routing.module';
import {AdminBoardComponent} from './admin-board/admin-board.component';
import {LayoutModule} from '@angular/cdk/layout';
import {TranslateModule} from "@ngx-translate/core";
import {MaterialModule} from "../material/material.module";
import {NgxEchartsModule} from "ngx-echarts";
import {ReactiveFormsModule} from "@angular/forms";
import {HomeModule} from "../home/home.module";


@NgModule({
  declarations: [
    AdminBoardComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    LayoutModule,
    MaterialModule,
    TranslateModule,
    NgxEchartsModule,
    ReactiveFormsModule,
    HomeModule
  ],
  providers: []
})
export class AdminModule {
}
