import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DayInfoBoardComponent} from './day-info-board/day-info-board.component';
import {DayInfoBoardActionsComponent} from './day-info-board-actions/day-info-board-actions.component';
import {MaterialModule} from "../material/material.module";
import {TranslateModule} from "@ngx-translate/core";
import {DayInfoBoardContentComponent} from './day-info-board-content/day-info-board-content.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DayInfoBoardEntryComponent} from './day-info-board-entry/day-info-board-entry.component';
import {DayInfoRangeSelectionComponent} from './day-info-range-selection/day-info-range-selection.component';
import {DayInfoBookingSelectionComponent} from './day-info-booking-selection/day-info-booking-selection.component';
import {DayInfoRoutingModule} from "./day-info-routing.module";
import {DayInfoDetailsComponent} from './day-info-details/day-info-details.component';
import {NgxEchartsModule} from "ngx-echarts";
import {DayInfoDetailsOfferListComponent} from './day-info-details-offer-list/day-info-details-offer-list.component';
import {DayInfoDetailsOfferListEntryComponent} from './day-info-details-offer-list-entry/day-info-details-offer-list-entry.component';


@NgModule({
  declarations: [
    DayInfoBoardComponent,
    DayInfoBoardActionsComponent,
    DayInfoBoardContentComponent,
    DayInfoBoardEntryComponent,
    DayInfoRangeSelectionComponent,
    DayInfoBookingSelectionComponent,
    DayInfoDetailsComponent,
    DayInfoDetailsOfferListComponent,
    DayInfoDetailsOfferListEntryComponent
  ],
    exports: [
        DayInfoBoardComponent,
        DayInfoDetailsOfferListComponent
    ],
  imports: [
    CommonModule,
    DayInfoRoutingModule,
    MaterialModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    NgxEchartsModule,
  ]
})
export class DayInfoModule {
}
