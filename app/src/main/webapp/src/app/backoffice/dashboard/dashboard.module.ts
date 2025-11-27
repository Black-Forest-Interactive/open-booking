import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {MaterialModule} from "../../material/material.module";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {DayInfoCardComponent} from './day-info-card/day-info-card.component';
import { DailyVisitorStatsComponent } from './daily-visitor-stats/daily-visitor-stats.component';
import {NgxEchartsModule} from "ngx-echarts";


@NgModule({
  declarations: [
    DashboardComponent,
    DayInfoCardComponent,
    DailyVisitorStatsComponent
  ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        MaterialModule,
        TranslateModule,
        ReactiveFormsModule,
        NgxEchartsModule,
    ]
})
export class DashboardModule { }
