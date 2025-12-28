import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';
import {HomeBoardComponent} from './home-board/home-board.component';
import {MaterialModule} from "../material/material.module";
import {TranslateModule} from "@ngx-translate/core";
import {SharedModule} from "../shared/shared.module";
import {DayInfoModule} from "../day-info/day-info.module";
import {HomeToolbarComponent} from './home-toolbar/home-toolbar.component';
import {NgxEchartsModule} from "ngx-echarts";
import {HomeDetailsBoardComponent} from './home-details-board/home-details-board.component';
import {DayInfoDashboardComponent} from './day-info-dashboard/day-info-dashboard.component';
import {DayInfoDashboardEntryComponent} from './day-info-dashboard-entry/day-info-dashboard-entry.component';
import {DayInfoDetailsComponent} from './day-info-details/day-info-details.component';
import {DayInfoDetailsChartComponent} from './day-info-details-chart/day-info-details-chart.component';
import {DayInfoDetailsListComponent} from './day-info-details-list/day-info-details-list.component';
import {DayInfoDetailsListEntryComponent} from './day-info-details-list-entry/day-info-details-list-entry.component';
import {CreateBookingRequestComponent} from './create-booking-request/create-booking-request.component';
import {ReactiveFormsModule} from "@angular/forms";
import {
  CreateBookingConfirmationDialogComponent
} from './create-booking-confirmation-dialog/create-booking-confirmation-dialog.component';
import {ConfirmMailComponent} from './confirm-mail/confirm-mail.component';
import {
  CreateBookingFailedDialogComponent
} from './create-booking-failed-dialog/create-booking-failed-dialog.component';


@NgModule({
  declarations: [
    HomeBoardComponent,
    HomeToolbarComponent,
    HomeDetailsBoardComponent,
    DayInfoDashboardComponent,
    DayInfoDashboardEntryComponent,
    DayInfoDetailsComponent,
    DayInfoDetailsChartComponent,
    DayInfoDetailsListComponent,
    DayInfoDetailsListEntryComponent,
    CreateBookingRequestComponent,
    CreateBookingConfirmationDialogComponent,
    ConfirmMailComponent,
    CreateBookingFailedDialogComponent
  ],
  exports: [
    HomeToolbarComponent,
    DayInfoDetailsListComponent,
    DayInfoDetailsChartComponent,
    DayInfoDetailsListEntryComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    TranslateModule,
    SharedModule,
    DayInfoModule,
    NgxEchartsModule,
    ReactiveFormsModule,
  ]
})
export class HomeModule {
}
